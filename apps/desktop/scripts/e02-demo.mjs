import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { ProjectStore } = require("../dist/electron/project-store.js");
const root = await mkdtemp(join(tmpdir(), "veyra-e02-demo-"));
const source = new ProjectStore(join(root, "source"));
const backupPath = join(root, "commerce-storefront.veyra-project.json");

source.saveProject({ id: "commerce-storefront-demo", name: "Commerce Storefront Demo", applicationUrl: "https://example.test", environmentName: "Staging" });
source.saveDefinition("commerce-storefront-demo", "test", "checkout", 1, { expected: "Order created" });
source.recordCompletedRun({ id: "run-demo-1", projectId: "commerce-storefront-demo", completedAt: "2026-09-15T12:00:00.000Z", outcome: "PASS", definitionSnapshot: { expected: "Order created" } });
await source.writeEvidence("commerce-storefront-demo", "checkout-screenshot", new TextEncoder().encode("demo evidence"), "text/plain", "2020-01-01T00:00:00.000Z");
await source.exportProject("commerce-storefront-demo", backupPath);
source.close();

const restored = new ProjectStore(join(root, "restored"));
await restored.restoreProject(backupPath);
const before = await restored.getStorageUsage("commerce-storefront-demo");
const cleanup = await restored.cleanEvidence("commerce-storefront-demo", "2025-01-01T00:00:00.000Z");
const after = await restored.getStorageUsage("commerce-storefront-demo");
const run = restored.getCompletedRun("run-demo-1");
restored.close();

if (!run || before.evidenceFiles !== 1 || cleanup.deletedFiles !== 1 || after.evidenceFiles !== 0) throw new Error("E02 demo verification failed");
console.log(JSON.stringify({ backupPath, before, cleanup, after, historicalRun: run, result: "VEYRA_E02_DEMO_READY" }, null, 2));
