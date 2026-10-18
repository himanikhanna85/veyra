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

## Teach sessions

`ProjectStore` owns persisted Teach-session identity and lifecycle state.
Schema v4 permits one active started session per project, tied by foreign key
to a real project environment. The renderer may start or restore that session
only through the typed preload methods; recording events and normalization
will deepen this interface in E06.T02–T03 rather than create renderer-owned
session state. E06.T01 must not present this started state as active recording;
that transition belongs to browser event capture in E06.T02.

`electron/teach-capture.ts` is that capture seam. The page-side function is injected into an isolated world and reports over a nonce-prefixed `console.debug` channel; `TeachRecorder` validates and buffers events in memory (persistence is E06.T03). Fingerprints carry no values for sensitive fields and no index/XPath/geometry locators; targets with no uniquely matching candidate are marked `ambiguous`.

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

<!-- reticle:begin (managed by `reticle init` — edit outside these markers) -->
## Verifying with Reticle

This app is instrumented by **Reticle**, an in-app verification layer exposed as `reticle_*` MCP tools and the `npx @reticlehq/server` CLI (always through npx: Reticle's server is not installed into this project). Verifying is part of "done", not an optional extra.

**Verify when you have changed something a user can see or do.** A component, a form, a route, a request, a piece of state that reaches the screen. Do it BEFORE telling the user it is complete. Reading the diff proves nothing and unit tests do not run the app.

**Do not reach for Reticle when the change cannot show up in the running app.** It costs tool calls and the user's patience, and a verdict over an unrelated flow proves nothing about what you changed. Skip it for: documentation, comments, tests, build config, CI, dependency bumps with no user-facing effect, backend or CLI work with no UI surface, and any change to a project that is not a running web app. Say in one line that you skipped verification and why, rather than silently not doing it.

**How to verify:**

- Drive the flow with `reticle_act_and_wait({ ref, action, until })`. It names the consequence you expect BEFORE the action, which is the difference between a check and a rationalisation.
- Batch a multi-step journey (a login, a form) into one `reticle_act { steps: [...] }` rather than one round trip per field.
- Read the surrounding evidence with `reticle_look { action: "page" | "state" }` and `reticle_observe { action: "network" | "console" }`.
- **Only `reticle_act_and_wait` and `reticle_assert` produce a verdict.** `reticle_act` and everything else move or read the app and prove nothing, so a session ending without one of those two has no result however many tools it used.
- Covered flows: `npx @reticlehq/server gate` reports which recorded flows the changed files affect and whether they still pass.

**Setting Reticle up? You are mid-sequence — do not stop until a verdict exists.** The whole of it
is: instrument the app → get a dev server running → open the app in a browser → drive one flow →
report the verdict. Every step is yours to do, and none of them needs the user. Stopping short leaves an app that
looks installed and can verify nothing, which is the commonest way this goes wrong. `/reticle`
carries the recovery ladder; never report the install as finished without a verdict to point at.

**Nothing connected? Get the app running.**

**A dev server already running when `reticle init` ran does not have Reticle in its bundle.** It read the build config at boot; `init` edited it afterwards. It serves the old bundle and no session appears. In order:

1. **A dev server was already running?** Restart it, then hard-reload the tab. "Something is listening" does not mean the right bundle is served.
2. **Nothing was running?** Start it in the BACKGROUND and say so in one line. `reticle_session { action: "list" }` gives you this project's own dev command in `next_action`; use that, never compose one. Started after `init`, it needs no restart.

Stopping to ask is how a verification turn ends with nothing verified.

Four guards, none optional:

1. **Never run two at once.** One dev server on the app's port. Restarting a stale one means stopping it first, not starting a second alongside it.
2. **Never guess the command.** It comes from `package.json` scripts. No recognisable dev script means say so and stop, not invent one.
3. **Never kill anything you did not start**, and never a daemon or a port holder. The one exception is the restart above, and say in one line that you did it.
4. **The permission prompt belongs to your host.** Never bypass, suppress or auto-approve it, and take a refusal as the answer.

A dev server that is already running does not pick up an edited build config or a newly created plugin file — restart it and hard-reload the tab. And if a server IS listening and still nothing connects, the cause is the SDK not loading in the page, not a missing dev server; do not tell the user to start one they are already running.

**Finish `src/reticle-dev.ts` before you claim setup is done.** `init` writes it and cannot always fill it in: a store that needs an argument only reading the code supplies (Jotai atoms, an XState actor, a TanStack `queryClient`) is left as a commented `registerStore` line. A file that registers nothing looks exactly like a finished one, and `reticle_look { action: "state" }` then returns empty forever — which is indistinguishable from an app that has nothing to report, so it reads as success. Uncomment the line, complete it, and prove it by driving one flow and seeing your keys come back. If `init` told you to restart your client, this is the job waiting for you on the other side of that restart.

**Verify each feature as you finish it, not all of them at the end.** Asked for four, build one, drive it, get a verdict, then start the second. A red verdict after four builds has four suspects; after one it has none.

**Capture what a change is FOR while you are building it, not afterwards.** The business outcome a change is meant to produce is known only while the change is being made. Pass `intent` when a flow is saved, so the saved flow carries the reason it exists. A flow without one replays for months and then reports "step 3 failed" instead of what stopped being true for a user.

**Honesty, which is the whole point:**

- **`verified: "unknown"` is not a pass.** It means Reticle drove the app and could not tell what happened; `verifiedReason` says which clause decided that. Report it as unknown, never as working.
- **`verified: "no-fault"` is not a pass either.** It means nothing was DECLARED to prove: the page settled and no channel complained, but you asserted nothing, so there is no verification. You get it whenever `until` is omitted. Name a consequence the action changes — a signal, a request, a route, or store state — and call again.
- **Never weaken a check to make it green.** Downgrading, skipping or deleting an assertion is a finding, not a fix.
- **If Reticle cannot run** (no daemon, or this is not a running web app), say so. Do not skip verification silently.
- **Setup is not finished until one real flow has been driven and produced a verdict.** `init` exiting 0, the tools appearing, and a session being listed are all things that happen before anything has been verified.

**The `/reticle` skill runs this whole loop for you** — detect, connect, drive one flow, report. If your client does not have it, install it once: `/plugin marketplace add reticlehq/reticle` then `/plugin install reticle@reticlehq` in Claude Code, or `npx skills add reticlehq/reticle` anywhere the skills CLI works.

**A tool you need is missing?** Call `reticle_tools` before assuming it: this surface merges several families behind an `action`, so what looks absent is usually one argument away. It is the verify loop and nothing else on purpose, and a daemon started with `RETICLE_ADVERTISE_ALL_TOOLS=1` advertises the wider set — it reads that at startup, so it takes effect on the next one.

**Report Reticle's own defects with `reticle_session { action: "feedback" }` the moment you notice**, then carry on with your task. You are the user Reticle is built for and the only one who can say what it cost you, and that knowledge is gone when your context is.

📄 **The rest is in [RETICLE.md](./RETICLE.md): what to do when the tools are missing, when a result carries `version_skew` or `update_available`, when `reticle_look { action: "state" }` comes back empty, and how to write a feedback report that can be acted on. Read it when you hit one of those, not before.**
<!-- reticle:end -->
