# Veyra — Codex Handoff

Continuation brief for `/Users/anandarora/Veyra` (branch `codex/prodv1`).
Read it with the canonical documents; do not duplicate or replace them.

## Start here

1. Read `groundrules.md`, `status_quo.md`, `tasks.md`, `jevprotocol.md`.
2. Read `CLAUDE.md` (architecture, locked decisions), `AGENTS.md`, `RETICLE.md`.
3. Product truth: `docs/Veyra_PRD.md`. UI truth: `design_specification.md`. Commands: `commands.md`.
4. Continue tasks sequentially. **Next task: `E06.T03`** — normalize recorded events into semantic action records (`FR06.03`) and persist them. Jev backlog is `JEV01`–`JEV12` and `JEV.EVAL`.

## What just landed: E06.T02 (marked Done in `tasks.md`)

Controlled-browser action capture with sanitized, multi-signal target fingerprints.

- `apps/desktop/electron/teach-capture.ts`
  - `installTeachCapture(win, nonce, emit)` is a self-contained function injected into the controlled page's **isolated world** (`webContents.executeJavaScriptInIsolatedWorld(1000, …)` on `dom-ready`). It must not close over module scope because it is injected via `toString()`.
  - It captures click, type, select, Enter/Escape and reports over a nonce-prefixed `console.debug` channel (`veyra-teach:<nonce>:<json>`).
  - Fingerprint: tag/type/role/accessible name/label/text, stable attributes (test id, durable id, name, aria-*, href path), up to 3 semantic ancestor scopes (heading/label/nearby text), bounded structure and subtree, and locator candidates with match counts (`testId`, `id`, `label`, `role-name`, `role-name-in-scope`, `text-in-scope`). No index/XPath/geometry locators. `resolution` is `unique` if any candidate matches exactly once, else `ambiguous` (never collapsed to an index).
  - Sensitive fields (password type, `autocomplete` password/otp/cc-*, name/id/label/placeholder matching password|token|secret|otp|cvv|card|ssn|api key|credential) emit `value: null`, empty text/name/subtree, and are skipped in nearby text.
  - Post-action effect (`mutations`, `titleChanged`, `urlChanged`) arrives in a follow-up message after 400 ms; main attaches `navigatedTo` from `did-navigate`/`did-navigate-in-page`.
  - `TeachRecorder` (main) validates the nonce, drops any value on sensitive events, buffers up to 1000 events **in memory only**, bound to one Teach session id.
- `controlled-browser.ts` gained an optional `attachCapture(window)` dependency; `main.ts` wires it and calls `teachRecorder.begin(activeSessionId)` in `startControlledBrowser`.
- IPC: `getTeachCapture(projectId)` in `ipc-contract.ts` (channel, DTO, preload surface), validated in `ipc-main.ts`, composed in `main.ts`.
- UI: `App.jsx` polls `getTeachCapture` every second while a session exists and has `openTeachBrowser()`; `TeachScreen.jsx` shows "Recording your demonstration", readable steps, an ambiguity warning and "Value protected", plus an "Open controlled browser" button.
- Tests: `teach-capture.test.ts` (same-name controls under different ancestors, ambiguous controls, stable test id vs generated id, secret exclusion from the wire, effects, spoofed messages), `TeachScreen.test.jsx`, plus updated `ipc-contract.test.ts` and `ipc-main.test.ts` (removeHandler count is now 16).

## Known limits and decisions for E06.T03

- Events are **not persisted**. T03 should add the persistence seam through `ProjectStore` (schema v5) and normalize raw events into semantic action records; do not create renderer-owned state.
- The nonce channel is spoof-resistant from page JS (isolated world) but a page could still flood the console. Acceptable for V0.
- Typed values for non-sensitive fields are kept (≤200 chars). Parameterization and secret-reference mapping belong to T03+/FR19.
- No Jev call is involved in T02; capture is deterministic. Use Jev only where PRD §38 (`DEC-25`) permits, record request counts/confidence/escalation/latency/cost and a savings baseline, and keep low-confidence results behind human review. No production LLM/TypeSafe integration or measured savings exists. Never put provider keys in source, the renderer, commits or handoffs.

## Validation state

- `npm run typecheck` clean; `npm run smoke:desktop` passes (preload API now lists `getTeachCapture`).
- Full `npx vitest run`: everything passes **except** `electron/project-store.test.ts`, which currently fails to load (`Cannot bundle Node.js built-in "node:sqlite"`, Node v22.22.0). I did not touch `project-store.ts`. The earlier handoff mentioned a separate `passRate: 50` vs `null` failure in that file; neither is investigated. Resolve before claiming a clean suite.
- Real-Electron probe (throwaway script, not in repo) confirmed isolated-world injection, console delivery, scoped fingerprint ("Add to cart" in "Travel Mug", unique) and effect.
- The Teach screen has a component test only; it has **not** been driven end to end in the running app.

## Reticle

Reticle is linked (daemon port 4401, project `veyra-7a58c61b`, config in `.reticle.json` and `apps/desktop/.reticle.json`, state in `apps/desktop/src/reticle-dev.ts`). A live Overview journey and a Teach navigation click both returned `verified: yes` at state grade.

Run the app with Reticle:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run build:electron
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Then in a second terminal:

```bash
cd /Users/anandarora/Veyra/apps/desktop
VEYRA_RENDERER_URL=http://127.0.0.1:4173/ npm run start:desktop
```

- Reticle sees only the Veyra window, not the separate controlled-browser window.
- `reticle-dev.ts` registers only `activeProjectId`, `activeSection`, `workspaceStatus`. Next useful step: register Teach capture state (recording flag, captured step count/readable list) so Reticle can assert "recording started" and "step appeared". Then start a Teach session on a **throwaway project** (starting one on the user's "Macy's Beauty Section" project persists an active session and blocks another), open the controlled browser, perform actions, and assert the timeline.
- If Codex lacks the `reticle_*` MCP tools, use the CLI `@reticlehq/server verify --expect` fallback and report explicit verdicts. Setup is complete only when a real flow has a verdict. Documentation-only changes need no UI verdict.

## Working tree

Uncommitted: Reticle setup/instrumentation, product docs, Jev tasks, the E06.T02 work above, and a pre-existing `.DS_Store` change. Nothing from this session is committed. Preserve unrelated changes; do not reset or clean the tree. Nothing was pushed.

## Process requirements

Inspect the implementation before editing. Add or confirm the task in `tasks.md` before implementing, update it only after verification. For every completed task report the exact manual test procedure and expected result. Update `status_quo.md` at the end of material work.

## Suggested next objective

Implement `E06.T03`: normalize the buffered raw events into stable semantic actions (target meaning from the fingerprint, parameter candidates left as suggestions), persist them via `ProjectStore`, keep sensitive values out of storage and backups, add tests for same-name controls and secret exclusion at the persistence layer, then verify in the running app.
