# Veyra

<img width="2000" height="2000" alt="veyra_tr_icon" src="https://github.com/user-attachments/assets/3309349e-ae8e-46e9-9e63-eed612e89792" />


Veyra is an **Application Quality Intelligence Platform** that helps manual and low-code QA teams turn demonstrated browser workflows into reusable, maintainable automation.

Instead of treating test scripts as the primary source of QA knowledge, Veyra is designed to learn what application behavior means. Its long-term foundation is an evolving, human-governed **Application Behaviour Model (ABM)** built from demonstrations, assertions, reusable modules, execution evidence, failures, and approved business rules.

## Product vision

Veyra begins with a focused promise:

> Teach a workflow once, turn it into reusable parameterized browser automation, run it repeatedly, and get evidence-backed results without writing automation code.

Over time, Veyra aims to understand more of an application, discover what deserves testing, diagnose failures, remember historical defects, and recommend risk-focused validation while keeping people in control of test meaning.

## Core experience

```text
TEACH → TEST → RESULTS
```

- **Teach:** Demonstrate a workflow in a controlled browser and confirm Veyra's interpretation.
- **Test:** Reuse semantic business modules, variables, assertions, and datasets.
- **Results:** Distinguish application failures from automation blockages and provide supporting evidence.

## V0 scope

Veyra V0 is planned as a local-first desktop browser QA product for manual and low-code testers. Its core capabilities include:

- controlled Chromium execution through Playwright;
- readable Teach/record workflows;
- a visual test editor;
- explicit assertions and checkpoints;
- variables, presets, and data-driven runs;
- reusable semantic modules with inputs, outputs, preconditions, and expected outcomes;
- deterministic `PASS`, `FAIL`, and `BLOCKED` result semantics;
- screenshots, console and network evidence, run history, and developer-ready reports;
- inspectable and optional AI assistance for parameter, module, and intent suggestions.

V0 intentionally excludes API testing, multi-browser execution, scheduling, parallel execution, full self-healing, CI/CD integrations, autonomous exploration, and unsupported quality scores.

## Architecture

The implemented desktop foundation and V0 direction are:

- Electron, React, and TypeScript;
- Node.js application core;
- Playwright as an execution adapter;
- SQLite for structured local persistence;
- filesystem-backed evidence artifacts;
- OS-native secure secret storage;
- isolated worker processes for browser execution and heavier computation;
- deterministic intelligence first, with optional local and cloud model routing.

The central architectural rule is:

```text
User intent / semantic model
            ↓
Normalized execution plan
            ↓
Playwright adapter
            ↓
Browser
```

Veyra stores what automation means rather than persisting the application as Playwright scripts.

## Product principles

1. Teach business behavior, not automation syntax.
2. Treat the ABM as the strategic asset and scripts as execution artifacts.
3. Keep actions and assertions distinct.
4. Put evidence before AI-generated explanations.
5. Let AI propose while humans govern semantic changes.
6. Keep core workflows usable with AI disabled.
7. Prefer deterministic and local intelligence before expensive cloud reasoning.
8. Preserve local-first privacy and economics.
9. Use progressive disclosure to keep the product approachable.
10. Never silently change test intent.

## Roadmap

### V0 — Intelligent desktop browser QA

Prove that manual QA users can teach, parameterize, reuse, execute, and diagnose browser workflows without becoming automation engineers.

### V1 — Application-aware QA automation

Add API testing, Firefox and WebKit, parallel and scheduled execution, team capabilities, reuse-first AI test creation, richer diagnostics, provenance, dependencies, and failure memory.

### Later — Quality intelligence

Explore state and transition coverage, learned invariants, safe exploration, change-aware regression, historical defect immunity, Quality Knowledge Coverage, and release-quality briefs after the underlying application model has been validated.

## Documentation

The main project documents are:

- [`01_Product_Thesis_and_Innovation_Pillars.md`](docs/01_Product_Thesis_and_Innovation_Pillars.md)
- [`02_Competitive_Validation.md`](docs/02_Competitive_Validation.md)
- [`03_Capability_Universe.md`](docs/03_Capability_Universe.md)
- [`04_Product_Architecture.md`](docs/04_Product_Architecture.md)
- [`05_Veyra_V0_Commercial_Product.md`](docs/05_Veyra_V0_Commercial_Product.md)
- [`06_Veyra_V1_Product.md`](docs/06_Veyra_V1_Product.md)
- [`07_Veyra_Innovation_Queue.md`](docs/07_Veyra_Innovation_Queue.md)
- [`Veyra_PRD.md`](docs/Veyra_PRD.md)
- [`idea_browserautomation.md`](docs/idea_browserautomation.md)
- [`design_specification.md`](design_specification.md)
- [`CLAUDE.md`](CLAUDE.md)
- [`tasks.md`](tasks.md)
- [`status_quo.md`](status_quo.md)
- [`commands.md`](commands.md)

The PRD is the implementation requirements baseline; `tasks.md` is the
traceable delivery tracker.

## Run the desktop application

```bash
cd apps/desktop
npm install
npm run smoke:desktop
```

See [`commands.md`](commands.md) for development mode, alternate ports, tests,
packaging and target-host validation commands.

## Status

E01 Desktop Application Foundation and the approved Overview renderer are
implemented. The next logical slice is E02 Local Persistence & Project
Lifecycle; it is not yet approved or in progress.
