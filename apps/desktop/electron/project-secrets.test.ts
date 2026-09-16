import { describe, expect, it, vi } from "vitest";
import { ProjectSecrets, type SecretMetadataStore, type SecretValueVault } from "./project-secrets";

function createVault(): SecretValueVault {
  const values = new Map<string, string>();
  const key = (projectId: string, secretId: string) => `${projectId}:${secretId}`;
  return {
    configuredIds: (projectId) => [...values.keys()].filter((entry) => entry.startsWith(`${projectId}:`)).map((entry) => entry.slice(projectId.length + 1)),
    delete: (projectId, secretId) => { values.delete(key(projectId, secretId)); },
    deleteProject: (projectId) => { for (const entry of [...values.keys()]) if (entry.startsWith(`${projectId}:`)) values.delete(entry); },
    revealForRuntime: (projectId, secretId) => { const value = values.get(key(projectId, secretId)); if (!value) throw new Error("not configured"); return value; },
    set: (projectId, secretId, value) => { values.set(key(projectId, secretId), value); },
    status: (projectId, secretId) => ({ configured: values.has(key(projectId, secretId)) }),
  };
}

function createMetadata(overrides: Partial<SecretMetadataStore> = {}): SecretMetadataStore {
  return {
    assertSecretReferenceDeletable: vi.fn(),
    deleteProject: vi.fn(async () => undefined),
    deleteSecretReference: vi.fn(),
    getProjectDetail: () => ({ id: "shop", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, archivedAt: null, environments: [], secretReferences: [{ id: "api_token", description: "API token", hasValue: false }] }),
    saveSecretReference: (_projectId, reference) => ({ id: reference.id, description: reference.description ?? "", hasValue: false }),
    ...overrides,
  };
}

describe("ProjectSecrets", () => {
  it("owns status-only value operations and production output policies", () => {
    const vault = createVault();
    const secrets = new ProjectSecrets(createMetadata(), vault);
    secrets.setValue("shop", "api_token", "token-123");

    expect(secrets.getProjectDetail("shop")?.secretReferences[0].hasValue).toBe(true);
    expect(secrets.resolveForRuntime("shop", { value: { secretRef: "api_token" } })).toEqual({ value: "token-123" });
    expect(secrets.redactForLog("shop", "token-123")).toBe("[REDACTED]");
    expect(secrets.redactForReport("shop", "token-123")).toBe("[REDACTED]");
    expect(secrets.prepareAiRequest("shop", { value: { secretRef: "api_token" } })).toEqual({ value: "[SECRET_REF:api_token]" });
  });

  it("restores secured values if permanent project deletion fails", async () => {
    const vault = createVault();
    const metadata = createMetadata({ deleteProject: vi.fn(async () => { throw new Error("evidence cleanup failed"); }) });
    const secrets = new ProjectSecrets(metadata, vault);
    secrets.setValue("shop", "api_token", "token-123");

    await expect(secrets.deleteProject("shop", "Shop")).rejects.toThrow(/cleanup failed/i);
    expect(vault.revealForRuntime("shop", "api_token")).toBe("token-123");
  });
});
