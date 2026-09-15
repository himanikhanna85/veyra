import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import type {
  LifecycleJournal,
  LifecycleJournalState,
  LifecycleOperationRecord,
} from "./lifecycle";

class CorruptLifecycleJournalError extends Error {}

function isOperationRecord(value: unknown): value is LifecycleOperationRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.kind === "string" &&
    typeof record.startedAt === "string"
  );
}

function isLifecycleJournalState(value: unknown): value is LifecycleJournalState {
  if (!value || typeof value !== "object") return false;
  const state = value as Record<string, unknown>;
  return (
    state.schemaVersion === 1 &&
    typeof state.sessionId === "string" &&
    typeof state.cleanShutdown === "boolean" &&
    Array.isArray(state.activeOperations) &&
    state.activeOperations.every(isOperationRecord) &&
    Array.isArray(state.pendingRecovery) &&
    state.pendingRecovery.every(isOperationRecord)
  );
}

export class FileLifecycleJournal implements LifecycleJournal {
  readonly #path: string;

  constructor(path: string) {
    this.#path = path;
  }

  async read(): Promise<LifecycleJournalState | null> {
    try {
      const contents = await readFile(this.#path, "utf8");
      let state: unknown;
      try {
        state = JSON.parse(contents);
      } catch {
        throw new CorruptLifecycleJournalError("Lifecycle journal is not JSON");
      }
      if (!isLifecycleJournalState(state)) {
        throw new CorruptLifecycleJournalError(
          "Lifecycle journal does not match schema version 1",
        );
      }
      return state;
    } catch (error) {
      if (isNodeError(error) && error.code === "ENOENT") return null;
      if (error instanceof CorruptLifecycleJournalError) {
        await rename(
          this.#path,
          `${this.#path}.corrupt-${Date.now()}-${crypto.randomUUID()}`,
        );
        return null;
      }
      throw error;
    }
  }

  async write(state: LifecycleJournalState): Promise<void> {
    const directory = dirname(this.#path);
    const temporaryPath = join(
      directory,
      `.${basename(this.#path)}.${process.pid}.${crypto.randomUUID()}.tmp`,
    );
    await mkdir(directory, { recursive: true });
    await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
    await rename(temporaryPath, this.#path);
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
