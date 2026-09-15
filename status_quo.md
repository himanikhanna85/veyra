# Status Quo

## Current state

- E01 Desktop Application Foundation is implemented in `apps/desktop`: the approved React shell now runs inside an installable Electron 44 application.
- The renderer is sandboxed, context-isolated and Node-free. Production assets use the local `veyra://app` origin, navigation and permissions are denied by default, and the bundled preload exposes only seven typed, allow-listed APIs/events.
- The main process owns single-instance window behavior and a versioned atomic lifecycle journal under Electron's stable application-data location. Shutdown cleanup is bounded and idempotent; unfinished or unclean operations are recovered on the next launch.
- macOS arm64/x64 DMG and ZIP packages and a Windows x64 NSIS installer build successfully. GitHub Actions is configured to repeat tests and packaging on native macOS and Windows runners after the repository is pushed.
- Source and packaged Apple Silicon apps passed two-launch smoke checks proving renderer isolation, IPC access, clean shutdown and persisted lifecycle state. The 33-test suite, TypeScript check, Vite/Electron build, Sites tests and desktop restart smoke check pass.
- The approved transparent Veyra mark is embedded in the development window, macOS bundle/Dock metadata and Windows executable/installer resources; its lossless source and generated packaging derivative are both versioned.
- The desktop sidebar now uses the supplied `veyra_tr_icon.png` mark and the exact rectlogo-derived wordmark artwork. The former generic blue diamond and font-rendered label have been removed; the combined lockup is exposed accessibly as “Veyra”.
- Current packaging limits are deliberate E22 work: artifacts are unsigned and have no update channel. Windows and Intel macOS artifacts are built but still need runtime execution on native target hosts; this ARM machine lacks the Intel compatibility runtime.
- E02 Local Persistence & Project Lifecycle is implemented. Versioned SQLite stores structured project data and immutable completed-run snapshots; evidence remains in a separate filesystem tree. Checksummed project export/restore, safe migration failure, storage accounting and age-based evidence cleanup are operational through validated Electron IPC.
- The Data destination now shows structured/evidence/total local usage, per-project evidence counts, native backup/restore controls and a two-step cleanup action that preserves core definitions and run history.
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

- No implementation task is currently in progress.
- No next implementation task has been approved; E03 is the next logical slice.

## Open decisions

- Authentication/licensing boundary before broad commercial release (`OD-04`).
- Local model packaging and cloud model providers (`OD-05`, `OD-06`).
- Evidence retention defaults and empirical pilot reliability thresholds (`OD-07`, `OD-08`).
- Pricing (`OD-09`). The structured project export format (`OD-10`) is resolved by the versioned, checksummed `.veyra-project.json` contract.
- Component system and visual brand are no longer open; `DEC-21` through `DEC-23` and `design_specification.md` resolve them.

## Most useful next action

Approve and start E03 Projects & Environments, using E02's project repository and persistence contract.
