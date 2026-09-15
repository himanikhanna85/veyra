import type { VeyraDesktopApi } from "../electron/ipc-contract";

declare global {
  interface Window {
    veyraDesktop?: VeyraDesktopApi;
  }
}

export {};
