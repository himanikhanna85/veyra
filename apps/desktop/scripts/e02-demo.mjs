import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { ProjectStore } = require("../dist/electron/project-store.js");
const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const root = join(repositoryRoot, "e02-test-output");
await rm(root, { recursive: true, force: true });
await mkdir(root, { recursive: true });
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
const project = restored.getProject("commerce-storefront-demo");
const definition = restored.getDefinition("commerce-storefront-demo", "test", "checkout");
restored.close();

if (!project || project.name !== "Commerce Storefront Demo" || project.environmentName !== "Staging") throw new Error("E02 project persistence verification failed");
if (!definition || definition.revision !== 1 || definition.payload.expected !== "Order created") throw new Error("E02 definition restore verification failed");
if (!run || run.outcome !== "PASS" || run.definitionSnapshot.expected !== "Order created") throw new Error("E02 historical integrity verification failed");
if (before.evidenceFiles !== 1 || before.evidenceBytes !== 13) throw new Error("E02 separate evidence verification failed");
if (cleanup.deletedFiles !== 1 || cleanup.deletedBytes !== 13 || after.evidenceFiles !== 0) throw new Error("E02 evidence cleanup verification failed");
console.log(`
E02 quick test passed

✓ Project data saved in local SQLite storage
✓ Evidence stored separately (${before.evidenceFiles} file, ${before.evidenceBytes} bytes)
✓ Project backup exported and restored successfully
✓ Historical run remained unchanged (${run.outcome}: ${run.definitionSnapshot.expected})
✓ Old evidence cleaned without deleting the project (${cleanup.deletedFiles} file removed)

Sample backup:
${backupPath}

You can now open Veyra → Data → Restore project and select that file.
`);
