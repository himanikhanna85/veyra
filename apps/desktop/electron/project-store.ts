import { createHash, randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const SCHEMA_VERSION = 3;
const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
const SECRET_REFERENCE_ID = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;

export interface ProjectRecord {
  applicationUrl: string;
  environmentName: string;
  id: string;
  name: string;
  archivedAt?: string | null;
}

export interface EnvironmentVariable { key: string; value: string }
export interface ProjectEnvironment { baseUrl: string; id: string; isActive: boolean; name: string; variables: EnvironmentVariable[] }
export interface SecretReference { description: string; hasValue: false; id: string }
export interface ProjectDetail extends ProjectRecord { archived: boolean; environments: ProjectEnvironment[]; secretReferences: SecretReference[] }
export interface ProjectSummary { archived: boolean; environmentName: string; id: string; name: string }
export interface ProjectOverview {
  latestOutcome: string | null;
  latestRunAt: string | null;
  moduleItems: Array<{ id: string; name: string }>;
  modules: number;
  outcomeCounts: Record<string, number>;
  passRate: number | null;
  recentRunItems: Array<{ completedAt: string; id: string; outcome: string }>;
  recentRuns: number;
  tests: number;
}

export interface CompletedRunRecord {
  completedAt: string;
  definitionSnapshot: unknown;
  id: string;
  outcome: string;
  projectId: string;
}

export interface StorageUsage {
  databaseBytes: number;
  evidenceBytes: number;
  evidenceFiles: number;
  totalBytes: number;
}

interface BackupPayload {
  definitions: Array<{ id: string; kind: string; payload: unknown; revision: number }>;
  evidence: Array<{ base64: string; createdAt: string; id: string; mediaType: string; relativePath: string; size: number }>;
  environments?: ProjectEnvironment[];
  project: ProjectRecord;
  runs: CompletedRunRecord[];
  secretReferences?: Array<{ description?: string; id: string }>;
}

function assertSafeId(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !SAFE_ID.test(value)) throw new Error(`${label} is invalid`);
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function checksum(payload: BackupPayload): string {
  return createHash("sha256").update(stableJson(payload)).digest("hex");
}

function extensionFor(mediaType: string): string {
  return ({ "image/png": ".png", "image/jpeg": ".jpg", "text/plain": ".txt", "application/json": ".json", "application/zip": ".zip" } as Record<string, string>)[mediaType] ?? ".bin";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertIsoDate(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value)) || new Date(value).toISOString() !== value) throw new Error(`${label} is invalid`);
}

function validateBackupPayload(value: unknown, version = 1): BackupPayload {
  if (!isRecord(value) || !isRecord(value.project) || !Array.isArray(value.definitions) || !Array.isArray(value.runs) || !Array.isArray(value.evidence)) throw new Error("Project backup payload is invalid");
  const project = value.project;
  for (const field of ["id", "name", "applicationUrl", "environmentName"] as const) if (typeof project[field] !== "string" || project[field].length === 0) throw new Error(`Project ${field} is invalid`);
  assertSafeId(project.id, "Project id");
  try { new URL(project.applicationUrl as string); } catch { throw new Error("Project application URL is invalid"); }
  const projectId = project.id as string;
  if (version >= 2 && value.environments === undefined) throw new Error(`Version ${version} project backup is missing environments`);
  if (value.environments !== undefined) {
    if (!Array.isArray(value.environments) || value.environments.length === 0) throw new Error("Project environments are invalid");
    let activeCount = 0;
    const names = new Set<string>();
    for (const environment of value.environments) {
      if (!isRecord(environment)) throw new Error("Project environment is invalid");
      assertSafeId(environment.id, "Environment id");
      if (typeof environment.name !== "string" || !environment.name.trim() || names.has(environment.name)) throw new Error("Environment name is invalid or duplicated");
      names.add(environment.name);
      try { new URL(requiredBackupString(environment.baseUrl, "Environment URL")); } catch { throw new Error("Environment URL is invalid"); }
      if (typeof environment.isActive !== "boolean") throw new Error("Environment active state is invalid");
      if (environment.isActive) activeCount += 1;
      if (!Array.isArray(environment.variables)) throw new Error("Environment variables are invalid");
      const keys = new Set<string>();
      for (const variable of environment.variables) {
        if (!isRecord(variable) || typeof variable.key !== "string" || !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(variable.key) || typeof variable.value !== "string" || keys.has(variable.key)) throw new Error("Environment variable is invalid or duplicated");
        keys.add(variable.key);
      }
    }
    if (activeCount !== 1) throw new Error("Project backup must contain one active environment");
  }
  if (version >= 3 && value.secretReferences === undefined) throw new Error("Version 3 project backup is missing secret references");
  if (value.secretReferences !== undefined) {
    if (!Array.isArray(value.secretReferences)) throw new Error("Project secret references are invalid");
    const identifiers = new Set<string>();
    for (const reference of value.secretReferences) {
      if (!isRecord(reference) || Object.keys(reference).some((key) => !["id", "description"].includes(key)) || typeof reference.id !== "string" || !SECRET_REFERENCE_ID.test(reference.id) || (reference.description !== undefined && (typeof reference.description !== "string" || reference.description.length > 200)) || identifiers.has(reference.id)) throw new Error("Secret reference is invalid or duplicated");
      identifiers.add(reference.id);
    }
  }
  const seenDefinitions = new Set<string>();
  for (const item of value.definitions) {
    if (!isRecord(item)) throw new Error("Definition is invalid");
    assertSafeId(item.kind, "Definition kind"); assertSafeId(item.id, "Definition id");
    if (!Number.isInteger(item.revision) || Number(item.revision) < 1) throw new Error("Definition revision is invalid");
    const key = `${item.kind}:${item.id}`; if (seenDefinitions.has(key)) throw new Error("Duplicate definition in backup"); seenDefinitions.add(key);
  }
  const seenRuns = new Set<string>();
  const outcomes = new Set(["PASS", "FAIL", "BLOCKED", "ERROR", "INTERRUPTED"]);
  for (const item of value.runs) {
    if (!isRecord(item)) throw new Error("Completed run is invalid");
    assertSafeId(item.id, "Run id");
    const runId = item.id;
    if (item.projectId !== projectId) throw new Error("Run project does not match backup project");
    assertIsoDate(item.completedAt, "Run completion date");
    if (typeof item.outcome !== "string" || !outcomes.has(item.outcome)) throw new Error("Run outcome is invalid");
    if (seenRuns.has(runId)) throw new Error("Duplicate run in backup"); seenRuns.add(runId);
  }
  const seenEvidence = new Set<string>();
  for (const item of value.evidence) {
    if (!isRecord(item)) throw new Error("Evidence record is invalid");
    assertSafeId(item.id, "Evidence id");
    const evidenceId = item.id;
    if (typeof item.mediaType !== "string" || typeof item.relativePath !== "string" || item.relativePath !== `${projectId}/${item.id}${extensionFor(item.mediaType)}`) throw new Error("Unsafe evidence path in backup");
    assertIsoDate(item.createdAt, "Evidence creation date");
    if (!Number.isInteger(item.size) || Number(item.size) < 0 || typeof item.base64 !== "string") throw new Error("Evidence payload is invalid");
    const bytes = Buffer.from(item.base64, "base64");
    if (bytes.toString("base64") !== item.base64 || bytes.byteLength !== item.size) throw new Error("Evidence encoding or size mismatch in backup");
    if (seenEvidence.has(evidenceId)) throw new Error("Duplicate evidence in backup"); seenEvidence.add(evidenceId);
  }
  return value as unknown as BackupPayload;
}

function requiredBackupString(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`${label} is invalid`);
  return value;
}

export class ProjectStore {
  readonly #databasePath: string;
  readonly #evidenceRoot: string;
  #database!: DatabaseSync;
  #closed = false;

  constructor(root: string) {
    mkdirSync(root, { recursive: true, mode: 0o700 });
    this.#databasePath = join(root, "veyra.sqlite");
    this.#evidenceRoot = join(root, "evidence");
    mkdirSync(this.#evidenceRoot, { recursive: true, mode: 0o700 });
    try {
      this.#database = new DatabaseSync(this.#databasePath);
      this.#database.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
      this.#migrate();
    } catch (error) {
      try { this.#database?.close(); } catch { /* preserve the original failure */ }
      throw new Error(`Veyra project storage could not be opened; the original database was preserved: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  get schemaVersion(): number {
    return Number(this.#database.prepare("PRAGMA user_version").get()?.user_version ?? 0);
  }

  #migrate(): void {
    const version = Number(this.#database.prepare("PRAGMA user_version").get()?.user_version ?? 0);
    if (version > SCHEMA_VERSION) throw new Error(`Unsupported future schema version ${version}`);
    if (version === SCHEMA_VERSION) return;
    if (version === 0) this.#database.exec(`BEGIN IMMEDIATE;
      CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, application_url TEXT NOT NULL, environment_name TEXT NOT NULL, updated_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS definitions (project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, kind TEXT NOT NULL, id TEXT NOT NULL, revision INTEGER NOT NULL, payload_json TEXT NOT NULL, PRIMARY KEY(project_id, kind, id));
      CREATE TABLE IF NOT EXISTS completed_runs (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, completed_at TEXT NOT NULL, outcome TEXT NOT NULL, definition_snapshot_json TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS evidence_assets (id TEXT NOT NULL, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, relative_path TEXT NOT NULL UNIQUE, media_type TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(project_id, id));
      PRAGMA user_version = 1;
      COMMIT;`);
    if (version < 2) this.#database.exec(`BEGIN IMMEDIATE;
      ALTER TABLE projects ADD COLUMN archived_at TEXT;
      CREATE TABLE environments (id TEXT NOT NULL, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, name TEXT NOT NULL, base_url TEXT NOT NULL, is_active INTEGER NOT NULL DEFAULT 0 CHECK(is_active IN (0,1)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(project_id,id), UNIQUE(project_id,name));
      CREATE UNIQUE INDEX one_active_environment_per_project ON environments(project_id) WHERE is_active=1;
      CREATE TABLE environment_variables (project_id TEXT NOT NULL, environment_id TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(project_id,environment_id,key), FOREIGN KEY(project_id,environment_id) REFERENCES environments(project_id,id) ON DELETE CASCADE);
      INSERT INTO environments (id,project_id,name,base_url,is_active,created_at,updated_at) SELECT 'default',id,environment_name,application_url,1,updated_at,updated_at FROM projects;
      PRAGMA user_version = 2;
      COMMIT;`);
    if (version < 3) this.#database.exec(`BEGIN IMMEDIATE;
      CREATE TABLE secret_references (project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, id TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(project_id,id));
      PRAGMA user_version = 3;
      COMMIT;`);
  }

  createProject(project: ProjectRecord): ProjectDetail {
    assertSafeId(project.id, "Project id");
    const name = project.name.trim();
    const environmentName = project.environmentName.trim();
    if (!name) throw new Error("Project name is required");
    if (!environmentName) throw new Error("Environment name is required");
    try { new URL(project.applicationUrl); } catch { throw new Error("Application URL is invalid"); }
    const now = new Date().toISOString();
    this.#database.exec("BEGIN IMMEDIATE");
    try {
      this.#database.prepare("INSERT INTO projects (id,name,application_url,environment_name,updated_at,archived_at) VALUES (?,?,?,?,?,NULL)").run(project.id, name, project.applicationUrl, environmentName, now);
      this.#database.prepare("INSERT INTO environments (id,project_id,name,base_url,is_active,created_at,updated_at) VALUES ('default',?,?,?,?,?,?)").run(project.id, environmentName, project.applicationUrl, 1, now, now);
      this.#database.exec("COMMIT");
    } catch (error) { this.#database.exec("ROLLBACK"); throw error; }
    return this.getProjectDetail(project.id)!;
  }

  updateProject(id: string, changes: { applicationUrl?: string; name?: string }): ProjectDetail {
    const current = this.getProject(id); if (!current) throw new Error("Project not found");
    const name = changes.name?.trim() ?? current.name;
    const applicationUrl = changes.applicationUrl ?? current.applicationUrl;
    if (!name) throw new Error("Project name is required");
    try { new URL(applicationUrl); } catch { throw new Error("Application URL is invalid"); }
    const now = new Date().toISOString();
    this.#database.prepare("UPDATE projects SET name=?,application_url=?,updated_at=? WHERE id=?").run(name, applicationUrl, now, id);
    this.#database.prepare("UPDATE environments SET base_url=?,updated_at=? WHERE project_id=? AND is_active=1").run(applicationUrl, now, id);
    return this.getProjectDetail(id)!;
  }

  listProjectSummaries(includeArchived = false): ProjectSummary[] {
    const rows = this.#database.prepare(`SELECT p.id,p.name,p.archived_at,e.name environment_name FROM projects p JOIN environments e ON e.project_id=p.id AND e.is_active=1 ${includeArchived ? "" : "WHERE p.archived_at IS NULL"} ORDER BY p.name`).all() as Record<string, unknown>[];
    return rows.map((row) => ({ id: String(row.id), name: String(row.name), environmentName: String(row.environment_name), archived: row.archived_at !== null }));
  }

  getProjectDetail(id: string): ProjectDetail | undefined {
    const project = this.getProject(id); if (!project) return undefined;
    const environments = (this.#database.prepare("SELECT id,name,base_url,is_active FROM environments WHERE project_id=? ORDER BY is_active DESC,name").all(id) as Record<string, unknown>[]).map((row) => ({
      id: String(row.id), name: String(row.name), baseUrl: String(row.base_url), isActive: Boolean(row.is_active),
      variables: (this.#database.prepare("SELECT key,value FROM environment_variables WHERE project_id=? AND environment_id=? ORDER BY key").all(id, String(row.id)) as Record<string, unknown>[]).map((variable) => ({ key: String(variable.key), value: String(variable.value) })),
    }));
    const secretReferences = (this.#database.prepare("SELECT id,description FROM secret_references WHERE project_id=? ORDER BY id").all(id) as Record<string, unknown>[])
      .map((row) => ({ id: String(row.id), description: String(row.description), hasValue: false as const }));
    return { ...project, archived: project.archivedAt != null, environments, secretReferences };
  }

  saveEnvironment(projectId: string, environment: { baseUrl: string; id: string; name: string }): ProjectEnvironment {
    assertSafeId(environment.id, "Environment id");
    if (!this.getProject(projectId)) throw new Error("Project not found");
    if (!environment.name.trim()) throw new Error("Environment name is required");
    try { new URL(environment.baseUrl); } catch { throw new Error("Environment URL is invalid"); }
    const now = new Date().toISOString();
    this.#database.prepare(`INSERT INTO environments (id,project_id,name,base_url,is_active,created_at,updated_at) VALUES (?,?,?,?,0,?,?) ON CONFLICT(project_id,id) DO UPDATE SET name=excluded.name,base_url=excluded.base_url,updated_at=excluded.updated_at`).run(environment.id, projectId, environment.name.trim(), environment.baseUrl, now, now);
    return this.getProjectDetail(projectId)!.environments.find((item) => item.id === environment.id)!;
  }

  setActiveEnvironment(projectId: string, environmentId: string): ProjectDetail {
    const environment = this.#database.prepare("SELECT name,base_url FROM environments WHERE project_id=? AND id=?").get(projectId, environmentId) as Record<string, unknown> | undefined;
    if (!environment) throw new Error("Environment not found");
    this.#database.exec("BEGIN IMMEDIATE");
    try {
      this.#database.prepare("UPDATE environments SET is_active=0 WHERE project_id=?").run(projectId);
      this.#database.prepare("UPDATE environments SET is_active=1 WHERE project_id=? AND id=?").run(projectId, environmentId);
      this.#database.prepare("UPDATE projects SET environment_name=?,application_url=?,updated_at=? WHERE id=?").run(String(environment.name), String(environment.base_url), new Date().toISOString(), projectId);
      this.#database.exec("COMMIT");
    } catch (error) { this.#database.exec("ROLLBACK"); throw error; }
    return this.getProjectDetail(projectId)!;
  }

  saveEnvironmentVariable(projectId: string, environmentId: string, variable: EnvironmentVariable): void {
    const key = variable.key.trim(); if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(key)) throw new Error("Variable name is invalid");
    if (!this.#database.prepare("SELECT 1 ok FROM environments WHERE project_id=? AND id=?").get(projectId, environmentId)) throw new Error("Environment not found");
    this.#database.prepare(`INSERT INTO environment_variables (project_id,environment_id,key,value,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(project_id,environment_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`).run(projectId, environmentId, key, variable.value, new Date().toISOString());
  }

  deleteEnvironmentVariable(projectId: string, environmentId: string, key: string): void { this.#database.prepare("DELETE FROM environment_variables WHERE project_id=? AND environment_id=? AND key=?").run(projectId, environmentId, key); }

  saveSecretReference(projectId: string, reference: { description?: string; id: string }): SecretReference {
    if (!this.getProject(projectId)) throw new Error("Project not found");
    const id = reference.id.trim();
    const description = reference.description?.trim() ?? "";
    if (!SECRET_REFERENCE_ID.test(id)) throw new Error("Secret identifier must start with a letter and contain only letters, numbers or underscores");
    if (description.length > 200) throw new Error("Secret description must be 200 characters or fewer");
    const now = new Date().toISOString();
    try {
      this.#database.prepare("INSERT INTO secret_references (project_id,id,description,created_at,updated_at) VALUES (?,?,?,?,?)").run(projectId, id, description, now, now);
    } catch (error) {
      if (String(error).includes("UNIQUE constraint failed")) throw new Error("A secret reference with this identifier already exists");
      throw error;
    }
    return { id, description, hasValue: false };
  }

  deleteSecretReference(projectId: string, id: string): void {
    if (!SECRET_REFERENCE_ID.test(id)) throw new Error("Secret identifier is invalid");
    this.#database.prepare("DELETE FROM secret_references WHERE project_id=? AND id=?").run(projectId, id);
  }

  setProjectArchived(id: string, archived: boolean): ProjectDetail {
    if (!this.getProject(id)) throw new Error("Project not found");
    this.#database.prepare("UPDATE projects SET archived_at=?,updated_at=? WHERE id=?").run(archived ? new Date().toISOString() : null, new Date().toISOString(), id);
    return this.getProjectDetail(id)!;
  }

  async deleteProject(id: string, confirmationName: string): Promise<void> {
    const project = this.getProject(id); if (!project) throw new Error("Project not found");
    if (confirmationName !== project.name) throw new Error("Enter the exact project name to delete it");
    this.#database.prepare("DELETE FROM projects WHERE id=?").run(id);
    await rm(join(this.#evidenceRoot, id), { recursive: true, force: true });
  }

  getProjectOverview(projectId: string): ProjectOverview {
    if (!this.getProject(projectId)) throw new Error("Project not found");
    const counts = this.#database.prepare("SELECT SUM(CASE WHEN kind='test' THEN 1 ELSE 0 END) tests,SUM(CASE WHEN kind='module' THEN 1 ELSE 0 END) modules FROM definitions WHERE project_id=?").get(projectId) as Record<string, unknown>;
    const runs = this.#database.prepare("SELECT id,outcome,completed_at FROM completed_runs WHERE project_id=? ORDER BY completed_at DESC,id DESC LIMIT 20").all(projectId) as Record<string, unknown>[];
    const moduleRows = this.#database.prepare("SELECT id,payload_json FROM definitions WHERE project_id=? AND kind='module' ORDER BY id LIMIT 3").all(projectId) as Record<string, unknown>[];
    const sevenDayCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDayRuns = this.#database.prepare("SELECT outcome FROM completed_runs WHERE project_id=? AND completed_at>=?").all(projectId, sevenDayCutoff) as Record<string, unknown>[];
    const passed = sevenDayRuns.filter((run) => run.outcome === "PASS").length;
    const outcomeCounts = runs.reduce<Record<string, number>>((totals, run) => { const outcome = String(run.outcome); totals[outcome] = (totals[outcome] ?? 0) + 1; return totals; }, {});
    return {
      tests: Number(counts.tests ?? 0), modules: Number(counts.modules ?? 0), recentRuns: runs.length,
      latestOutcome: runs[0] ? String(runs[0].outcome) : null,
      latestRunAt: runs[0] ? String(runs[0].completed_at) : null,
      passRate: sevenDayRuns.length ? Math.round((passed / sevenDayRuns.length) * 100) : null,
      outcomeCounts,
      recentRunItems: runs.map((run) => ({ id: String(run.id), outcome: String(run.outcome), completedAt: String(run.completed_at) })),
      moduleItems: moduleRows.map((row) => { const payload = JSON.parse(String(row.payload_json)) as Record<string, unknown>; return { id: String(row.id), name: typeof payload.name === "string" ? payload.name : String(row.id) }; }),
    };
  }

  saveProject(project: ProjectRecord): void {
    assertSafeId(project.id, "Project id");
    this.#database.prepare(`INSERT INTO projects (id,name,application_url,environment_name,updated_at) VALUES (?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, application_url=excluded.application_url, environment_name=excluded.environment_name, updated_at=excluded.updated_at`)
      .run(project.id, project.name, project.applicationUrl, project.environmentName, new Date().toISOString());
    const now = new Date().toISOString();
    this.#database.prepare("INSERT OR IGNORE INTO environments (id,project_id,name,base_url,is_active,created_at,updated_at) VALUES ('default',?,?,?,?,?,?)")
      .run(project.id, project.environmentName, project.applicationUrl, 1, now, now);
  }

  getProject(id: string): ProjectRecord | undefined {
    const row = this.#database.prepare("SELECT id,name,application_url,environment_name,archived_at FROM projects WHERE id=?").get(id) as Record<string, unknown> | undefined;
    return row ? { id: String(row.id), name: String(row.name), applicationUrl: String(row.application_url), environmentName: String(row.environment_name), archivedAt: row.archived_at == null ? null : String(row.archived_at) } : undefined;
  }

  listProjects(): ProjectRecord[] {
    return (this.#database.prepare("SELECT id,name,application_url,environment_name FROM projects ORDER BY name").all() as Record<string, unknown>[])
      .map((row) => ({ id: String(row.id), name: String(row.name), applicationUrl: String(row.application_url), environmentName: String(row.environment_name) }));
  }

  saveDefinition(projectId: string, kind: string, id: string, revision: number, payload: unknown): void {
    assertSafeId(projectId, "Project id"); assertSafeId(kind, "Definition kind"); assertSafeId(id, "Definition id");
    this.#database.prepare(`INSERT INTO definitions (project_id,kind,id,revision,payload_json) VALUES (?,?,?,?,?)
      ON CONFLICT(project_id,kind,id) DO UPDATE SET revision=excluded.revision,payload_json=excluded.payload_json`)
      .run(projectId, kind, id, revision, JSON.stringify(payload));
  }

  getDefinition(projectId: string, kind: string, id: string): { revision: number; payload: unknown } | undefined {
    const row = this.#database.prepare("SELECT revision,payload_json FROM definitions WHERE project_id=? AND kind=? AND id=?").get(projectId, kind, id) as Record<string, unknown> | undefined;
    return row ? { revision: Number(row.revision), payload: JSON.parse(String(row.payload_json)) } : undefined;
  }

  recordCompletedRun(run: CompletedRunRecord): void {
    assertSafeId(run.id, "Run id");
    try {
      this.#database.prepare("INSERT INTO completed_runs (id,project_id,completed_at,outcome,definition_snapshot_json) VALUES (?,?,?,?,?)")
        .run(run.id, run.projectId, run.completedAt, run.outcome, JSON.stringify(run.definitionSnapshot));
    } catch (error) {
      if (String(error).includes("UNIQUE constraint failed")) throw new Error("Completed run history is immutable");
      throw error;
    }
  }

  getCompletedRun(id: string): CompletedRunRecord | undefined {
    const row = this.#database.prepare("SELECT id,project_id,completed_at,outcome,definition_snapshot_json FROM completed_runs WHERE id=?").get(id) as Record<string, unknown> | undefined;
    return row ? { id: String(row.id), projectId: String(row.project_id), completedAt: String(row.completed_at), outcome: String(row.outcome), definitionSnapshot: JSON.parse(String(row.definition_snapshot_json)) } : undefined;
  }

  async writeEvidence(projectId: string, id: string, bytes: Uint8Array, mediaType: string, createdAt = new Date().toISOString()) {
    assertSafeId(projectId, "Project id"); assertSafeId(id, "Evidence id");
    assertIsoDate(createdAt, "Evidence creation date");
    if (!this.getProject(projectId)) throw new Error("Project not found");
    const relativePath = `${projectId}/${id}${extensionFor(mediaType)}`;
    const absolutePath = join(this.#evidenceRoot, relativePath);
    const temporaryPath = `${absolutePath}.tmp-${randomUUID()}`;
    mkdirSync(dirname(absolutePath), { recursive: true, mode: 0o700 });
    await writeFile(temporaryPath, bytes, { mode: 0o600, flag: "wx" });
    this.#database.exec("BEGIN IMMEDIATE");
    let installed = false;
    try {
      this.#database.prepare("INSERT INTO evidence_assets (id,project_id,relative_path,media_type,size,created_at) VALUES (?,?,?,?,?,?)").run(id, projectId, relativePath, mediaType, bytes.byteLength, createdAt);
      await rename(temporaryPath, absolutePath);
      installed = true;
      this.#database.exec("COMMIT");
    } catch (error) {
      try { this.#database.exec("ROLLBACK"); } catch { /* transaction may not have started */ }
      await rm(temporaryPath, { force: true });
      if (installed) await rm(absolutePath, { force: true });
      throw error;
    }
    return { id, relativePath, mediaType, size: bytes.byteLength, createdAt };
  }

  async #evidenceFiles(projectId?: string): Promise<Array<{ absolutePath: string; relativePath: string; size: number; modifiedAt: number }>> {
    const projects = projectId ? [projectId] : (await readdir(this.#evidenceRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    const files = [];
    for (const candidateProjectId of projects) {
      if (!SAFE_ID.test(candidateProjectId)) continue;
      const directory = join(this.#evidenceRoot, candidateProjectId);
      const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        const absolutePath = join(directory, entry.name);
        const details = await stat(absolutePath);
        files.push({ absolutePath, relativePath: `${candidateProjectId}/${entry.name}`, size: details.size, modifiedAt: details.mtimeMs });
      }
    }
    return files;
  }

  async getStorageUsage(projectId?: string): Promise<StorageUsage> {
    const files = await this.#evidenceFiles(projectId);
    const databaseBytes = (await Promise.all([this.#databasePath, `${this.#databasePath}-wal`, `${this.#databasePath}-shm`].map((path) => stat(path).then((value) => value.size).catch(() => 0)))).reduce((sum, size) => sum + size, 0);
    const evidenceBytes = files.reduce((sum, file) => sum + file.size, 0);
    return { databaseBytes, evidenceBytes, evidenceFiles: files.length, totalBytes: databaseBytes + evidenceBytes };
  }

  async cleanEvidence(projectId: string, olderThan: string) {
    assertIsoDate(olderThan, "Evidence cutoff");
    const rows = this.#database.prepare("SELECT relative_path,created_at FROM evidence_assets WHERE project_id=?").all(projectId) as Record<string, unknown>[];
    const tracked = new Map(rows.map((row) => [String(row.relative_path), String(row.created_at)]));
    const cutoff = Date.parse(olderThan);
    const files = (await this.#evidenceFiles(projectId)).filter((file) => Date.parse(tracked.get(file.relativePath) ?? new Date(file.modifiedAt).toISOString()) < cutoff);
    for (const file of files) await rm(file.absolutePath, { force: true });
    this.#database.prepare("DELETE FROM evidence_assets WHERE project_id=? AND created_at<?").run(projectId, olderThan);
    return { deletedFiles: files.length, deletedBytes: files.reduce((sum, file) => sum + file.size, 0) };
  }

  #backupPayload(projectId: string): BackupPayload {
    const project = this.getProject(projectId);
    if (!project) throw new Error("Project not found");
    const definitions = (this.#database.prepare("SELECT kind,id,revision,payload_json FROM definitions WHERE project_id=? ORDER BY kind,id").all(projectId) as Record<string, unknown>[]).map((row) => ({ kind: String(row.kind), id: String(row.id), revision: Number(row.revision), payload: JSON.parse(String(row.payload_json)) }));
    const runs = (this.#database.prepare("SELECT id,project_id,completed_at,outcome,definition_snapshot_json FROM completed_runs WHERE project_id=? ORDER BY completed_at,id").all(projectId) as Record<string, unknown>[]).map((row) => ({ id: String(row.id), projectId: String(row.project_id), completedAt: String(row.completed_at), outcome: String(row.outcome), definitionSnapshot: JSON.parse(String(row.definition_snapshot_json)) }));
    const evidenceRows = this.#database.prepare("SELECT id,relative_path,media_type,size,created_at FROM evidence_assets WHERE project_id=? ORDER BY id").all(projectId) as Record<string, unknown>[];
    const detail = this.getProjectDetail(projectId);
    const secretReferences = (detail?.secretReferences ?? []).map((reference) => ({ id: reference.id, ...(reference.description ? { description: reference.description } : {}) }));
    return { project, environments: detail?.environments ?? [], secretReferences, definitions, runs, evidence: evidenceRows.map((row) => ({ id: String(row.id), relativePath: String(row.relative_path), mediaType: String(row.media_type), size: Number(row.size), createdAt: String(row.created_at), base64: "" })) };
  }

  async exportProject(projectId: string, destination: string): Promise<void> {
    const payload = this.#backupPayload(projectId);
    for (const item of payload.evidence) item.base64 = (await readFile(join(this.#evidenceRoot, item.relativePath))).toString("base64");
    await mkdirSync(dirname(destination), { recursive: true });
    await writeFile(destination, JSON.stringify({ format: "veyra-project", version: 3, checksum: checksum(payload), payload }, null, 2), { mode: 0o600 });
  }

  async restoreProject(source: string): Promise<ProjectRecord> {
    if ((await stat(source)).size > 512 * 1024 * 1024) throw new Error("Project backup exceeds the 512 MB import limit");
    const document = JSON.parse(await readFile(source, "utf8")) as { format?: string; version?: number; checksum?: string; payload?: unknown };
    if (document.format !== "veyra-project" || ![1, 2, 3].includes(document.version ?? 0) || !document.payload) throw new Error("Unsupported Veyra project backup");
    if (checksum(document.payload as BackupPayload) !== document.checksum) throw new Error("Project backup checksum is invalid");
    const payload = validateBackupPayload(document.payload, document.version);
    const existingProject = this.getProject(payload.project.id);
    if (existingProject) {
      if (existingProject.archivedAt) {
        this.setProjectArchived(existingProject.id, false);
        return this.getProject(existingProject.id)!;
      }
      throw new Error("Project already exists");
    }
    this.#database.exec("BEGIN IMMEDIATE");
    try {
      this.saveProject(payload.project);
      if (payload.environments) {
        this.#database.prepare("DELETE FROM environments WHERE project_id=?").run(payload.project.id);
        const now = new Date().toISOString();
        for (const environment of payload.environments) {
          this.#database.prepare("INSERT INTO environments (id,project_id,name,base_url,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").run(environment.id, payload.project.id, environment.name, environment.baseUrl, environment.isActive ? 1 : 0, now, now);
          for (const variable of environment.variables) this.saveEnvironmentVariable(payload.project.id, environment.id, variable);
        }
      }
      for (const reference of payload.secretReferences ?? []) this.saveSecretReference(payload.project.id, reference);
      for (const definition of payload.definitions) this.saveDefinition(payload.project.id, definition.kind, definition.id, definition.revision, definition.payload);
      for (const run of payload.runs) this.recordCompletedRun(run);
      this.#database.exec("COMMIT");
      for (const item of payload.evidence) {
        const bytes = Buffer.from(item.base64, "base64");
        await this.writeEvidence(payload.project.id, item.id, bytes, item.mediaType, item.createdAt);
      }
    } catch (error) {
      try { this.#database.exec("ROLLBACK"); } catch { /* structured transaction may already be committed */ }
      this.#database.prepare("DELETE FROM projects WHERE id=?").run(payload.project.id);
      await rm(join(this.#evidenceRoot, payload.project.id), { recursive: true, force: true });
      throw error;
    }
    return payload.project;
  }

  close(): void {
    if (this.#closed) return;
    this.#closed = true;
    this.#database.close();
  }
}
