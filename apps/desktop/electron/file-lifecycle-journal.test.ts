import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { FileLifecycleJournal } from "./file-lifecycle-journal";
import type { LifecycleJournalState } from "./lifecycle";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe("FileLifecycleJournal", () => {
  it("persists lifecycle state atomically in the application data directory", async () => {
    const directory = await mkdtemp(join(tmpdir(), "veyra-lifecycle-"));
    temporaryDirectories.push(directory);
    const path = join(directory, "state", "lifecycle.json");
    const journal = new FileLifecycleJournal(path);
    const state: LifecycleJournalState = {
      activeOperations: [],
      cleanShutdown: false,
      pendingRecovery: [],
      schemaVersion: 1,
      sessionId: "session-1",
    };

    await journal.write(state);

    await expect(new FileLifecycleJournal(path).read()).resolves.toEqual(state);
    await expect(readFile(path, "utf8")).resolves.toBe(
      `${JSON.stringify(state, null, 2)}\n`,
    );
  });

  it("quarantines a corrupt journal so the desktop shell can recover", async () => {
    const directory = await mkdtemp(join(tmpdir(), "veyra-lifecycle-"));
    temporaryDirectories.push(directory);
    const path = join(directory, "lifecycle.json");
    await writeFile(path, "not-json", "utf8");

    await expect(new FileLifecycleJournal(path).read()).resolves.toBeNull();

    const files = await readdir(directory);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^lifecycle\.json\.corrupt-/);
    await expect(readFile(join(directory, files[0]), "utf8")).resolves.toBe(
      "not-json",
    );
  });
});
