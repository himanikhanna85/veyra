import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectStore } from "./project-store";

const stores: ProjectStore[] = [];

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

async function createStore() {
  const root = await mkdtemp(join(tmpdir(), "veyra-project-store-"));
  const store = new ProjectStore(root);
  stores.push(store);
  return { root, store };
}

afterEach(() => stores.splice(0).forEach((store) => store.close()));

describe("ProjectStore", () => {
  it("persists versioned structured project data across restarts", async () => {
    const { root, store } = await createStore();
    store.saveProject({ id: "project-1", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging" });
    store.close();
    stores.splice(stores.indexOf(store), 1);

    const reopened = new ProjectStore(root);
    stores.push(reopened);
    expect(reopened.schemaVersion).toBe(1);
    expect(reopened.getProject("project-1")).toMatchObject({ name: "Shop", environmentName: "Staging" });
  });

  it("stores evidence outside SQLite and reports its usage", async () => {
    const { root, store } = await createStore();
    store.saveProject({ id: "project-1", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging" });
    const evidence = await store.writeEvidence("project-1", "shot-1", new Uint8Array([1, 2, 3]), "image/png");

    expect(evidence.relativePath).toBe("project-1/shot-1.png");
    expect(await readFile(join(root, "evidence", evidence.relativePath))).toEqual(Buffer.from([1, 2, 3]));
    expect((await stat(join(root, "veyra.sqlite"))).size).toBeGreaterThan(0);
    expect(await store.getStorageUsage("project-1")).toMatchObject({ evidenceBytes: 3, evidenceFiles: 1 });
  });

  it("keeps completed-run snapshots immutable when definitions change", async () => {
    const { store } = await createStore();
    store.saveProject({ id: "project-1", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging" });
    store.saveDefinition("project-1", "test", "checkout", 1, { expected: "Order created" });
    store.recordCompletedRun({ id: "run-1", projectId: "project-1", completedAt: "2026-09-15T10:00:00.000Z", definitionSnapshot: { expected: "Order created" }, outcome: "PASS" });
    store.saveDefinition("project-1", "test", "checkout", 2, { expected: "Receipt visible" });

    expect(store.getCompletedRun("run-1")?.definitionSnapshot).toEqual({ expected: "Order created" });
    expect(() => store.recordCompletedRun({ id: "run-1", projectId: "project-1", completedAt: "2026-09-15T10:01:00.000Z", definitionSnapshot: {}, outcome: "FAIL" })).toThrow(/immutable/i);
  });

  it("exports and restores a checksummed project including evidence", async () => {
    const source = await createStore();
    source.store.saveProject({ id: "project-1", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging" });
    await source.store.writeEvidence("project-1", "shot-1", new Uint8Array([4, 5, 6]), "image/png");
    const backupPath = join(source.root, "shop.veyra-project.json");
    await source.store.exportProject("project-1", backupPath);

    const target = await createStore();
    await target.store.restoreProject(backupPath);
    expect(target.store.getProject("project-1")?.name).toBe("Shop");
    expect((await target.store.getStorageUsage("project-1")).evidenceBytes).toBe(3);

    const tampered = JSON.parse(await readFile(backupPath, "utf8"));
    tampered.payload.project.name = "Tampered";
    await writeFile(backupPath, JSON.stringify(tampered));
    await expect(target.store.restoreProject(backupPath)).rejects.toThrow(/checksum/i);
  });

  it("cleans evidence by age without deleting project definitions", async () => {
    const { root, store } = await createStore();
    store.saveProject({ id: "project-1", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging" });
    store.saveDefinition("project-1", "module", "login", 1, { steps: ["Sign in"] });
    await store.writeEvidence("project-1", "old", new Uint8Array([1]), "text/plain", "2020-01-01T00:00:00.000Z");
    await store.writeEvidence("project-1", "new", new Uint8Array([2]), "text/plain", "2026-09-15T00:00:00.000Z");

    expect(await store.cleanEvidence("project-1", "2025-01-01T00:00:00.000Z")).toEqual({ deletedBytes: 1, deletedFiles: 1 });
    expect(store.getDefinition("project-1", "module", "login")?.payload).toEqual({ steps: ["Sign in"] });
    expect(await readdir(join(root, "evidence", "project-1"))).toEqual(["new.txt"]);
  });

  it("counts and cleans orphan evidence files from the actual filesystem", async () => {
    const { root, store } = await createStore();
    store.saveProject({ id: "project-1", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging" });
    const orphan = join(root, "evidence", "project-1", "orphan.bin");
    await mkdir(join(root, "evidence", "project-1"));
    await writeFile(orphan, new Uint8Array([1, 2, 3, 4]));
    await (await import("node:fs/promises")).utimes(orphan, new Date("2020-01-01"), new Date("2020-01-01"));
    expect(await store.getStorageUsage("project-1")).toMatchObject({ evidenceBytes: 4, evidenceFiles: 1 });
    expect(await store.cleanEvidence("project-1", "2025-01-01T00:00:00.000Z")).toEqual({ deletedBytes: 4, deletedFiles: 1 });
  });

  it("rejects structurally invalid backups before importing any records", async () => {
    const source = await createStore();
    source.store.saveProject({ id: "project-1", name: "Shop", applicationUrl: "https://shop.test", environmentName: "Staging" });
    source.store.recordCompletedRun({ id: "run-1", projectId: "project-1", completedAt: "2026-09-15T10:00:00.000Z", definitionSnapshot: {}, outcome: "PASS" });
    const backupPath = join(source.root, "invalid.veyra-project.json");
    await source.store.exportProject("project-1", backupPath);
    const document = JSON.parse(await readFile(backupPath, "utf8"));
    document.payload.runs[0].projectId = "project-2";
    document.checksum = createHash("sha256").update(canonicalJson(document.payload)).digest("hex");
    await writeFile(backupPath, JSON.stringify(document));

    const target = await createStore();
    target.store.saveProject({ id: "project-2", name: "Other", applicationUrl: "https://other.test", environmentName: "Staging" });
    await expect(target.store.restoreProject(backupPath)).rejects.toThrow(/run project/i);
    expect(target.store.getCompletedRun("run-1")).toBeUndefined();
    expect(target.store.getProject("project-1")).toBeUndefined();
  });

  it("does not create an evidence file when metadata cannot be committed", async () => {
    const { root, store } = await createStore();
    await expect(store.writeEvidence("missing-project", "shot", new Uint8Array([1]), "image/png")).rejects.toThrow(/project not found/i);
    await expect(readdir(join(root, "evidence"))).resolves.toEqual([]);
  });

  it("preserves a corrupt database for recovery instead of overwriting it", async () => {
    const root = await mkdtemp(join(tmpdir(), "veyra-corrupt-store-"));
    await writeFile(join(root, "veyra.sqlite"), "not sqlite");
    expect(() => new ProjectStore(root)).toThrow(/could not be opened/i);
    expect(await readFile(join(root, "veyra.sqlite"), "utf8")).toBe("not sqlite");
  });
});
