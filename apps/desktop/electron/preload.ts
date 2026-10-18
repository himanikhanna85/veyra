import "@reticlehq/electron/preload";
import { contextBridge, ipcRenderer } from "electron";
import { createVeyraDesktopApi } from "./ipc-contract";

contextBridge.exposeInMainWorld(
  "veyraDesktop",
  createVeyraDesktopApi(ipcRenderer),
);
