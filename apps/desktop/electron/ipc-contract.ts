export const IPC_CHANNELS = Object.freeze({
  getAppInfo: "veyra:desktop:get-app-info",
  getLifecycleSnapshot: "veyra:desktop:get-lifecycle-snapshot",
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

export interface VeyraDesktopApi {
  getAppInfo(): Promise<AppInfo>;
  getLifecycleSnapshot(): Promise<LifecycleSnapshot>;
  onLifecycleChanged(listener: (snapshot: LifecycleSnapshot) => void): () => void;
}

export interface RendererIpc {
  invoke(channel: string): Promise<unknown>;
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
    onLifecycleChanged: (listener: (snapshot: LifecycleSnapshot) => void) => {
      const handleLifecycleChange = (_event: unknown, payload: unknown) => {
        listener(payload as LifecycleSnapshot);
      };
      ipc.on(IPC_CHANNELS.lifecycleChanged, handleLifecycleChange);
      return () => ipc.removeListener(IPC_CHANNELS.lifecycleChanged, handleLifecycleChange);
    },
  });
}
