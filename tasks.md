# Veyra Tasks

Every implementation task traces to `docs/Veyra_PRD.md`; visual work also
traces to `design_specification.md`. Keep each task to one line and keep status
current.

**Status meanings:** Pending = approved and queued next; Not Started = backlog;
Done = completed and verified/documented.

## Pending

None.

## Not Started

### M01 — Desktop Foundation & Persistence

### M02 — Projects, Environments & Secrets

#### E04 — Secrets & Sensitive Data (M02/M14)

### M03 — Controlled Browser & Teach

#### E05 — Controlled Browser

- [x] E05.T01 — Launch the managed Chromium runtime (`P0`; `FR05.01`).
- [x] E05.T02 — Display a headed controlled browser session (`P0`; `FR05.02`).
- [x] E05.T03 — Capture browser/session metadata (`P0`; `FR05.03`).
- [ ] E05.T04 — Isolate browser contexts between runs and projects (`P0`; `FR05.04`).
- [x] E05.T05 — Stop the controlled browser safely (`P0`; `FR05.05`).
- [ ] E05.T06 — Install and manage compatible browser binaries (`P0`; `FR05.06`).

#### E06 — Teach Recorder

- [ ] E06.T01 — Start a Teach session from a project/environment (`P0`; `FR06.01`; `SCR-TEACH`).
- [ ] E06.T02 — Capture meaningful user browser actions (`P0`; `FR06.02`).
- [ ] E06.T03 — Normalize recorded events into semantic action records (`P0`; `FR06.03`).
- [ ] E06.T04 — Render the readable teaching timeline (`P0`; `FR06.04`; `SCR-TEACH`).
- [ ] E06.T05 — Filter recorder noise and duplicate events (`P0`; `FR06.05`).
- [ ] E06.T06 — Pause and resume an active teaching session (`P0`; `FR06.06`).
- [ ] E06.T07 — Remove an incorrect recorded step (`P0`; `FR06.07`).
- [ ] E06.T08 — Insert a manual step while teaching (`P0`; `FR06.08`).
- [ ] E06.T09 — Add a checkpoint during teaching (`P0`; `FR06.09`).
- [ ] E06.T10 — Finish teaching and hand off to review (`P0`; `FR06.10`).

### M04 — Understanding & Semantic Extraction

#### E07 — Teach Completion & Understanding

- [ ] E07.T01 — Generate the post-teaching understanding summary (`P0`; `FR07.01`; `SCR-UNDERSTANDING`).
- [ ] E07.T02 — Express inferred meaning in business language (`P0`; `FR07.02`).
- [ ] E07.T03 — Approve understood semantics before saving (`P0`; `FR07.03`).
- [ ] E07.T04 — Edit understood semantics before saving (`P0`; `FR07.04`).
- [ ] E07.T05 — Return to teaching without losing the draft (`P0`; `FR07.05`).
- [ ] E07.T06 — Propose literals as parameter candidates (`P0`; `FR07.06`).
- [ ] E07.T07 — Propose reusable module candidates (`P1`; `FR07.07`).
- [ ] E07.T08 — Preserve proposal provenance and confidence (`P1`; `FR07.08`).

### M05 — Visual Test Authoring

#### E08 — Visual Test Editor

- [ ] E08.T01 — Render a test as an ordered semantic flow (`P0`; `FR08.01`; `SCR-EDITOR`).
- [ ] E08.T02 — Show test identity, draft and version context (`P0`; `FR08.02`).
- [ ] E08.T03 — Author and display browser action steps (`P0`; `FR08.03`).
- [ ] E08.T04 — Author and display visually distinct validation steps (`P0`; `FR08.04`).
- [ ] E08.T05 — Insert and configure reusable module steps (`P0`; `FR08.05`).
- [ ] E08.T06 — Reorder steps by pointer and keyboard (`P0`; `FR08.06`).
- [ ] E08.T07 — Delete steps with dependency-safe behavior (`P0`; `FR08.07`).
- [ ] E08.T08 — Edit step targets and values (`P0`; `FR08.08`).
- [ ] E08.T09 — Duplicate steps deterministically (`P0`; `FR08.09`).
- [ ] E08.T10 — Save immutable test versions (`P0`; `FR08.10`).
- [ ] E08.T11 — Expose raw implementation in an advanced view (`P1`; `FR08.11`).
- [ ] E08.T12 — Add and manage test tags (`P1`; `FR08.12`).

### M06 — Variables, Presets & Datasets

#### E10 — Variables & Presets

- [ ] E10.T01 — Create typed variables (`P0`; `FR10.01`).
- [ ] E10.T02 — Convert a recorded literal into a variable (`P0`; `FR10.02`).
- [ ] E10.T03 — Resolve variable references in tests and modules (`P0`; `FR10.03`).
- [ ] E10.T04 — Enforce variable scopes (`P0`; `FR10.04`).
- [ ] E10.T05 — Bind module inputs (`P0`; `FR10.05`).
- [ ] E10.T06 — Capture and expose step/module outputs (`P0`; `FR10.06`).
- [ ] E10.T07 — Save reusable variable presets (`P1`; `FR10.07`).
- [ ] E10.T08 — Validate missing, invalid and conflicting variable values (`P1`; `FR10.08`).

#### E11 — Datasets & Data-Driven Runs

- [ ] E11.T01 — Create a dataset for a test (`P0`; `FR11.01`; `SCR-RUN-CONFIG`).
- [ ] E11.T02 — Add, edit and remove dataset rows (`P0`; `FR11.02`).
- [ ] E11.T03 — Bind dataset columns to test inputs (`P0`; `FR11.03`).
- [ ] E11.T04 — Expand each dataset row into one execution case (`P0`; `FR11.04`).
- [ ] E11.T05 — Preserve an independent result per dataset row (`P0`; `FR11.05`).
- [ ] E11.T06 — Import and preview CSV data (`P1`; `FR11.06`).
- [ ] E11.T07 — Validate dataset schema, types and required values (`P0`; `FR11.07`).

### M07 — Semantic Modules / Minimum ABM

#### E12 — Semantic Modules / Minimum ABM

- [ ] E12.T01 — Create a reusable semantic module (`P0`; `FR12.01`).
- [ ] E12.T02 — Store and edit module intent (`P0`; `FR12.02`).
- [ ] E12.T03 — Define module inputs (`P0`; `FR12.03`).
- [ ] E12.T04 — Define module outputs (`P0`; `FR12.04`).
- [ ] E12.T05 — Define module preconditions (`P0`; `FR12.05`).
- [ ] E12.T06 — Define module expected outcomes (`P0`; `FR12.06`).
- [ ] E12.T07 — Store module browser implementation behind semantics (`P0`; `FR12.07`).
- [ ] E12.T08 — List dependent tests and modules (`P0`; `FR12.08`).
- [ ] E12.T09 — Show edit impact before consequential module changes (`P0`; `FR12.09`).
- [ ] E12.T10 — Version modules immutably (`P0`; `FR12.10`).
- [ ] E12.T11 — Reuse a module across tests (`P0`; `FR12.11`).
- [ ] E12.T12 — Link module evidence and verification context (`P1`; `FR12.12`).

### M08 — Execution Engine

#### E13 — Execution Compiler & Runtime

- [ ] E13.T01 — Compile semantic test definitions into executable plans (`P0`; `FR13.01`).
- [ ] E13.T02 — Execute plans through the Playwright adapter (`P0`; `FR13.02`).
- [ ] E13.T03 — Run with a visible browser (`P0`; `FR13.03`).
- [ ] E13.T04 — Run headlessly with equivalent evidence (`P0`; `FR13.04`).
- [ ] E13.T05 — Stream live case and step progress (`P0`; `FR13.05`; `SCR-LIVE-RUN`).
- [ ] E13.T06 — Stop execution and persist an interrupted result (`P0`; `FR13.06`).
- [ ] E13.T07 — Pause and resume supported execution (`P1`; `FR13.07`).
- [ ] E13.T08 — Enforce configured step and run timeouts (`P0`; `FR13.08`).
- [ ] E13.T09 — Retry eligible blockages within policy (`P1`; `FR13.09`).
- [ ] E13.T10 — Snapshot test/module/environment versions at run start (`P0`; `FR13.10`).
- [ ] E13.T11 — Expand datasets deterministically into queued cases (`P0`; `FR13.11`).

### M09 — Assertions & Result Semantics

#### E09 — Assertions & Checkpoints

- [ ] E09.T01 — Implement Verify text assertion (`P0`; `FR09.01`).
- [ ] E09.T02 — Implement Verify visibility assertion (`P0`; `FR09.02`).
- [ ] E09.T03 — Implement Verify URL assertion (`P0`; `FR09.03`).
- [ ] E09.T04 — Implement Verify value assertion (`P0`; `FR09.04`).
- [ ] E09.T05 — Implement Verify count assertion (`P0`; `FR09.05`).
- [ ] E09.T06 — Capture expected and actual assertion values (`P0`; `FR09.06`).
- [ ] E09.T07 — Render assertions in readable business language (`P0`; `FR09.07`).
- [ ] E09.T08 — Add assertions manually in the editor (`P0`; `FR09.08`).
- [ ] E09.T09 — Classify assertion mismatches as application FAIL (`P0`; `FR09.09`).

#### E14 — Result Classification

- [ ] E14.T01 — Classify and explain PASS results (`P0`; `FR14.01`).
- [ ] E14.T02 — Classify application contradictions as FAIL (`P0`; `FR14.02`).
- [ ] E14.T03 — Classify automation uncertainty as BLOCKED (`P0`; `FR14.03`).
- [ ] E14.T04 — Classify Veyra/runtime faults as ERROR (`P0`; `FR14.04`).
- [ ] E14.T05 — Classify stopped/incomplete runs as INTERRUPTED (`P0`; `FR14.05`).
- [ ] E14.T06 — Persist machine-readable result reason codes (`P0`; `FR14.06`).
- [ ] E14.T07 — Generate plain-language result explanations (`P0`; `FR14.07`; `SCR-RESULT`).

### M10 — Evidence & Diagnostics

#### E15 — Evidence Capture

- [ ] E15.T01 — Capture screenshots at required run moments (`P0`; `FR15.01`).
- [ ] E15.T02 — Record the relevant URL with evidence (`P0`; `FR15.02`).
- [ ] E15.T03 — Record synchronized evidence timestamps (`P0`; `FR15.03`).
- [ ] E15.T04 — Attach readable action context to evidence (`P0`; `FR15.04`).
- [ ] E15.T05 — Attach expected/actual assertion context (`P0`; `FR15.05`).
- [ ] E15.T06 — Capture bounded console evidence (`P0`; `FR15.06`).
- [ ] E15.T07 — Capture bounded network evidence (`P0`; `FR15.07`).
- [ ] E15.T08 — Capture advanced DOM/target details (`P0`; `FR15.08`).
- [ ] E15.T09 — Link evidence to cases and timeline steps (`P0`; `FR15.09`).
- [ ] E15.T10 — Lazy-load large evidence without layout shifts (`P1`; `FR15.10`).
- [ ] E15.T11 — Capture a trace on configured failures (`P1`; `FR15.11`).

### M11 — Results, History & Reporting

#### E16 — Results & Run History

- [ ] E16.T01 — Build the run result summary (`P0`; `FR16.01`; `SCR-RESULT`).
- [ ] E16.T02 — Build the case/step result timeline (`P0`; `FR16.02`).
- [ ] E16.T03 — Show expected, observed and correlated failure detail (`P0`; `FR16.03`).
- [ ] E16.T04 — Show blockage reason and recovery detail (`P0`; `FR16.04`).
- [ ] E16.T05 — Build immutable run history (`P0`; `FR16.05`).
- [ ] E16.T06 — Filter and search run history (`P1`; `FR16.06`).
- [ ] E16.T07 — Roll up dataset cases without losing individual results (`P0`; `FR16.07`).
- [ ] E16.T08 — Show the exact test/module/environment version context (`P0`; `FR16.08`).

#### E17 — Developer Reports & Export

- [ ] E17.T01 — Export a self-contained HTML developer report (`P0`; `FR17.01`).
- [ ] E17.T02 — Export a readable PDF developer report (`P0`; `FR17.02`).
- [ ] E17.T03 — Include required result, reproduction and evidence content (`P0`; `FR17.03`).
- [ ] E17.T04 — Keep exported reports readable outside Veyra (`P0`; `FR17.04`).
- [ ] E17.T05 — Apply report redaction policy (`P0`; `FR17.05`).
- [ ] E17.T06 — Provide structured machine-readable export (`P2`; `FR17.06`).

### M12 — Locator Intelligence & Maintenance

#### E18 — Smart Locators & Assisted Recovery

- [ ] E18.T01 — Resolve targets through a multi-signal locator model (`P0`; `FR18.01`).
- [ ] E18.T02 — Show readable target identity (`P0`; `FR18.02`).
- [ ] E18.T03 — Rank candidate target matches deterministically (`P0`; `FR18.03`).
- [ ] E18.T04 — Surface uncertainty instead of hiding it (`P0`; `FR18.04`).
- [ ] E18.T05 — Allow an approved candidate to be used once (`P0`; `FR18.05`).
- [ ] E18.T06 — Edit and intentionally save a target (`P0`; `FR18.06`).
- [ ] E18.T07 — Block rather than guess below confidence policy (`P0`; `FR18.07`).
- [ ] E18.T08 — Expose developer locator details progressively (`P1`; `FR18.08`).
- [ ] E18.T09 — Add governed persistent self-healing after V0 (`P2`; `FR18.09`).

### M13 — AI/Intelligence & Governance

#### E19 — V0 Intelligence Assistance

- [ ] E19.T01 — Suggest parameter candidates from teaching evidence (`P0`; `FR19.01`).
- [ ] E19.T02 — Suggest readable action descriptions (`P0`; `FR19.02`).
- [ ] E19.T03 — Suggest business intent with provenance (`P1`; `FR19.03`).
- [ ] E19.T04 — Suggest module boundaries with provenance (`P1`; `FR19.04`).
- [ ] E19.T05 — Route intelligence through a capability gateway (`P0`; `FR19.05`).
- [ ] E19.T06 — Choose the lowest-cost reliable intelligence tier (`P0`; `FR19.06`).
- [ ] E19.T07 — Run intelligence asynchronously without blocking core work (`P0`; `FR19.07`).
- [ ] E19.T08 — Preserve deterministic authoring with AI disabled (`P0`; `FR19.08`).

#### E20 — Human Governance & Manual Fallback

- [ ] E20.T01 — Mark intelligence output as a proposal (`P0`; `FR20.01`).
- [ ] E20.T02 — Accept a proposal explicitly (`P0`; `FR20.02`).
- [ ] E20.T03 — Edit a proposal before acceptance (`P0`; `FR20.03`).
- [ ] E20.T04 — Reject a proposal without side effects (`P0`; `FR20.04`).
- [ ] E20.T05 — Provide a complete manual fallback path (`P0`; `FR20.05`).
- [ ] E20.T06 — Prevent silent consequential semantic changes (`P0`; `FR20.06`).
- [ ] E20.T07 — Undo accepted/edited governance actions (`P1`; `FR20.07`).
- [ ] E20.T08 — Retain proposal and decision provenance (`P1`; `FR20.08`).

### M14 — Security, Privacy & Data Control

#### E23 — Privacy, Security & Telemetry

- [ ] E23.T01 — Implement explicit telemetry policy and controls (`P0`; `FR23.01`).
- [ ] E23.T02 — Implement evidence capture/retention policy (`P0`; `FR23.02`).
- [ ] E23.T03 — Govern local AI processing (`P0`; `FR23.03`).
- [ ] E23.T04 — Require explicit cloud AI policy (`P0`; `FR23.04`).
- [ ] E23.T05 — Apply one tested redaction pipeline across egress (`P0`; `FR23.05`).
- [ ] E23.T06 — Delete project data and evidence intentionally (`P0`; `FR23.06`).
- [ ] E23.T07 — Require secure transport for external services (`P0`; `FR23.07`).
- [ ] E23.T08 — Publish clear privacy and data-handling documentation (`P0`; `FR23.08`).

### M15 — Onboarding & Commercial Product

#### E21 — Onboarding & Commerce Fixture

- [ ] E21.T01 — Build the first-run welcome experience (`P0`; `FR21.01`).
- [ ] E21.T02 — Keep required initial setup minimal (`P0`; `FR21.02`).
- [ ] E21.T03 — Build the interactive teaching tutorial (`P1`; `FR21.03`).
- [ ] E21.T04 — Ship the internal commerce quality fixture (`P0`; `FR21.04`).
- [ ] E21.T05 — Add controlled fixture failure injection (`P1`; `FR21.05`).
- [ ] E21.T06 — Deliver the Teach-to-evidence onboarding magic moment (`P0`; `FR21.06`).
- [ ] E21.T07 — Capture privacy-safe activation telemetry (`P1`; `FR21.07`).

#### E22 — Commercial Hardening

- [ ] E22.T01 — Produce signed, reliable installers (`P0`; `FR22.01`).
- [ ] E22.T02 — Implement a safe auto-update strategy (`P1`; `FR22.02`).
- [ ] E22.T03 — Verify runtime/browser compatibility (`P0`; `FR22.03`).
- [ ] E22.T04 — Define and implement the entitlement boundary (`P1`; `FR22.04`).
- [ ] E22.T05 — Define truthful offline behavior (`P1`; `FR22.05`).
- [ ] E22.T06 — Publish user and product documentation (`P0`; `FR22.06`).
- [ ] E22.T07 — Provide an in-product support path (`P0`; `FR22.07`).
- [ ] E22.T08 — Implement storage inspection and cleanup (`P0`; `FR22.08`).
- [ ] E22.T09 — Provide commercial-grade backup and restore (`P1`; `FR22.09`).

### Cross-cutting V0

#### E24 — Observability, Recovery & Supportability

- [ ] E24.T01 — Emit structured, redacted application logs (`P0`; `FR24.01`).
- [ ] E24.T02 — Capture isolated worker diagnostics (`P0`; `FR24.02`).
- [ ] E24.T03 — Recover safely after application/worker crashes (`P0`; `FR24.03`).
- [ ] E24.T04 — Persist and explain interrupted execution state (`P0`; `FR24.04`).
- [ ] E24.T05 — Export a redacted diagnostic support bundle (`P1`; `FR24.05`).
- [ ] E24.T06 — Surface application, schema, browser and runtime versions (`P0`; `FR24.06`).

### M16 — API Testing (V1)

#### E25 — API Testing

- [ ] E25.T01 — Execute supported HTTP methods (`P2`; `FR25.01`).
- [ ] E25.T02 — Configure URL, headers, query, body and authentication (`P2`; `FR25.02`).
- [ ] E25.T03 — Resolve variables in API requests (`P2`; `FR25.03`).
- [ ] E25.T04 — Extract response values into outputs (`P2`; `FR25.04`).
- [ ] E25.T05 — Assert API status, headers, body and schema (`P2`; `FR25.05`).
- [ ] E25.T06 — Compose browser and API steps in one test (`P2`; `FR25.06`).
- [ ] E25.T07 — Enrich authoring from OpenAPI descriptions (`P2`; `FR25.07`).

### M17 — Multi-Browser, Parallel & Scheduling (V1)

#### E26 — Multi-Browser Execution

- [ ] E26.T01 — Execute tests in Firefox (`P2`; `FR26.01`).
- [ ] E26.T02 — Execute tests in WebKit (`P2`; `FR26.02`).
- [ ] E26.T03 — Configure browser execution matrices (`P2`; `FR26.03`).
- [ ] E26.T04 — Preserve independent per-browser results (`P2`; `FR26.04`).

#### E27 — Parallel Execution

- [ ] E27.T01 — Implement a bounded execution worker pool (`P2`; `FR27.01`).
- [ ] E27.T02 — Configure project/run parallelism (`P2`; `FR27.02`).
- [ ] E27.T03 — Isolate state across parallel workers (`P2`; `FR27.03`).
- [ ] E27.T04 — Aggregate parallel progress and results deterministically (`P2`; `FR27.04`).
- [ ] E27.T05 — Warn when requested parallelism exceeds local resources (`P2`; `FR27.05`).

#### E28 — Scheduling

- [ ] E28.T01 — Create and manage schedules (`P2`; `FR28.01`).
- [ ] E28.T02 — Configure scheduled test, environment, data and browser (`P2`; `FR28.02`).
- [ ] E28.T03 — Explain and enforce local scheduling semantics (`P2`; `FR28.03`).
- [ ] E28.T04 — Preserve scheduled-run history (`P2`; `FR28.04`).
- [ ] E28.T05 — Notify users of scheduled-run outcomes (`P2`; `FR28.05`).

### M18 — Deeper ABM & Quality Memory (V1)

#### E29 — Expanded ABM

- [ ] E29.T01 — Model approved business entities (`P2`; `FR29.01`).
- [ ] E29.T02 — Model approved business actions (`P2`; `FR29.02`).
- [ ] E29.T03 — Model dependencies between application behaviors (`P2`; `FR29.03`).
- [ ] E29.T04 — Retain ABM provenance and confidence (`P2`; `FR29.04`).
- [ ] E29.T05 — Govern ABM proposal/approval lifecycle (`P2`; `FR29.05`).
- [ ] E29.T06 — Track when knowledge was last verified (`P2`; `FR29.06`).
- [ ] E29.T07 — Build the application knowledge view (`P2`; `FR29.07`).
- [ ] E29.T08 — Model behavior preconditions (`P2`; `FR29.08`).

### M19 — AI Test Creation & Test Families (V1)

#### E30 — Reuse-First AI Test Creation

- [ ] E30.T01 — Accept a natural-language test intent (`P2`; `FR30.01`).
- [ ] E30.T02 — Search trusted existing behaviors before generation (`P2`; `FR30.02`).
- [ ] E30.T03 — Generate only missing behavior gaps (`P2`; `FR30.03`).
- [ ] E30.T04 — Mark generated content and its provenance (`P2`; `FR30.04`).
- [ ] E30.T05 — Require review before generated tests become trusted (`P2`; `FR30.05`).
- [ ] E30.T06 — Prevent silent trust of generated tests (`P2`; `FR30.06`).

#### E31 — Test Families & Candidate Assertions

- [ ] E31.T01 — Generate governed test families from approved seeds (`P2`; `FR31.01`).
- [ ] E31.T02 — Let users selectively add family members (`P2`; `FR31.02`).
- [ ] E31.T03 — Suggest candidate invariants/assertions (`P2`; `FR31.03`).
- [ ] E31.T04 — Require explicit assertion approval (`P2`; `FR31.04`).
- [ ] E31.T05 — Prevent known bug baselines from becoming assertions (`P2`; `FR31.05`).

### M10/M18 — Diagnostics & Failure Memory (V1)

#### E32 — Diagnostics & Failure Memory

- [ ] E32.T01 — Correlate UI, network, console and version evidence (`P2`; `FR32.01`).
- [ ] E32.T02 — Suggest the likely failure area (`P2`; `FR32.02`).
- [ ] E32.T03 — Show diagnostic confidence and supporting evidence (`P2`; `FR32.03`).
- [ ] E32.T04 — Compare a failure with the last success (`P2`; `FR32.04`).
- [ ] E32.T05 — Generate a safe reproduction path (`P2`; `FR32.05`).
- [ ] E32.T06 — Identify recurring failure patterns (`P2`; `FR32.06`).
- [ ] E32.T07 — Recommend governed memory updates (`P2`; `FR32.07`).

### M20 — Team Workspace & Sync (V1)

#### E33 — Team Workspace & Sync

- [ ] E33.T01 — Create and join a team workspace (`P2`; `FR33.01`).
- [ ] E33.T02 — Sync approved shared project knowledge (`P2`; `FR33.02`).
- [ ] E33.T03 — Enforce workspace roles and permissions (`P2`; `FR33.03`).
- [ ] E33.T04 — Resolve concurrent edit conflicts safely (`P2`; `FR33.04`).
- [ ] E33.T05 — Sync evidence selectively under policy (`P2`; `FR33.05`).

### M13/M14 — AI Modes, Routing & Cost Governance (V1)

#### E34 — AI Modes, Routing & Cost Governance

- [ ] E34.T01 — Implement Local Only intelligence mode (`P2`; `FR34.01`).
- [ ] E34.T02 — Implement Hybrid intelligence mode (`P2`; `FR34.02`).
- [ ] E34.T03 — Implement Cloud Enhanced intelligence mode (`P2`; `FR34.03`).
- [ ] E34.T04 — Apply mode-specific redaction and consent (`P2`; `FR34.04`).
- [ ] E34.T05 — Show intelligence usage and estimated cost (`P2`; `FR34.05`).
- [ ] E34.T06 — Keep model vendors behind replaceable adapters (`P2`; `FR34.06`).

### Cross-cutting NFR verification

- [ ] NFR90.T01 — Validate that primary users never need automation-engineering jargon (`NFR90.01`).
- [ ] NFR90.T02 — Validate progressive disclosure across all primary screens (`NFR90.02`).
- [ ] NFR90.T03 — Complete keyboard, contrast, label, zoom and status accessibility audit (`NFR90.03`).
- [ ] NFR90.T04 — Prove UI responsiveness during execution and intelligence work (`NFR90.04`).
- [ ] NFR90.T05 — Benchmark local projects with hundreds of test definitions (`NFR90.05`).
- [ ] NFR90.T06 — Run persistence, recorder, execution, cancellation and evidence reliability suites (`NFR90.06`).
- [ ] NFR90.T07 — Complete security review with no critical leakage/insecure transport (`NFR90.07`).
- [ ] NFR90.T08 — Validate explicit, minimized, policy-controlled cloud transmission (`NFR90.08`).
- [ ] NFR90.T09 — Audit provenance for consequential intelligence changes (`NFR90.09`).
- [ ] NFR90.T10 — Verify adapters/providers/storage remain separated from product semantics (`NFR90.10`).
- [ ] NFR90.T11 — Unit-test core domain logic outside desktop/browser integration (`NFR90.11`).
- [ ] NFR90.T12 — Verify product failures produce supportable diagnostic context (`NFR90.12`).
- [ ] NFR90.T13 — Verify portable domain data and documented export behavior (`NFR90.13`).
- [ ] NFR90.T14 — Verify ordinary local runs require no cloud-browser spend (`NFR90.14`).
- [ ] NFR90.T15 — Benchmark model quality/cost routing against policy (`NFR90.15`).

### V0 release-level acceptance

- [ ] V0A.T01 — Pass the parameterized Product test scenario (`V0-AS01`).
- [ ] V0A.T02 — Pass the application-failure classification/evidence scenario (`V0-AS02`).
- [ ] V0A.T03 — Pass the locator BLOCKED safety scenario (`V0-AS03`).
- [ ] V0A.T04 — Pass the semantic module reuse scenario (`V0-AS04`).
- [ ] V0A.T05 — Pass the data-driven independent-case scenario (`V0-AS05`).
- [ ] V0A.T06 — Pass the complete AI-disabled authoring scenario (`V0-AS06`).
- [ ] V0A.T07 — Pass the secret storage/redaction scenario (`V0-AS07`).
- [ ] V0A.T08 — Pass the worker-crash recovery scenario (`V0-AS08`).
- [ ] V0A.T09 — Pass the standalone developer-report scenario (`V0-AS09`).
- [ ] V0A.T10 — Pass the complete manual-authoring fallback scenario (`V0-AS10`).

### V0 release gates

- [ ] RG.T01 — Establish and pass the empirical reliability/false-BLOCKED threshold (`RG-V0.1`).
- [ ] RG.T02 — Validate parameterized reusable test creation with representative manual QA users (`RG-V0.2`).
- [ ] RG.T03 — Validate Teach, Understanding and modules as material differentiation (`RG-V0.3`).
- [ ] RG.T04 — Validate failure evidence usefulness with QA and developers (`RG-V0.4`).
- [ ] RG.T05 — Pass the no-critical-secret-leakage/insecure-default security gate (`RG-V0.5`).
- [ ] RG.T06 — Pass installer, migration, browser-runtime and recovery supportability (`RG-V0.6`).
- [ ] RG.T07 — Pass normal-usage cloud browser/model cost controls (`RG-V0.7`).

## Done

- [x] E04.T07 — Enforced evidence-write rejection and OS window capture protection during password-masked secret entry (`P1`; `FR04.07`).
- [x] E04.T06 — Established the production-owned AI preparation seam that never resolves references and redacts accidental known values (`P0`; `FR04.06`).
- [x] E04.T05 — Established the production-owned raw, URL-encoded and base64 redaction seam required by structured logs and reports (`P0`; `FR04.05`).
- [x] E04.T04 — Added status-only masked secret entry, replacement and clearing without a reveal/copy path (`P0`; `FR04.04`).
- [x] E04.T03 — Added validated logical secret tokens and a main/worker-only authorized runtime resolver (`P0`; `FR04.03`).
- [x] E04.T02 — Added fail-closed OS-backed encrypted secret value storage outside SQLite and backups (`P0`; `FR04.02`).
- [x] E04.T01 — Added project-scoped named secret-reference metadata, value-free typed IPC/UI, and portable value-free backup/restore (`P0`; `FR04.01`).
- [x] B01 — Added a final irreversible-action confirmation modal after exact-name project deletion confirmation (`FR03.06`; `design_specification.md`).
- [x] B02 — Reactivated an archived project when its valid backup is restored into the same workspace while retaining active-duplicate protection (`FR02.06`; `FR03.06`).
- [x] D09 — Closed the E03 fixed-diff design/spec review: truthful persisted Overview details, first-project/loading/error states, status icon-labels, modal focus containment and mutation busy states (`FR03.01`–`FR03.06`; `SCR-OVERVIEW`; `design_specification.md`).
- [x] E03.T01 — Created projects with required identity and a default active environment (`P0`; `FR03.01`).
- [x] E03.T02 — Added safe project name and application URL editing (`P0`; `FR03.02`).
- [x] E03.T03 — Added named multi-environment creation and active-environment selection (`P0`; `FR03.03`).
- [x] E03.T04 — Added environment-scoped non-secret variable management and portable backup (`P0`; `FR03.04`).
- [x] E03.T05 — Connected the project switcher and Overview to persisted tests, modules, recent outcomes, last-run and seven-day health data, including empty/loading/error states (`P0`; `FR03.05`; `SCR-OVERVIEW`).
- [x] E03.T06 — Added two-step archive and exact-name permanent deletion (`P1`; `FR03.06`).
- [x] D08 — Corrected icon-to-label spacing in the Data screen Restore project, Refresh, Export and Clean Evidence actions (`DEC-21`; `design_specification.md`; `design-qa.md`).
- [x] D07 — Simplified E02 testing to one repository-root command with visible root-level test artifacts and plain-language output (`FR02.01`–`FR02.07`; `commands.md`).
- [x] E02.T01 — Persisted structured project data locally in versioned SQLite storage (`P0`; `FR02.01`).
- [x] E02.T02 — Stored screenshots/traces/reports in a separate evidence filesystem tree (`P0`; `FR02.02`).
- [x] E02.T03 — Implemented transactional versioned migrations with preserved-database failure handling (`P0`; `FR02.03`).
- [x] E02.T04 — Preserved completed-run meaning with immutable definition snapshots (`P0`; `FR02.04`).
- [x] E02.T05 — Exported complete checksummed project backups in the documented Veyra format (`P1`; `FR02.05`).
- [x] E02.T06 — Restored validated backups transactionally with partial-evidence cleanup (`P1`; `FR02.06`).
- [x] E02.T07 — Added local storage inspection, native backup/restore and two-step old-evidence cleanup in Data (`P1`; `FR02.07`).
- [x] D06 — Replaced the generic sidebar lockup with the approved transparent Veyra mark and exact rectlogo-derived wordmark artwork (`DEC-23`, `SCR-OVERVIEW`; `design_specification.md`; `design-qa.md`).
- [x] D05 — Applied and package-verified the approved Veyra mark for the development window, macOS bundle/DMG and Windows executable/installer (`DEC-22`, `FR22.01`; `design_specification.md`).
- [x] E01.T01 — Delivered and restart-tested the installable Electron desktop shell (`P0`; `DEC-01`, `FR01.01`).
- [x] E01.T02 — Enforced sandboxed, context-isolated, Node-free renderer execution (`P0`; `DEC-01`, `FR01.02`).
- [x] E01.T03 — Added the explicit typed preload/main API and event boundary (`P0`; `DEC-01`, `FR01.03`).
- [x] E01.T04 — Implemented single-instance window lifecycle, bounded cleanup and interrupted-operation recovery (`P0`; `DEC-01`, `FR01.04`).
- [x] E01.T05 — Produced macOS arm64/x64 and Windows x64 installer artifacts with native CI packaging and documented unsigned/runtime-validation limits (`P1`; `DEC-01`, `FR01.05`).
- [x] D04 — Implemented and verified the approved Veyra tokens, accessible primitives, global desktop shell and Overview reference screen (`DEC-21`, `NFR90.01`–`NFR90.03`; `design_specification.md`; `design-qa.md`).
- [x] D01 — Compared Veyra V0/V1 with Spur and prepared the seven-screen Claude Design brief (`DEC-17`; `docs/Spur_Parity_and_Claude_Design_Prompt.md`).
- [x] D02 — Reviewed and approved the seven-screen `Veyra Prototype.dc.html` direction as the final Veyra product language (`DEC-21`).
- [x] D03 — Formalized the approved prototype and design-system captures in root `design_specification.md` (`DEC-21`, `NFR90.01`–`NFR90.03`).
- [x] P01 — Converted all 34 PRD epics and 253 functional requirements into this module/epic implementation tracker, with NFR, acceptance and release-gate verification tasks.
