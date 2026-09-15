# Veyra Architecture

This file records the implementation architecture and locked technical
decisions. Product behaviour is governed by `docs/Veyra_PRD.md`; visual
behaviour is governed by `design_specification.md`; operational commands live
in `commands.md`.

## Locked V0 stack

- Electron 44, React 19 and TypeScript 7 form the desktop application.
- The Node.js main process owns application services and operating-system
  access. Playwright will remain an adapter behind those services.
- Vite 8 bundles the renderer. Vitest 5 covers renderer and process-boundary
  units. Electron Builder 26 creates installers.
- SQLite, filesystem evidence storage and OS-native secret storage remain the
  persistence direction for E02/E04; they are not renderer dependencies.

The committed lockfile is authoritative for exact dependency versions.

## Process boundaries

| Boundary | Owns | Must not own |
|---|---|---|
| Renderer (`src/`) | React UI, local view state, calls to `window.veyraDesktop` | Node.js APIs, filesystem paths, secrets, Playwright, workers |
| Preload (`electron/preload.ts`) | A frozen, named API assembled from the shared IPC contract | Generic `send`, `invoke`, raw Electron objects |
| Main (`electron/`) | Windows, lifecycle, IPC authorization, app-data paths, service orchestration | Product meaning embedded in Electron handlers |
| Workers (future E05/E13/E19) | Browser execution and heavy evidence/intelligence work | UI rendering or direct renderer access |

`electron/ipc-contract.ts` is the sole renderer/main contract. Every new method
or event must be named and typed there, exposed explicitly by preload, validated
in main, and tested from both sides. The renderer never imports Electron.

## Desktop security invariants

- Renderer windows use `contextIsolation: true`, `sandbox: true`,
  `nodeIntegration: false`, `webSecurity: true` and no `<webview>` support.
- Production assets load only from the privileged `veyra://app` origin. Path
  traversal, other origins, new windows and external navigation are rejected.
- Development rendering is opt-in through `VEYRA_RENDERER_URL` and accepts only
  loopback HTTP origins.
- IPC handlers authorize the sender frame before returning data. Renderer
  permission requests are denied by default.
- The renderer Content Security Policy disallows objects, frames, remote
  scripts and remote assets.

## Lifecycle and recovery

The main process owns one `DesktopLifecycle`. It writes a versioned journal
under Electron's stable `userData/state/lifecycle.json` location using an atomic
temporary-file rename and restrictive file mode. Corrupt journals are
quarantined instead of blocking launch.

Application services register active operations with the lifecycle. Shutdown
requests each operation to stop once, bounds cleanup time, persists unfinished
operation IDs for recovery, then permits Electron to quit. An unclean previous
session is surfaced as pending recovery on the next launch. E05/E13 workers
must use this registry rather than adding independent quit hooks.

## Build outputs and platforms

- `dist/client/` contains bundled renderer assets.
- `dist/electron/` contains CommonJS main-process modules and the single-file
  sandbox-compatible `preload.cjs`.
- macOS packages target Apple Silicon and Intel (`dmg` and `zip`).
- Windows targets x64 (`NSIS`).
- `.github/workflows/desktop-build.yml` repeats tests and packaging on native
  macOS and Windows runners.

E01 packages are deliberately unsigned and use Electron's default icon. Code
signing, notarization, branded icons, auto-update and release-channel policy
belong to E22 Commercial Hardening.
