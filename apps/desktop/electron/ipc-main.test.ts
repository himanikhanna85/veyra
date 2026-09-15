import { describe, expect, it, vi } from "vitest";
import { IPC_CHANNELS, type AppInfo, type LifecycleSnapshot } from "./ipc-contract";
import { registerDesktopIpc, type IpcMainLike } from "./ipc-main";

describe("desktop main-process IPC", () => {
  it("serves allow-listed requests only to trusted renderer frames", async () => {
    const handlers = new Map<string, (event: unknown) => unknown>();
    const removeHandler = vi.fn((channel: string) => handlers.delete(channel));
    const ipcMain: IpcMainLike = {
      handle: (channel, handler) => handlers.set(channel, handler),
      removeHandler,
    };
    const appInfo: AppInfo = {
      apiVersion: 1,
      architecture: "arm64",
      isPackaged: true,
      name: "Veyra",
      platform: "darwin",
      version: "0.1.0",
    };
    const lifecycle: LifecycleSnapshot = {
      activeOperationIds: [],
      cleanupFailures: [],
      phase: "ready",
      recoveredInterruptedOperationIds: [],
    };

    const dispose = registerDesktopIpc({
      getAppInfo: () => appInfo,
      getLifecycleSnapshot: () => lifecycle,
      ipcMain,
      isTrustedSender: (url) => url === "veyra://app/index.html",
    });

    expect([...handlers.keys()]).toEqual([
      IPC_CHANNELS.getAppInfo,
      IPC_CHANNELS.getLifecycleSnapshot,
    ]);
    await expect(
      handlers.get(IPC_CHANNELS.getAppInfo)?.({
        senderFrame: { url: "https://attacker.example/" },
      }),
    ).rejects.toThrow("Untrusted IPC sender");
    await expect(
      handlers.get(IPC_CHANNELS.getAppInfo)?.({
        senderFrame: { url: "veyra://app/index.html" },
      }),
    ).resolves.toEqual(appInfo);
    await expect(
      handlers.get(IPC_CHANNELS.getLifecycleSnapshot)?.({
        senderFrame: { url: "veyra://app/index.html" },
      }),
    ).resolves.toEqual(lifecycle);

    dispose();
    expect(removeHandler).toHaveBeenCalledTimes(2);
    expect(handlers).toHaveLength(0);
  });
});

