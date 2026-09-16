import { IPC_CHANNELS, type AppInfo, type BackupDialogResult, type EvidenceCleanupResult, type LifecycleSnapshot, type ProjectCommand, type ProjectCommandResult, type ProjectWorkspace, type StorageOverview } from "./ipc-contract";

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
  getProjectWorkspace(projectId?: string): ProjectWorkspace | Promise<ProjectWorkspace>;
  applyProjectCommand(command: ProjectCommand): ProjectCommandResult | Promise<ProjectCommandResult>;
  setSensitiveEntry(active: boolean): void | Promise<void>;
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
  getProjectWorkspace,
  applyProjectCommand,
  setSensitiveEntry,
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
  const requiredString = (value: unknown, label: string): string => {
    if (typeof value !== "string") throw new Error(`Invalid ${label}`);
    return value;
  };
  const validateProjectCommand = (payload: unknown): ProjectCommand => {
    if (!payload || typeof payload !== "object") throw new Error("Invalid project command");
    const value = payload as Record<string, unknown>;
    switch (value.type) {
      case "create": return { type: "create", name: requiredString(value.name, "project name"), applicationUrl: requiredString(value.applicationUrl, "application URL"), environmentName: requiredString(value.environmentName, "environment name") };
      case "update": return { type: "update", projectId: validateProjectId(value.projectId), name: requiredString(value.name, "project name"), applicationUrl: requiredString(value.applicationUrl, "application URL") };
      case "save-environment": {
        const environment = value.environment as Record<string, unknown> | null;
        if (!environment || typeof environment !== "object") throw new Error("Invalid environment");
        return { type: "save-environment", projectId: validateProjectId(value.projectId), environment: { id: environment.id == null ? undefined : validateProjectId(environment.id), name: requiredString(environment.name, "environment name"), baseUrl: requiredString(environment.baseUrl, "environment URL") } };
      }
      case "activate-environment": return { type: "activate-environment", projectId: validateProjectId(value.projectId), environmentId: validateProjectId(value.environmentId) };
      case "save-variable": return { type: "save-variable", projectId: validateProjectId(value.projectId), environmentId: validateProjectId(value.environmentId), key: requiredString(value.key, "variable name"), value: requiredString(value.value, "variable value") };
      case "delete-variable": return { type: "delete-variable", projectId: validateProjectId(value.projectId), environmentId: validateProjectId(value.environmentId), key: requiredString(value.key, "variable name") };
      case "save-secret-reference": return { type: "save-secret-reference", projectId: validateProjectId(value.projectId), id: requiredString(value.id, "secret identifier"), description: value.description == null ? undefined : requiredString(value.description, "secret description") };
      case "delete-secret-reference": return { type: "delete-secret-reference", projectId: validateProjectId(value.projectId), id: requiredString(value.id, "secret identifier") };
      case "set-secret-value": return { type: "set-secret-value", projectId: validateProjectId(value.projectId), id: requiredString(value.id, "secret identifier"), value: requiredString(value.value, "secret value") };
      case "delete-secret-value": return { type: "delete-secret-value", projectId: validateProjectId(value.projectId), id: requiredString(value.id, "secret identifier") };
      case "archive": {
        if (typeof value.archived !== "boolean") throw new Error("Invalid archive state");
        return { type: "archive", projectId: validateProjectId(value.projectId), archived: value.archived };
      }
      case "delete": return { type: "delete", projectId: validateProjectId(value.projectId), confirmationName: requiredString(value.confirmationName, "confirmation name") };
      default: throw new Error("Invalid project command");
    }
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
  ipcMain.handle(IPC_CHANNELS.getProjectWorkspace, async (event, payload) => {
    if (!isTrustedSender(event.senderFrame?.url ?? "")) throw new Error("Untrusted IPC sender");
    const value = (payload as Record<string, unknown> | null)?.projectId;
    return getProjectWorkspace(value == null ? undefined : validateProjectId(value));
  });
  ipcMain.handle(IPC_CHANNELS.applyProjectCommand, async (event, payload) => {
    if (!isTrustedSender(event.senderFrame?.url ?? "")) throw new Error("Untrusted IPC sender");
    return applyProjectCommand(validateProjectCommand(payload));
  });
  ipcMain.handle(IPC_CHANNELS.setSensitiveEntry, async (event, payload) => {
    if (!isTrustedSender(event.senderFrame?.url ?? "")) throw new Error("Untrusted IPC sender");
    const active = (payload as Record<string, unknown> | null)?.active;
    if (typeof active !== "boolean") throw new Error("Invalid sensitive-entry state");
    await setSensitiveEntry(active);
  });

  return () => {
    ipcMain.removeHandler(IPC_CHANNELS.getAppInfo);
    ipcMain.removeHandler(IPC_CHANNELS.getLifecycleSnapshot);
    ipcMain.removeHandler(IPC_CHANNELS.getStorageOverview);
    ipcMain.removeHandler(IPC_CHANNELS.cleanProjectEvidence);
    ipcMain.removeHandler(IPC_CHANNELS.exportProjectBackup);
    ipcMain.removeHandler(IPC_CHANNELS.restoreProjectBackup);
    ipcMain.removeHandler(IPC_CHANNELS.getProjectWorkspace);
    ipcMain.removeHandler(IPC_CHANNELS.applyProjectCommand);
    ipcMain.removeHandler(IPC_CHANNELS.setSensitiveEntry);
  };
}
