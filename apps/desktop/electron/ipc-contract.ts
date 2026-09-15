export const IPC_CHANNELS = Object.freeze({
  getAppInfo: "veyra:desktop:get-app-info",
  getLifecycleSnapshot: "veyra:desktop:get-lifecycle-snapshot",
  getStorageOverview: "veyra:desktop:get-storage-overview",
  cleanProjectEvidence: "veyra:desktop:clean-project-evidence",
  exportProjectBackup: "veyra:desktop:export-project-backup",
  restoreProjectBackup: "veyra:desktop:restore-project-backup",
  lifecycleChanged: "veyra:desktop:lifecycle-changed",
} as const);

export type LifecyclePhase = "starting" | "ready" | "stopping" | "stopped";

export interface AppInfo {
  apiVersion: 1;
  architecture: string;
  isPackaged: boolean;
  name: "Veyra";
  platform: NodeJS.Platform;
  version: string;
}

export interface LifecycleSnapshot {
  activeOperationIds: string[];
  cleanupFailures: string[];
  phase: LifecyclePhase;
  recoveredInterruptedOperationIds: string[];
}

export interface ProjectStorageUsage {
  evidenceBytes: number;
  evidenceFiles: number;
  id: string;
  name: string;
}

export interface StorageOverview {
  databaseBytes: number;
  evidenceBytes: number;
  evidenceFiles: number;
  projects: ProjectStorageUsage[];
  totalBytes: number;
}

export interface EvidenceCleanupResult { deletedBytes: number; deletedFiles: number }
export type BackupDialogResult = { canceled: true } | { canceled: false; fileName: string; projectId: string };

export interface VeyraDesktopApi {
  getAppInfo(): Promise<AppInfo>;
  getLifecycleSnapshot(): Promise<LifecycleSnapshot>;
  getStorageOverview(): Promise<StorageOverview>;
  cleanProjectEvidence(projectId: string, olderThan: string): Promise<EvidenceCleanupResult>;
  exportProjectBackup(projectId: string): Promise<BackupDialogResult>;
  restoreProjectBackup(): Promise<BackupDialogResult>;
  onLifecycleChanged(listener: (snapshot: LifecycleSnapshot) => void): () => void;
}

export interface RendererIpc {
  invoke(channel: string, ...args: unknown[]): Promise<unknown>;
  on(channel: string, listener: (event: unknown, payload: unknown) => void): void;
  removeListener(
    channel: string,
    listener: (event: unknown, payload: unknown) => void,
  ): void;
}

export function createVeyraDesktopApi(ipc: RendererIpc): VeyraDesktopApi {
  return Object.freeze({
    getAppInfo: () => ipc.invoke(IPC_CHANNELS.getAppInfo) as Promise<AppInfo>,
    getLifecycleSnapshot: () =>
      ipc.invoke(IPC_CHANNELS.getLifecycleSnapshot) as Promise<LifecycleSnapshot>,
    getStorageOverview: () => ipc.invoke(IPC_CHANNELS.getStorageOverview) as Promise<StorageOverview>,
    cleanProjectEvidence: (projectId: string, olderThan: string) => ipc.invoke(IPC_CHANNELS.cleanProjectEvidence, { projectId, olderThan }) as Promise<EvidenceCleanupResult>,
    exportProjectBackup: (projectId: string) => ipc.invoke(IPC_CHANNELS.exportProjectBackup, { projectId }) as Promise<BackupDialogResult>,
    restoreProjectBackup: () => ipc.invoke(IPC_CHANNELS.restoreProjectBackup) as Promise<BackupDialogResult>,
    onLifecycleChanged: (listener: (snapshot: LifecycleSnapshot) => void) => {
      const handleLifecycleChange = (_event: unknown, payload: unknown) => {
        listener(payload as LifecycleSnapshot);
      };
      ipc.on(IPC_CHANNELS.lifecycleChanged, handleLifecycleChange);
      return () => ipc.removeListener(IPC_CHANNELS.lifecycleChanged, handleLifecycleChange);
    },
  });
}
