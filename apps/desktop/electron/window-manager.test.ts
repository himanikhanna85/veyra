import { describe, expect, it, vi } from "vitest";
import {
  DesktopWindowManager,
  type DesktopWindowLike,
  type WindowFactory,
} from "./window-manager";

function createWindowDouble(): DesktopWindowLike & {
  emit(event: "closed" | "ready-to-show"): void;
  emitNavigation(url: string): { prevented: boolean };
  openHandler(): { action: "deny" | "allow" };
} {
  const listeners = new Map<string, () => void>();
  let navigationHandler: ((event: { preventDefault(): void }, url: string) => void) | undefined;
  let windowOpenHandler: (() => { action: "deny" | "allow" }) | undefined;
  return {
    close: vi.fn(),
    emit: (event) => listeners.get(event)?.(),
    emitNavigation: (url) => {
      const state = { prevented: false };
      navigationHandler?.({ preventDefault: () => (state.prevented = true) }, url);
      return state;
    },
    focus: vi.fn(),
    isDestroyed: () => false,
    loadURL: vi.fn(async () => undefined),
    on: (event, listener) => listeners.set(event, listener),
    once: (event, listener) => listeners.set(event, listener),
    openHandler: () => windowOpenHandler?.() ?? { action: "allow" },
    show: vi.fn(),
    setContentProtection: vi.fn(),
    webContents: {
      executeJavaScript: vi.fn(async () => undefined),
      on: (event, listener) => {
        if (event === "will-navigate") navigationHandler = listener;
      },
      send: vi.fn(),
      setWindowOpenHandler: (handler) => {
        windowOpenHandler = handler;
      },
    },
  };
}

describe("DesktopWindowManager", () => {
  it("opens one isolated minimum-size window and blocks external navigation", async () => {
    const window = createWindowDouble();
    const factory = vi.fn<WindowFactory>(() => window);
    const manager = new DesktopWindowManager({
      appIconPath: "/app/icon.png",
      createWindow: factory,
      preloadPath: "/app/preload.js",
      rendererUrl: "veyra://app/index.html",
    });

    await manager.open();

    expect(factory).toHaveBeenCalledWith(
      expect.objectContaining({
        height: 960,
        icon: "/app/icon.png",
        minHeight: 800,
        minWidth: 1280,
        show: false,
        webPreferences: expect.objectContaining({
          contextIsolation: true,
          nodeIntegration: false,
          preload: "/app/preload.js",
          sandbox: true,
          webSecurity: true,
          webviewTag: false,
        }),
        width: 1440,
      }),
    );
    expect(window.loadURL).toHaveBeenCalledWith("veyra://app/index.html");
    expect(window.openHandler()).toEqual({ action: "deny" });
    expect(window.emitNavigation("https://attacker.example/").prevented).toBe(true);
    expect(window.emitNavigation("veyra://app/runs").prevented).toBe(false);

    window.emit("ready-to-show");
    expect(window.show).toHaveBeenCalledOnce();
  });

  it("focuses an open window and creates a new one after close", async () => {
    const first = createWindowDouble();
    const second = createWindowDouble();
    const factory = vi
      .fn<WindowFactory>()
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second);
    const manager = new DesktopWindowManager({
      appIconPath: "/app/icon.png",
      createWindow: factory,
      preloadPath: "/app/preload.js",
      rendererUrl: "veyra://app/index.html",
    });

    await manager.open();
    await manager.open();
    expect(factory).toHaveBeenCalledOnce();
    expect(first.show).toHaveBeenCalledOnce();
    expect(first.focus).toHaveBeenCalledOnce();

    first.emit("closed");
    await manager.open();
    expect(factory).toHaveBeenCalledTimes(2);
    expect(second.loadURL).toHaveBeenCalledWith("veyra://app/index.html");
  });
});
