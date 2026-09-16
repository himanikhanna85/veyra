export const IPC_CHANNELS = Object.freeze({
  getAppInfo: "veyra:desktop:get-app-info",
  getLifecycleSnapshot: "veyra:desktop:get-lifecycle-snapshot",
  getStorageOverview: "veyra:desktop:get-storage-overview",
  cleanProjectEvidence: "veyra:desktop:clean-project-evidence",
  exportProjectBackup: "veyra:desktop:export-project-backup",
  restoreProjectBackup: "veyra:desktop:restore-project-backup",
  getProjectWorkspace: "veyra:desktop:get-project-workspace",
  applyProjectCommand: "veyra:desktop:apply-project-command",
  startControlledBrowser: "veyra:desktop:start-controlled-browser",
  getControlledBrowserSession: "veyra:desktop:get-controlled-browser-session",
  stopControlledBrowser: "veyra:desktop:stop-controlled-browser",
  setSensitiveEntry: "veyra:desktop:set-sensitive-entry",
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
export interface EnvironmentVariableDto { key: string; value: string }
export interface ProjectEnvironmentDto { baseUrl: string; id: string; isActive: boolean; name: string; variables: EnvironmentVariableDto[] }
export interface SecretReferenceDto { description: string; hasValue: boolean; id: string }
export interface ProjectDetailDto { applicationUrl: string; archived: boolean; environmentName: string; environments: ProjectEnvironmentDto[]; id: string; name: string; secretReferences: SecretReferenceDto[] }
export interface ProjectSummaryDto { archived: boolean; environmentName: string; id: string; name: string }
export interface ProjectOverviewDto { latestOutcome: string | null; latestRunAt: string | null; moduleItems: Array<{ id: string; name: string }>; modules: number; outcomeCounts: Record<string, number>; passRate: number | null; recentRunItems: Array<{ completedAt: string; id: string; outcome: string }>; recentRuns: number; tests: number }
export interface ProjectWorkspace { activeProject: ProjectDetailDto | null; overview: ProjectOverviewDto | null; projects: ProjectSummaryDto[] }
export type ProjectCommand =
  | { type: "create"; name: string; applicationUrl: string; environmentName: string }
  | { type: "update"; projectId: string; name: string; applicationUrl: string }
  | { type: "save-environment"; projectId: string; environment: { id?: string; name: string; baseUrl: string } }
  | { type: "activate-environment"; projectId: string; environmentId: string }
  | { type: "save-variable"; projectId: string; environmentId: string; key: string; value: string }
  | { type: "delete-variable"; projectId: string; environmentId: string; key: string }
  | { type: "save-secret-reference"; projectId: string; id: string; description?: string }
  | { type: "delete-secret-reference"; projectId: string; id: string }
  | { type: "set-secret-value"; projectId: string; id: string; value: string }
  | { type: "delete-secret-value"; projectId: string; id: string }
  | { type: "archive"; projectId: string; archived: boolean }
  | { type: "delete"; projectId: string; confirmationName: string };
export interface ProjectCommandResult { projectId: string | null }
export interface ControlledBrowserStartCommand { environmentId?: string; projectId: string }
export interface ControlledBrowserSessionDto { browserEngine: "chromium"; browserVersion: string; environmentName: string; isolationKey: string; launchedAt: string; projectId: string; projectName: string; sessionId: string; status: "running"; url: string }
export interface ControlledBrowserStopResultDto { sessionId: string | null; status: "stopped" }

export interface VeyraDesktopApi {
  getAppInfo(): Promise<AppInfo>;
  getLifecycleSnapshot(): Promise<LifecycleSnapshot>;
  getStorageOverview(): Promise<StorageOverview>;
  cleanProjectEvidence(projectId: string, olderThan: string): Promise<EvidenceCleanupResult>;
  exportProjectBackup(projectId: string): Promise<BackupDialogResult>;
  restoreProjectBackup(): Promise<BackupDialogResult>;
  getProjectWorkspace(projectId?: string): Promise<ProjectWorkspace>;
  applyProjectCommand(command: ProjectCommand): Promise<ProjectCommandResult>;
  startControlledBrowser(command: ControlledBrowserStartCommand): Promise<ControlledBrowserSessionDto>;
  getControlledBrowserSession(): Promise<ControlledBrowserSessionDto | null>;
  stopControlledBrowser(): Promise<ControlledBrowserStopResultDto>;
  setSensitiveEntry(active: boolean): Promise<void>;
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
    getProjectWorkspace: (projectId?: string) => ipc.invoke(IPC_CHANNELS.getProjectWorkspace, { projectId }) as Promise<ProjectWorkspace>,
    applyProjectCommand: (command: ProjectCommand) => ipc.invoke(IPC_CHANNELS.applyProjectCommand, command) as Promise<ProjectCommandResult>,
    startControlledBrowser: (command: ControlledBrowserStartCommand) => ipc.invoke(IPC_CHANNELS.startControlledBrowser, command) as Promise<ControlledBrowserSessionDto>,
    getControlledBrowserSession: () => ipc.invoke(IPC_CHANNELS.getControlledBrowserSession) as Promise<ControlledBrowserSessionDto | null>,
    stopControlledBrowser: () => ipc.invoke(IPC_CHANNELS.stopControlledBrowser) as Promise<ControlledBrowserStopResultDto>,
    setSensitiveEntry: (active: boolean) => ipc.invoke(IPC_CHANNELS.setSensitiveEntry, { active }) as Promise<void>,
    onLifecycleChanged: (listener: (snapshot: LifecycleSnapshot) => void) => {
      const handleLifecycleChange = (_event: unknown, payload: unknown) => {
        listener(payload as LifecycleSnapshot);
      };
      ipc.on(IPC_CHANNELS.lifecycleChanged, handleLifecycleChange);
      return () => ipc.removeListener(IPC_CHANNELS.lifecycleChanged, handleLifecycleChange);
    },
  });
}
