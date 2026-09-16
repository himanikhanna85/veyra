import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const SECRET_ID = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;

export interface SecretCipher {
  readonly backend: string;
  isAvailable(): boolean;
  protect(value: string): Buffer;
  unprotect(value: Buffer): string;
}

interface VaultDocument { version: 1; values: Record<string, Record<string, string>> }

export class SecretVault {
  readonly #cipher: SecretCipher;
  readonly #path: string;
  #document: VaultDocument;

  constructor(root: string, cipher: SecretCipher) {
    mkdirSync(root, { recursive: true, mode: 0o700 });
    this.#path = join(root, "secrets.v1.json");
    this.#cipher = cipher;
    this.#document = this.#load();
  }

  set(projectId: string, secretId: string, value: string): void {
    this.#assertIds(projectId, secretId);
    if (!value) throw new Error("Secret value is required");
    if (!this.#cipher.isAvailable()) throw new Error("Operating-system secure storage is unavailable on this device");
    const project = this.#document.values[projectId] ?? {};
    project[secretId] = this.#cipher.protect(value).toString("base64");
    this.#document.values[projectId] = project;
    this.#persist();
  }

  status(projectId: string, secretId: string): { backend: string; configured: boolean } {
    this.#assertIds(projectId, secretId);
    return { backend: this.#cipher.backend, configured: Boolean(this.#document.values[projectId]?.[secretId]) };
  }

  configuredIds(projectId: string): string[] {
    if (!SAFE_ID.test(projectId)) throw new Error("Project id is invalid");
    return Object.keys(this.#document.values[projectId] ?? {}).sort();
  }

  revealForRuntime(projectId: string, secretId: string): string {
    this.#assertIds(projectId, secretId);
    if (!this.#cipher.isAvailable()) throw new Error("Operating-system secure storage is unavailable on this device");
    const encrypted = this.#document.values[projectId]?.[secretId];
    if (!encrypted) throw new Error(`Secret reference ${secretId} is not configured`);
    return this.#cipher.unprotect(Buffer.from(encrypted, "base64"));
  }

  delete(projectId: string, secretId: string): void {
    this.#assertIds(projectId, secretId);
    const project = this.#document.values[projectId];
    if (!project) return;
    delete project[secretId];
    if (Object.keys(project).length === 0) delete this.#document.values[projectId];
    this.#persist();
  }

  deleteProject(projectId: string): void {
    if (!SAFE_ID.test(projectId)) throw new Error("Project id is invalid");
    if (!this.#document.values[projectId]) return;
    delete this.#document.values[projectId];
    this.#persist();
  }

  #assertIds(projectId: string, secretId: string): void {
    if (!SAFE_ID.test(projectId)) throw new Error("Project id is invalid");
    if (!SECRET_ID.test(secretId)) throw new Error("Secret identifier is invalid");
  }

  #load(): VaultDocument {
    if (!existsSync(this.#path)) return { version: 1, values: {} };
    const parsed = JSON.parse(readFileSync(this.#path, "utf8")) as VaultDocument;
    if (parsed.version !== 1 || !parsed.values || typeof parsed.values !== "object") throw new Error("Secret vault format is invalid");
    return parsed;
  }

  #persist(): void {
    const temporaryPath = `${this.#path}.tmp`;
    writeFileSync(temporaryPath, JSON.stringify(this.#document), { mode: 0o600 });
    renameSync(temporaryPath, this.#path);
    chmodSync(this.#path, 0o600);
  }
}
