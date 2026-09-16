import { describe, expect, it, vi } from "vitest";
import {
  IPC_CHANNELS,
  createVeyraDesktopApi,
  type LifecycleSnapshot,
  type RendererIpc,
} from "./ipc-contract";

describe("Veyra desktop preload interface", () => {
  it("exposes only allow-listed typed calls and lifecycle subscription", async () => {
    const invoke = vi.fn(async (channel: string, ...args: unknown[]) => ({ channel, args }));
    const listeners = new Map<string, (...args: unknown[]) => void>();
    const removeListener = vi.fn((channel: string) => listeners.delete(channel));
    const ipc: RendererIpc = {
      invoke,
      on: (channel, listener) => {
        listeners.set(channel, listener);
      },
      removeListener,
    };

    const api = createVeyraDesktopApi(ipc);

    expect(Object.keys(api)).toEqual([
      "getAppInfo",
      "getLifecycleSnapshot",
      "getStorageOverview",
      "cleanProjectEvidence",
      "exportProjectBackup",
      "restoreProjectBackup",
      "getProjectWorkspace",
      "applyProjectCommand",
      "startControlledBrowser",
      "getControlledBrowserSession",
      "stopControlledBrowser",
      "setSensitiveEntry",
      "onLifecycleChanged",
    ]);

    await api.getAppInfo();
    await api.getLifecycleSnapshot();
    await api.getStorageOverview();
    await api.cleanProjectEvidence("project-1", "2025-01-01T00:00:00.000Z");
    await api.exportProjectBackup("project-1");
    await api.restoreProjectBackup();
    await api.getProjectWorkspace("project-1");
    await api.applyProjectCommand({ type: "archive", projectId: "project-1", archived: true });
    await api.startControlledBrowser({ projectId: "project-1", environmentId: "staging" });
    await api.getControlledBrowserSession();
    await api.stopControlledBrowser();
    await api.setSensitiveEntry(true);
    expect(invoke.mock.calls).toEqual([
      [IPC_CHANNELS.getAppInfo],
      [IPC_CHANNELS.getLifecycleSnapshot],
      [IPC_CHANNELS.getStorageOverview],
      [IPC_CHANNELS.cleanProjectEvidence, { projectId: "project-1", olderThan: "2025-01-01T00:00:00.000Z" }],
      [IPC_CHANNELS.exportProjectBackup, { projectId: "project-1" }],
      [IPC_CHANNELS.restoreProjectBackup],
      [IPC_CHANNELS.getProjectWorkspace, { projectId: "project-1" }],
      [IPC_CHANNELS.applyProjectCommand, { type: "archive", projectId: "project-1", archived: true }],
      [IPC_CHANNELS.startControlledBrowser, { projectId: "project-1", environmentId: "staging" }],
      [IPC_CHANNELS.getControlledBrowserSession],
      [IPC_CHANNELS.stopControlledBrowser],
      [IPC_CHANNELS.setSensitiveEntry, { active: true }],
    ]);

    const listener = vi.fn();
    const unsubscribe = api.onLifecycleChanged(listener);
    const snapshot: LifecycleSnapshot = {
      activeOperationIds: [],
      cleanupFailures: [],
      phase: "ready",
      recoveredInterruptedOperationIds: ["run-42"],
    };
    listeners.get(IPC_CHANNELS.lifecycleChanged)?.({}, snapshot);
    expect(listener).toHaveBeenCalledWith(snapshot);

    unsubscribe();
    expect(removeListener).toHaveBeenCalledWith(
      IPC_CHANNELS.lifecycleChanged,
      expect.any(Function),
    );
  });
});
