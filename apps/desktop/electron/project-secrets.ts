import type { ProjectDetail, SecretReference } from "./project-store";
import { SecretProtection } from "./secret-protection";

export interface SecretMetadataStore {
  assertSecretReferenceDeletable(projectId: string, id: string): void;
  deleteProject(projectId: string, confirmationName: string): Promise<void>;
  deleteSecretReference(projectId: string, id: string): void;
  getProjectDetail(projectId: string): ProjectDetail | undefined;
  saveSecretReference(projectId: string, reference: { description?: string; id: string }): SecretReference;
}

export interface SecretValueVault {
  configuredIds(projectId: string): string[];
  delete(projectId: string, secretId: string): void;
  deleteProject(projectId: string): void;
  revealForRuntime(projectId: string, secretId: string): string;
  set(projectId: string, secretId: string, value: string): void;
  status(projectId: string, secretId: string): { configured: boolean };
}

export class ProjectSecrets {
  readonly #metadata: SecretMetadataStore;
  readonly #protection: SecretProtection;
  readonly #vault: SecretValueVault;

  constructor(metadata: SecretMetadataStore, vault: SecretValueVault) {
    this.#metadata = metadata;
    this.#vault = vault;
    this.#protection = new SecretProtection(vault);
  }

  getProjectDetail(projectId: string): ProjectDetail | undefined {
    const detail = this.#metadata.getProjectDetail(projectId);
    if (!detail) return undefined;
    return { ...detail, secretReferences: detail.secretReferences.map((reference) => ({ ...reference, hasValue: this.#vault.status(projectId, reference.id).configured })) };
  }

  saveReference(projectId: string, reference: { description?: string; id: string }): SecretReference {
    return this.#metadata.saveSecretReference(projectId, reference);
  }

  deleteReference(projectId: string, secretId: string): void {
    this.#metadata.assertSecretReferenceDeletable(projectId, secretId);
    const previous = this.#snapshot(projectId, secretId);
    this.#vault.delete(projectId, secretId);
    try { this.#metadata.deleteSecretReference(projectId, secretId); }
    catch (error) { if (previous !== undefined) this.#vault.set(projectId, secretId, previous); throw error; }
  }

  setValue(projectId: string, secretId: string, value: string): void {
    if (!this.#metadata.getProjectDetail(projectId)?.secretReferences.some((reference) => reference.id === secretId)) throw new Error("Secret reference not found");
    this.#vault.set(projectId, secretId, value);
  }

  clearValue(projectId: string, secretId: string): void {
    this.#vault.delete(projectId, secretId);
  }

  async deleteProject(projectId: string, confirmationName: string): Promise<void> {
    const project = this.#metadata.getProjectDetail(projectId);
    if (!project) throw new Error("Project not found");
    if (confirmationName !== project.name) throw new Error("Enter the exact project name to delete it");
    const snapshot = new Map(this.#vault.configuredIds(projectId).map((secretId) => [secretId, this.#vault.revealForRuntime(projectId, secretId)]));
    this.#vault.deleteProject(projectId);
    try { await this.#metadata.deleteProject(projectId, confirmationName); }
    catch (error) { for (const [secretId, value] of snapshot) this.#vault.set(projectId, secretId, value); throw error; }
  }

  resolveForRuntime(projectId: string, definition: unknown): unknown { return this.#protection.resolveForRuntime(projectId, definition); }
  redactForLog(projectId: string, payload: unknown): unknown { return this.#protection.redactForLog(projectId, payload); }
  redactForReport(projectId: string, payload: unknown): unknown { return this.#protection.redactForReport(projectId, payload); }
  prepareAiRequest(projectId: string, payload: unknown): unknown { return this.#protection.prepareAiRequest(projectId, payload); }

  #snapshot(projectId: string, secretId: string): string | undefined {
    return this.#vault.status(projectId, secretId).configured ? this.#vault.revealForRuntime(projectId, secretId) : undefined;
  }
}
