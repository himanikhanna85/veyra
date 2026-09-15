import { describe, expect, it, vi } from "vitest";
import {
  IPC_CHANNELS,
  createVeyraDesktopApi,
  type LifecycleSnapshot,
  type RendererIpc,
} from "./ipc-contract";

describe("Veyra desktop preload interface", () => {
  it("exposes only allow-listed typed calls and lifecycle subscription", async () => {
    const invoke = vi.fn(async (channel: string) => ({ channel }));
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
      "onLifecycleChanged",
    ]);

    await api.getAppInfo();
    await api.getLifecycleSnapshot();
    expect(invoke.mock.calls).toEqual([
      [IPC_CHANNELS.getAppInfo],
      [IPC_CHANNELS.getLifecycleSnapshot],
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

