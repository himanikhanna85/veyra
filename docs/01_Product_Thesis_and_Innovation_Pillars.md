# 01 --- Product Thesis & Innovation Pillars

**Working category:** Application Quality Intelligence Platform (AQIP)\
**Core engine:** Application Behaviour Model (ABM)\
**Initial commercial wedge:** Desktop-first intelligent browser QA for
manual/low-code QA teams\
**Domain examples used in this document:** E-commerce

## Product Thesis

Most test-automation products make tests easier to author, execute,
heal, or analyse. Our product should move the abstraction one level
higher.

**We teach the system how an application behaves, not merely how to
replay a test.**

A QA user demonstrates and explains real e-commerce behaviour. The
platform converts those demonstrations, observations, requirements,
failures, and approved rules into an evolving **Application Behaviour
Model**. Tests then become executable validations and generated paths
through that model rather than isolated scripts that must each be
maintained.

The commercial product begins with a simple promise:

> **Teach a workflow once. Turn it into reusable, parameterised browser
> automation. Run it repeatedly. Get evidence-backed results without
> writing automation code.**

The long-term promise is:

> **Teach us your application. We continuously learn what should happen,
> discover what deserves testing, execute and diagnose those tests,
> remember where the application has failed before, and tell you what is
> risky --- while you remain in control.**

## The Customer We Start With

The primary user is a manual or low-code QA professional who
understands: - customer journeys; - expected business behaviour; - edge
cases; - defects; - release risk;

but should not need expertise in: - Playwright; - XPath/CSS selector
engineering; - page-object patterns; - automation frameworks; - model
prompting; - test infrastructure.

The initial buying context is a web/e-commerce team with meaningful
repetitive regression work and a desire to automate without creating a
large automation-engineering burden.

## Jobs To Be Done

### Functional job

"When my e-commerce application changes, help me prove that the
important customer behaviours still work without manually repeating
every test."

### Maintenance job

"When the UI or workflow changes, help me update the application's
testing knowledge once instead of repairing many brittle scripts."

### Diagnostic job

"When something fails, tell me exactly what failed, show me the
evidence, and help me isolate the likely cause."

### Coverage job

"Tell me what important behaviour I have not tested --- not merely how
many tests passed."

### Risk job

"Tell me what deserves testing first in this release and why."

## Core Product Loop

``` text
TEACH
  ↓
UNDERSTAND
  ↓
ABSTRACT
  ↓
MODULARISE
  ↓
PARAMETERISE
  ↓
VALIDATE
  ↓
TEST / EXPLORE
  ↓
CAPTURE EVIDENCE
  ↓
DIAGNOSE
  ↓
LEARN
  ↓
PREDICT / RECOMMEND
  ↓
TEACH FURTHER
```

Each loop should strengthen the ABM.

# Ten Innovation Pillars

## Pillar 1 --- Teach, Don't Script

The signature interaction is **Teach**.

A user can demonstrate an e-commerce flow while optionally explaining
intent:

> "I'm adding any available product to the cart. Product and quantity
> are variables. Cart count must increase. Out-of-stock is an
> alternative valid state."

The system observes browser actions and application state, then proposes
its understanding.

The user validates **business meaning**, not generated code.

### Product consequence

Recording is an implementation mechanism. Teaching is the user
experience.

### V0 expression

-   record actions;
-   convert raw events into human-readable steps;
-   detect candidate variables;
-   let user mark assertions;
-   save reusable modules.

### Long-term expression

Multimodal demonstration + narration + ABM learning.

------------------------------------------------------------------------

## Pillar 2 --- Application Behaviour Model Is the Core Asset

The ABM should progressively understand:

``` text
Screens
Elements
Business entities
Business actions
Inputs / outputs
States
Transitions
Dependencies
Permissions
Rules
Invariants
Preconditions
Test data
Tests
Coverage
Historical failures
Changes
Risk
Provenance
Confidence
```

For commerce:

``` text
Search → Product → Cart → Coupon → Checkout → Payment → Order → Refund
```

Tests, diagnostics, exploration, coverage and risk analysis should
increasingly feed or consume this model.

### Strategic consequence

Our moat should become accumulated application understanding, not
proprietary test syntax.

------------------------------------------------------------------------

## Pillar 3 --- Reusable Business Behaviour, Not Repeated Clicks

The product must automatically encourage abstraction.

Example:

``` text
SearchProduct(product_query)
  → selected_product

AddToCart(selected_product)
  → cart_state

Checkout(cart_state, payment_method)
  → order

VerifyOrder(order)
```

A demonstration using "Laptop" should be reusable for "Watch",
"Backpack" or another product without re-recording.

### Required concepts

-   actions;
-   modules;
-   inputs;
-   outputs;
-   variables;
-   datasets;
-   presets;
-   test templates;
-   composed tests.

### Compounding effect

New tests should preferentially compose trusted modules and generate
only missing behaviour.

------------------------------------------------------------------------

## Pillar 4 --- AI Proposes; Humans Govern

AI must never become an opaque authority over QA intent.

Every important AI recommendation must support: - inspect; - accept; -
edit; - reject; - override; - manual creation.

Examples: - variable suggestion; - module extraction; - assertion
discovery; - generated tests; - inferred business rules; - healing; -
risk recommendations.

### Non-negotiable rule

**Execution may become autonomous. Changing the semantic meaning of a
test may not happen silently.**

This is both a trust principle and a UX principle.

------------------------------------------------------------------------

## Pillar 5 --- Deterministic First, Intelligence Routed by Cost and Need

Do not build an LLM wrapper around Playwright.

Preferred routing:

``` text
Rules
  ↓
Algorithms
  ↓
Classical ML / embeddings
  ↓
Local quantized LLM
  ↓
Cloud small model
  ↓
Frontier model
```

### Good non-LLM candidates

-   browser execution;
-   assertions;
-   locator ranking;
-   DOM/structure comparison;
-   repeated-sequence detection;
-   combinatorial generation;
-   failure classification;
-   anomaly detection;
-   flakiness correlation;
-   risk scoring;
-   test prioritisation.

### Local-model candidates

-   step naming;
-   module naming;
-   parameter suggestions;
-   simple intent extraction;
-   simple summaries;
-   semantic mapping.

### Cloud-model candidates

-   complex test-family generation;
-   long requirements analysis;
-   multi-source diagnostics;
-   difficult planning/reasoning.

### Commercial consequence

Lower inference cost, lower latency, stronger privacy, and less
model-provider dependency.

------------------------------------------------------------------------

## Pillar 6 --- Evidence Before Explanation

The system must distinguish: - observed fact; - expected behaviour; -
inference; - confidence.

A failure report should preserve: - step/checkpoint; - screenshot; -
URL; - timestamp; - expected result; - actual result; - console/network
evidence; - locator information; - relevant state.

At the test level use: - PASS; - FAIL; - BLOCKED.

At the diagnostic level, recommendations must point to supporting
evidence.

------------------------------------------------------------------------

## Pillar 7 --- Discover What Should Be Tested

The product should evolve beyond executing authored tests.

From an approved workflow it should propose: - happy paths; - negative
cases; - boundary cases; - state cases; - adversarial behaviours; -
dangerous combinations; - missing requirement coverage; - untested state
transitions.

Example from one checkout demonstration:

``` text
Normal checkout
Declined payment
Expired coupon
Out-of-stock product
Double Place Order click
Refresh during payment
Back navigation during payment
Coupon + gift card + partial refund
```

Humans choose which candidates become trusted tests.

### Long-term consequence

Testing becomes coverage discovery, not merely automation authoring.

------------------------------------------------------------------------

## Pillar 8 --- Learn From Change and Failure

The ABM must accumulate organisational quality memory.

A production incident such as:

> Two discount codes incorrectly triggered free shipping.

should become permanent regression knowledge.

When relevant checkout/coupon logic changes later, the system should
increase risk and prioritise the associated tests.

Similarly, the system should compare successful and failed runs to
isolate meaningful differences.

### Goal

**Every escaped defect should increase the application's future immunity
to that class of defect.**

------------------------------------------------------------------------

## Pillar 9 --- Quality Intelligence, Not Test Counts

"437 tests passed" is insufficient.

The product should eventually answer: - What changed? - What is risky? -
What is untested? - What failed? - What is flaky? - What should we run
next? - Why?

Potential measures:

``` text
Application understanding
Known state transitions
Approved business rules
Tested transitions
High-risk paths tested
Uncertain behaviour
Release confidence
```

This becomes **Quality Knowledge Coverage** and **Release Confidence**,
without claiming absolute release safety.

------------------------------------------------------------------------

## Pillar 10 --- Consumer-Grade UX + Local-First Economics

The visible product should feel simpler than its internal architecture.

Default surface:

``` text
Teach | Test | Results
```

Advanced complexity appears only when needed.

Local-first execution should use the customer's machine for: -
Playwright/browser; - deterministic processing; - ML; - local LLM where
feasible.

Cloud services can add: - team sync; - optional AI escalation; -
scheduled orchestration; - paid parallel/cloud execution later.

### Commercial consequence

UX and cost are not secondary advantages. They are immediate competitive
weapons.

# Defensibility Stack

## Layer 1 --- Better UX

Immediate adoption advantage.

A tester should become productive without learning automation
engineering.

## Layer 2 --- Lower Cost

Local execution, classical ML and selective model escalation should
support aggressive pricing and healthy margins.

## Layer 3 --- Customer-Specific ABM

The platform becomes more valuable as it learns the customer's
application, history, failures, states and risks.

## Layer 4 --- Cross-Application QA Intelligence

Long term, privacy-safe generic patterns across applications can
improve: - module recognition; - test-family discovery; - risk models; -
commerce ontology; - anomaly detection.

Customer-specific knowledge must remain isolated.

# Product Generations

## V0 --- Intelligent QA Recorder / Teacher

Commercially usable browser QA: - Teach/Record; - visual editor; -
assertions; - parameters; - reusable modules; - presets; - datasets; -
smart locators; - Chromium execution; - evidence; - PASS/FAIL/BLOCKED; -
history; - reports; - basic AI parameter/module suggestions; - manual
override.

## V1 --- AI QA Automation Platform

V0 plus: - API testing; - parallel execution; - scheduling; - AI test
creation; - AI diagnostics; - deeper ABM capabilities.

## V1.x --- Resilient Automation

-   assisted/confidence-based self-healing;
-   deeper maintenance intelligence;
-   richer local AI;
-   flakiness intelligence.

## North Star --- Application Quality Intelligence

-   safe exploration;
-   learned invariants;
-   state-space coverage;
-   test-family generation;
-   requirements-to-coverage;
-   predictive regression;
-   failure memory;
-   adversarial exploration;
-   Quality Knowledge Coverage;
-   release confidence;
-   conversational QA;
-   upstream/pre-implementation quality.

# Anti-Goals

We must not become: 1. a bloated enterprise testing suite; 2. an LLM
wrapper around Playwright; 3. an autonomous black box QA does not trust;
4. an unnecessarily expensive browser-cloud infrastructure company; 5. a
brittle record/replay tool; 6. a system that silently changes business
intent; 7. a product whose moat is lock-in.

# Innovation Filter

A proposed feature should pass at least one of these tests:

1.  **Does it strengthen the ABM?**
2.  **Does it materially simplify Teach → Test → Results?**
3.  **Does it materially increase reliability, trust, coverage
    intelligence or diagnostic value?**
4.  **Is it necessary commercial table stakes?**

Otherwise it waits.

# Working Positioning

### Category

**Application Quality Intelligence Platform**

### Technology thesis

**Application Behaviour Model**

### Commercial wedge

**Low/no-code intelligent browser QA for teams currently carrying
repetitive manual regression work.**

### Working message

> **Teach it once. Test continuously. Know what changed, what broke, and
> what is risky.**

# Decisions to Validate Next

Competitive validation must specifically test whether the following are
genuinely differentiated or merely renamed existing capabilities:

1.  Teach as multimodal behavioural instruction rather than
    record/playback.
2.  ABM as persistent business/state/risk model.
3.  Learned invariants with human approval.
4.  Goal-based tests separated from execution paths.
5.  State-transition/knowledge coverage.
6.  Failure memory feeding future regression priority.
7.  Risk-based regression from ABM changes.
8.  Self-composition from trusted business modules.
9.  Quality Knowledge Coverage.
10. Local-first intelligence/economics.
