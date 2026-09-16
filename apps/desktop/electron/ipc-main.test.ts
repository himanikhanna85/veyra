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
      getStorageOverview: () => ({ databaseBytes: 10, evidenceBytes: 0, evidenceFiles: 0, projects: [], totalBytes: 10 }),
      cleanProjectEvidence: () => ({ deletedBytes: 0, deletedFiles: 0 }),
      exportProjectBackup: () => ({ canceled: true }),
      restoreProjectBackup: () => ({ canceled: true }),
      getProjectWorkspace: () => ({ activeProject: null, overview: null, projects: [] }),
      applyProjectCommand: () => ({ projectId: null }),
      ipcMain,
      isTrustedSender: (url) => url === "veyra://app/index.html",
    });

    expect([...handlers.keys()]).toEqual([
      IPC_CHANNELS.getAppInfo,
      IPC_CHANNELS.getLifecycleSnapshot,
      IPC_CHANNELS.getStorageOverview,
      IPC_CHANNELS.cleanProjectEvidence,
      IPC_CHANNELS.exportProjectBackup,
      IPC_CHANNELS.restoreProjectBackup,
      IPC_CHANNELS.getProjectWorkspace,
      IPC_CHANNELS.applyProjectCommand,
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
    await expect(
      handlers.get(IPC_CHANNELS.cleanProjectEvidence)?.({ senderFrame: { url: "veyra://app/index.html" } }, { projectId: "../bad", olderThan: "nope" }),
    ).rejects.toThrow(/invalid/i);
    await expect(
      handlers.get(IPC_CHANNELS.applyProjectCommand)?.({ senderFrame: { url: "veyra://app/index.html" } }, { type: "delete", projectId: "../bad", confirmationName: "Shop" }),
    ).rejects.toThrow(/invalid/i);

    dispose();
    expect(removeHandler).toHaveBeenCalledTimes(8);
    expect(handlers).toHaveLength(0);
  });
});
