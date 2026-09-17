import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  net,
  protocol,
  session,
} from "electron";
import { randomUUID } from "node:crypto";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import { ControlledBrowser } from "./controlled-browser";
import { inspectBundledBrowserRuntime } from "./browser-runtime";
import { FileLifecycleJournal } from "./file-lifecycle-journal";
import { IPC_CHANNELS } from "./ipc-contract";
import { registerDesktopIpc } from "./ipc-main";
import { DesktopLifecycle } from "./lifecycle";
import { ProjectStore } from "./project-store";
import { createElectronSecretCipher } from "./electron-secret-cipher";
import { SecretVault } from "./secret-vault";
import { SensitiveEvidenceGuard } from "./sensitive-evidence-guard";
import { ProjectSecrets } from "./project-secrets";
import {
  isTrustedRendererSender,
  selectRendererUrl,
} from "./renderer-origin";
import { resolveRendererAsset } from "./renderer-assets";
import {
  DesktopWindowManager,
  type DesktopWindowLike,
} from "./window-manager";

const APP_SCHEME = "veyra";
const rendererRoot = join(__dirname, "..", "client");
const preloadPath = join(__dirname, "preload.cjs");
const appIconPath = join(__dirname, "..", "..", "build", "icon.png");
const rendererUrl = selectRendererUrl(process.env.VEYRA_RENDERER_URL);
const browserRuntime = inspectBundledBrowserRuntime(process.versions.chrome);

protocol.registerSchemesAsPrivileged([
  {
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
    },
    scheme: APP_SCHEME,
  },
]);
app.enableSandbox();
app.setName("Veyra");
if (process.env.VEYRA_USER_DATA_DIR) {
  app.setPath("userData", process.env.VEYRA_USER_DATA_DIR);
}

let disposeIpc: () => void = () => undefined;
let disposeLifecycleSubscription: () => void = () => undefined;
let lifecycle: DesktopLifecycle | undefined;
let shutdownRequested = false;
let shutdownComplete = false;
let rendererProtocolInstalled = false;
let applicationReady: Promise<void> | undefined;
let projectStore: ProjectStore | undefined;
let projectSecrets: ProjectSecrets | undefined;
let controlledBrowser: ControlledBrowser | undefined;

const windowManager = new DesktopWindowManager({
  appIconPath,
  createWindow: (options) =>
    new BrowserWindow(options) as unknown as DesktopWindowLike,
  preloadPath,
  rendererUrl,
});
const sensitiveEvidenceGuard = new SensitiveEvidenceGuard({
  setContentProtection: (enabled) => windowManager.currentWindow?.setContentProtection(enabled),
});
controlledBrowser = new ControlledBrowser({
  createSessionId: randomUUID,
  createWindow: (options) => new BrowserWindow(options),
  now: () => new Date(),
});

function installRendererProtocol(): void {
  protocol.handle(APP_SCHEME, async (request) => {
    try {
      const assetPath = resolveRendererAsset(rendererRoot, request.url);
      return await net.fetch(pathToFileURL(assetPath).toString());
    } catch {
      return new Response("Renderer asset not found", { status: 404 });
    }
  });
  rendererProtocolInstalled = true;
}

function denyRendererPermissions(): void {
  session.defaultSession.setPermissionCheckHandler(() => false);
  session.defaultSession.setPermissionRequestHandler(
    (_webContents, _permission, callback) => callback(false),
  );
}

async function runSmokeCheck(window: DesktopWindowLike): Promise<void> {
  const result = await window.webContents.executeJavaScript(`
    (async () => {
      const api = globalThis.veyraDesktop;
      const info = await api.getAppInfo();
      const lifecycle = await api.getLifecycleSnapshot();
      return {
        apiKeys: Object.keys(api).sort(),
        appName: info.name,
        hasNodeProcess: typeof globalThis.process !== "undefined",
        hasNodeRequire: typeof globalThis.require !== "undefined",
        lifecyclePhase: lifecycle.phase,
      };
    })()
  `);
  const smoke = result as Record<string, unknown>;
  const valid =
    smoke.appName === "Veyra" &&
    smoke.hasNodeProcess === false &&
    smoke.hasNodeRequire === false &&
    smoke.lifecyclePhase === "ready" &&
    JSON.stringify(smoke.apiKeys) ===
      JSON.stringify([
        "applyProjectCommand",
        "cleanProjectEvidence",
        "exportProjectBackup",
        "getAppInfo",
        "getBrowserRuntimeStatus",
        "getControlledBrowserSession",
        "getLifecycleSnapshot",
        "getProjectWorkspace",
        "getStorageOverview",
        "onLifecycleChanged",
        "restoreProjectBackup",
        "setSensitiveEntry",
        "startControlledBrowser",
        "stopControlledBrowser",
      ]);
  if (!valid) throw new Error(`Desktop smoke check failed: ${JSON.stringify(smoke)}`);
  console.log(`VEYRA_SMOKE_READY ${JSON.stringify(smoke)}`);
}

async function openWindow(): Promise<void> {
  const window = await windowManager.open();
  if (process.env.VEYRA_SMOKE_TEST === "1") {
    await runSmokeCheck(window);
    app.quit();
  }
}

async function startApplication(): Promise<void> {
  installRendererProtocol();
  denyRendererPermissions();
  if (process.platform === "darwin" && !app.isPackaged) {
    app.dock?.setIcon(appIconPath);
  }
  if (process.platform === "win32") app.setAppUserModelId("com.veyra.desktop");

  lifecycle = new DesktopLifecycle({
    createSessionId: randomUUID,
    journal: new FileLifecycleJournal(
      join(app.getPath("userData"), "state", "lifecycle.json"),
    ),
    now: () => new Date(),
  });
  await lifecycle.start();
  projectStore = new ProjectStore(join(app.getPath("userData"), "projects"), { assertEvidenceCaptureAllowed: () => sensitiveEvidenceGuard.assertCaptureAllowed() });
  const secretVault = new SecretVault(join(app.getPath("userData"), "secrets"), createElectronSecretCipher());
  projectSecrets = new ProjectSecrets(projectStore, secretVault);

  const getProjectWorkspace = (requestedProjectId?: string) => {
    if (!projectStore) throw new Error("Project storage is not ready");
    const projects = projectStore.listProjectSummaries();
    const projectId = requestedProjectId && projects.some((project) => project.id === requestedProjectId) ? requestedProjectId : projects[0]?.id;
    return {
      projects,
      activeProject: projectId ? (() => {
        return projectSecrets!.getProjectDetail(projectId) ?? null;
      })() : null,
      overview: projectId ? projectStore.getProjectOverview(projectId) : null,
    };
  };

  disposeIpc = registerDesktopIpc({
    getAppInfo: () => ({
      apiVersion: 1,
      architecture: process.arch,
      isPackaged: app.isPackaged,
      name: "Veyra",
      platform: process.platform,
      version: app.getVersion(),
    }),
    getLifecycleSnapshot: () => lifecycle?.snapshot() ?? {
      activeOperationIds: [],
      cleanupFailures: [],
      phase: "starting",
      recoveredInterruptedOperationIds: [],
    },
    getStorageOverview: async () => {
      if (!projectStore) throw new Error("Project storage is not ready");
      const totals = await projectStore.getStorageUsage();
      const projects = await Promise.all(projectStore.listProjects().map(async (project) => {
        const usage = await projectStore!.getStorageUsage(project.id);
        return { id: project.id, name: project.name, evidenceBytes: usage.evidenceBytes, evidenceFiles: usage.evidenceFiles };
      }));
      return { ...totals, projects };
    },
    cleanProjectEvidence: (projectId, olderThan) => {
      if (!projectStore) throw new Error("Project storage is not ready");
      return projectStore.cleanEvidence(projectId, olderThan);
    },
    exportProjectBackup: async (projectId) => {
      if (!projectStore) throw new Error("Project storage is not ready");
      const project = projectStore.getProject(projectId);
      if (!project) throw new Error("Project not found");
      const result = await dialog.showSaveDialog({
        defaultPath: `${project.name.replace(/[^a-zA-Z0-9._-]+/g, "-")}.veyra-project.json`,
        filters: [{ name: "Veyra project", extensions: ["json"] }],
        title: "Export Veyra project",
      });
      if (result.canceled || !result.filePath) return { canceled: true } as const;
      await projectStore.exportProject(projectId, result.filePath);
      return { canceled: false, fileName: basename(result.filePath), projectId } as const;
    },
    restoreProjectBackup: async () => {
      if (!projectStore) throw new Error("Project storage is not ready");
      const result = await dialog.showOpenDialog({
        filters: [{ name: "Veyra project", extensions: ["json"] }],
        properties: ["openFile"],
        title: "Restore Veyra project",
      });
      const filePath = result.filePaths[0];
      if (result.canceled || !filePath) return { canceled: true } as const;
      const project = await projectStore.restoreProject(filePath);
      return { canceled: false, fileName: basename(filePath), projectId: project.id } as const;
    },
    getProjectWorkspace,
    applyProjectCommand: async (command) => {
      if (!projectStore) throw new Error("Project storage is not ready");
      switch (command.type) {
        case "create": {
          const project = projectStore.createProject({ id: randomUUID(), name: command.name, applicationUrl: command.applicationUrl, environmentName: command.environmentName });
          return { projectId: project.id };
        }
        case "update": projectStore.updateProject(command.projectId, { name: command.name, applicationUrl: command.applicationUrl }); return { projectId: command.projectId };
        case "save-environment": {
          const environment = projectStore.saveEnvironment(command.projectId, { id: command.environment.id ?? randomUUID(), name: command.environment.name, baseUrl: command.environment.baseUrl });
          return { projectId: command.projectId, environmentId: environment.id };
        }
        case "activate-environment": projectStore.setActiveEnvironment(command.projectId, command.environmentId); return { projectId: command.projectId };
        case "save-variable": projectStore.saveEnvironmentVariable(command.projectId, command.environmentId, { key: command.key, value: command.value }); return { projectId: command.projectId };
        case "delete-variable": projectStore.deleteEnvironmentVariable(command.projectId, command.environmentId, command.key); return { projectId: command.projectId };
        case "save-secret-reference": projectSecrets!.saveReference(command.projectId, { id: command.id, description: command.description }); return { projectId: command.projectId };
        case "delete-secret-reference": projectSecrets!.deleteReference(command.projectId, command.id); return { projectId: command.projectId };
        case "set-secret-value": projectSecrets!.setValue(command.projectId, command.id, command.value); return { projectId: command.projectId };
        case "delete-secret-value": projectSecrets!.clearValue(command.projectId, command.id); return { projectId: command.projectId };
        case "archive": projectStore.setProjectArchived(command.projectId, command.archived); return { projectId: command.archived ? null : command.projectId };
        case "delete": await projectSecrets!.deleteProject(command.projectId, command.confirmationName); return { projectId: null };
      }
    },
    getBrowserRuntimeStatus: () => browserRuntime,
    startControlledBrowser: (command) => {
      if (!projectStore) throw new Error("Project storage is not ready");
      if (!controlledBrowser) throw new Error("Controlled browser is not ready");
      if (browserRuntime.status !== "ready") throw new Error("Veyra's bundled Chromium runtime is unavailable");
      const project = projectStore.getProjectDetail(command.projectId);
      if (!project) throw new Error("Project not found");
      const environment = command.environmentId
        ? project.environments.find((candidate) => candidate.id === command.environmentId)
        : project.environments.find((candidate) => candidate.isActive);
      if (!environment) throw new Error("Project environment not found");
      return controlledBrowser.start({
        environmentName: environment.name,
        projectId: project.id,
        projectName: project.name,
        url: environment.baseUrl,
      });
    },
    getControlledBrowserSession: () => controlledBrowser?.getSession() ?? null,
    stopControlledBrowser: () => controlledBrowser?.stop() ?? { sessionId: null, status: "stopped" },
    setSensitiveEntry: (active) => {
      sensitiveEvidenceGuard.setSensitiveEntry(active);
    },
    ipcMain,
    isTrustedSender: (candidateUrl) =>
      isTrustedRendererSender(rendererUrl, candidateUrl),
  });
  disposeLifecycleSubscription = lifecycle.subscribe((snapshot) => {
    windowManager.currentWindow?.webContents.send(
      IPC_CHANNELS.lifecycleChanged,
      snapshot,
    );
  });
  await openWindow();
}

function reopenWindowWhenReady(): void {
  void applicationReady?.then(openWindow).catch((error: unknown) => {
    console.error("Veyra failed to open its desktop window", error);
  });
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", reopenWindowWhenReady);
  app.on("activate", reopenWindowWhenReady);
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("before-quit", (event) => {
    if (
      shutdownComplete ||
      !lifecycle ||
      lifecycle.snapshot().phase === "stopped"
    ) {
      return;
    }
    event.preventDefault();
    if (shutdownRequested) return;
    shutdownRequested = true;
    void lifecycle
      .shutdown()
      .catch((error: unknown) => {
        console.error("Veyra shutdown cleanup failed", error);
      })
      .finally(() => {
        shutdownComplete = true;
        app.quit();
      });
  });
  app.on("will-quit", () => {
    disposeLifecycleSubscription();
    disposeIpc();
    controlledBrowser?.stop();
    projectStore?.close();
    if (rendererProtocolInstalled) protocol.unhandle(APP_SCHEME);
  });
  applicationReady = app.whenReady().then(startApplication);
  void applicationReady.catch((error: unknown) => {
    console.error("Veyra failed to start", error);
    app.quit();
  });
}
