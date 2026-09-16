# Veyra --- Product Requirements Document (PRD)

**Document:** `PRD.md`\
**Product:** Veyra\
**Category:** Application Quality Intelligence Platform (AQIP)\
**Version:** 1.1\
**Date:** 15 September 2026\
**Primary implementation baseline:** V0 Commercial Product\
**Forward architecture:** V1 requirements are numbered here but are not
V0 commitments.

------------------------------------------------------------------------

# 0. Governance and Nomenclature

This PRD is the implementation requirements source of truth. Supporting
strategy/architecture/innovation files explain rationale; this PRD
governs build scope unless a later approved decision updates it.

``` text
Mxx       Product Module
Exx       Epic
FRxx.yy   Functional Requirement / Story
ACxx.yy.z Acceptance Criterion when a requirement needs explicit subcriteria
NFRxx.yy  Non-Functional Requirement
E##.T##   Future TASKS.md implementation task
DEC-xx    Architectural/Product Decision
OD-xx     Open Decision
```

Every future implementation task must reference one or more FR/NFR IDs.
`TASKS.md` is deliberately not generated inside this PRD.

Priority: **P0** V0 commercial requirement; **P1** important V0
requirement; **P2** V1/later; **R** research.

# 1. Key Architectural and Product Decisions

## DEC-01 --- Desktop-first V0

Electron + React + TypeScript + Node.js is the locked V0 shell;
product-domain objects must remain shell-independent. Electron is preferred
over Tauri for V0 because Playwright, worker orchestration, local inference,
filesystem-backed evidence and debugging can remain in one TypeScript/Node.js
runtime family. The renderer stays sandboxed and UI-only behind an explicit
preload interface so this convenience does not grant it Node.js privileges.
The E01 implementation baseline is Electron 44, React 19 and TypeScript 7;
exact tool versions remain reproducible through the committed lockfile.

## DEC-02 --- Playwright as adapter

Playwright executes browser plans; persisted Veyra tests are
semantic/normalized models, not serialized Playwright scripts.

## DEC-03 --- Chromium first

V0 targets Chromium; Firefox and WebKit are V1.

## DEC-04 --- Local-first execution

Ordinary V0 browser runs execute on the user's machine; cloud is not
required for core execution.

## DEC-05 --- Local persistence

Recommended V0 persistence is SQLite for structured data, filesystem for
evidence, and OS secure storage for secrets.

## DEC-06 --- Minimum Viable ABM

V0 ABM centers on semantic business modules containing intent, inputs,
outputs, preconditions, expected outcomes, implementation, dependencies
and version/evidence links.

## DEC-07 --- Deterministic core

Execution and ordinary PASS/FAIL determination are deterministic; AI is
not required in the execution loop.

## DEC-08 --- Intelligence routing

Prefer rules → algorithms/ML/embeddings → local model → cloud small
model → frontier model only when justified.

## DEC-09 --- AI optional

Teach/edit/variables/modules/assertions/run/evidence/reporting remain
usable with AI disabled.

## DEC-10 --- Human semantic sovereignty

AI proposes; humans can inspect, edit, reject, override or manually
create essential objects. AI never silently changes test intent.

## DEC-11 --- Immutable run history

Completed runs preserve the versions/data/environment/evidence needed to
understand what happened historically.

## DEC-12 --- Worker isolation

Browser execution and heavy work run outside the renderer so a worker
crash does not normally crash the desktop UI.

## DEC-13 --- API boundary

V0 architecture leaves a clean execution-adapter boundary for V1 API
testing.

## DEC-14 --- Security by default

Secrets are not intentionally persisted in plaintext definitions,
reports, logs or AI prompts.

## DEC-15 --- Exportability

Avoid deliberate lock-in; provide structured project backup/export and
explore honest Playwright-oriented export later.

## DEC-16 --- Product identity

Veyra is an Application Quality Intelligence Platform; V0 wedge is
intelligent desktop browser QA.

## DEC-17 --- Primary UX

Default mental model is Teach → Test → Results with progressive
disclosure.

## DEC-18 --- Action ≠ assertion

A click succeeding does not prove the intended business outcome
occurred.

## DEC-19 --- Result taxonomy

PASS, FAIL, BLOCKED, ERROR and INTERRUPTED have distinct meanings.

## DEC-20 --- Scope discipline

V0 excludes API, multi-browser, parallelism, scheduling, full
self-healing, mobile, visual regression, accessibility, CI/CD and
autonomous exploration.

## DEC-21 --- Approved visual system and representative V0 flow

The approved product direction is the seven-screen desktop flow and
design-system board in
`design_inspirations/New UI Mockups/Veyra Prototype.dc.html`, formalized
in root `design_specification.md`. The production interface uses the dark
navigation shell, warm near-white workspace, Inter plus limited Instrument
Serif, primary blue, high-energy orange and link/assertion teal defined there.
Orange is reserved for one high-energy action per screen; actions and
assertions remain visually distinct; PASS, FAIL, BLOCKED, ERROR, RUNNING and
QUEUED always use an icon and label rather than colour alone.

Reasoning: the prototype has been reviewed as the intended final product
language, not merely inspiration. Locking its tokens, shell, hierarchy and
core Teach → Understanding → Test → Run → Result journey prevents later
implementation from drifting back into generic grayscale tooling while still
leaving non-representative PRD surfaces free to reuse the same system.

## DEC-22 --- Approved desktop application mark

The supplied transparent Veyra mark is the application identity asset for the
macOS Dock/Finder bundle, Windows executable/installer and development window.
The canonical 2000 × 2000 RGBA source lives at
`docs/brand/veyra-app-icon-source.png`; packaging consumes the deterministic
1024 × 1024 derivative at `apps/desktop/build/icon.png`.

Reasoning: the mark uses the already-approved navigation ink and action-orange
language, has sufficient transparent safe area for platform presentation and
was explicitly supplied for this purpose. Keeping one lossless source and one
generated packaging input prevents platform variants from drifting. Platform
tools may scale or apply their native mask, but must not redraw, crop, add a
wordmark or bake in rounded corners.

## DEC-23 --- Approved in-product sidebar lockup

The global sidebar uses the supplied transparent mark from
`docs/brand/veyra_tr_icon.png` and the exact wordmark letterforms from
`docs/brand/veyra_rectlogo.png`. The mark is presented on a compact white tile
for contrast against the navigation-ink sidebar; the wordmark is extracted as
a transparent light-on-ink asset rather than approximated with interface text.
The previous blue tile, generic diamond and Inter-rendered “Veyra” label are
retired.

Reasoning: the two approved source files are the brand authority. Keeping the
wordmark as artwork preserves its actual custom typography, while the neutral
tile makes the predominantly dark transparent mark legible without recolouring
or redrawing it. The lockup remains a single accessible image named “Veyra”.

# 2. Product Vision and Thesis

> **Veyra learns how an application behaves, converts human
> demonstrations and other approved evidence into an evolving
> Application Behaviour Model, continuously discovers what should be
> tested, executes those tests, learns from failures and changes, and
> tells teams what is risky---while keeping humans in control.**

V0 must not pretend to understand the entire application. It must prove
a narrower proposition:

> **A tester can teach Veyra reusable application behaviour once,
> parameterize it, rerun it reliably and receive trustworthy
> evidence-backed PASS/FAIL/BLOCKED results without becoming an
> automation engineer.**

Long-term strategic asset: application knowledge that compounds across
demonstrations, tests, assertions, modules, runs, failures, changes and
approved business rules.

# 3. Problem Statement

Manual/low-code QA teams know what applications should do but face an
automation-authoring barrier, brittle maintenance, weak failure
communication and fragmented business knowledge. Traditional automation
often remembers execution instructions better than it remembers what the
application behaviour means.

# 4. Goals

1.  **G1 Accessible automation:** manual QA can create useful browser
    automation without code.
2.  **G2 Preserve meaning:** tests/modules express intent, inputs,
    outputs and expected outcomes.
3.  **G3 Reuse:** one taught behaviour can serve many tests/data rows.
4.  **G4 Trust:** distinguish application failure from automation
    blockage and Veyra error.
5.  **G5 Evidence:** automatically produce developer-useful failure
    context.
6.  **G6 Minimum ABM:** prove semantic application knowledge adds value
    beyond record/replay.
7.  **G7 Economics:** local-first execution and selective AI avoid
    unnecessary cloud costs.
8.  **G8 Human control:** AI accelerates QA expertise without silently
    overriding it.

# 5. V0 Non-Goals

V0 does not include API testing, Firefox/WebKit, parallel execution,
scheduling, native mobile, visual regression, accessibility testing,
CI/CD integrations, Jira/Slack/GitHub integrations, full self-healing,
autonomous exploration, predictive quality, release approval or a full
application state-space model.

# 6. Personas and Jobs-to-be-Done

## P1 --- Manual / Low-Code QA Tester

Needs to teach workflows, create assertions/variables/modules, rerun
regression and understand failures without automation-engineering
expertise.

## P2 --- QA Lead

Needs reusable structure, trustworthy outcomes, history, maintainability
and consistent evidence.

## P3 --- Developer Consuming Results

Needs goal, input data, expected/actual, screenshot, relevant
network/console evidence and reproduction context.

## P4 --- Product/Engineering Manager (Secondary)

Needs understandable run outcomes and critical failures without invented
quality scores.

Primary V0 jobs: - automate what I already know how to test; - reuse
Search Product/Add to Cart/Checkout behaviours; - run the same template
with Laptop/Watch/Backpack; - know whether the app failed or automation
was blocked; - give developers useful evidence; - update shared
behaviour once rather than repair many copies.

# 7. Primary User Journeys

1.  **First test:** Install → Project → Teach → Checkpoint → Finish →
    Confirm Understanding → Save → Run → Result.
2.  **Parameterized rerun:** Teach with Laptop → convert/suggest
    `product` → run with Watch.
3.  **Module reuse:** teach/extract Search Product → reuse → edit once →
    review affected tests.
4.  **Dataset:** bind Product Regression dataset → run each row →
    inspect independent results.
5.  **Application failure:** assertion violation → FAIL →
    expected/actual + evidence → report.
6.  **Automation blockage:** target unresolved safely → BLOCKED →
    candidates/manual recovery.
7.  **Manual authoring:** build valid test without Teach or AI.

# 8. Product Modules

  Module   Name                                      V0       V1
  -------- -------------------------------------- ----- --------
  M01      Desktop Foundation & Persistence         Yes   Extend
  M02      Projects, Environments & Secrets         Yes   Extend
  M03      Controlled Browser & Teach               Yes   Extend
  M04      Understanding & Semantic Extraction      Yes   Extend
  M05      Visual Test Authoring                    Yes   Extend
  M06      Variables, Presets & Datasets            Yes   Extend
  M07      Semantic Modules / Minimum ABM           Yes   Extend
  M08      Execution Engine                         Yes   Extend
  M09      Assertions & Result Semantics            Yes   Extend
  M10      Evidence & Diagnostics                   Yes   Extend
  M11      Results, History & Reporting             Yes   Extend
  M12      Locator Intelligence & Maintenance       Yes   Extend
  M13      AI/Intelligence & Governance             Yes   Extend
  M14      Security, Privacy & Data Control         Yes   Extend
  M15      Onboarding & Commercial Product          Yes   Extend
  M16      API Testing                               No      Yes
  M17      Multi-Browser, Parallel & Scheduling      No      Yes
  M18      Deeper ABM & Quality Memory               No      Yes
  M19      AI Test Creation & Test Families          No      Yes
  M20      Team Workspace & Sync                     No      Yes

# 9. Epic Register

  Epic   Module          Name                                       Release
  ------ --------------- ------------------------------------------ ---------
  E01    M01             Desktop Application Foundation             V0
  E02    M01             Local Persistence & Project Lifecycle      V0
  E03    M02             Projects & Environments                    V0
  E04    M02/M14         Secrets & Sensitive Data                   V0
  E05    M03             Controlled Browser                         V0
  E06    M03             Teach Recorder                             V0
  E07    M04             Teach Completion & Understanding           V0
  E08    M05             Visual Test Editor                         V0
  E09    M09             Assertions & Checkpoints                   V0
  E10    M06             Variables & Presets                        V0
  E11    M06             Datasets & Data-Driven Runs                V0
  E12    M07             Semantic Modules / Minimum ABM             V0
  E13    M08             Execution Compiler & Runtime               V0
  E14    M09             Result Classification                      V0
  E15    M10             Evidence Capture                           V0
  E16    M11             Results & Run History                      V0
  E17    M11             Developer Reports & Export                 V0
  E18    M12             Smart Locators & Assisted Recovery         V0
  E19    M13             V0 Intelligence Assistance                 V0
  E20    M13             Human Governance & Manual Fallback         V0
  E21    M15             Onboarding & Commerce Fixture              V0
  E22    M15             Commercial Hardening                       V0
  E23    M14             Privacy, Security & Telemetry              V0
  E24    Cross-cutting   Observability, Recovery & Supportability   V0
  E25    M16             API Testing                                V1
  E26    M17             Multi-Browser Execution                    V1
  E27    M17             Parallel Execution                         V1
  E28    M17             Scheduling                                 V1
  E29    M18             Expanded ABM                               V1
  E30    M19             Reuse-First AI Test Creation               V1
  E31    M19             Test Families & Candidate Assertions       V1
  E32    M10/M18         Diagnostics & Failure Memory               V1
  E33    M20             Team Workspace & Sync                      V1
  E34    M13/M14         AI Modes, Routing & Cost Governance        V1

# 10. Detailed Epic Requirements

## E01 --- Desktop Application Foundation

**Module:** M01\
**Release:** V0

### FR01.01 --- Installable desktop shell \[P0\]

Provide an installable Veyra desktop application that preserves projects
across restart.

### FR01.02 --- Renderer isolation \[P0\]

Browser automation and heavy evidence/intelligence work must not execute
in the renderer thread.

### FR01.03 --- Typed internal boundary \[P0\]

UI communicates with application services through typed APIs/events
rather than direct Playwright control.

### FR01.04 --- Lifecycle \[P0\]

Support graceful launch, shutdown, worker cleanup and interrupted-run
recovery.

### FR01.05 --- Platforms \[P1\]

Commercial V0 should support macOS and Windows; limitations must be
documented.

### E01 implementation baseline --- 15 September 2026

The shipped foundation packages the approved React shell behind a privileged
local application origin. Its renderer is sandboxed, context-isolated and
Node-free; a bundled preload exposes only named, typed calls/events whose main
handlers authorize the sending frame. Browser automation, evidence processing
and intelligence remain main-process/worker responsibilities and are not
renderer imports.

The main process owns a single-instance window lifecycle and a versioned,
atomic journal beneath Electron's stable application-data directory. Registered
operations receive one bounded shutdown request; unfinished or previously
unclean operations are carried into the next launch as pending recovery.
This establishes the restart-safe storage location and service lifecycle that
E02 project persistence and E05/E13 workers must use. End-to-end project record
persistence remains E02 scope because project records do not exist yet.

E01 produces macOS Apple Silicon/Intel DMG and ZIP artifacts plus an x64
Windows NSIS installer, with native macOS and Windows packaging configured in CI.
The current artifacts are unsigned and use the approved Veyra application mark.
macOS code signing/notarization, Windows signing and auto-update policy are
commercial hardening work under E22. The Apple Silicon package was executed
locally; Intel macOS and Windows artifacts require native target-host runtime
validation before external distribution.

## E02 --- Local Persistence & Project Lifecycle

**Module:** M01\
**Release:** V0

### FR02.01 --- Structured persistence \[P0\]

Persist product-domain data locally using versioned storage.

### FR02.02 --- Evidence storage \[P0\]

Store screenshots/traces/reports outside the primary relational store.

### FR02.03 --- Migrations \[P0\]

Use versioned schema migrations with safe failure handling.

### FR02.04 --- Historical integrity \[P0\]

Later edits must not rewrite completed-run meaning.

### FR02.05 --- Backup/export \[P1\]

Export a project in a documented Veyra format.

### FR02.06 --- Restore/import \[P1\]

Restore a valid Veyra project export.

### FR02.07 --- Storage management \[P1\]

Inspect/clean old evidence without deleting core definitions.

### E02 implementation baseline --- 15 September 2026

The shipped `ProjectStore` is the single persistence interface over a
versioned local SQLite database and a separate filesystem evidence tree. It
stores project definitions and immutable completed-run snapshots, performs
transactional schema migration, and preserves an unreadable/future database
rather than replacing it. Storage inspection and two-step age-based evidence
cleanup are available from the Data screen through validated, allow-listed
main/preload calls; cleanup never deletes definitions or run history.

Project export and restore use the documented checksummed
`.veyra-project.json` format in `docs/Veyra_Project_Backup_Format.md`. Native
main-process file pickers keep paths out of the renderer. Restore validates the
format version, checksum, identifiers, evidence paths/extensions and byte sizes,
then commits structured rows transactionally and removes partial evidence on
failure.

E02 verification is intentionally exposed from the repository root as
`npm run test:e02`. It writes only to the visible, ignored
`e02-test-output/` folder and reports plain-language assertions for structured
data, separate evidence, export/restore, historical integrity and cleanup.
This root wrapper was chosen over requiring product stakeholders to navigate
the nested desktop package or interpret raw database/test-runner output; the
underlying module tests remain available for engineering diagnostics.

## E03 --- Projects & Environments

**Module:** M02\
**Release:** V0

### FR03.01 --- Create project \[P0\]

Create with project name, application URL and environment name.

### FR03.02 --- Edit project \[P0\]

Edit project metadata/base URL.

### FR03.03 --- Environments \[P0\]

Support named environment configuration; model must allow multiple
environments.

### FR03.04 --- Environment variables \[P0\]

Store/reference non-secret environment-specific values.

### FR03.05 --- Project overview \[P0\]

Show tests, modules, recent runs, latest outcomes and primary Teach/Run
actions.

### FR03.06 --- Archive/delete \[P1\]

Destructive project actions require confirmation.

### E03 implementation baseline (2026-09-16)

Projects, named environments and non-secret environment variables are stored
in the versioned local project database and exposed to the sandboxed renderer
only through the typed project-workspace command boundary. This keeps database
ownership in Electron's main process while giving the UI one refreshable model
for the switcher, active environment and overview.

Each project always has exactly one active environment. Changing it updates the
visible project context and effective application URL together, avoiding a
split state where a displayed environment and execution URL disagree. The
overview is derived from persisted definitions and immutable completed runs;
when no records exist, it shows truthful zero/empty states rather than demo
health data.

Archive is reversible at the storage layer and hides the project from the
normal switcher. Permanent deletion requires the exact project name and also
removes its evidence directory. Exact-name entry is an identity gate, followed
by a separate irreversible-action confirmation modal; this prevents a single
enabled click from destroying the project while still proving which project the
user intends to remove.
Exports now include all environments and their non-secret variables in backup
format version 2; restore remains compatible with version 1 so the E03 schema
does not make existing E02 backups unusable. Restoring a valid backup whose
identity matches an archived local project reactivates and selects that project;
an active same-identity duplicate remains blocked to prevent silent overwrite.

## E04 --- Secrets & Sensitive Data

**Module:** M02/M14\
**Release:** V0

### FR04.01 --- Secret creation \[P0\]

Create named secret references.

### FR04.02 --- Secure storage \[P0\]

Use OS-secure storage/keychain where practical.

### FR04.03 --- References \[P0\]

Definitions reference logical secret IDs rather than plaintext.

### FR04.04 --- Masking \[P0\]

Mask secrets in ordinary UI.

### FR04.05 --- Report/log redaction \[P0\]

Do not intentionally expose plaintext secrets in reports/logs.

### FR04.06 --- AI redaction \[P0\]

Never automatically send secrets to AI.

### FR04.07 --- Evidence protection \[P1\]

Reduce accidental screenshot/evidence exposure where Veyra controls
secret entry.

## E05 --- Controlled Browser

**Module:** M03\
**Release:** V0

### FR05.01 --- Launch Chromium \[P0\]

Open configured application in Veyra-controlled Chromium.

### FR05.02 --- Headed browser \[P0\]

Teach/onboarding support visible browser execution.

### FR05.03 --- Metadata \[P0\]

Capture browser/version/environment metadata.

### FR05.04 --- Isolation \[P0\]

Use clean browser contexts per isolated run/case unless explicitly
configured.

### FR05.05 --- Stop \[P0\]

User can terminate controlled browser execution.

### FR05.06 --- Browser binaries \[P0\]

Reliably install/find/manage compatible browser runtime.

## E06 --- Teach Recorder

**Module:** M03\
**Release:** V0

### FR06.01 --- Start Teach \[P0\]

Start a named Teach workflow.

### FR06.02 --- Meaningful actions \[P0\]

Capture navigation, click, type, select and meaningful key actions.

### FR06.03 --- Normalize \[P0\]

Convert raw events to stable normalized Veyra actions.

### FR06.04 --- Readable timeline \[P0\]

Show business-readable steps rather than raw selectors.

### FR06.05 --- Noise filtering \[P0\]

Suppress incidental mouse/focus/duplicate/layout/insignificant-scroll
events.

### FR06.06 --- Pause/resume \[P0\]

Pause and resume teaching.

### FR06.07 --- Remove step \[P0\]

Remove accidental recorded steps.

### FR06.08 --- Manual insertion \[P0\]

Insert manual steps during/after teaching.

### FR06.09 --- Checkpoint \[P0\]

Add checkpoint/assertion while demonstrating.

### FR06.10 --- Finish \[P0\]

Finish Teach into Understanding Confirmation, not opaque save.

## E07 --- Teach Completion & Understanding

**Module:** M04\
**Release:** V0

### FR07.01 --- Understanding summary \[P0\]

Show proposed goal, variables, expected outcomes and reusable
behaviours.

### FR07.02 --- Business language \[P0\]

Summary must not require automation terminology.

### FR07.03 --- Approve \[P0\]

User can confirm understanding.

### FR07.04 --- Edit \[P0\]

User can edit goal/variables/outcomes/module meaning.

### FR07.05 --- Return \[P0\]

User can return to teaching/editor.

### FR07.06 --- Parameter candidate \[P0\]

Suggest literal→variable with Convert/Edit/Keep Fixed.

### FR07.07 --- Module candidate \[P1\]

Suggest reusable semantic behaviours.

### FR07.08 --- Provenance \[P1\]

Retain manual/observed/suggested/approved origin where relevant.

## E08 --- Visual Test Editor

**Module:** M05\
**Release:** V0

### FR08.01 --- Semantic flow \[P0\]

Display tests as ordered readable cards/steps.

### FR08.02 --- Identity \[P0\]

Edit test name, description and goal.

### FR08.03 --- Browser steps \[P0\]

Manually add Open URL, Click, Type, Select, Press Key and Wait.

### FR08.04 --- Validation step \[P0\]

Add supported assertions.

### FR08.05 --- Module step \[P0\]

Insert existing reusable module.

### FR08.06 --- Reorder \[P0\]

Reorder compatible steps.

### FR08.07 --- Delete \[P0\]

Delete steps with safe UX.

### FR08.08 --- Edit target/value \[P0\]

Edit step targets and values.

### FR08.09 --- Duplicate \[P0\]

Duplicate test into a new definition.

### FR08.10 --- Version \[P0\]

Material saves update version/history metadata.

### FR08.11 --- Advanced view \[P1\]

Expand technical locator/implementation detail.

### FR08.12 --- Tags \[P1\]

Organize/filter tests with tags.

## E09 --- Assertions & Checkpoints

**Module:** M09\
**Release:** V0

### FR09.01 --- Verify text \[P0\]

Assert text presence/value.

### FR09.02 --- Verify visibility \[P0\]

Assert target visibility.

### FR09.03 --- Verify URL \[P0\]

Assert URL/pattern.

### FR09.04 --- Verify value \[P0\]

Assert target value.

### FR09.05 --- Verify count \[P0\]

Assert supported element/business count.

### FR09.06 --- Expected vs actual \[P0\]

Persist expected and observed context on failure.

### FR09.07 --- Readable assertion \[P0\]

Default assertion label communicates business meaning.

### FR09.08 --- Manual assertion \[P0\]

Assertions can be created without AI.

### FR09.09 --- Failure semantics \[P0\]

Deterministically violated expected outcome produces FAIL unless
evaluation itself is blocked.

## E10 --- Variables & Presets

**Module:** M06\
**Release:** V0

### FR10.01 --- Create variable \[P0\]

Create named variable with value/default.

### FR10.02 --- Literal conversion \[P0\]

Convert recorded literal to variable.

### FR10.03 --- References \[P0\]

Tests/modules reference variables.

### FR10.04 --- Scopes \[P0\]

Model environment, test, module, output/generated and secret scopes.

### FR10.05 --- Module inputs \[P0\]

Expose module variables as inputs.

### FR10.06 --- Outputs \[P0\]

Capture supported step/module outputs for downstream use.

### FR10.07 --- Presets \[P1\]

Save reusable non-secret configuration/value groups.

### FR10.08 --- Validation \[P1\]

Detect missing required variable values.

## E11 --- Datasets & Data-Driven Runs

**Module:** M06\
**Release:** V0

### FR11.01 --- Create dataset \[P0\]

Create tabular datasets.

### FR11.02 --- Rows \[P0\]

Add/edit/remove rows.

### FR11.03 --- Binding \[P0\]

Bind columns to test variables.

### FR11.04 --- Per-row execution \[P0\]

Each row creates a distinct run case.

### FR11.05 --- Independent result \[P0\]

Each row has independently inspectable outcome/evidence.

### FR11.06 --- CSV import \[P1\]

Import compatible CSV.

### FR11.07 --- Validation \[P0\]

Identify missing required columns/values with actionable feedback.

## E12 --- Semantic Modules / Minimum ABM

**Module:** M07\
**Release:** V0

### FR12.01 --- Create module \[P0\]

Create reusable module from selected steps or manually.

### FR12.02 --- Intent \[P0\]

Store business intent.

### FR12.03 --- Inputs \[P0\]

Expose named inputs.

### FR12.04 --- Outputs \[P0\]

Expose supported named outputs.

### FR12.05 --- Preconditions \[P0\]

Store readable preconditions.

### FR12.06 --- Expected outcomes \[P0\]

Store expected business outcomes.

### FR12.07 --- Implementation \[P0\]

Map semantic module to executable steps.

### FR12.08 --- Dependents \[P0\]

Identify tests using the module.

### FR12.09 --- Impact \[P0\]

Show affected tests before material shared-module change.

### FR12.10 --- Versioning \[P0\]

Preserve module versions for historical traceability.

### FR12.11 --- Reuse \[P0\]

Insert one module across multiple tests.

### FR12.12 --- Evidence linkage \[P1\]

Link module knowledge to relevant evidence.

## E13 --- Execution Compiler & Runtime

**Module:** M08\
**Release:** V0

### FR13.01 --- Compile \[P0\]

Translate Veyra definitions into execution plans.

### FR13.02 --- Playwright adapter \[P0\]

Execute supported browser actions through Playwright.

### FR13.03 --- Visible run \[P0\]

Execute headed.

### FR13.04 --- Headless run \[P0\]

Execute headlessly.

### FR13.05 --- Live progress \[P0\]

Show current/completed steps.

### FR13.06 --- Stop \[P0\]

Stop active run.

### FR13.07 --- Pause \[P1\]

Pause where runtime semantics permit.

### FR13.08 --- Timeout \[P0\]

Use bounded timeouts with clear handling.

### FR13.09 --- Retry \[P1\]

Configurable retries must not hide instability.

### FR13.10 --- Snapshot \[P0\]

Persist test/module/data/environment version context at run start.

### FR13.11 --- Dataset expansion \[P0\]

Expand data cases independently.

## E14 --- Result Classification

**Module:** M09\
**Release:** V0

### FR14.01 --- PASS \[P0\]

Required expected outcomes satisfied and execution completed.

### FR14.02 --- FAIL \[P0\]

Observed application behaviour contradicted deterministic expectation.

### FR14.03 --- BLOCKED \[P0\]

Veyra could not reliably perform/evaluate intended operation without
evidence to call app wrong.

### FR14.04 --- ERROR \[P0\]

Veyra/internal failure remains distinct from application FAIL.

### FR14.05 --- INTERRUPTED \[P0\]

User/system interruption remains distinct.

### FR14.06 --- Reason code \[P0\]

Persist machine-readable primary reason where possible.

### FR14.07 --- Explanation \[P0\]

Show concise human-readable reason.

## E15 --- Evidence Capture

**Module:** M10\
**Release:** V0

### FR15.01 --- Screenshot \[P0\]

Capture failure/checkpoint screenshots per policy.

### FR15.02 --- URL \[P0\]

Persist relevant URL.

### FR15.03 --- Timestamp \[P0\]

Timestamp evidence.

### FR15.04 --- Action context \[P0\]

Persist current/relevant action and target description.

### FR15.05 --- Expected/actual \[P0\]

Persist assertion expectation and observation.

### FR15.06 --- Console \[P0\]

Capture relevant console evidence.

### FR15.07 --- Network \[P0\]

Capture relevant request failure/status evidence.

### FR15.08 --- DOM/target \[P0\]

Capture sufficient diagnostics for blocked/failing target actions.

### FR15.09 --- Timeline linkage \[P0\]

Map evidence to run steps.

### FR15.10 --- Lazy load \[P1\]

Load large evidence on demand.

### FR15.11 --- Trace on failure \[P1\]

Support richer failure traces where feasible.

## E16 --- Results & Run History

**Module:** M11\
**Release:** V0

### FR16.01 --- Summary \[P0\]

Show status, duration, environment, browser and data case.

### FR16.02 --- Timeline \[P0\]

Show per-step state.

### FR16.03 --- Failure detail \[P0\]

Show expected/actual and evidence.

### FR16.04 --- Blocked detail \[P0\]

Show intended target/action and blockage reason.

### FR16.05 --- History \[P0\]

Chronological project run history.

### FR16.06 --- Filters \[P1\]

Filter by status/test/date/tag.

### FR16.07 --- Dataset rollup \[P0\]

Aggregate plus individual row results.

### FR16.08 --- Version context \[P0\]

Historical results identify executed test/module versions.

## E17 --- Developer Reports & Export

**Module:** M11\
**Release:** V0

### FR17.01 --- HTML \[P0\]

Generate portable HTML report.

### FR17.02 --- PDF \[P0\]

Generate shareable PDF report.

### FR17.03 --- Content \[P0\]

Include goal, inputs, environment/browser, failing checkpoint,
expected/actual, screenshot and relevant technical evidence.

### FR17.04 --- Independent readability \[P0\]

Developer without Veyra can understand the failure.

### FR17.05 --- Redaction \[P0\]

Apply sensitive-data policy to exports.

### FR17.06 --- Structured export \[P2\]

V1/later may add JSON/integration export.

## E18 --- Smart Locators & Assisted Recovery

**Module:** M12\
**Release:** V0

### FR18.01 --- Multi-signal model \[P0\]

Prefer role, accessible name, label, stable test ID, text and contextual
hints.

### FR18.02 --- Readable target \[P0\]

Default UI shows target meaning, not selector syntax.

### FR18.03 --- Candidate ranking \[P0\]

Rank plausible alternate targets after resolution failure.

### FR18.04 --- Uncertainty \[P0\]

Show confidence/equivalent uncertainty.

### FR18.05 --- Use once \[P0\]

Allow safe candidate use for current attempt.

### FR18.06 --- Edit target \[P0\]

Allow manual redefinition.

### FR18.07 --- Block rather than guess \[P0\]

Insufficient confidence produces BLOCKED.

### FR18.08 --- Advanced details \[P1\]

Expose locator mechanics to advanced users.

### FR18.09 --- Persistent self-healing \[P2\]

Deferred beyond V0.

## E19 --- V0 Intelligence Assistance

**Module:** M13\
**Release:** V0

### FR19.01 --- Parameter suggestion \[P0\]

Suggest reusable literals as parameters.

### FR19.02 --- Readable description \[P0\]

Improve normalized action descriptions.

### FR19.03 --- Intent suggestion \[P1\]

Suggest workflow/module intent.

### FR19.04 --- Module suggestion \[P1\]

Suggest reusable sequences.

### FR19.05 --- Capability gateway \[P0\]

Domain requests capabilities, never hard-coded model names.

### FR19.06 --- Lowest-cost reliable tier \[P0\]

Prefer deterministic/local intelligence.

### FR19.07 --- Async \[P0\]

Non-essential intelligence must not block execution.

### FR19.08 --- AI disabled \[P0\]

Core product remains functional.

## E20 --- Human Governance & Manual Fallback

**Module:** M13\
**Release:** V0

### FR20.01 --- Proposal state \[P0\]

Consequential AI suggestions remain proposals until accepted.

### FR20.02 --- Accept \[P0\]

Accept proposal.

### FR20.03 --- Edit \[P0\]

Edit proposal before acceptance.

### FR20.04 --- Reject \[P0\]

Reject proposal.

### FR20.05 --- Manual path \[P0\]

Essential AI-assisted objects have manual creation paths.

### FR20.06 --- No silent semantic change \[P0\]

Never silently change goal, expected outcome or module intent.

### FR20.07 --- Undo \[P1\]

Support undo for authoring transformations where practical.

### FR20.08 --- Provenance \[P1\]

Retain manual/observed/suggested/approved origin.

## E21 --- Onboarding & Commerce Fixture

**Module:** M15\
**Release:** V0

### FR21.01 --- Welcome \[P0\]

Direct first-run user to project creation and Teach.

### FR21.02 --- Minimal setup \[P0\]

Avoid long onboarding questionnaires.

### FR21.03 --- Interactive tutorial \[P1\]

Teach Veyra by using Veyra.

### FR21.04 --- Commerce fixture \[P0\]

Maintain controlled e-commerce demo/evaluation application.

### FR21.05 --- Failure injection \[P1\]

Support rename, API failure, delay, wrong count, expired coupon, order
failure and wrong total scenarios.

### FR21.06 --- Magic moment \[P0\]

Teach Laptop → variable product → rerun Watch → evidence-backed result.

### FR21.07 --- Activation telemetry \[P1\]

Measure project/Teach/save/run/parameterized-run funnel.

## E22 --- Commercial Hardening

**Module:** M15\
**Release:** V0

### FR22.01 --- Installer \[P0\]

Reliable supported-platform installer.

### FR22.02 --- Auto-update \[P1\]

Safe application updates.

### FR22.03 --- Runtime compatibility \[P0\]

Manage browser/Playwright compatibility.

### FR22.04 --- Entitlement boundary \[P1\]

Support licensing/account without making local execution unnecessarily
cloud-dependent.

### FR22.05 --- Offline semantics \[P1\]

Document capabilities available disconnected.

### FR22.06 --- Documentation \[P0\]

Installation/onboarding/authoring/troubleshooting docs.

### FR22.07 --- Support path \[P0\]

Accessible support/troubleshooting path.

### FR22.08 --- Storage cleanup \[P0\]

Manage evidence growth.

### FR22.09 --- Backup \[P1\]

Commercial users can preserve project work.

## E23 --- Privacy, Security & Telemetry

**Module:** M14\
**Release:** V0

### FR23.01 --- Telemetry policy \[P0\]

Disclose/configure telemetry according to policy.

### FR23.02 --- Evidence policy \[P0\]

Document/control sensitive evidence defaults.

### FR23.03 --- Local AI \[P0\]

Local inference remains local.

### FR23.04 --- Cloud AI policy \[P0\]

Know/enforce what data may leave machine.

### FR23.05 --- Redaction pipeline \[P0\]

Remove/mask known secrets/tokens before eligible cloud inference.

### FR23.06 --- Deletion \[P0\]

Support project/evidence deletion.

### FR23.07 --- Secure transport \[P0\]

Use secure transport for cloud communication.

### FR23.08 --- Privacy docs \[P0\]

Commercial release includes data-handling documentation.

## E24 --- Observability, Recovery & Supportability

**Module:** Cross-cutting\
**Release:** V0

### FR24.01 --- Structured logs \[P0\]

Diagnostic logs without intentional secret leakage.

### FR24.02 --- Worker diagnostics \[P0\]

Worker failures include actionable context.

### FR24.03 --- Crash recovery \[P0\]

Reopen project safely after abnormal shutdown.

### FR24.04 --- Interrupted state \[P0\]

Interrupted run is not PASS/FAIL.

### FR24.05 --- Diagnostic bundle \[P1\]

Gather support diagnostics with sensitive-data controls.

### FR24.06 --- Version info \[P0\]

Expose Veyra/browser/runtime/OS versions.

## E25 --- API Testing

**Module:** M16\
**Release:** V1

### FR25.01 --- HTTP methods \[P2\]

GET/POST/PUT/PATCH/DELETE.

### FR25.02 --- Request configuration \[P2\]

Headers, query params, body and auth.

### FR25.03 --- Variables \[P2\]

Use Veyra variables in requests.

### FR25.04 --- Extraction \[P2\]

Extract response values downstream.

### FR25.05 --- Assertions \[P2\]

Status and body assertions.

### FR25.06 --- Hybrid test \[P2\]

UI and API steps share variables/evidence.

### FR25.07 --- OpenAPI enrichment \[P2\]

Import may seed API definitions and semantic hints.

## E26 --- Multi-Browser Execution

**Module:** M17\
**Release:** V1

### FR26.01 --- Firefox \[P2\]

Execute Firefox.

### FR26.02 --- WebKit \[P2\]

Execute WebKit.

### FR26.03 --- Matrix \[P2\]

Select browser matrix.

### FR26.04 --- Independent results \[P2\]

Preserve browser-specific outcomes/evidence.

## E27 --- Parallel Execution

**Module:** M17\
**Release:** V1

### FR27.01 --- Worker pool \[P2\]

Execute cases through isolated worker pool.

### FR27.02 --- Parallelism \[P2\]

Configurable concurrency.

### FR27.03 --- Isolation \[P2\]

Independent browser contexts.

### FR27.04 --- Aggregation \[P2\]

Correct result aggregation/cancellation.

### FR27.05 --- Resource warning \[P2\]

Warn about obvious shared-resource conflicts.

## E28 --- Scheduling

**Module:** M17\
**Release:** V1

### FR28.01 --- Create schedule \[P2\]

Schedule named suite.

### FR28.02 --- Configuration \[P2\]

Select environment/browser.

### FR28.03 --- Local semantics \[P2\]

Communicate machine-availability requirement.

### FR28.04 --- History \[P2\]

Scheduled runs appear in history.

### FR28.05 --- Notification \[P2\]

Notify completion in supported Veyra surface.

## E29 --- Expanded ABM

**Module:** M18\
**Release:** V1

### FR29.01 --- Business entities \[P2\]

Represent Product, Cart, Coupon, Checkout, Payment, Order, Refund as
learned project concepts where applicable.

### FR29.02 --- Business actions \[P2\]

Represent semantic actions on entities.

### FR29.03 --- Dependencies \[P2\]

Represent business/execution dependencies.

### FR29.04 --- Provenance/confidence \[P2\]

Persist source and uncertainty.

### FR29.05 --- Lifecycle \[P2\]

Support suggested/approved/trusted/deprecated knowledge.

### FR29.06 --- Last verified \[P2\]

Track validation recency.

### FR29.07 --- Knowledge view \[P2\]

Expose useful business-readable ABM surface.

### FR29.08 --- Preconditions \[P2\]

Represent prerequisites and test-data blockage.

## E30 --- Reuse-First AI Test Creation

**Module:** M19\
**Release:** V1

### FR30.01 --- Natural language \[P2\]

Create candidate test from business goal.

### FR30.02 --- Trusted search \[P2\]

Search existing modules/data/assertions first.

### FR30.03 --- Generate gaps only \[P2\]

Generate novel behavior only when missing.

### FR30.04 --- Mark generated content \[P2\]

Distinguish reused from generated.

### FR30.05 --- Review \[P2\]

Accept/Edit/Reject candidate.

### FR30.06 --- No silent trust \[P2\]

Generated test does not automatically join trusted regression.

## E31 --- Test Families & Candidate Assertions

**Module:** M19\
**Release:** V1

### FR31.01 --- Test families \[P2\]

Suggest happy/negative/boundary/state/behavior variants.

### FR31.02 --- Selective addition \[P2\]

User selects candidates to add.

### FR31.03 --- Candidate invariants \[P2\]

Repeated observations may suggest outcomes.

### FR31.04 --- Approval \[P2\]

Observation alone never becomes trusted business truth.

### FR31.05 --- Bug guard \[P2\]

Frequency alone is insufficient ground truth.

## E32 --- Diagnostics & Failure Memory

**Module:** M10/M18\
**Release:** V1

### FR32.01 --- Correlation \[P2\]

Correlate assertion, browser, console, network, API, prior success and
failure history.

### FR32.02 --- Likely area \[P2\]

Present probable failure area with supporting evidence.

### FR32.03 --- Confidence \[P2\]

Inference is not presented as certainty.

### FR32.04 --- Compare success \[P2\]

Surface high-value differences from last comparable success.

### FR32.05 --- Reproduce \[P2\]

Re-execute historical context where feasible/safe.

### FR32.06 --- Failure patterns \[P2\]

Store semantic historical defect patterns and occurrences.

### FR32.07 --- Memory recommendation \[P2\]

Relevant historical defects influence future recommendations.

## E33 --- Team Workspace & Sync

**Module:** M20\
**Release:** V1

### FR33.01 --- Workspace \[P2\]

Shared workspace/projects.

### FR33.02 --- Shared knowledge \[P2\]

Share tests/modules/data/run/knowledge according to policy.

### FR33.03 --- Roles \[P2\]

Admin/Editor/Viewer.

### FR33.04 --- Conflicts \[P2\]

No silent overwrite of newer shared versions.

### FR33.05 --- Selective evidence sync \[P2\]

Artifact sync follows privacy policy.

## E34 --- AI Modes, Routing & Cost Governance

**Module:** M13/M14\
**Release:** V1

### FR34.01 --- Local Only \[P2\]

No project/application context to cloud AI.

### FR34.02 --- Hybrid \[P2\]

Rules/local first with permitted escalation.

### FR34.03 --- Cloud Enhanced \[P2\]

Broader cloud reasoning under policy.

### FR34.04 --- Redaction \[P2\]

Cloud prompts pass policy/redaction layer.

### FR34.05 --- Usage visibility \[P2\]

Expose meaningful AI usage/cost metadata.

### FR34.06 --- Vendor abstraction \[P2\]

Capability gateway remains model-vendor agnostic.

# 11. V0 Release-Level Acceptance Scenarios

## V0-AS01 --- Parameterized Product Test

Teach Search `Laptop` → open product → Add to Cart → verify Cart. Veyra
records readable actions, creates/allows `product`, reruns with `Watch`,
and produces PASS when expected behaviour occurs. **No automation code
required.**

## V0-AS02 --- Application Failure

Controlled cart operation returns a failure and explicit Cart outcome is
violated. Veyra returns **FAIL**, shows expected/actual, screenshot and
relevant network evidence.

## V0-AS03 --- Locator Blockage

`Add to Cart` becomes `Add to Basket` and confidence is insufficient.
Veyra returns **BLOCKED**, presents candidate evidence and does not
silently redefine intent.

## V0-AS04 --- Module Reuse

Three tests reuse Search Product. A shared-module change shows affected
tests; old run history remains understandable.

## V0-AS05 --- Dataset

Laptop, Watch and Backpack create independently inspectable cases.

## V0-AS06 --- AI Disabled

Teach/record, manual edit, variables, modules, assertions, execution,
evidence and reports remain usable.

## V0-AS07 --- Secrets

Credentials are masked and absent from ordinary plaintext reports/logs.

## V0-AS08 --- Worker Crash

Desktop UI survives; run is ERROR/INTERRUPTED; project is preserved.

## V0-AS09 --- Developer Report

A developer without Veyra can understand the failing goal, inputs,
expected/actual and evidence.

## V0-AS10 --- Manual Authoring

User creates and executes a valid test without recording or AI.

# 12. Cross-Cutting Non-Functional Requirements

## NFR90.01 --- UX simplicity

Primary user need not understand Playwright, XPath, page objects or LLM
prompting.

## NFR90.02 --- Progressive disclosure

Technical detail is available but not dominant.

## NFR90.03 --- Accessibility

Keyboard-accessible primary interactions, readable contrast/labels,
status not color-only, reasonable scaling.

## NFR90.04 --- Responsiveness

Desktop UI remains responsive during execution/intelligence.

## NFR90.05 --- Local scale

Architecture should remain usable with hundreds of test definitions;
exact benchmark set during implementation.

## NFR90.06 --- Reliability

Recorder/execution/persistence/cancellation/evidence outrank flashy AI.

## NFR90.07 --- Security

No known critical secret leakage or insecure transport may ship.

## NFR90.08 --- Privacy

Cloud transmission is explicit, policy-controlled and minimized.

## NFR90.09 --- Auditability

Consequential AI-assisted knowledge retains provenance.

## NFR90.10 --- Maintainability

Execution adapters, model providers and storage are separated from
product semantics.

## NFR90.11 --- Testability

Core domain logic should be testable without full desktop/browser stack
where practical.

## NFR90.12 --- Observability

Veyra failures produce supportable diagnostic context.

## NFR90.13 --- Portability

Domain data is not irreversibly tied to one selector format/model
vendor.

## NFR90.14 --- Cost efficiency

Ordinary local runs incur no mandatory cloud-browser fee.

## NFR90.15 --- Model economics

Use least expensive intelligence tier satisfying quality.

# 13. Conceptual Data Model

V0 entities:

``` text
Project
Environment
SecretReference
Variable
Preset
Dataset
DatasetRow
Test
TestVersion
Module
ModuleVersion
Action
Assertion
LocatorDefinition
Run
RunCase
RunStep
EvidenceArtifact
AIProposal
```

V1 additions:

``` text
Workspace
WorkspaceMember
BusinessEntity
BusinessAction
Dependency
ABMFact
ABMFactSource
FailurePattern
FailureOccurrence
Diagnostic
RunComparison
APIDefinition
Schedule
SyncVersion
```

Core relationships:

``` text
Project
├── Environments
├── Variables
├── Datasets
├── Tests
├── Modules
└── Runs

TestVersion
├── Actions
├── Assertions
├── ModuleReferences
└── VariableBindings

ModuleVersion
├── Intent
├── Inputs
├── Outputs
├── Preconditions
├── ExpectedOutcomes
└── Implementation

Run → RunCases → RunSteps → EvidenceArtifacts
```

# 14. Core State Models

``` text
Test: DRAFT → READY → ARCHIVED

Run:
QUEUED → RUNNING → COMPLETED
                  ↘ INTERRUPTED
                  ↘ ERROR

Run Case Outcome:
PASS | FAIL | BLOCKED | ERROR | INTERRUPTED

AI Proposal:
SUGGESTED | ACCEPTED | EDITED_AND_ACCEPTED | REJECTED

V1 Knowledge:
OBSERVED → SUGGESTED → APPROVED → TRUSTED → STALE → DEPRECATED
```

# 15. Execution Contract

A normalized execution step receives execution context, resolved
variables, action/assertion, target definition and timeout/policy, and
returns structured status, observations, outputs, evidence references,
timing and block/error reason.

Playwright-specific objects must not leak into the persisted
product-domain contract.

# 16. Locator Contract

A target may retain multiple semantic/stability hints:

``` text
semanticName
role
accessibleName
label
testId
textHints
structuralHints
historicalCandidates
confidence metadata
```

Veyra should prefer semantic/stable evidence over brittle positional
XPath.

# 17. Intelligence Contract

Capabilities, not model names:

``` text
describeStep()
detectParameters()
findReusableSequences()
suggestIntent()
rankLocatorCandidates()
diagnoseFailure()        // V1
generateCandidateTest()  // V1
```

Every capability defines allowed input, eligible routing tiers,
structured output, uncertainty where applicable and whether human
approval is mandatory.

# 18. Security and Privacy Requirements

Threat areas requiring explicit engineering treatment: - credentials and
session cookies; - screenshots containing personal/payment data; -
network bodies and console logs; - exported reports; - cloud AI
prompts; - local model files; - project exports; - untrusted web content
interacting with desktop privileges.

The controlled web page must not receive unsafe privileged desktop
access.

Required controls: - secure secret references; - evidence
collection/retention policy; - AI enabled/disabled; - cloud AI
permitted/not permitted; - redaction; - project/evidence deletion; -
secure transport; - explicit cloud boundaries.

# 19. V0 Commercial Readiness

A feature-complete prototype is not automatically commercial. Broad V0
release additionally requires: - reliable installer; - browser
binary/runtime management; - database migrations; - crash recovery; -
privacy/data-handling documentation; - support/troubleshooting; -
storage cleanup; - product documentation; - onboarding; - update
strategy; - account/licensing decision; - backup/export strategy.

# 20. V0 Release Gates

**RG-V0.1 Reliability:** ordinary e-commerce flows repeat with
sufficiently low false-BLOCKED rate to earn trust; threshold established
empirically before external SLA claims.

**RG-V0.2 Usability:** representative manual QA users create a
parameterized reusable test without automation-engineering assistance.

**RG-V0.3 Differentiation:** Teach + Understanding + semantic modules
are materially more useful than basic record/replay.

**RG-V0.4 Evidence:** developers/QA find generated failure evidence
materially useful.

**RG-V0.5 Security:** no known critical secret leakage/insecure default
blocks release.

**RG-V0.6 Distribution:** installer, migrations, browser runtime and
recovery are supportable.

**RG-V0.7 Economics:** normal usage does not depend on uncontrolled
cloud browser/LLM cost.

# 21. Metrics

## Activation

Project created; Teach completed; first test saved; first successful
run; first parameterized rerun.

## Engagement

Active projects, tests run, repeat runs, module reuse, datasets used,
reports exported.

## Trust

BLOCKED rate, discovered false FAILs, locator-candidate acceptance, AI
proposal accept/edit/reject, manual overrides.

## Value

Workflows automated, estimated repetitive QA time reduced,
report-preparation work reduced, maintenance avoided through module
reuse.

## Reliability

Desktop crash rate, worker crash rate, recorder failure rate,
corrupted-project incidents.

# 22. Pilot Requirements

Before broad commercial launch, pilot Veyra against multiple real
e-commerce-style applications covering Search, Product Detail, Cart,
Coupon, Checkout and Order Confirmation.

Pilot must validate **abstraction quality**, not merely replay success:

> Can Veyra represent reusable business behaviour across different UI
> implementations?

# 23. Internal Commerce Quality Fixture

Maintain a controlled fixture for onboarding, product demos, regression
and intelligence evaluation.

Failure flags/scenarios should include:

``` text
RENAME_ADD_TO_CART
FAIL_CART_API
DELAY_SEARCH
BREAK_CART_COUNT
EXPIRE_COUPON
FAIL_ORDER
WRONG_TOTAL
```

Later extend with parallel conflicts, browser-specific failures,
intermittent failures and recurring historical defects.

# 24. UX Principles

1.  Business language first.
2.  Progressive disclosure.
3.  Show meaning before mechanism.
4.  Put evidence near failure.
5.  Ask users to validate Veyra's understanding, not AI reasoning.
6.  Low-friction empty states point to Teach/Create.
7.  No AI theatre where deterministic UI is faster.
8.  Consequential recommendations explain why.
9.  PASS/FAIL/BLOCKED are never color-only.
10. Better UX is a strategic moat, not decoration.

# 25. Product Copy Direction

Avoid generic: **"AI-powered no-code automation."**

V0 working headline:

> **Teach your browser test once. Let Veyra handle the repetition.**

Supporting:

> Create reusable e-commerce tests by demonstrating real workflows. Run
> them with different data and get evidence-backed PASS, FAIL or BLOCKED
> results---without writing automation code.

Long-term:

> Veyra learns your application's behaviour and uses that knowledge to
> continuously improve how it is tested.

# 26. Deferred Innovation Register

Not implementation commitments until explicitly promoted:

-   assisted semantic self-healing;
-   flakiness intelligence;
-   semantic change detection;
-   resource-aware scheduling;
-   learned business invariants;
-   goal-based testing;
-   state-space modelling;
-   missing-transition discovery;
-   combinatorial intelligence;
-   business-aware adversarial testing;
-   Safe Explore Mode;
-   counterfactual debugging;
-   historical defect immunity;
-   ABM diff;
-   behavioural blast radius;
-   risk-based regression;
-   predictive quality;
-   usage-aware testing;
-   Quality Knowledge Coverage;
-   Release Confidence;
-   requirements-to-coverage;
-   pre-implementation quality;
-   executable living documentation;
-   conversational QA;
-   cross-application ontology;
-   confidence decay;
-   semantic maintenance;
-   intelligent test retirement;
-   Quality Recommendation Feed;
-   Quality Agent;
-   Pre-Release Quality Brief.

Promotion requires: customer problem, hypothesis, required data,
smallest experiment, baseline, success metric, safety constraint, cost
ceiling, kill threshold, target release and affected FR/NFR.

# 27. Anti-Patterns

1.  **Bloated enterprise suite:** do not add breadth merely to match
    checklists.
2.  **LLM wrapper around Playwright:** scripts generated by prompts are
    not the moat.
3.  **Autonomous black box:** consequential changes remain inspectable.
4.  **Expensive cloud testing company:** preserve local-first economics.
5.  **Brittle recorder:** Teach must lead toward maintainable semantics.
6.  **Silent healing:** never preserve execution by changing business
    meaning.
7.  **Fake quality metric:** no unsupported "94% quality" score.
8.  **Model worship:** Veyra must improve because application knowledge
    compounds, not only because a new model ships.

# 28. Dependency Map and Recommended Workstreams

``` text
Desktop Foundation
→ Persistence + Project
→ Controlled Browser
→ Teach Recorder
→ Normalized Actions
→ Visual Editor + Assertions
→ Variables
→ Execution Runtime
→ Evidence + Result Classification
→ Run History + Reports
→ Semantic Modules / Minimum ABM
→ Teach Understanding Intelligence
→ Datasets + Commercial Hardening
```

Planning workstreams:

``` text
WS-A Foundation             E01–E05
WS-B Teach & Author         E06–E12
WS-C Execute & Prove        E13–E18
WS-D Intelligence/Governance E19–E20
WS-E Commercial Product     E21–E24
WS-F V1 Execution Expansion E25–E28
WS-G V1 Intelligence        E29–E34
```

# 29. Recommended V0 Vertical Slices

**VS-01 First deterministic test:** Project → Chromium → manual steps →
execute → result.

**VS-02 Teach:** Search + Add to Cart demonstration → normalized actions
→ replay.

**VS-03 Assertions + evidence:** inject `/cart` failure → FAIL +
expected/actual + screenshot + network 500.

**VS-04 Parameterization:** Laptop → `product` → Watch.

**VS-05 Semantic module:** extract Search Product and reuse.

**VS-06 Data-driven:** Laptop/Watch/Backpack independent cases.

**VS-07 BLOCKED:** rename target and verify safe recovery.

**VS-08 Commercial candidate:** installer + onboarding + report +
recovery + security + storage controls.

# 30. Sprint and Task Planning Rules

This PRD intentionally does not invent calendar sprints. Sprints should
be built from dependency-aware tasks after design approval.

Future task format:

``` text
E06.T01 — Implement Teach session lifecycle
Covers: FR06.01, FR06.06, FR06.10
Status: Not Started
```

A sprint should deliver a demonstrable vertical outcome, not
disconnected infrastructure for its own sake.

## Definition of Ready

A task enters active development only when: 1. FR/NFR IDs exist; 2.
expected behaviour is understood; 3. dependencies are known; 4.
acceptance is testable; 5. UI-sensitive design dependency is resolved;
6. security/privacy implications are identified; 7. the task exists in
`TASKS.md`.

## Definition of Done

A task is complete only when: 1. referenced requirements are satisfied;
2. appropriate automated tests pass; 3. relevant manual testing is
documented/performed; 4. known regressions are not hidden; 5. affected
documentation/commands are updated; 6. `TASKS.md` status is updated
immediately; 7. reported/discovered bugs are recorded in `bugs.md`; 8.
the ship report states what shipped, exact manual test steps, expected
behaviour and known limitations.

# 31. Repository Governance

Development must follow `groundrules.md`.

Lifecycle implications: 1. `idea.md` remains the brainstorming source.
2. `PRD.md` is the product-requirements source. 3. Before design
specification, permission is required to create `design-inspiration`;
each mockup requires its own go-ahead. 4. Approved design becomes root
`design_specification.md`. 5. **Only after design approval** is
`TASKS.md` created as the implementation tracker. 6. Every task
references PRD FR/NFR IDs. 7. Once TASKS exists, every finalized feature
decision updates PRD and TASKS in the same turn. 8. No coding starts for
work absent from TASKS. 9. Completed work updates TASKS immediately. 10.
`commands.md` documents every run/test/deploy/troubleshooting/Git
command, including alternate ports. 11. `bugs.md` records every reported
bug by epic and updates status in place. 12. Every shipped task receives
a ship report.

# 32. Open Decisions Before Coding

OD-01 (desktop shell) was resolved by DEC-01 during the E01 bootstrap on
2026-09-15. OD-02 (component system) and OD-03 (visual brand) were resolved by
DEC-21, DEC-22 and `design_specification.md` on 2026-09-15.

**OD-04 Authentication/licensing:** required before broad commercial
release, not the first local vertical slice.

**OD-05 Local model packaging:** benchmark candidate runtimes/models on
target hardware.

**OD-06 Cloud model providers:** remain behind capability gateway.

**OD-07 Evidence retention defaults:** validate privacy/storage
trade-offs.

**OD-08 Pilot reliability thresholds:** establish empirically.

**OD-09 Pricing:** not frozen.

**OD-10 Project export format:** resolved by E02 on 2026-09-15 as the
versioned, checksummed `.veyra-project.json` contract documented in
`docs/Veyra_Project_Backup_Format.md`. JSON was selected over a proprietary
binary container because it is inspectable, versionable and recoverable with
ordinary tools; evidence is embedded as base64 so export remains one portable
file while restore still recreates the required separate evidence tree. A
canonical-payload SHA-256 checksum detects truncation or edits before any
records are committed. A raw SQLite copy was rejected because it couples
exports to internal migrations, and an unchecksummed directory bundle was
rejected because partial copies are difficult to distinguish from valid ones.

These operational decisions do not reopen the completed product grill
unless they materially alter product behaviour.

# 33. Final V0 Definition

> **Veyra V0 is a desktop browser QA product that lets a tester teach an
> e-commerce workflow, convert it into reusable parameterized semantic
> automation, execute it locally with deterministic reliability, and
> automatically produce trustworthy evidence-backed results.**

``` text
Visible:
TEACH → TEST → RESULTS

Foundation:
Semantic Business Knowledge
+ Normalized Test Model
+ Deterministic Execution
+ Evidence
+ Human Governance
```

# 34. Final V1 Definition

> **Veyra V1 is an application-aware QA platform combining browser and
> API testing, multi-browser/parallel/scheduled execution, reuse-first
> AI test creation, evidence-backed diagnostics and an evolving
> Application Behaviour Model that remembers dependencies and
> failures.**

``` text
V0: Teach → Test → Results

V1:
Teach → Understand
Test → Compose
Results → Diagnose
```

# 35. Long-Term North Star

Provide a staging e-commerce URL, safe credentials and an environment
policy and ask:

> **Understand enough of this application to tell me what should be
> tested.**

A mature future Veyra may safely explore permitted areas, identify
entities/actions, build a candidate ABM, propose
workflows/outcomes/tests, request human confirmation, execute approved
tests, identify anomalies, learn from corrections, remember defects and
recommend risk-focused validation after change.

This guides architecture; it is not a V0/V1 promise.

# 36. Non-Negotiable Product Principles

1.  Teach business behaviour, not automation syntax.
2.  ABM is the strategic asset; scripts are execution artifacts.
3.  Reusable modules are business functions with inputs, outputs and
    outcomes.
4.  Actions and assertions are distinct.
5.  PASS, FAIL, BLOCKED and Veyra ERROR are meaningfully different.
6.  Evidence comes before AI explanation.
7.  AI proposes; humans remain sovereign over semantics.
8.  Core functionality works without AI.
9.  Deterministic/local intelligence precedes expensive cloud reasoning.
10. Local-first execution is a product and economic advantage.
11. Better UX is a moat.
12. Never silently change test intent.
13. Never invent quality scores without defensible denominators.
14. Every escaped defect should eventually be capable of strengthening
    application quality memory.
15. Veyra should become more valuable because it remembers what the
    application means, what changed, what failed and what remains
    uncertain---not merely because a newer AI model exists.

# 37. PRD Completion Gate

This PRD is ready as the requirements baseline when V0 scope/exclusions,
nomenclature and architectural decisions are accepted.

The next lifecycle phase is **design**, not coding or TASKS generation.
After design approval, `TASKS.md` translates these requirements into
dependency-aware tasks using `E##.T##`, with explicit FR/NFR references.

# Appendix A --- Traceability

Every future implementation unit must be traceable:

``` text
Task
→ FR/NFR
→ Epic
→ Module
→ Release
→ Acceptance Test
```

No implementation work should exist only as an untracked conversational
instruction.
