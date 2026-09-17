import { describe, expect, it } from "vitest";
import { inspectBundledBrowserRuntime } from "./browser-runtime";

describe("bundled browser runtime", () => {
  it("reports Electron's bundled Chromium as a managed ready runtime", () => {
    expect(inspectBundledBrowserRuntime("144.0.7559.97")).toEqual({
      compatibility: "compatible",
      engine: "chromium",
      managedBy: "veyra",
      source: "electron-bundled",
      status: "ready",
      version: "144.0.7559.97",
    });
  });

  it("reports an unavailable runtime when Chromium cannot be identified", () => {
    expect(inspectBundledBrowserRuntime(undefined)).toEqual({
      compatibility: "unknown",
      engine: "chromium",
      managedBy: "veyra",
      source: "electron-bundled",
      status: "unavailable",
      version: null,
    });
  });
});
