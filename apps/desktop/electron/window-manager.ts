import { isTrustedRendererSender } from "./renderer-origin";

export interface DesktopWindowOptions {
  backgroundColor: string;
  height: number;
  icon: string;
  minHeight: number;
  minWidth: number;
  show: boolean;
  title: string;
  webPreferences: {
    contextIsolation: boolean;
    nodeIntegration: boolean;
    preload: string;
    sandbox: boolean;
    webSecurity: boolean;
    webviewTag: boolean;
  };
  width: number;
}

interface NavigationEventLike {
  preventDefault(): void;
}

export interface DesktopWebContentsLike {
  executeJavaScript(script: string): Promise<unknown>;
  on(
    event: "will-navigate",
    listener: (event: NavigationEventLike, url: string) => void,
  ): void;
  send(channel: string, payload: unknown): void;
  setWindowOpenHandler(handler: () => { action: "deny" }): void;
}

export interface DesktopWindowLike {
  close(): void;
  focus(): void;
  isDestroyed(): boolean;
  loadURL(url: string): Promise<unknown>;
  on(event: "closed", listener: () => void): void;
  once(event: "ready-to-show", listener: () => void): void;
  show(): void;
  setContentProtection(enabled: boolean): void;
  webContents: DesktopWebContentsLike;
}

export type WindowFactory = (options: DesktopWindowOptions) => DesktopWindowLike;

interface DesktopWindowManagerOptions {
  appIconPath: string;
  createWindow: WindowFactory;
  preloadPath: string;
  rendererUrl: string;
}

export class DesktopWindowManager {
  readonly #appIconPath: string;
  readonly #createWindow: WindowFactory;
  readonly #preloadPath: string;
  readonly #rendererUrl: string;
  #window: DesktopWindowLike | null = null;

  constructor({
    appIconPath,
    createWindow,
    preloadPath,
    rendererUrl,
  }: DesktopWindowManagerOptions) {
    this.#appIconPath = appIconPath;
    this.#createWindow = createWindow;
    this.#preloadPath = preloadPath;
    this.#rendererUrl = rendererUrl;
  }

  async open(): Promise<DesktopWindowLike> {
    if (this.#window && !this.#window.isDestroyed()) {
      this.#window.show();
      this.#window.focus();
      return this.#window;
    }

    const window = this.#createWindow({
      backgroundColor: "#F6F7F5",
      height: 960,
      icon: this.#appIconPath,
      minHeight: 800,
      minWidth: 1280,
      show: false,
      title: "Veyra",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: this.#preloadPath,
        sandbox: true,
        webSecurity: true,
        webviewTag: false,
      },
      width: 1440,
    });
    this.#window = window;

    window.once("ready-to-show", () => window.show());
    window.on("closed", () => {
      if (this.#window === window) this.#window = null;
    });
    window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    window.webContents.on("will-navigate", (event, targetUrl) => {
      if (!isTrustedRendererSender(this.#rendererUrl, targetUrl)) {
        event.preventDefault();
      }
    });

    try {
      await window.loadURL(this.#rendererUrl);
    } catch (error) {
      if (this.#window === window) this.#window = null;
      window.close();
      throw error;
    }

    return window;
  }

  close(): void {
    this.#window?.close();
  }

  get currentWindow(): DesktopWindowLike | null {
    return this.#window && !this.#window.isDestroyed() ? this.#window : null;
  }
}
