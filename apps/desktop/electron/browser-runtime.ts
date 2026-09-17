export interface BrowserRuntimeStatus {
  compatibility: "compatible" | "unknown";
  engine: "chromium";
  managedBy: "veyra";
  source: "electron-bundled";
  status: "ready" | "unavailable";
  version: string | null;
}

export function inspectBundledBrowserRuntime(chromiumVersion: string | undefined): BrowserRuntimeStatus {
  const version = chromiumVersion?.trim();
  const available = Boolean(version && /^\d+(?:\.\d+)+$/.test(version));
  return {
    compatibility: available ? "compatible" : "unknown",
    engine: "chromium",
    managedBy: "veyra",
    source: "electron-bundled",
    status: available ? "ready" : "unavailable",
    version: version || null,
  };
}
