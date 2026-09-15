import { createHash, randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const SCHEMA_VERSION = 1;
const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;

export interface ProjectRecord {
  applicationUrl: string;
  environmentName: string;
  id: string;
  name: string;
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
  project: ProjectRecord;
  runs: CompletedRunRecord[];
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

function validateBackupPayload(value: unknown): BackupPayload {
  if (!isRecord(value) || !isRecord(value.project) || !Array.isArray(value.definitions) || !Array.isArray(value.runs) || !Array.isArray(value.evidence)) throw new Error("Project backup payload is invalid");
  const project = value.project;
  for (const field of ["id", "name", "applicationUrl", "environmentName"] as const) if (typeof project[field] !== "string" || project[field].length === 0) throw new Error(`Project ${field} is invalid`);
  assertSafeId(project.id, "Project id");
  try { new URL(project.applicationUrl as string); } catch { throw new Error("Project application URL is invalid"); }
  const projectId = project.id as string;
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
    this.#database.exec(`BEGIN IMMEDIATE;
      CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, application_url TEXT NOT NULL, environment_name TEXT NOT NULL, updated_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS definitions (project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, kind TEXT NOT NULL, id TEXT NOT NULL, revision INTEGER NOT NULL, payload_json TEXT NOT NULL, PRIMARY KEY(project_id, kind, id));
      CREATE TABLE IF NOT EXISTS completed_runs (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, completed_at TEXT NOT NULL, outcome TEXT NOT NULL, definition_snapshot_json TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS evidence_assets (id TEXT NOT NULL, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, relative_path TEXT NOT NULL UNIQUE, media_type TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(project_id, id));
      PRAGMA user_version = 1;
      COMMIT;`);
  }

  saveProject(project: ProjectRecord): void {
    assertSafeId(project.id, "Project id");
    this.#database.prepare(`INSERT INTO projects (id,name,application_url,environment_name,updated_at) VALUES (?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, application_url=excluded.application_url, environment_name=excluded.environment_name, updated_at=excluded.updated_at`)
      .run(project.id, project.name, project.applicationUrl, project.environmentName, new Date().toISOString());
  }

  getProject(id: string): ProjectRecord | undefined {
    const row = this.#database.prepare("SELECT id,name,application_url,environment_name FROM projects WHERE id=?").get(id) as Record<string, unknown> | undefined;
    return row ? { id: String(row.id), name: String(row.name), applicationUrl: String(row.application_url), environmentName: String(row.environment_name) } : undefined;
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
    return { project, definitions, runs, evidence: evidenceRows.map((row) => ({ id: String(row.id), relativePath: String(row.relative_path), mediaType: String(row.media_type), size: Number(row.size), createdAt: String(row.created_at), base64: "" })) };
  }

  async exportProject(projectId: string, destination: string): Promise<void> {
    const payload = this.#backupPayload(projectId);
    for (const item of payload.evidence) item.base64 = (await readFile(join(this.#evidenceRoot, item.relativePath))).toString("base64");
    await mkdirSync(dirname(destination), { recursive: true });
    await writeFile(destination, JSON.stringify({ format: "veyra-project", version: 1, checksum: checksum(payload), payload }, null, 2), { mode: 0o600 });
  }

  async restoreProject(source: string): Promise<ProjectRecord> {
    if ((await stat(source)).size > 512 * 1024 * 1024) throw new Error("Project backup exceeds the 512 MB import limit");
    const document = JSON.parse(await readFile(source, "utf8")) as { format?: string; version?: number; checksum?: string; payload?: unknown };
    if (document.format !== "veyra-project" || document.version !== 1 || !document.payload) throw new Error("Unsupported Veyra project backup");
    if (checksum(document.payload as BackupPayload) !== document.checksum) throw new Error("Project backup checksum is invalid");
    const payload = validateBackupPayload(document.payload);
    if (this.getProject(payload.project.id)) throw new Error("Project already exists");
    this.#database.exec("BEGIN IMMEDIATE");
    try {
      this.saveProject(payload.project);
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
