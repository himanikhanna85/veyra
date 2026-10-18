# Veyra — Product Idea

## What Veyra is

Veyra is an **Application Quality Intelligence Platform** for manual and
low-code QA teams. It helps a tester demonstrate an important browser workflow,
define what the application is expected to do, and turn that knowledge into
reusable automation that can run repeatedly without requiring the tester to
write code.

The simple product promise is:

> Teach Veyra a business workflow once. Confirm what success means. Reuse and
> run it with different approved data, and receive evidence-backed results.

Veyra is not intended to be an AI agent that reasons through every browser step
on every test run. AI is used selectively to understand, structure, explain,
and maintain automation. Normal approved regression execution should be
deterministic and should require no LLM inference wherever technically
feasible.

## The problem

Manual testers understand applications in business terms: who can perform an
operation, which data is valid, what must happen next, and what counts as a
defect. Conventional automation often asks them to translate that knowledge
into selectors, scripts, framework structure, and execution infrastructure.

Record-and-playback products can reduce initial authoring work, but a sequence
of successful clicks does not establish that the intended business outcome was
correct. Generated scripts can also become brittle, duplicated, difficult to
govern, and expensive to maintain.

Veyra aims to preserve the tester's knowledge—not merely the recorded browser
mechanics—and use it to create automation that remains understandable,
reviewable, reusable, and economical to execute.

## Who it is for

Veyra initially serves:

- manual and low-code QA testers who own recurring browser regression checks;
- QA leads who need reliable, maintainable coverage without making every
  tester an automation engineer;
- developers and release owners who need evidence that distinguishes an
  application defect from bad data, an unavailable environment, or an
  automation blockage.

The initial opportunity is strongest in teams that repeatedly test a bounded
set of business-critical SaaS, commerce, CMS, or enterprise workflows and
currently rely on checklists, spreadsheets, screenshots, or developer-owned
automation.

## The core experience

Veyra's product loop is:

```text
TEACH → TEST → RESULTS
```

### Teach

A tester demonstrates a real workflow in a controlled browser. Veyra captures
browser actions, navigation, DOM and accessibility context, target evidence,
and relevant visual or execution state. The tester then reviews Veyra's
interpretation, identifies parameters, and explicitly confirms the expected
outcomes.

### Test

The approved workflow becomes structured, reusable automation. Inputs can be
bound to controlled datasets, and common business operations can be reused
across journeys. The execution engine compiles this meaning into deterministic
browser operations rather than asking an LLM to rediscover every step.

### Results

Veyra reports what happened with inspectable evidence. It distinguishes a
verified product failure from an automation or environment blockage and does
not treat a completed sequence of actions as proof that the business outcome
was correct.

## The four levels of truth

Veyra keeps four kinds of knowledge separate:

1. **Observed behaviour** — what the tester or browser actually demonstrated.
2. **Confirmed expectation** — what an authorized person says should happen.
3. **Suggested possibility** — a scenario, parameter, or interpretation
   proposed by AI or deterministic analysis.
4. **Approved automation** — the versioned workflow and assertions authorized
   for execution.

This separation is fundamental. Veyra must never silently turn an observation
or AI hypothesis into an authoritative business rule.

## The product architecture in one sentence

**Capture once → understand once → structure once → approve once → execute
deterministically at scale.**

Browser instrumentation captures evidence. Structured models represent
actions, parameters, assertions, and dependencies. AI helps only where meaning
or ambiguity requires it. A deterministic runner executes approved tests and
collects evidence.

MCP may expose browser or application capabilities to intelligence services,
but it is not assumed to be the recording mechanism itself. The capture and
execution architecture may combine browser instrumentation, Chromium DevTools
Protocol, Playwright-compatible adapters, and narrowly scoped AI services.

## The Application Behaviour Model

Over time, approved workflows form an **Application Behaviour Model (ABM)**: a
human-governed body of knowledge connecting pages, operations, parameters,
preconditions, expected outcomes, dependencies, execution history, and known
failures.

The ABM is a long-term strategy, not a claim that Veyra understands an entire
application after one demonstration. It earns value only if it measurably
improves reuse, maintenance, diagnosis, coverage decisions, or prevention of
repeat defects.

## What makes Veyra different

Recording, natural-language authoring, reusable steps, self-healing, local
execution, and AI-assisted test generation already exist in the market. Veyra
should not claim any one of them as unique.

Its differentiation hypothesis is their governed combination:

- a manual tester can teach meaningful business behaviour;
- expectations remain explicit and reviewable;
- reusable operations carry inputs, outputs, preconditions, and outcomes;
- AI proposes, while humans control semantic changes;
- results distinguish `PASS`, `FAIL`, and `BLOCKED` with evidence;
- approved tests execute repeatedly without routine LLM reasoning;
- local-first operation provides a credible path to privacy and predictable
  economics without pretending that local execution alone is a moat.

This is a hypothesis to validate with users. It is not yet a proven competitive
moat or willingness-to-pay claim.

## The first product proof

The first meaningful product milestone is one complete vertical slice:

1. A tester teaches a consequential browser workflow.
2. Veyra presents a correct, readable interpretation.
3. The tester confirms at least one expected business outcome.
4. One or more values become approved parameters.
5. The workflow runs against a small dataset without LLM inference.
6. Veyra correctly reports a passing run, a real application failure, and an
   automation or environment blockage with understandable evidence.
7. A tester can repeat and maintain the workflow without developer help.

A second, structurally different workflow should then test whether the model is
application-independent rather than tailored to a single commerce journey.

## Current boundaries

Veyra V0 focuses on local-first Chromium browser testing and the trustworthy
Teach → Test → Results loop. Broad platform capabilities such as API testing,
multiple browser engines, scheduling, parallel execution, CI/CD integration,
autonomous exploration, and a comprehensive ABM remain later work unless user
validation changes the priority.

The detailed requirements, approved decisions, implementation status, and
delivery tasks live respectively in `docs/Veyra_PRD.md`, `status_quo.md`, and
`tasks.md`. This document remains the concise stakeholder narrative and should
change when the product idea changes materially.
