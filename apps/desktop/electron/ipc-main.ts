import { IPC_CHANNELS, type AppInfo, type LifecycleSnapshot } from "./ipc-contract";

export interface IpcMainEventLike {
  senderFrame?: {
    url?: string;
  } | null;
}

export interface IpcMainLike {
  handle(
    channel: string,
    handler: (event: IpcMainEventLike) => Promise<unknown>,
  ): void;
  removeHandler(channel: string): void;
}

interface DesktopIpcDependencies {
  getAppInfo(): AppInfo | Promise<AppInfo>;
  getLifecycleSnapshot(): LifecycleSnapshot | Promise<LifecycleSnapshot>;
  ipcMain: IpcMainLike;
  isTrustedSender(url: string): boolean;
}

export function registerDesktopIpc({
  getAppInfo,
  getLifecycleSnapshot,
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

  return () => {
    ipcMain.removeHandler(IPC_CHANNELS.getAppInfo);
    ipcMain.removeHandler(IPC_CHANNELS.getLifecycleSnapshot);
  };
}

