# Open-Source Leverage Strategy

**Status:** Product and engineering guidance  
**Reviewed:** 2026-09-16

## Strategic position

Veyra should use open-source software for undifferentiated infrastructure while
keeping its product-defining semantics owned by Veyra.

Veyra should continue to own:

- semantic tests and reusable modules;
- the Teach to Understanding workflow;
- PASS, FAIL, BLOCKED, ERROR and INTERRUPTED reasoning;
- human-approved locator recovery;
- business-readable evidence and reporting;
- project, environment and versioning semantics.

Open-source components should accelerate browser mechanics, state
orchestration, secure local encryption, trace capture, accessibility analysis,
worker infrastructure and development security.

## Recommended leverage map

| Area | Direction | Rationale |
|---|---|---|
| Browser execution | Adopt Playwright | Mature browser control, locators, evidence and tracing; already the approved adapter |
| Trace capture | Adopt Playwright tracing | Avoid rebuilding DOM, network, console and screenshot capture |
| Teach recorder | Adapt Playwright public APIs | Reuse browser events and locator intelligence while retaining Veyra's semantic model |
| Workflow lifecycle | Adopt XState selectively | Strong fit for Teach, approval, execution, pause, retry and interruption states |
| Secret encryption | Adopt Electron `safeStorage` | Built-in OS-backed encryption without an additional native dependency |
| Accessibility checks | Adopt `@axe-core/playwright` when prioritized | Accelerates accessibility assertion coverage |
| CPU-heavy background work | Consider Piscina | Suitable for image processing, evidence compression and report preparation |
| Advanced developer diagnostics | Reuse Playwright Trace Viewer | Provides deep debugging without recreating a trace debugger |
| Repository secret scanning | Adopt Secretlint | Prevents credentials entering source, fixtures and CI artifacts |
| Session replay | Investigate rrweb after V0 | Potentially valuable for failure replay, but privacy- and storage-sensitive |
| Visual workflow canvas | Do not adopt React Flow yet | V0 is an ordered semantic flow, not a general node graph |
| User-facing reports | Keep Veyra-owned | Existing automation reports do not match Veyra's business-readable product language |

## Playwright: browser mechanics, recording and evidence

Playwright should remain an adapter behind Veyra's services. Its public APIs
can provide:

- browser actions and assertions;
- role-oriented locators;
- screenshots and DOM snapshots;
- network and console observation;
- execution traces and Trace Viewer;
- accessibility-tree snapshots.

The recommended recording path is:

```text
Playwright browser event
        ↓
normalized browser action
        ↓
Veyra semantic interpretation
        ↓
human-approved Veyra step
```

Veyra must not persist generated Playwright scripts as its canonical test
model. It should use documented public Playwright APIs and avoid coupling the
product to undocumented Codegen or Inspector internals.

## XState: consequential workflow state

XState is a strong fit where Veyra has explicit, consequential transitions:

```text
idle → starting → recording → paused → understanding → approved
                                      ↘ discarded

queued → launching → running → paused → stopping
                             ↘ passed / failed / blocked / error / interrupted
```

Good candidates include:

- Teach session lifecycle;
- Understanding approval and return-to-teaching;
- run lifecycle and cancellation;
- pause, resume and retry policy;
- worker recovery and invalid-transition prevention.

XState should not replace ordinary React state, forms or simple project
settings.

## Electron safeStorage: E04 secret encryption

Use Electron's asynchronous `safeStorage` API for local secret encryption.
Depending on the operating system, it uses macOS Keychain, Windows DPAPI, or a
Linux secret-service/keyring provider.

Required safeguards:

- use the asynchronous API to avoid blocking and support key rotation;
- detect and reject or prominently warn about the Linux `basic_text` fallback;
- keep plaintext secret values out of the renderer;
- never include secret values in logs, reports, backups or AI requests;
- code-sign macOS releases so Keychain identity remains consistent;
- keep Veyra's own secret-reference, authorization, masking and redaction
  model.

Do not adopt the archived `keytar` project as the primary implementation.

## axe-core: accessibility assertions

`@axe-core/playwright` could support a future Veyra assertion such as “Check
this page for serious accessibility issues.” Results should be converted into
Veyra semantics with a readable rule explanation, affected element, impact,
screenshot and evidence context.

The package is MPL-2.0. Commercial use is possible, but license obligations
must be recorded and reviewed before distribution. This is valuable but does
not need to block the core V0 assertion set.

## Playwright Trace Viewer: advanced diagnostics

Use progressive disclosure:

- the standard Veyra Result screen explains business meaning and evidence;
- Advanced details can open the locally stored Playwright trace;
- developer exports may package or link the trace alongside the Veyra report.

Do not fork or embed the complete Trace Viewer until user evidence shows that
opening a local viewer is insufficient.

## Worker strategy and Piscina

Piscina is appropriate for bounded CPU-heavy tasks such as:

- image comparison;
- evidence compression and processing;
- report generation;
- local-model preprocessing;
- CPU-heavy redaction or analysis.

It should not be the main browser-execution isolation boundary. Browser runs
should use separate child or Electron utility processes so crashes, memory
leaks and hangs cannot destabilize the desktop main process.

```text
Electron main process
├── isolated browser execution processes
│   └── Playwright browser/context ownership
└── optional Piscina worker pool
    ├── image and evidence processing
    ├── redaction/analysis
    └── report preparation
```

## rrweb: defer to a focused replay experiment

rrweb can capture DOM changes and user interactions as a replayable stream and
may eventually improve failure reproduction. It should not be Veyra's initial
Teach recorder because it captures more data than semantic teaching requires
and introduces additional privacy, redaction, storage, canvas and cross-origin
complexity.

Start Teach with Playwright-level action capture. Evaluate rrweb after V0 for
failure-session replay only, with explicit masking and retention policies.

## React Flow: not yet a fit

React Flow is a mature MIT-licensed node-editor library, but the approved V0
editor is an ordered semantic timeline. A graph canvas would introduce layout,
connection, keyboard-accessibility and validation complexity without improving
the current product flow.

Reconsider React Flow only if Veyra adds conditional branches, loops, parallel
paths, shared subflows or visual dependency graphs.

## Reporting and Allure

Allure can be useful as internal engineering tooling or as inspiration for a
future result-event adapter. It should not become Veyra's primary user-facing
report because its information architecture is aimed at automation engineers.

Veyra should own the self-contained HTML and PDF report experience. Later it
may export the same normalized result events to Allure, JUnit or other
developer ecosystems.

## Secretlint: development and CI hygiene

Use Secretlint to scan source, fixtures and CI inputs for accidentally
committed credentials. Its output masks detected secrets and it supports
extensible rules and SARIF output.

Secretlint does not replace runtime redaction. Veyra still needs runtime
protection for:

- exact user-entered secret values;
- tokens, headers, cookies and URL parameters;
- network and console bodies;
- screenshots where feasible;
- reports, logs and AI requests.

## Recommended adoption order

1. **E04:** Electron asynchronous `safeStorage`, Veyra secret references,
   masking and redaction; add Secretlint to development/CI.
2. **E05/E06:** Playwright public APIs for controlled browsing, locator capture
   and normalized action recording.
3. **E06/E07:** XState for Teach and Understanding lifecycle orchestration.
4. **E13:** Isolated browser processes; add Piscina only for bounded CPU work.
5. **E15/E16:** Playwright tracing and Trace Viewer behind Advanced details.
6. **E09 or later:** axe-core accessibility assertions.
7. **E17:** Veyra-owned HTML/PDF reporting with optional ecosystem adapters.
8. **Post-V0 experiment:** rrweb failure-session replay.
9. **Only if flows become graphs:** React Flow.

## Alternatives and trade-offs

### Adopt a complete open-source testing platform

This could accelerate execution, scheduling and reporting, but it would force
Veyra's product into another platform's test model and automation-engineer UX.
The semantic authoring and result model would become harder to differentiate.

### Build every subsystem internally

This maximizes control but spends time recreating browser tracing, encryption,
state orchestration, accessibility engines and worker-pool mechanics. It is not
justified for V0.

### Recommended hybrid

Adopt mature infrastructure through narrow adapters and keep Veyra's domain
model independent. This provides the best balance of build speed, product
control, local-first operation and future replaceability.

## When this recommendation becomes wrong

Revisit the strategy if Veyra becomes primarily a cloud-hosted, multi-tenant
testing service. Server-side browser fleets require different isolation,
queues, secrets, storage, observability and cost controls than a desktop-local
application.

Also revisit individual dependencies when:

- licensing terms change;
- a project becomes unmaintained;
- public APIs no longer meet Veyra's isolation or security requirements;
- evidence shows an adopted component is constraining Veyra's semantic model;
- packaging size, startup time or native build complexity becomes material.

## Reference sources

- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Playwright ARIA snapshots](https://playwright.dev/docs/aria-snapshots)
- [Electron safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage)
- [XState](https://github.com/statelyai/xstate)
- [Piscina](https://github.com/piscinajs/piscina)
- [axe-core Playwright package](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [rrweb](https://rrweb.com/product/record-and-replay)
- [React Flow](https://reactflow.dev/)
- [Allure Playwright integration](https://github.com/allure-framework/allure-js/tree/main/packages/allure-playwright)
- [Secretlint](https://github.com/secretlint/secretlint)

External project health, APIs and licenses were reviewed on 2026-09-16. Verify
versions, compatibility and license obligations again before adoption.
