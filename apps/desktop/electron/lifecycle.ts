import type { LifecyclePhase, LifecycleSnapshot } from "./ipc-contract";

export interface LifecycleOperationRecord {
  id: string;
  kind: string;
  startedAt: string;
}

export interface LifecycleJournalState {
  activeOperations: LifecycleOperationRecord[];
  cleanShutdown: boolean;
  pendingRecovery: LifecycleOperationRecord[];
  schemaVersion: 1;
  sessionId: string;
}

export interface LifecycleJournal {
  read(): Promise<LifecycleJournalState | null>;
  write(state: LifecycleJournalState): Promise<void>;
}

interface DesktopLifecycleOptions {
  cleanupTimeoutMs?: number;
  createSessionId(): string;
  journal: LifecycleJournal;
  now(): Date;
}

export interface TrackedLifecycleOperation {
  id: string;
  kind: string;
  stop(reason: "application-shutdown"): Promise<void>;
}

function uniqueOperations(
  operations: LifecycleOperationRecord[],
): LifecycleOperationRecord[] {
  return [...new Map(operations.map((operation) => [operation.id, operation])).values()];
}

export class DesktopLifecycle {
  readonly #cleanupTimeoutMs: number;
  readonly #createSessionId: () => string;
  readonly #journal: LifecycleJournal;
  readonly #listeners = new Set<(snapshot: LifecycleSnapshot) => void>();
  readonly #now: () => Date;
  readonly #operations = new Map<string, TrackedLifecycleOperation>();
  #phase: LifecyclePhase = "starting";
  #state: LifecycleJournalState | null = null;
  #cleanupFailures: string[] = [];
  #shutdownPromise: Promise<LifecycleSnapshot> | null = null;

  constructor({
    cleanupTimeoutMs = 5_000,
    createSessionId,
    journal,
    now,
  }: DesktopLifecycleOptions) {
    this.#cleanupTimeoutMs = cleanupTimeoutMs;
    this.#createSessionId = createSessionId;
    this.#journal = journal;
    this.#now = now;
  }

  async start(): Promise<LifecycleSnapshot> {
    const previous = await this.#journal.read();
    const interrupted = uniqueOperations([
      ...(previous?.pendingRecovery ?? []),
      ...(previous && !previous.cleanShutdown ? previous.activeOperations : []),
    ]);

    this.#state = {
      activeOperations: [],
      cleanShutdown: false,
      pendingRecovery: interrupted,
      schemaVersion: 1,
      sessionId: this.#createSessionId(),
    };
    await this.#journal.write(this.#state);
    this.#phase = "ready";
    const snapshot = this.snapshot();
    this.#emit(snapshot);
    return snapshot;
  }

  snapshot(): LifecycleSnapshot {
    return {
      activeOperationIds: this.#state?.activeOperations.map(({ id }) => id) ?? [],
      cleanupFailures: [...this.#cleanupFailures],
      phase: this.#phase,
      recoveredInterruptedOperationIds:
        this.#state?.pendingRecovery.map(({ id }) => id) ?? [],
    };
  }

  subscribe(listener: (snapshot: LifecycleSnapshot) => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  async trackOperation(operation: TrackedLifecycleOperation): Promise<void> {
    if (this.#phase !== "ready" || !this.#state) {
      throw new Error("Desktop lifecycle is not ready");
    }
    if (this.#operations.has(operation.id)) {
      throw new Error(`Lifecycle operation already tracked: ${operation.id}`);
    }

    this.#operations.set(operation.id, operation);
    this.#state.activeOperations.push({
      id: operation.id,
      kind: operation.kind,
      startedAt: this.#now().toISOString(),
    });
    await this.#journal.write(this.#state);
    this.#emit();
  }

  async completeOperation(operationId: string): Promise<void> {
    if (this.#phase !== "ready" || !this.#state) {
      throw new Error("Desktop lifecycle is not ready");
    }
    this.#operations.delete(operationId);
    this.#state.activeOperations = this.#state.activeOperations.filter(
      ({ id }) => id !== operationId,
    );
    await this.#journal.write(this.#state);
    this.#emit();
  }

  async acknowledgeRecovery(operationIds: string[]): Promise<void> {
    if (this.#phase !== "ready" || !this.#state) {
      throw new Error("Desktop lifecycle is not ready");
    }
    const acknowledgedIds = new Set(operationIds);
    this.#state.pendingRecovery = this.#state.pendingRecovery.filter(
      ({ id }) => !acknowledgedIds.has(id),
    );
    await this.#journal.write(this.#state);
    this.#emit();
  }

  shutdown(): Promise<LifecycleSnapshot> {
    if (this.#shutdownPromise) return this.#shutdownPromise;
    this.#shutdownPromise = this.#performShutdown();
    return this.#shutdownPromise;
  }

  async #performShutdown(): Promise<LifecycleSnapshot> {
    if (!this.#state) throw new Error("Desktop lifecycle has not started");

    this.#phase = "stopping";
    this.#emit();
    const activeOperations = [...this.#state.activeOperations];
    const cleanupResults = await Promise.allSettled(
      [...this.#operations.values()].map((operation) =>
        this.#stopWithTimeout(operation),
      ),
    );
    this.#cleanupFailures = cleanupResults.flatMap((result, index) =>
      result.status === "rejected" ? [activeOperations[index]?.id ?? "unknown"] : [],
    );

    this.#state = {
      ...this.#state,
      activeOperations: [],
      cleanShutdown: true,
      pendingRecovery: uniqueOperations([
        ...this.#state.pendingRecovery,
        ...activeOperations,
      ]),
    };
    this.#operations.clear();
    await this.#journal.write(this.#state);
    this.#phase = "stopped";
    const snapshot = this.snapshot();
    this.#emit(snapshot);
    return snapshot;
  }

  #emit(snapshot = this.snapshot()): void {
    for (const listener of this.#listeners) listener(snapshot);
  }

  async #stopWithTimeout(operation: TrackedLifecycleOperation): Promise<void> {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        operation.stop("application-shutdown"),
        new Promise<never>((_resolve, reject) => {
          timeout = setTimeout(
            () => reject(new Error(`Cleanup timed out: ${operation.id}`)),
            this.#cleanupTimeoutMs,
          );
        }),
      ]);
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}
