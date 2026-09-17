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
| Renderer (`src/`) | React UI, local view state, transient password-masked secret entry, calls to `window.veyraDesktop` | Node.js APIs, filesystem paths, persisted/retrieved secrets, Playwright, workers |
| Preload (`electron/preload.ts`) | A frozen, named API assembled from the shared IPC contract | Generic `send`, `invoke`, raw Electron objects |
| Main (`electron/`) | Windows, lifecycle, IPC authorization, app-data paths, service orchestration | Product meaning embedded in Electron handlers |
| Browser/runtime workers (E05/E13/E19) | Browser execution and heavy evidence/intelligence work | UI rendering or direct renderer access |

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

## Controlled browser

`electron/controlled-browser.ts` is the E05 browser-control module. The
renderer may start, inspect and stop a session only through the typed preload
methods in `electron/ipc-contract.ts`; it never opens Electron browser windows
or receives Electron objects. The current slice uses Electron's bundled
Chromium in a separate headed window with a fresh non-persistent partition per
session. It returns metadata only: session id, isolation key, project,
environment, URL, launch time, browser engine and Chromium version.

`electron/browser-runtime.ts` owns runtime discovery. Electron's version-pinned
bundled Chromium is the managed runtime and is compatible by construction with
Electron's `BrowserWindow`; its engine, version, source, compatibility and
readiness may cross typed IPC, while launch is rejected if detection cannot
confirm that the runtime is available.

Future Teach and Run work should call this module or deepen it, not create a
parallel window-launch path.

## Project persistence

`electron/project-store.ts` is the E02 persistence module and the only seam for
project-domain storage. It owns versioned SQLite migrations, immutable
completed-run snapshots, the external evidence tree, storage accounting,
cleanup, and the checksummed `.veyra-project.json` backup format. Renderer code
must use the named preload methods; it must never import SQLite, receive local
filesystem paths, or access evidence directly. Restore must validate before
commit and preserve the original database when opening or migration fails.

## Secret and sensitive-output handling

`electron/project-secrets.ts` is the main-process application seam for secret
metadata, values, cleanup and authorized output/runtime policy; Electron
handlers only dispatch to it. `electron/secret-vault.ts` is the secret-value
persistence seam. Its Electron
adapter uses `safeStorage` (Keychain on macOS, DPAPI on Windows and a protected
Linux backend) and fails closed when only Linux `basic_text` is available.
Encrypted blobs live outside SQLite with restrictive permissions. The renderer
may submit a password-masked value but never receives one back; backups include
logical reference metadata only.

Definitions represent credentials only as exact `{ secretRef: "logical_id" }`
tokens. `electron/secret-protection.ts` is the main/worker runtime seam that may
resolve those tokens. Its log/report paths redact known raw, URL-encoded and
base64 forms; its AI path replaces references without resolving them and also
redacts accidental known values. Do not add a direct vault read to renderer,
reporting, logging or AI code.

`electron/sensitive-evidence-guard.ts` owns the secret-entry capture state.
Password fields enable Electron content protection while focused, and the
project evidence writer calls `assertCaptureAllowed()` before every write.

## Build outputs and platforms

- `dist/client/` contains bundled renderer assets.
- `dist/electron/` contains CommonJS main-process modules and the single-file
  sandbox-compatible `preload.cjs`.
- macOS packages target Apple Silicon and Intel (`dmg` and `zip`).
- Windows targets x64 (`NSIS`).
- `.github/workflows/desktop-build.yml` repeats tests and packaging on native
  macOS and Windows runners.
- `docs/brand/veyra-app-icon-source.png` is the approved lossless icon source;
  `apps/desktop/build/icon.png` is the generated packaging/runtime derivative.

E01 packages are deliberately unsigned. Code signing, notarization,
auto-update and release-channel policy belong to E22 Commercial Hardening.
