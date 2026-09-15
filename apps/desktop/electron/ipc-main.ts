import { IPC_CHANNELS, type AppInfo, type BackupDialogResult, type EvidenceCleanupResult, type LifecycleSnapshot, type StorageOverview } from "./ipc-contract";

export interface IpcMainEventLike {
  senderFrame?: {
    url?: string;
  } | null;
}

export interface IpcMainLike {
  handle(
    channel: string,
    handler: (event: IpcMainEventLike, payload?: unknown) => Promise<unknown>,
  ): void;
  removeHandler(channel: string): void;
}

interface DesktopIpcDependencies {
  getAppInfo(): AppInfo | Promise<AppInfo>;
  getLifecycleSnapshot(): LifecycleSnapshot | Promise<LifecycleSnapshot>;
  getStorageOverview(): StorageOverview | Promise<StorageOverview>;
  cleanProjectEvidence(projectId: string, olderThan: string): EvidenceCleanupResult | Promise<EvidenceCleanupResult>;
  exportProjectBackup(projectId: string): BackupDialogResult | Promise<BackupDialogResult>;
  restoreProjectBackup(): BackupDialogResult | Promise<BackupDialogResult>;
  ipcMain: IpcMainLike;
  isTrustedSender(url: string): boolean;
}

export function registerDesktopIpc({
  getAppInfo,
  getLifecycleSnapshot,
  getStorageOverview,
  cleanProjectEvidence,
  exportProjectBackup,
  restoreProjectBackup,
  ipcMain,
  isTrustedSender,
}: DesktopIpcDependencies): () => void {
  function trustedHandler<T>(read: () => T | Promise<T>) {
    return async (event: IpcMainEventLike): Promise<T> => {
      const senderUrl = event.senderFrame?.url ?? "";
      if (!isTrustedSender(senderUrl)) {
        throw new Error("Untrusted IPC sender");
      }
      return read();
    };
  }

  ipcMain.handle(IPC_CHANNELS.getAppInfo, trustedHandler(getAppInfo));
  ipcMain.handle(
    IPC_CHANNELS.getLifecycleSnapshot,
    trustedHandler(getLifecycleSnapshot),
  );
  ipcMain.handle(IPC_CHANNELS.getStorageOverview, trustedHandler(getStorageOverview));

  function trustedMutation<T>(validate: (payload: unknown) => Parameters<typeof cleanProjectEvidence>, mutate: (...args: Parameters<typeof cleanProjectEvidence>) => T | Promise<T>) {
    return async (event: IpcMainEventLike, payload: unknown): Promise<T> => {
      if (!isTrustedSender(event.senderFrame?.url ?? "")) throw new Error("Untrusted IPC sender");
      return mutate(...validate(payload));
    };
  }
  const validateProjectId = (value: unknown): string => {
    if (typeof value !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(value)) throw new Error("Invalid project id");
    return value;
  };
  ipcMain.handle(IPC_CHANNELS.cleanProjectEvidence, trustedMutation((payload) => {
    const value = payload as Record<string, unknown> | null;
    const projectId = validateProjectId(value?.projectId);
    const olderThan = value?.olderThan;
    if (typeof olderThan !== "string" || Number.isNaN(Date.parse(olderThan))) throw new Error("Invalid evidence cutoff");
    return [projectId, olderThan];
  }, cleanProjectEvidence));
  ipcMain.handle(IPC_CHANNELS.exportProjectBackup, async (event, payload) => {
    if (!isTrustedSender(event.senderFrame?.url ?? "")) throw new Error("Untrusted IPC sender");
    return exportProjectBackup(validateProjectId((payload as Record<string, unknown> | null)?.projectId));
  });
  ipcMain.handle(IPC_CHANNELS.restoreProjectBackup, trustedHandler(restoreProjectBackup));

  return () => {
    ipcMain.removeHandler(IPC_CHANNELS.getAppInfo);
    ipcMain.removeHandler(IPC_CHANNELS.getLifecycleSnapshot);
    ipcMain.removeHandler(IPC_CHANNELS.getStorageOverview);
    ipcMain.removeHandler(IPC_CHANNELS.cleanProjectEvidence);
    ipcMain.removeHandler(IPC_CHANNELS.exportProjectBackup);
    ipcMain.removeHandler(IPC_CHANNELS.restoreProjectBackup);
  };
}
