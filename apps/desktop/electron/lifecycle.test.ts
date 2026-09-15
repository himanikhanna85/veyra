import { describe, expect, it, vi } from "vitest";
import {
  DesktopLifecycle,
  type LifecycleJournal,
  type LifecycleJournalState,
} from "./lifecycle";

function createJournal(initial: LifecycleJournalState | null) {
  let state = initial;
  const journal: LifecycleJournal = {
    read: vi.fn(async () => state),
    write: vi.fn(async (nextState) => {
      state = structuredClone(nextState);
    }),
  };
  return { journal, state: () => state };
}

describe("DesktopLifecycle", () => {
  it("recovers unfinished operations from an unclean prior session", async () => {
    const { journal, state } = createJournal({
      activeOperations: [
        { id: "run-42", kind: "run", startedAt: "2026-09-15T06:00:00.000Z" },
      ],
      cleanShutdown: false,
      pendingRecovery: [],
      schemaVersion: 1,
      sessionId: "prior-session",
    });
    const lifecycle = new DesktopLifecycle({
      createSessionId: () => "current-session",
      journal,
      now: () => new Date("2026-09-15T07:00:00.000Z"),
    });

    await expect(lifecycle.start()).resolves.toEqual({
      activeOperationIds: [],
      cleanupFailures: [],
      phase: "ready",
      recoveredInterruptedOperationIds: ["run-42"],
    });
    expect(state()).toEqual({
      activeOperations: [],
      cleanShutdown: false,
      pendingRecovery: [
        { id: "run-42", kind: "run", startedAt: "2026-09-15T06:00:00.000Z" },
      ],
      schemaVersion: 1,
      sessionId: "current-session",
    });
  });

  it("cleans up active workers and journals them as interrupted on shutdown", async () => {
    const { journal, state } = createJournal(null);
    const stop = vi.fn(async () => undefined);
    const lifecycle = new DesktopLifecycle({
      createSessionId: () => "current-session",
      journal,
      now: () => new Date("2026-09-15T07:00:00.000Z"),
    });
    await lifecycle.start();

    await lifecycle.trackOperation({ id: "run-active", kind: "run", stop });
    expect(lifecycle.snapshot().activeOperationIds).toEqual(["run-active"]);

    await expect(lifecycle.shutdown()).resolves.toEqual({
      activeOperationIds: [],
      cleanupFailures: [],
      phase: "stopped",
      recoveredInterruptedOperationIds: ["run-active"],
    });
    expect(stop).toHaveBeenCalledWith("application-shutdown");
    expect(state()).toEqual({
      activeOperations: [],
      cleanShutdown: true,
      pendingRecovery: [
        { id: "run-active", kind: "run", startedAt: "2026-09-15T07:00:00.000Z" },
      ],
      schemaVersion: 1,
      sessionId: "current-session",
    });
  });

  it("bounds worker cleanup and reports the operation that did not stop", async () => {
    const { journal } = createJournal(null);
    const lifecycle = new DesktopLifecycle({
      cleanupTimeoutMs: 5,
      createSessionId: () => "current-session",
      journal,
      now: () => new Date("2026-09-15T07:00:00.000Z"),
    });
    await lifecycle.start();
    await lifecycle.trackOperation({
      id: "hung-worker",
      kind: "worker",
      stop: () => new Promise(() => undefined),
    });

    await expect(lifecycle.shutdown()).resolves.toMatchObject({
      cleanupFailures: ["hung-worker"],
      phase: "stopped",
      recoveredInterruptedOperationIds: ["hung-worker"],
    });
  });

  it("removes completed and acknowledged operations from recovery state", async () => {
    const { journal } = createJournal({
      activeOperations: [],
      cleanShutdown: true,
      pendingRecovery: [
        { id: "recovered-run", kind: "run", startedAt: "2026-09-15T06:00:00.000Z" },
      ],
      schemaVersion: 1,
      sessionId: "prior-session",
    });
    const lifecycle = new DesktopLifecycle({
      createSessionId: () => "current-session",
      journal,
      now: () => new Date("2026-09-15T07:00:00.000Z"),
    });
    await lifecycle.start();
    await lifecycle.acknowledgeRecovery(["recovered-run"]);
    await lifecycle.trackOperation({
      id: "completed-run",
      kind: "run",
      stop: vi.fn(async () => undefined),
    });
    await lifecycle.completeOperation("completed-run");

    await expect(lifecycle.shutdown()).resolves.toMatchObject({
      activeOperationIds: [],
      recoveredInterruptedOperationIds: [],
    });
  });

  it("publishes lifecycle snapshots and lets subscribers detach", async () => {
    const { journal } = createJournal(null);
    const lifecycle = new DesktopLifecycle({
      createSessionId: () => "current-session",
      journal,
      now: () => new Date("2026-09-15T07:00:00.000Z"),
    });
    const listener = vi.fn();
    const unsubscribe = lifecycle.subscribe(listener);

    await lifecycle.start();
    await lifecycle.trackOperation({
      id: "run-active",
      kind: "run",
      stop: vi.fn(async () => undefined),
    });
    unsubscribe();
    await lifecycle.completeOperation("run-active");

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ phase: "ready" }),
    );
    expect(listener).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ activeOperationIds: ["run-active"] }),
    );
  });

  it("runs shutdown cleanup once when shutdown is requested concurrently", async () => {
    const { journal } = createJournal(null);
    const stop = vi.fn(async () => undefined);
    const lifecycle = new DesktopLifecycle({
      createSessionId: () => "current-session",
      journal,
      now: () => new Date("2026-09-15T07:00:00.000Z"),
    });
    await lifecycle.start();
    await lifecycle.trackOperation({ id: "run-active", kind: "run", stop });

    const [first, second] = await Promise.all([
      lifecycle.shutdown(),
      lifecycle.shutdown(),
    ]);

    expect(first).toEqual(second);
    expect(stop).toHaveBeenCalledTimes(1);
  });
});
