# Status Quo

## Current state

- E01 Desktop Application Foundation is implemented in `apps/desktop`: the approved React shell now runs inside an installable Electron 44 application.
- The renderer is sandboxed, context-isolated and Node-free. Production assets use the local `veyra://app` origin, navigation and permissions are denied by default, and the bundled preload exposes only typed, allow-listed APIs/events.
- The main process owns single-instance window behavior and a versioned atomic lifecycle journal under Electron's stable application-data location. Shutdown cleanup is bounded and idempotent; unfinished or unclean operations are recovered on the next launch.
- macOS arm64/x64 DMG and ZIP packages and a Windows x64 NSIS installer build successfully. GitHub Actions is configured to repeat tests and packaging on native macOS and Windows runners after the repository is pushed.
- Source and packaged Apple Silicon apps passed two-launch smoke checks proving renderer isolation, IPC access, clean shutdown and persisted lifecycle state. The 66-test suite, TypeScript check, Vite/Electron build, Sites tests and desktop restart smoke check pass.
- The approved transparent Veyra mark is embedded in the development window, macOS bundle/Dock metadata and Windows executable/installer resources; its lossless source and generated packaging derivative are both versioned.
- The desktop sidebar now uses the supplied `veyra_tr_icon.png` mark and the exact rectlogo-derived wordmark artwork. The former generic blue diamond and font-rendered label have been removed; the combined lockup is exposed accessibly as “Veyra”.
- Current packaging limits are deliberate E22 work: artifacts are unsigned and have no update channel. Windows and Intel macOS artifacts are built but still need runtime execution on native target hosts; this ARM machine lacks the Intel compatibility runtime.
- E02 Local Persistence & Project Lifecycle is implemented. Versioned SQLite stores structured project data and immutable completed-run snapshots; evidence remains in a separate filesystem tree. Checksummed project export/restore, safe migration failure, storage accounting and age-based evidence cleanup are operational through validated Electron IPC.
- The Data destination now shows structured/evidence/total local usage, per-project evidence counts, native backup/restore controls and a two-step cleanup action that preserves core definitions and run history.
- E02 has a one-command root-level test (`npm run test:e02`) with plain-language results and inspectable artifacts under `e02-test-output/`; the SQLite experimental warning is suppressed for this user-facing check.
- Data-screen action buttons now use the shared icon slot and consistent 7 px icon-to-label spacing; Restore, Refresh, Export and Clean Evidence no longer visually collide with their icons.
- E03 Projects & Environments is implemented. Users can create and edit projects, add and activate named environments, manage non-secret environment variables, switch projects, view persisted Overview health, archive projects with a second confirmation, and permanently delete only after entering the exact project name.
- Permanent deletion now adds a separate irreversible-action alert after the exact-name gate. Archived projects remain exportable in Data, and restoring their valid same-identity backup reactivates them; active duplicates remain protected from overwrite.
- E04 Secrets & Sensitive Data is implemented. Project Settings creates logical references and supports password-masked value save, replace, clear and reference deletion. Values are encrypted through the OS-backed secure-storage adapter outside SQLite, are never returned to the renderer, and are omitted from backups.
- Definitions persist exact logical `{ secretRef }` tokens, validate project ownership and block deletion while referenced. The production-owned `ProjectSecrets` seam is the only runtime resolver and supplies mandatory log/report redaction and non-resolving AI preparation. Secret entry activates OS window capture protection, and the project evidence writer rejects capture through the shared guard until entry ends.
- Project backup format version 3 preserves value-free secret-reference metadata as well as environments and variables, while restore remains compatible with existing versions 1 and 2. Backups never contain secret values or secure-store locators.
- E05 Controlled Browser is complete. The desktop main process owns a `ControlledBrowser` module that opens the active project environment in a separate headed Chromium window, returns session metadata to the renderer, shows status in Overview and stops the session safely.
- Each controlled browser launch uses a fresh non-persistent Electron partition keyed by project id and session id, so cookies/localStorage/session state do not bleed across projects or sessions. Veyra manages Electron's version-pinned, BrowserWindow-compatible bundled Chromium, reports its source/version/compatibility/readiness through typed IPC and blocks launch with a visible unavailable state if runtime detection fails.
- E06.T01 starts the Teach Recorder epic. The Teach destination creates one named active session per project, binds it to the active environment, persists it in SQLite schema v4 and restores its started-session header after an application restart. It truthfully avoids claiming that recording or a browser is active; controlled-browser action capture remains E06.T02.
- E06.T02 is implemented: `electron/teach-capture.ts` injects a self-contained capture script into the controlled browser's isolated world and a main-process `TeachRecorder` validates (per-session nonce) and bounds raw events before E06.T03 normalization/persistence. The renderer polls `getTeachCapture` and shows readable steps; ambiguous targets are flagged and carry no index locator; sensitive values never leave the page. Original contract: target-bearing events retain sanitized DOM/accessibility fingerprints, meaningful ancestor context, bounded subtree structure, multiple locator candidates and post-action effects. Repeated same-name controls must remain distinguishable; low-confidence matches block rather than guess, and V0 cannot silently persist a healed baseline.
- E06.T03 is implemented. Deterministic normalization turns recorder events into stable semantic records with readable wording, scoped target meaning, ambiguity state and literal parameter suggestions. ProjectStore schema v5 persists ordered actions and restores their timeline after restart; protected values, content-bearing sensitive fingerprints and URL query values are stripped again at the persistence boundary and never enter project backups. Reticle verified the persisted readable step after a full Electron restart.
- E06.T04 is implemented and awaiting user verification. The Teach timeline now orders persisted actions by sequence, shows visible numbering and action categories, highlights the latest step, attaches parameter suggestions without exposing their literal value, preserves ambiguity/protected-value guidance, announces new readable steps accessibly and keeps the timeline independently scrollable. Focused acceptance coverage was added but not executed under the user-owned verification rule.
- Repository work now follows `jevprotocol.md`: deterministic tools handle exact work, Jev/TypeSafe handles suitable typed high-volume semantic judgments, low confidence escalates to frontier reasoning, and completion reports track measured or explicitly estimated savings so the approach can be evaluated rather than assumed.
- `docs/Veyra_PRD.md` is the product source of truth and now contains `DEC-21` through `DEC-23`, locking the approved visual system, representative flow, application mark and in-product lockup.
- Root `design_specification.md` is now the design source of truth. It formalizes the approved `design_inspirations/New UI Mockups/Veyra Prototype.dc.html` shell, tokens, components, interactions, accessibility contract, overlays and seven screens.
- The approved product language is a dark `#101827` navigation shell, warm `#F6F7F5` workspace, Inter with limited Instrument Serif, blue confirmation/selection, one orange high-energy action per screen and teal links/assertions.
- Result semantics are locked: PASS, FAIL, BLOCKED, ERROR, INTERRUPTED, RUNNING and QUEUED use an icon plus label and are never communicated by colour alone.
- The shared renderer foundation includes local Inter/Instrument Serif fonts, design tokens, accessible button and status primitives, primary navigation, command search, project and notification popovers, and responsive 1440 × 960 / 1280 × 800 layouts.
- `CLAUDE.md` now locks the process boundaries, security invariants, build outputs and extension rules for future application services and workers.
- Root `tasks.md` now tracks all 34 epics and all 253 PRD functional requirements module/epic-wise, plus 15 NFR verification tasks, 10 V0 acceptance scenarios and 7 release gates.
- Spur was evaluated as a competitor, not copied as the product scope. Veyra intentionally does not promise full Spur parity; deferred areas remain explicit in the PRD.
- The Git repository is initialized on `main`, connected to `https://github.com/himanikhanna85/veyra.git`, and its committed history uses Himani Khanna's approved author identity.

## In flight

- Repository documentation is now organized around `docs/idea.md` as the
  stakeholder product narrative. Historical client context, stale handoffs,
  standalone design captures, raw research intermediates and the Manus queue
  receipt are retained under `archive/`; active source, current competitive
  synthesis, Reticle state and reproducible E02 artifacts remain in place.

- Product-positioning review: REVIEW01's first-pass assessment is prepared. REVIEW02 research workflow `5f625149c1b0` completed all 16 competitor profiles, a buyer-needs study and synthesis without coverage failures. The complete evaluation (`outputs/veyra-product-review/02_competitive_research.md`) cites 64 sources; the reusable comparison (`03_competitor_comparison.csv` in the same folder) has 16 rows and 15 fields. Both files were checked for completeness, CSV structure and citation definitions. Research strengthens the warning that AI/no-code/local execution and ABM-adjacent governance/context are contested; near-term opportunity hypotheses are tester-owned outcome verification, trustworthy handoff and measurable semantic reuse. Pricing is a dated public snapshot, not normalized total cost; no hands-on competitor benchmark or demand validation was performed. Anand's review and REVIEW03 brainstorm remain pending. No product decisions, source-baseline rewrite or application changes were made. Jev was considered but not used for open-ended research; Reticle was skipped because no application behavior changed. No Manus credit estimate or savings claim is made.

- DEC-25 approves twelve Jev judgment capabilities, documented in PRD §38, V0/V1 product features and tasks JEV01–JEV12 plus JEV.EVAL. They are backlog requirements; no production Jev integration or measured savings exists yet. V0/V1/later release boundaries remain explicit.

- E06.T04 remains Pending until Anand confirms the manual test passes; Codex did not execute tests, typecheck, builds, Electron or Reticle.

## Open decisions

- Authentication/licensing boundary before broad commercial release (`OD-04`).
- Local model packaging and cloud model providers (`OD-05`, `OD-06`).
- Evidence retention defaults and empirical pilot reliability thresholds (`OD-07`, `OD-08`).
- Pricing (`OD-09`). The structured project export format (`OD-10`) is resolved by the versioned, checksummed `.veyra-project.json` contract.
- Component system and visual brand are no longer open; `DEC-21` through `DEC-23` and `design_specification.md` resolve them.

## Most useful next action

For the current product-review request, discuss the researched opportunity hypotheses and choose one primary buyer/job for REVIEW03 before finalizing positioning or changing the PRD. The implementation next action remains: manually verify E06.T04, then mark it Done and start E06.T05 only after confirmation.
