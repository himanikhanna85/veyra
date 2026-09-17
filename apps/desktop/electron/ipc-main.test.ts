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

    const applyProjectCommand = vi.fn(() => ({ projectId: "shop" }));
    const startControlledBrowser = vi.fn(() => ({
      browserEngine: "chromium" as const,
      browserVersion: "140.0.0.0",
      environmentName: "Staging",
      isolationKey: "veyra-controlled.shop.session-1",
      launchedAt: "2026-09-16T08:00:00.000Z",
      projectId: "shop",
      projectName: "Shop QA",
      sessionId: "session-1",
      status: "running" as const,
      url: "https://shop.test",
    }));
    const getControlledBrowserSession = vi.fn(() => null);
    const stopControlledBrowser = vi.fn(() => ({ sessionId: "session-1", status: "stopped" as const }));
    const getActiveTeachSession = vi.fn(() => null);
    const startTeachSession = vi.fn(() => ({ id: "teach-1", projectId: "shop", environmentId: "staging", environmentName: "Staging", name: "Complete checkout", startedAt: "2026-09-17T08:00:00.000Z", status: "started" as const }));
    const setSensitiveEntry = vi.fn();
    const dispose = registerDesktopIpc({
      getAppInfo: () => appInfo,
      getLifecycleSnapshot: () => lifecycle,
      getStorageOverview: () => ({ databaseBytes: 10, evidenceBytes: 0, evidenceFiles: 0, projects: [], totalBytes: 10 }),
      cleanProjectEvidence: () => ({ deletedBytes: 0, deletedFiles: 0 }),
      exportProjectBackup: () => ({ canceled: true }),
      restoreProjectBackup: () => ({ canceled: true }),
      getProjectWorkspace: () => ({ activeProject: null, overview: null, projects: [] }),
      applyProjectCommand,
      getBrowserRuntimeStatus: () => ({ compatibility: "compatible", engine: "chromium", managedBy: "veyra", source: "electron-bundled", status: "ready", version: "144.0.7559.97" }),
      getActiveTeachSession,
      startTeachSession,
      startControlledBrowser,
      getControlledBrowserSession,
      stopControlledBrowser,
      setSensitiveEntry,
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
      IPC_CHANNELS.getBrowserRuntimeStatus,
      IPC_CHANNELS.getActiveTeachSession,
      IPC_CHANNELS.startTeachSession,
      IPC_CHANNELS.startControlledBrowser,
      IPC_CHANNELS.getControlledBrowserSession,
      IPC_CHANNELS.stopControlledBrowser,
      IPC_CHANNELS.setSensitiveEntry,
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
      handlers.get(IPC_CHANNELS.getBrowserRuntimeStatus)?.({ senderFrame: { url: "veyra://app/index.html" } }),
    ).resolves.toMatchObject({ status: "ready", version: "144.0.7559.97" });
    await expect(
      handlers.get(IPC_CHANNELS.getActiveTeachSession)?.({ senderFrame: { url: "veyra://app/index.html" } }, { projectId: "shop" }),
    ).resolves.toBeNull();
    await handlers.get(IPC_CHANNELS.startTeachSession)?.({ senderFrame: { url: "veyra://app/index.html" } }, { projectId: "shop", environmentId: "staging", name: "Complete checkout" });
    expect(startTeachSession).toHaveBeenCalledWith({ projectId: "shop", environmentId: "staging", name: "Complete checkout" });
    await expect(
      handlers.get(IPC_CHANNELS.startTeachSession)?.({ senderFrame: { url: "veyra://app/index.html" } }, { projectId: "../bad", name: "Workflow" }),
    ).rejects.toThrow(/invalid/i);
    await expect(
      handlers.get(IPC_CHANNELS.cleanProjectEvidence)?.({ senderFrame: { url: "veyra://app/index.html" } }, { projectId: "../bad", olderThan: "nope" }),
    ).rejects.toThrow(/invalid/i);
    await expect(
      handlers.get(IPC_CHANNELS.applyProjectCommand)?.({ senderFrame: { url: "veyra://app/index.html" } }, { type: "delete", projectId: "../bad", confirmationName: "Shop" }),
    ).rejects.toThrow(/invalid/i);
    await expect(
      handlers.get(IPC_CHANNELS.startControlledBrowser)?.({ senderFrame: { url: "veyra://app/index.html" } }, { projectId: "../bad" }),
    ).rejects.toThrow(/invalid/i);
    await handlers.get(IPC_CHANNELS.startControlledBrowser)?.({ senderFrame: { url: "veyra://app/index.html" } }, { projectId: "shop", environmentId: "staging" });
    expect(startControlledBrowser).toHaveBeenCalledWith({ projectId: "shop", environmentId: "staging" });
    await expect(
      handlers.get(IPC_CHANNELS.getControlledBrowserSession)?.({ senderFrame: { url: "https://attacker.example/" } }),
    ).rejects.toThrow(/untrusted/i);
    await expect(
      handlers.get(IPC_CHANNELS.stopControlledBrowser)?.({ senderFrame: { url: "veyra://app/index.html" } }),
    ).resolves.toEqual({ sessionId: "session-1", status: "stopped" });
    await expect(
      handlers.get(IPC_CHANNELS.applyProjectCommand)?.({ senderFrame: { url: "veyra://app/index.html" } }, { type: "save-secret-reference", projectId: "shop", id: "shop_password", description: "Shopper login", value: "must-not-cross-ipc" }),
    ).resolves.toEqual({ projectId: "shop" });
    expect(applyProjectCommand).toHaveBeenLastCalledWith({ type: "save-secret-reference", projectId: "shop", id: "shop_password", description: "Shopper login" });
    await handlers.get(IPC_CHANNELS.applyProjectCommand)?.({ senderFrame: { url: "veyra://app/index.html" } }, { type: "save-secret-reference", projectId: "shop", id: "api_token" });
    expect(applyProjectCommand).toHaveBeenLastCalledWith({ type: "save-secret-reference", projectId: "shop", id: "api_token", description: undefined });
    await handlers.get(IPC_CHANNELS.setSensitiveEntry)?.({ senderFrame: { url: "veyra://app/index.html" } }, { active: true });
    expect(setSensitiveEntry).toHaveBeenCalledWith(true);
    await expect(handlers.get(IPC_CHANNELS.setSensitiveEntry)?.({ senderFrame: { url: "https://attacker.example/" } }, { active: false })).rejects.toThrow(/untrusted/i);

    dispose();
    expect(removeHandler).toHaveBeenCalledTimes(15);
    expect(handlers).toHaveLength(0);
  });
});
