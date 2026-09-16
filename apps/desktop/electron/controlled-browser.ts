export interface ControlledBrowserSession {
  browserEngine: "chromium";
  browserVersion: string;
  environmentName: string;
  isolationKey: string;
  launchedAt: string;
  projectId: string;
  projectName: string;
  sessionId: string;
  status: "running";
  url: string;
}

export interface ControlledBrowserStartRequest {
  environmentName: string;
  projectId: string;
  projectName: string;
  url: string;
}

export interface ControlledBrowserStopResult {
  sessionId: string | null;
  status: "stopped";
}

export interface ControlledBrowserWindowOptions {
  backgroundColor: string;
  height: number;
  show: boolean;
  title: string;
  webPreferences: {
    contextIsolation: boolean;
    nodeIntegration: boolean;
    partition: string;
    sandbox: boolean;
    webSecurity: boolean;
  };
  width: number;
}

export interface ControlledBrowserWindowLike {
  close(): void;
  isDestroyed(): boolean;
  loadURL(url: string): Promise<unknown>;
  on(event: "closed", listener: () => void): void;
  show(): void;
  webContents: {
    getUserAgent(): string;
  };
}

interface ControlledBrowserDependencies {
  createSessionId(): string;
  createWindow(options: ControlledBrowserWindowOptions): ControlledBrowserWindowLike;
  now(): Date;
}

export class ControlledBrowser {
  readonly #createSessionId: () => string;
  readonly #createWindow: (options: ControlledBrowserWindowOptions) => ControlledBrowserWindowLike;
  readonly #now: () => Date;
  #session: ControlledBrowserSession | null = null;
  #window: ControlledBrowserWindowLike | null = null;

  constructor({ createSessionId, createWindow, now }: ControlledBrowserDependencies) {
    this.#createSessionId = createSessionId;
    this.#createWindow = createWindow;
    this.#now = now;
  }

  async start(request: ControlledBrowserStartRequest): Promise<ControlledBrowserSession> {
    const url = normalizeControlledBrowserUrl(request.url);
    const sessionId = this.#createSessionId();
    const isolationKey = createIsolationKey(request.projectId, sessionId);
    this.stop();
    const window = this.#createWindow({
      backgroundColor: "#ffffff",
      height: 900,
      show: false,
      title: `Veyra Controlled Browser - ${request.projectName}`,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        partition: isolationKey,
        sandbox: true,
        webSecurity: true,
      },
      width: 1280,
    });
    this.#window = window;
    window.on("closed", () => {
      if (this.#window === window) {
        this.#window = null;
        this.#session = null;
      }
    });

    try {
      await window.loadURL(url);
    } catch (error) {
      this.stop();
      throw error;
    }

    const session: ControlledBrowserSession = {
      browserEngine: "chromium",
      browserVersion: parseChromiumVersion(window.webContents.getUserAgent()),
      environmentName: request.environmentName,
      isolationKey,
      launchedAt: this.#now().toISOString(),
      projectId: request.projectId,
      projectName: request.projectName,
      sessionId,
      status: "running",
      url,
    };
    this.#session = session;
    window.show();
    return session;
  }

  getSession(): ControlledBrowserSession | null {
    return this.#session;
  }

  stop(): ControlledBrowserStopResult {
    const sessionId = this.#session?.sessionId ?? null;
    const window = this.#window;
    this.#window = null;
    this.#session = null;
    if (window && !window.isDestroyed()) window.close();
    return { sessionId, status: "stopped" };
  }
}

function parseChromiumVersion(userAgent: string): string {
  return /Chrome\/([0-9.]+)/.exec(userAgent)?.[1] ?? "unknown";
}

function normalizeControlledBrowserUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Controlled browser URL is invalid");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Controlled browser URL must be http or https");
  }
  return url.toString();
}

function createIsolationKey(projectId: string, sessionId: string): string {
  return `veyra-controlled.${safePartitionSegment(projectId)}.${safePartitionSegment(sessionId)}`;
}

function safePartitionSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 128) || "unknown";
}
