import { describe, expect, it, vi } from "vitest";
import { ControlledBrowser, type ControlledBrowserWindowLike } from "./controlled-browser";

function createWindowFactory() {
  const windows: ControlledBrowserWindowLike[] = [];
  const createWindow = vi.fn((options) => {
    const listeners = new Map<string, () => void>();
    const window = {
      close: vi.fn(() => listeners.get("closed")?.()),
      isDestroyed: vi.fn(() => false),
      loadURL: vi.fn(async () => undefined),
      on: vi.fn((event: "closed", listener: () => void) => {
        listeners.set(event, listener);
      }),
      show: vi.fn(),
      webContents: {
        getUserAgent: vi.fn(() => "Mozilla/5.0 Chrome/140.0.0.0 Safari/537.36"),
      },
      options,
    };
    windows.push(window);
    return window;
  });
  return { createWindow, windows };
}

describe("ControlledBrowser", () => {
  it("starts a headed Chromium session and returns metadata", async () => {
    const { createWindow, windows } = createWindowFactory();
    const browser = new ControlledBrowser({
      createSessionId: () => "session-1",
      createWindow,
      now: () => new Date("2026-09-16T08:00:00.000Z"),
    });

    const session = await browser.start({
      environmentName: "Staging",
      projectId: "shop",
      projectName: "Shop QA",
      url: "https://shop.test/products",
    });

    expect(createWindow).toHaveBeenCalledWith(expect.objectContaining({
      show: false,
      title: "Veyra Controlled Browser - Shop QA",
    }));
    expect(windows[0]?.loadURL).toHaveBeenCalledWith("https://shop.test/products");
    expect(windows[0]?.show).toHaveBeenCalled();
    expect(session).toEqual({
      browserEngine: "chromium",
      browserVersion: "140.0.0.0",
      environmentName: "Staging",
      launchedAt: "2026-09-16T08:00:00.000Z",
      projectId: "shop",
      projectName: "Shop QA",
      sessionId: "session-1",
      status: "running",
      url: "https://shop.test/products",
    });
    expect(browser.getSession()).toEqual(session);
  });

  it("stops the active browser session safely", async () => {
    const { createWindow, windows } = createWindowFactory();
    const browser = new ControlledBrowser({
      createSessionId: () => "session-1",
      createWindow,
      now: () => new Date("2026-09-16T08:00:00.000Z"),
    });
    await browser.start({
      environmentName: "Staging",
      projectId: "shop",
      projectName: "Shop QA",
      url: "https://shop.test",
    });

    const stopped = browser.stop();

    expect(stopped).toEqual({ sessionId: "session-1", status: "stopped" });
    expect(windows[0]?.close).toHaveBeenCalled();
    expect(browser.getSession()).toBeNull();
  });

  it("rejects non-http controlled browser URLs", async () => {
    const { createWindow } = createWindowFactory();
    const browser = new ControlledBrowser({
      createSessionId: () => "session-1",
      createWindow,
      now: () => new Date("2026-09-16T08:00:00.000Z"),
    });

    await expect(browser.start({
      environmentName: "Staging",
      projectId: "shop",
      projectName: "Shop QA",
      url: "file:///etc/passwd",
    })).rejects.toThrow("Controlled browser URL must be http or https");
    expect(createWindow).not.toHaveBeenCalled();
  });
});
