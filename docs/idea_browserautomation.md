# Application Quality Intelligence Platform — Idea Capture

**Status:** Ideation / North Star frozen after Grill-Me Q1–Q56  
**Scope examples:** E-commerce browser testing only  
**Working category:** Application Quality Intelligence Platform (AQIP)  
**Core intelligence asset:** Application Behaviour Model (ABM)

---

## 1. Executive Idea

We are not building merely a browser test recorder, an LLM wrapper around Playwright, or another no-code QA suite.

The product is an **Application Quality Intelligence Platform** that learns how an application behaves, converts human demonstrations and other evidence into an evolving **Application Behaviour Model (ABM)**, continuously discovers what should be tested, executes tests, learns from failures and changes, predicts risk, and explains quality status — while keeping humans in control.

The commercial entry point is deliberately simpler:

> A desktop-first, low/no-code browser QA product where a manual tester can demonstrate an e-commerce workflow once, turn it into reusable parameterised automation, execute it repeatedly, and automatically produce evidence-backed developer-ready reports.

The long-term evolution is:

> **Teach → Understand → Explore → Test → Learn → Predict → Recommend → Teach further**

Every cycle strengthens the ABM.

---

## 2. Governing Product Principles

### 2.1 Human sovereignty
AI recommends; the human remains in control.

Every important AI-generated object must be:
- inspectable;
- editable;
- rejectable;
- overridable;
- manually creatable.

AI must never silently redefine the intent of a test.

Examples:
- Suggested variable → Convert / Keep Fixed / Edit
- Suggested module → Save / Modify / Ignore
- Suggested assertion → Accept / Edit / Reject / Add manually
- Generated test → Accept / Edit / Reject / Create manually
- Learned business rule → Approve / Correct / Reject
- Proposed healing → Use once / Update test / Reject

**Manual Override** is a product-wide principle.

### 2.2 Local-first, selective AI
Do not call a frontier LLM for every small operation.

Preferred intelligence hierarchy:

1. Rules
2. Deterministic algorithms
3. Classical ML / embeddings / sequence models
4. Local small quantized LLM
5. Cloud small model
6. Frontier cloud model only when necessary

The intelligence engine exposes capabilities, not model names, e.g.:
- `detectParameters()`
- `findReusableSequences()`
- `describeStep()`
- `diagnoseFailure()`
- `findAlternativeElement()`
- `generateTest()`

This prevents product coupling to a specific model provider.

### 2.3 Progressive disclosure
The product should be extremely easy at the surface and sophisticated underneath.

Default conceptual UI:
- **Teach**
- **Test**
- **Results**

Advanced users can drill into modules, variables, selectors, datasets, environments, ABM, diagnostics and configuration.

### 2.4 Application knowledge over script maintenance
The ambition is not to maintain hundreds of brittle scripts.

> Maintain the application knowledge; derive and update dependent tests from that knowledge.

### 2.5 Trust through evidence
Consequential recommendations should be explainable through evidence.

If the system says Checkout is high-risk, it should explain why:
- changed in this release;
- historical failures;
- affected dependency;
- untested high-risk paths;
- flaky behaviour;
- usage/business impact.

### 2.6 Customer portability
Where practical, allow tests to be exported to Playwright or another open representation.

Our value should come from intelligence, UX and accumulated knowledge — not lock-in.

### 2.7 Safety by design
Execution may be autonomous; changing the meaning of a test may not be.

Actions should be risk-classified:
- SAFE
- CAUTION
- DESTRUCTIVE

Destructive or consequential actions require explicit permission unless a trusted sandbox policy permits them.

---

## 3. Initial Commercial Product

### Target user
Manual QA / product QA teams that understand the business workflow but may not understand:
- Playwright;
- XPath/CSS selector engineering;
- test architecture;
- page-object patterns;
- data-driven automation;
- automation maintenance.

### Core promise
A tester demonstrates a workflow once. The system converts it into reusable, parameterised automation and owns the repetitive execution/evidence burden thereafter.

Example:

Tester demonstrates:

1. Open e-commerce site
2. Search for "Laptop"
3. Open first result
4. Add to Cart
5. Open Cart
6. Verify selected product exists

A naive recorder stores six fixed operations.

Our system should infer:

**Module: Search Product**
- Input: `product_query`
- Output: search results

**Module: Select Product**
- Input: result position
- Output: selected product name / URL / price

**Module: Add Product To Cart**
- Input: selected product
- Output: cart state

**Module: Verify Product In Cart**
- Input: expected selected product
- Assertion: cart contains the product

"Laptop" becomes `{{product}}`.

The same template can run against:
- Laptop
- Watch
- Backpack
- Headphones

without recreating the test.

---

## 4. Core Object Model

```text
PROJECT
│
├── ENVIRONMENTS / PRESETS / SECRETS
├── VARIABLES / DATASETS
├── ACTIONS
├── MODULES
│   └── reusable business-level sequences
├── TEST TEMPLATES
│   └── composition of modules + assertions
├── TEST CASES
│   └── template + actual data
├── TEST SUITES
└── RUNS
    └── execution + evidence + diagnostics + report
```

### Four levels of reuse

**Action**
- Click
- Type
- Select
- Navigate
- Scroll
- Wait
- Upload
- Download

**Module**
- Login
- Search Product
- Select Product
- Add To Cart
- Apply Coupon
- Checkout
- Refund Order

**Test Template**
Example:
`Login → Search Product → Select Product → Add To Cart → Checkout → Verify Order`

**Test Data**
Run the same template with different products, quantities, coupons, users or payment methods.

---

## 5. Modules as Business Functions

Modules should have more than grouped clicks.

Example:

```text
SearchProduct(product_query)

INPUT
product_query

EXECUTION
click search
enter product_query
submit

OUTPUT
results_page
result_count
```

Another:

```text
SelectProduct(position)

INPUT
position

OUTPUT
selected_product_name
selected_product_price
selected_product_url
```

Then:

```text
VerifyCartItem(
    expected_name = {{selected_product_name}}
)
```

This allows later steps to consume outputs from earlier modules and creates business-level composability.

---

## 6. Presets, Variables and Data

### Presets
Saved values/configurations, not reusable behaviour.

Examples:

**QA User**
- username
- password

**Staging Environment**
- base URL
- browser
- credentials
- timeout

### Variable scopes
Architecture should anticipate:
- Environment variables
- Test variables
- Module variables
- Generated variables
- Secrets

### Data-driven execution
One test template can run over a dataset:

| product | quantity |
|---|---:|
| Laptop | 1 |
| Watch | 2 |
| Backpack | 1 |
| Headphones | 3 |

Results remain distinct per data row.

---

## 7. Action vs Assertion vs Evidence

A successful browser action does not imply business success.

Example:

**Action:** Click Add to Cart  
**Assertion:** Cart count increased  
**Evidence:** Screenshot + URL + state  
**Result:** PASS / FAIL / BLOCKED

Internal model:

```text
ACTION
  ↓
CHECKPOINT
  ↓
EVIDENCE SNAPSHOT
```

### V0 evidence
At checkpoints:
- screenshot;
- timestamp;
- current URL;
- expected result;
- actual result;
- PASS / FAIL / BLOCKED.

Background diagnostic evidence:
- browser console errors;
- relevant network failures;
- locator metadata;
- execution duration.

Later:
- video;
- DOM dump;
- HAR/network trace;
- performance;
- accessibility;
- richer traces.

---

## 8. PASS / FAIL / BLOCKED

Do not conflate automation failure with application failure.

**PASS**  
Expected business behaviour occurred.

**FAIL**  
Application behaviour contradicted the expected result.

**BLOCKED**  
Automation could not reliably execute or determine the intended step.

This distinction is critical for QA trust.

---

## 9. Locator Strategy and Assisted Healing

V0 should prefer resilient semantic locators:
1. `data-testid`
2. accessible role/name
3. stable ID
4. label
5. meaningful text
6. structural relationship
7. CSS/XPath fallback

Retain multiple locator hints.

Aggressive silent self-healing should wait.

Preferred early behaviour:

> Couldn't locate "Add to Cart".  
> Possible replacement found: "Add to Basket".  
> Confidence: 94%.

Options:
- Accept & Update
- Use Once
- Reject / Mark Failed

Principle:

> Execution can be autonomous; changing test meaning cannot be.

---

## 10. Signature Interaction: Teach

"Teach" should ultimately be more important than "Record".

Tester clicks **Teach**, uses the application normally, and can simultaneously narrate/type intent:

> "I'm adding any product to the cart. Product is variable. Quantity can change. Cart count must increase. Out of stock is a valid alternative state."

System observes:
- browser;
- DOM;
- accessibility tree;
- actions;
- page transitions;
- timing;
- narration;
- assertions;
- state changes.

It then proposes its understanding:

```text
I UNDERSTOOD

Goal
Purchase an available product.

Variables
Product
Quantity
Payment method

Expected outcomes
Cart count increases.
Order is created.
Confirmation appears.

Reusable behaviours
Search Product
Add to Cart
Checkout

[Looks Right] [Edit]
```

Important UX principle:

> Never ask users to validate AI reasoning. Ask them to validate the system's understanding of business behaviour.

---

## 11. Demonstrate → Understand → Abstract

Core lifecycle:

```text
DEMONSTRATE
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
AUTOMATE
   ↓
REPORT
```

The system should detect candidate parameters such as:
- product;
- quantity;
- coupon;
- result position;
- customer type;
- payment method.

It should also detect repeated sequences across tests and suggest reusable modules.

Example:

A five-step login sequence appears in 15 tests.

> "This sequence appears repeatedly. Create reusable module 'Login'?"

---

## 12. Application Behaviour Model (ABM)

The ABM is the central architectural and strategic asset.

It should progressively represent:

```text
Application
├── Screens
├── Elements
├── Entities
├── Business Actions
├── Inputs / Outputs
├── Permissions
├── States
├── State Transitions
├── Dependencies
├── Business Rules
├── Known Invariants
├── Test Data Requirements
├── Tests
├── Coverage
├── Historical Failures
├── Changes
├── Risk
└── Provenance / Confidence
```

Example commerce model:

```text
Product
  ↓
Cart
  ↓
Checkout
  ↓
Payment
  ↓
Order
  ↓
Refund
```

The product should reason at this level rather than merely storing browser scripts.

---

## 13. Knowledge Provenance and Lifecycle

Observed behaviour is not necessarily correct behaviour. A bug must not become truth merely because it was repeatedly observed.

Each learned fact/rule should retain:
- source;
- confidence;
- human-approved status;
- last verified;
- evidence;
- version.

Possible lifecycle:

```text
Observed
→ Suggested
→ Human Approved
→ Trusted
→ Stale
→ Deprecated
```

Knowledge sources can include:
- human demonstration;
- approved assertions;
- PRD/requirements;
- existing manual tests;
- OpenAPI/API specs;
- prior test reports;
- release notes;
- historical behaviour.

Conflicts should be surfaced, not silently reconciled.

---

## 14. Automatic Assertion / Invariant Discovery

The system should learn candidate invariants from successful behaviour.

Example:

Repeated successful Add to Cart flows show:
- cart count increases;
- selected product appears;
- subtotal changes.

System proposes:

> "These outcomes consistently follow Add to Cart. Save them as assertions?"

Human approves/edits/rejects.

This evolves testing from manually specifying every assertion to discovering candidate expectations.

---

## 15. Goal-Based Testing

Long-term, tests should preserve **intent**, not only execution paths.

Instead of:

`Click A → Click B → Enter C → Assert D`

User specifies:

> Goal: Verify that a customer can purchase an in-stock product.

System can determine a valid path from the ABM.

If navigation changes, the goal remains stable while execution may adapt subject to trust/safety rules.

Architecture:

```text
GOAL / INTENT
      ↓
BEHAVIOURAL PLAN
      ↓
EXECUTION PATH
```

---

## 16. State-Space and Behavioural Coverage

Tests can be generated as paths through the ABM.

Example:

```text
Order
  Draft
    ↓
  Submitted
    ↓
  Paid
    ↓
  Shipped
    ↓
  Delivered
    ↓
  Refunded / Returned
```

The system can identify untested transitions:

```text
Cart → Checkout            ✓
Checkout → Paid            ✓
Paid → Cancelled           ✕ UNTESTED
Delivered → Partial Refund ✕ UNTESTED
```

This enables **behavioural coverage intelligence**, not merely counts of test cases.

---

## 17. Automatic Test Discovery

Once the ABM understands a workflow, it should propose additional tests.

One demonstrated successful checkout can create a human-approved test family.

Possible categories:

**Happy path**
- normal checkout

**Boundary**
- minimum quantity
- maximum allowed quantity
- zero/invalid quantity

**Negative**
- invalid coupon
- payment decline
- out-of-stock product

**State**
- expired coupon
- already-cancelled order

**Behaviour**
- double submission
- refresh during payment
- back button during payment

Human selects which candidates become tests.

---

## 18. Combinatorial Intelligence

The system should identify dangerous combinations without brute-forcing every permutation.

Individually:
- Coupon ✓
- Gift Card ✓
- Free Shipping ✓
- Partial Refund ✓

But perhaps nobody tested:

`Coupon + Gift Card + Free Shipping + Partial Refund`

Use:
- pairwise/combinatorial algorithms;
- interaction coverage;
- historical risk;
- business impact;
- ML prioritisation.

LLMs are unnecessary for much of this.

---

## 19. Safe Autonomous Exploration

After being taught initial workflows, the system can enter **Explore Mode**.

It may discover:
- screens;
- forms;
- navigation paths;
- business actions;
- states;
- unexplored areas.

Example:

> "I found 14 screens, 37 actions and 6 workflows you haven't taught me."

Exploration must respect risk classification.

It must not autonomously:
- submit real payments;
- issue refunds;
- delete data;
- send customer communications;
- perform irreversible actions

without explicit policy/permission.

North Star:

> Give the system a staging e-commerce URL + credentials. It explores safely, builds an initial ABM, recognises commerce concepts, proposes tests, executes safe tests, and returns anomalies for review.

---

## 20. Test Preconditions and Data Dependencies

Tests should understand prerequisites.

Example checkout test may require:
- authenticated customer;
- in-stock product;
- valid shipping address;
- active coupon;
- available payment method.

Before execution the system checks dependencies.

Example:

> "Coupon SAVE20 has expired. Replace with another valid coupon?"

This reduces failures caused by stale test data rather than product defects.

---

## 21. Parallel Execution and Isolation

Parallel execution is planned for V1.

But parallel tests can corrupt shared state:
- same cart;
- same user;
- same coupon;
- same inventory;
- same order;
- same payment state.

The system should eventually model resource dependencies and identify tests that cannot safely share state.

V1 can begin with basic isolation; intelligent state-aware parallelisation can mature later.

---

## 22. Failure Reproduction

A failed run should preserve enough context to offer:

> **Reproduce Failure**

Where feasible it should reconstruct:
- test data;
- product;
- quantity;
- coupon;
- browser state;
- relevant environment;
- execution path.

A reproducible bug is substantially more valuable than a screenshot-only report.

---

## 23. AI Diagnostics and Scientific Debugging

Diagnostics should progress beyond "step failed".

The system correlates:
- browser state;
- DOM;
- console;
- network;
- API responses;
- ABM dependencies;
- previous successful executions;
- recent application changes.

Example:

> Likely failure location: `/orders` returned HTTP 500. Payment authorization succeeded, but order creation failed. Checkout UI appears healthy.

Always distinguish:
- observation;
- evidence;
- inference;
- confidence.

### Counterfactual analysis
Compare yesterday's successful execution with today's failure.

Example differences:
- checkout build changed;
- coupon type changed;
- payment provider unchanged;
- browser unchanged;
- `/pricing` response schema changed.

Then recommend the smallest experiments needed to isolate cause.

This is **scientific debugging**, not generic LLM summarisation.

---

## 24. Flakiness Intelligence

Do not merely label tests flaky.

Accumulate evidence to discover correlations.

Example:

> Failure occurs primarily when product-search response time exceeds 2.5 seconds.

or:

> Failure rate increases during parallel execution.

The system should learn and explain flakiness patterns.

---

## 25. Change Intelligence and Risk-Based Regression

Compare previous and current Application Behaviour Models.

Example:

```text
Search                unchanged
Product Page          changed
Cart                  changed
Checkout              changed
Payment               unchanged
Refund                indirectly affected
```

Instead of blindly running 500 tests, recommend the most relevant subset.

Risk can eventually combine:

> **Probability of failure × Business impact × Usage frequency × Change impact × Historical failure propensity**

Example:

> Run these 37 tests first; they cover the changed and historically fragile paths.

---

## 26. Predictive Quality Intelligence

Long-term, predict where failures are likely before running the entire suite.

Example:

New release changes:
- Cart
- Coupon Engine
- Checkout

Historical ABM knowledge says:
- Checkout has broken after cart changes four times.
- Coupon tests are historically flaky.
- Payment has not changed.

System recommends highest-risk regression areas and tests first.

Actual executions continuously recalibrate the risk model.

---

## 27. Production / Escaped Bug Memory

A production incident should permanently strengthen future regression coverage.

Example incident:

> Two discount codes incorrectly triggered free shipping.

The system stores:
- failure pattern;
- affected workflow;
- state;
- reproduction;
- associated tests;
- related combinations.

When relevant modules change later:

> "This area previously suffered a discount/free-shipping defect. Prioritise regression test #184 and related combinations."

Principle:

> Every escaped bug should increase the application's immunity to that class of failure.

---

## 28. Requirements-to-Coverage Intelligence

Optional sources such as PRDs can enrich the ABM.

Example requirement:

> Refunds are permitted only within seven days.

ABM has:
`Payment → Refund`

but no test covers:
`Refund after >7 days`.

System says:

> Requirement identified with no corresponding test coverage. Generate test?

This moves beyond AI test generation into **requirements-to-coverage intelligence**.

Browser demonstration must remain sufficient; external artefacts enrich rather than become mandatory.

---

## 29. Quality Knowledge Coverage

Do not rely solely on "437 tests passed."

The system should eventually measure how well the application is understood and validated.

Example:

```text
Application understanding       92%
Known state transitions         87%
Approved business rules         76%
Tested transitions              81%
High-risk paths tested          96%
Uncertain behaviour              8%
```

This becomes **Quality Knowledge Coverage**.

It answers:

> How well do we actually understand and validate this application?

---

## 30. Release Confidence

The product must never claim absolute release safety.

Instead it can calculate evidence-based release confidence.

Example:

```text
Release Confidence: 87%

Critical workflows:       100% tested
Changed workflows:         94% tested
Known failures:              2
Untested high-risk paths:    3
Blocked tests:               1
```

Human retains Go/No-Go authority.

---

## 31. Business-Aware Adversarial / Exploratory Testing

The system should eventually behave like a difficult customer — intentionally but safely.

Examples:
- double-click Place Order;
- back button during payment;
- refresh after payment;
- checkout in two tabs;
- modify quantity during checkout;
- expired coupon + cart change;
- interrupted network.

This is not random monkey testing.

It is **business-aware adversarial exploration** driven by the ABM.

---

## 32. Usage-Aware Testing

Later, real customer usage/analytics may inform prioritisation.

If:
`Search → Product → Cart → Checkout`

represents 38% of real sessions, it deserves higher business-impact weight than a flow representing 0.2%.

This should remain optional and privacy-conscious.

---

## 33. Self-Composing Tests

When trusted modules already exist, new tests should preferentially compose them rather than regenerate browser automation.

Existing:
- Login()
- SearchProduct()
- AddToCart()
- Checkout()
- VerifyOrder()

User asks:

> "Test purchasing a watch with a coupon."

System composes trusted modules and generates only missing behaviour.

This:
- reduces LLM usage;
- improves reliability;
- increases reuse;
- reduces maintenance;
- makes the module library compound in value.

---

## 34. Cross-Application Learning

Long-term, the platform should learn generic QA patterns across applications without leaking customer-specific data.

After seeing many e-commerce applications, it may recognise generic concepts:
- Product;
- Search;
- Cart;
- Coupon;
- Checkout;
- Payment;
- Order;
- Refund.

Potential long-term asset:

> Generic QA ontology / behavioural pattern library learned from anonymised structural patterns.

Customer-specific models/data must remain isolated.

---

## 35. Conversational Quality Interface

Once ABM exists, users can ask:

- What hasn't been tested in Checkout?
- Why did yesterday's regression fail?
- What changed in Cart?
- Generate tests for refund edge cases.
- Show workflows affected by coupon changes.
- Which high-risk paths are untested?
- Why is Checkout risk high?

Most answers should come from structured ABM queries, with an LLM primarily translating natural language to/from structured operations.

---

## 36. Executable Living Documentation

The ABM can become living documentation.

A new QA, developer or product manager can ask:

> How does Checkout work?

and see:
- observed workflow;
- states;
- business rules;
- dependencies;
- screenshots;
- tests;
- known failures;
- confidence;
- last verification.

This is a valuable consequence of ABM, but not an initial commercial selling point.

---

## 37. Upstream / Pre-Implementation Quality

Later, the ABM can reason about planned features before implementation.

Example:

> "Buy Now will skip Cart and go directly Product → Checkout."

Because ABM already understands Product, Cart, Checkout, Payment and Order, it can:
- predict impacted behaviours;
- identify missing states;
- propose tests before development is finished.

This shifts quality intelligence upstream.

---

## 38. V0 — Intelligent QA Recorder

V0 must be commercially useful, not merely a technical prototype.

### Table-stakes / core V0 capabilities
- Desktop application
- Project creation
- Application URL
- Environment configuration
- Credential/secrets handling
- Chromium browser execution
- Playwright-based engine
- Record/Teach browser actions
- Human-readable recorded steps
- No/low-code test editor
- Assertions/checkpoints
- Variables/parameters
- Reusable modules
- Presets
- Data-driven tests
- Smart/resilient locators
- Test templates
- Test cases
- Test suites/tags/projects
- Screenshots/evidence
- Console/network diagnostic capture
- PASS / FAIL / BLOCKED
- Run history
- HTML/PDF developer-ready reports
- Share/export reports
- Basic AI-assisted modularisation
- Basic AI parameter detection
- Manual override everywhere

### V0 signature
> **Record/Teach → Parameterise → Modularise → Compose → Run → Evidence → Report**

---

## 39. V1 — AI QA Automation Platform

V1 retains all V0 capabilities and adds the selected advanced capabilities:

- API testing
- Parallel execution
- Scheduling
- AI test creation
- AI diagnostics

Additional intelligence can mature:
- richer module discovery;
- richer parameter discovery;
- test-family generation;
- requirements-to-coverage;
- failure diagnosis;
- test precondition checks;
- basic ABM visualisation;
- risk-aware regression recommendations.

### Self-healing
Self-healing is intentionally **not required for initial V1**.

It can arrive in V1.x once trust architecture and confidence handling are mature.

---

## 40. V1.x — Resilient Automation

Potential capabilities:
- confidence-based assisted/self-healing;
- richer local AI;
- semantic locator repair;
- test-maintenance intelligence;
- ABM-driven dependent test updates;
- deeper flakiness diagnosis;
- richer risk modelling.

---

## 41. Later Queue / V2+

Explicitly defer initially:
- CI/CD integrations
- visual regression
- accessibility testing
- native mobile testing
- Jira integration
- Slack integration
- GitHub integration
- large browser/device farms
- massive distributed execution
- fully autonomous destructive testing

Long-term platform capabilities may include:
- mobile;
- API + UI combined models;
- visual;
- accessibility;
- agentic QA;
- advanced autonomous exploration;
- predictive quality;
- upstream quality planning.

---

## 42. Local AI / ML Architecture

A substantial portion of intelligence should not require an LLM.

### Deterministic / algorithmic
- browser execution;
- assertions;
- retries;
- waits;
- URL checks;
- HTTP status;
- console error classification;
- locator scoring;
- structural comparison;
- sequence analysis;
- test execution;
- evidence collection.

### Classical ML / embeddings
Potential uses:
- repeated-flow clustering;
- semantic element similarity;
- parameter candidate classification;
- locator ranking;
- anomaly detection;
- flakiness correlation;
- risk prediction;
- failure clustering;
- test prioritisation.

### Local quantized LLM
Potential uses:
- human-readable step descriptions;
- module naming;
- basic intent extraction;
- variable suggestions;
- simple failure summaries;
- natural-language editing;
- semantic mapping.

### Cloud models
Reserve for genuinely complex tasks:
- long PRD → comprehensive test suite;
- multi-source reasoning;
- difficult diagnostics;
- complex test generation;
- advanced planning.

### User-facing AI modes
Potential future setting:

**Local Only**
- no browser/test data sent to cloud AI.

**Hybrid**
- local by default;
- cloud escalation for difficult tasks.

**Cloud Enhanced**
- maximum intelligence.

This may become a strong enterprise privacy and cost differentiator.

---

## 43. Local-First Execution Economics

Desktop execution should be strategically important.

Customer machine runs:
- Playwright;
- browser;
- deterministic engine;
- ML;
- local LLM where feasible.

Cloud can handle:
- account/sync;
- optional model calls;
- team collaboration;
- scheduling coordination;
- optional parallel/cloud execution later.

Benefits:
- lower infrastructure costs;
- lower customer pricing;
- faster local response;
- stronger privacy;
- less vendor dependency.

Cloud parallel execution can become a paid capability when required.

---

## 44. Commercial Defensibility

Four layers:

### 1. Exceptional UX — immediate moat
A manual QA user should be productive without understanding automation engineering.

### 2. Low cost — acquisition/economic moat
Local execution + ML + quantized models + selective cloud escalation.

### 3. Application Behaviour Model — product moat
The accumulated understanding of a customer's application becomes increasingly valuable over time.

### 4. Cross-application QA intelligence — long-term data moat
Generic patterns learned across many applications improve test discovery and risk prediction without transferring customer-specific knowledge.

Working sequence:

> **A + B + C → eventually D**

---

## 45. Product Identity

Rejected as insufficient:
- merely AI Test Automation Platform;
- merely Autonomous QA Platform;
- merely browser automation.

Working category:

> **Application Quality Intelligence Platform**

Core engine:

> **Application Behaviour Model (ABM)**

Working North Star:

> **Teach the system your application. It learns how the application should behave, continuously discovers what deserves testing, executes and diagnoses those tests, remembers where the application has failed before, and tells you what is risky — while you remain in control.**

---

## 46. What We Must Not Become

Explicit anti-goals:

1. A bloated enterprise testing suite.
2. An LLM wrapper around Playwright.
3. An autonomous black box that QA does not trust.
4. An unnecessarily expensive cloud testing infrastructure company.
5. A tool that forces AI-generated interpretations on users.
6. A brittle recorder that simply stores click sequences.
7. A proprietary lock-in system whose only moat is inability to leave.

Our opposite:

> **Simple UX + deterministic foundations + selective AI + human control + local-first economics + compounding application intelligence.**

---

## 47. Innovation Filter

To control feature creep:

> **Every major innovation should strengthen the Application Behaviour Model or materially improve the Teach/Test/Results experience. Otherwise it waits.**

Examples:

Strengthens ABM:
- learned checkout invariant;
- failure memory;
- state transition discovery;
- test-family generation;
- change intelligence.

Does not directly strengthen ABM:
- Jira integration;
- Slack integration;
- cosmetic enterprise administration.

The latter can wait until commercially required.

---

## 48. Working Product Evolution

### V0 — Intelligent QA Recorder
Reliable browser automation + Teach/Record + parameterisation + reusable modules + evidence + reports.

### V1 — AI QA Automation Platform
V0 + API testing + parallel execution + scheduling + AI test creation + AI diagnostics.

### V1.x — Resilient Automation
Confidence-based healing + deeper maintenance intelligence + richer local AI.

### V2+ — Application Quality Intelligence Platform at scale
Safe autonomous exploration + state-space coverage + predictive regression + quality knowledge coverage + mobile/visual/accessibility/integrations as justified.

### North Star
The system can safely learn a staging e-commerce application, build an ABM, discover candidate tests, execute safe tests, identify anomalies, diagnose failures, predict high-risk areas and continuously improve its understanding with human governance.

---

## 49. Next Workstream — Eight Outputs

The ideation phase is now frozen enough to begin structured product definition.

Every workstream below should produce its own Markdown artefact.

### 1. Product Thesis & Innovation Pillars
Distil the concept into 7–10 non-negotiable product principles and a sharp product thesis.

**Output:** `01_Product_Thesis_and_Innovation_Pillars.md`

### 2. Competitive Validation
Research current competitors and test every claimed innovation against the market.

Competitors should include at minimum:
- Testim
- mabl
- Autify
- Functionize
- Katalon
- Ghost Inspector
- additional relevant emerging products discovered during research

We should actively kill or reframe ideas that competitors already execute better.

**Output:** `02_Competitive_Validation.md`

### 3. Capability Universe
Create a master inventory containing:
- table stakes;
- V0;
- V1;
- V1.x;
- later queue;
- all innovations from this ideation;
- dependencies;
- commercial priority.

**Output:** `03_Capability_Universe.md`

### 4. Architecture
Define:
- desktop architecture;
- Playwright/browser engine;
- ABM;
- evidence engine;
- test orchestrator;
- API engine;
- deterministic intelligence;
- ML;
- local LLM;
- cloud AI router;
- storage;
- security;
- local/cloud boundaries.

**Output:** `04_Product_Architecture.md`

### 5. V0 Definition
Define the smallest commercially usable browser-testing product, including UX, features, acceptance criteria and exclusions.

**Output:** `05_V0_Commercial_Product.md`

### 6. V1 Definition
Define the first fuller commercial release:
- V0 completion;
- API testing;
- parallel execution;
- scheduling;
- AI test creation;
- AI diagnostics;
- selected ABM intelligence.

**Output:** `06_V1_Product.md`

### 7. Innovation Queue
Capture and prioritise:
- Explore Mode;
- learned invariants;
- test-family generation;
- state-space coverage;
- predictive regression;
- failure memory;
- Quality Knowledge Coverage;
- adversarial exploration;
- risk prediction;
- executable documentation;
- pre-implementation quality;
- self-healing;
- cross-application learning;
- other future innovations.

**Output:** `07_Innovation_Queue.md`

### 8. PRD
Only after outputs 1–7 are sufficiently frozen, write the implementation-grade Product Requirements Document.

**Output:** `08_PRD.md`

---

## 50. Current Decision State

The Grill-Me ideation ran through **Q1–Q56**.

The principal recommendations were accepted, including:
- target manual QA rather than automation engineers;
- learn from human demonstrations;
- Application Behaviour Model as core;
- automatic candidate assertions;
- human-governed adaptation;
- automatic test discovery;
- cross-application learning;
- goal-based tests;
- state-space coverage;
- provenance/confidence;
- safe autonomous exploration;
- risk-based regression;
- requirements-to-coverage;
- failure memory;
- self-composing tests;
- test-family generation;
- knowledge lifecycle;
- conversational QA;
- intelligent test-data dependencies;
- reproducible failures;
- parallel isolation;
- predictive quality;
- business-aware adversarial testing;
- usage-aware prioritisation;
- flakiness diagnosis;
- Quality Knowledge Coverage;
- ABM-driven maintenance;
- multimodal Teach interaction;
- executable documentation;
- combinatorial intelligence;
- release-level quality intelligence;
- explainability;
- customer portability;
- continuous learning loop;
- scientific root-cause diagnostics;
- counterfactual analysis;
- upstream/pre-implementation testing.

The ideation phase should now transition into structured validation and product definition rather than adding features indefinitely.
