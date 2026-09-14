# 07 --- Veyra Innovation Queue

**Product:** Veyra\
**Category:** Application Quality Intelligence Platform\
**Purpose:** Prioritise the innovation portfolio beyond V0/V1 without
allowing speculative ideas to destabilise the commercial roadmap.

------------------------------------------------------------------------

# 1. Innovation Portfolio Principle

Veyra should not attempt to ship every strong idea discovered during
product ideation.

The innovation queue exists to answer:

> **Which capabilities can turn Veyra from a very good automation
> product into a compounding Application Quality Intelligence
> platform---and what evidence must exist before we invest?**

Every innovation must have: - customer problem; - strategic value; -
prerequisite; - smallest experiment; - success signal; - failure/kill
criterion; - likely release horizon.

------------------------------------------------------------------------

# 2. Portfolio Structure

``` text
NOW
Prove the foundations in V0/V1.

NEXT
Capabilities justified immediately after the foundation works.

LATER
High-value extensions dependent on a mature ABM.

RESEARCH
High-upside hypotheses that should be tested before roadmap commitment.
```

The innovation queue is deliberately not a promised release schedule.

------------------------------------------------------------------------

# 3. Prioritisation Framework

Score innovations against:

1.  **Customer Value** --- does it materially reduce QA effort or risk?
2.  **ABM Compounding** --- does it strengthen Veyra's application
    knowledge?
3.  **Differentiation** --- does it move beyond current market table
    stakes?
4.  **Trust** --- can Veyra explain and govern it?
5.  **Technical Feasibility** --- can it work reliably enough?
6.  **Data Readiness** --- will Veyra possess the information required?
7.  **Commercial Leverage** --- can it increase willingness to pay or
    retention?
8.  **Cost Efficiency** --- can it operate without uncontrolled
    inference/infrastructure cost?

------------------------------------------------------------------------

# 4. Innovation Map

``` text
                         VEYRA
                           │
             APPLICATION BEHAVIOUR MODEL
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     UNDERSTAND           TEST               LEARN
        │                  │                  │
  Learned Rules      Test Families      Failure Memory
  States             Composition        Flakiness
  Dependencies       Exploration        Change Memory
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                        PREDICT
                           │
             Risk-Based Regression
             Quality Knowledge
             Release Confidence
```

------------------------------------------------------------------------

# 5. NOW --- Foundations Already Embedded in V0/V1

These are not speculative research items anymore. They are the
foundations upon which later innovations depend.

## N1 --- Semantic Modules

### Problem

Reusable step groups remain implementation-oriented.

### Veyra idea

Business modules have: - intent; - inputs; - outputs; - preconditions; -
expected outcomes; - implementation.

### Why now

This is the Minimum Viable ABM.

### Success signal

Users reuse modules across multiple tests and find updates easier than
editing duplicated tests.

### Kill/reframe signal

Users consistently ignore semantic metadata and treat modules only as
grouped steps.

If that happens, simplify the semantic layer before building a larger
ABM.

------------------------------------------------------------------------

## N2 --- Teach Understanding Confirmation

### Idea

After demonstration, Veyra says:

``` text
I understood:
Goal
Variables
Expected outcomes
Reusable behaviours
```

Human confirms/corrects.

### Strategic value

Creates explicit bridge:

``` text
Observed browser events
→
Business meaning
```

### Success signal

Users correct meaningful misunderstandings and report greater trust.

### Kill/reframe

If confirmation becomes a rubber-stamp screen users skip, redesign it
rather than adding more AI explanation.

------------------------------------------------------------------------

## N3 --- Reuse-First AI Composition

### Idea

When generating a test:

``` text
Existing trusted modules
→
Existing variables/data
→
Existing assertions
→
Generate only missing behaviour
```

### Strategic value

Veyra gets better as it learns the application.

### Success signal

A growing percentage of generated tests are assembled primarily from
trusted knowledge.

### Kill/reframe

If generated tests still require substantial re-authoring despite a
mature module library, the semantic model is not sufficiently useful.

------------------------------------------------------------------------

## N4 --- Provenance and Confidence

Every learned fact should answer:

``` text
Where did this come from?
How confident is Veyra?
Did a human approve it?
When was it last verified?
```

This is foundational for all autonomous intelligence.

------------------------------------------------------------------------

## N5 --- Failure Memory

Historical failures become semantic application knowledge rather than
isolated old run logs.

Success means old failures influence future recommendations.

------------------------------------------------------------------------

# 6. NEXT --- V1.x / Early Post-V1

------------------------------------------------------------------------

# 7. I1 --- Assisted Self-Healing

## Problem

UI changes cause BLOCKED automation even when business behaviour remains
unchanged.

## Veyra approach

``` text
Expected element unavailable
        ↓
Semantic candidate search
        ↓
Confidence ranking
        ↓
Proposal
```

User options:

``` text
Use Once
Update Test
Reject
```

## Differentiation

Self-healing itself is table stakes.

Veyra's value should come from **semantic intent protection**.

The system may heal:

``` text
"Add to Cart" → "Add to Basket"
```

only if evidence strongly suggests the same business action.

It must not heal:

``` text
"Place Order" → "Save for Later"
```

because both happen to occupy the same UI location.

## Prerequisites

-   semantic element identity;
-   locator history;
-   module intent;
-   confidence calibration.

## Success metric

High accepted-heal rate with extremely low semantic false-heal rate.

## Kill criterion

If safe confidence cannot be calibrated, retain suggestion-only healing
indefinitely.

------------------------------------------------------------------------

# 8. I2 --- Flakiness Intelligence

## Problem

Intermittent failures destroy trust in automation.

## Signals

-   timing;
-   endpoint latency;
-   browser;
-   machine load;
-   parallel worker count;
-   selector stability;
-   application response;
-   repeated run history.

## Output

``` text
Likely flaky

Failure rate
4 / 50 runs

Correlation
Search endpoint >2 sec in 4/4 failures.

Recommendation
Investigate timing/loading behaviour.
```

## Strategic value

Transforms run history into quality intelligence.

## Prerequisites

Reliable historical run/evidence data.

## Success

Veyra distinguishes intermittent automation/application instability from
deterministic regressions.

------------------------------------------------------------------------

# 9. I3 --- Semantic Change Detection

## Idea

Detect not merely:

``` text
DOM changed
```

but:

``` text
Checkout behaviour may have changed.
```

Inputs: - module implementation; - page structure; - observed
outcomes; - API behavior; - historical runs.

## Output

``` text
Apply Coupon changed.

Observed:
Discount label moved.
API response field renamed.
Final total behaviour unchanged.
```

or:

``` text
Possible semantic change:
Coupon now affects shipping calculation.
Human review recommended.
```

## Prerequisite

Richer ABM and run comparison.

------------------------------------------------------------------------

# 10. I4 --- Smarter Resource Isolation

Model resources such as:

``` text
User Account
Cart
Coupon
Order
Inventory
```

Properties:

``` text
SHARED
EXCLUSIVE
CONSUMABLE
MUTABLE
```

Scheduler uses them to avoid corrupting parallel tests.

Example:

Two tests cannot simultaneously use a one-time coupon.

------------------------------------------------------------------------

# 11. I5 --- Risk-Aware Run Ordering

Before full predictive regression, start simply.

Prioritise: 1. historically failing tests; 2. tests touching recently
changed modules; 3. critical business flows; 4. flaky tests separately.

This produces immediate value without pretending to predict the future.

------------------------------------------------------------------------

# 12. LATER --- Mature ABM Capabilities

------------------------------------------------------------------------

# 13. I6 --- Learned Business Invariants

## Concept

Repeated successful behaviour may reveal candidate rules.

Example:

``` text
Add To Cart
→
Cart count increases
```

or:

``` text
Successful payment
→
Order confirmation exists
```

## Pipeline

``` text
Repeated observations
        ↓
Pattern detection
        ↓
Candidate invariant
        ↓
Evidence
        ↓
Human approval
        ↓
Trusted invariant
```

## Important constraint

Never learn "normal" solely from frequency.

A recurring defect can be frequent.

## Success

Veyra discovers useful assertions testers had not explicitly authored.

## Kill criterion

If suggestion precision is low enough to create alert fatigue, narrow
the domains/actions eligible for invariant learning.

------------------------------------------------------------------------

# 14. I7 --- Goal-Based Testing

## Concept

Separate:

``` text
BUSINESS GOAL
Customer can purchase an in-stock product
```

from:

``` text
CURRENT EXECUTION PATH
Product → Cart → Checkout → Payment → Confirmation
```

## Value

UI implementation may change while business goal remains stable.

Veyra can propose a new execution path while preserving intent.

## Risk

This is semantically dangerous.

A model could decide that a different outcome satisfies the same goal.

## Governance

Any material execution-path change should show:

``` text
Goal unchanged.

Old path:
...

Proposed path:
...

Why Veyra believes this is equivalent:
...

[Approve] [Edit] [Reject]
```

## Research requirement

Measure semantic equivalence accuracy before allowing automatic
adaptation.

------------------------------------------------------------------------

# 15. I8 --- State-Space Model

## Concept

Move beyond paths into application states.

Commerce example:

``` text
Cart Empty
   ↓
Cart With Item
   ↓
Checkout Started
   ↓
Payment Pending
  /   \
Paid  Failed
 ↓
Order Created
 ↓
Shipped
 ↓
Refunded
```

Veyra tracks: - known states; - known transitions; - tested
transitions; - untested transitions.

## Strategic value

Enables systematic coverage discovery.

## Risk

State modelling can become enormously complex.

## Approach

Start only with high-value business entities/workflows.

Do not attempt to model the entire DOM as state.

------------------------------------------------------------------------

# 16. I9 --- Missing Transition Discovery

Once state modelling exists:

``` text
Known transition
Paid → Refunded
```

but no test validates it.

Veyra says:

``` text
Untested transition:
Paid Order → Partial Refund

[Generate Test]
```

This is stronger than counting tests.

------------------------------------------------------------------------

# 17. I10 --- Combinatorial Intelligence

## Problem

Most dangerous bugs occur in interactions.

Individually tested:

``` text
Coupon ✓
Gift Card ✓
Free Shipping ✓
Refund ✓
```

Missing:

``` text
Coupon
+
Gift Card
+
Partial Refund
```

## Approach

Use: - pairwise/combinatorial algorithms; - constraints; - historical
failure data; - business risk.

LLMs may help explain/select combinations, but should not brute-force
them.

## Output

``` text
High-value untested combination

Coupon + Gift Card + Partial Refund

Why:
• three interacting pricing rules;
• Refund has historical failures;
• no existing test covers this combination.
```

------------------------------------------------------------------------

# 18. I11 --- Business-Aware Adversarial Testing

## Concept

Veyra behaves like an awkward real customer.

Examples:

-   double-click Place Order;
-   refresh during payment;
-   browser Back after authorization;
-   two checkout tabs;
-   modify quantity during checkout;
-   apply expired coupon after cart change;
-   interrupt network.

## Difference from monkey testing

Actions are derived from: - business state; - known workflow; - expected
invariants.

## Success

Finds defects that normal happy-path regression misses.

------------------------------------------------------------------------

# 19. I12 --- Safe Explore Mode

## North-Star capability

Give Veyra:

``` text
Staging URL
Credentials
Safety policy
```

Veyra explores permitted application areas.

## Flow

``` text
Observe page
↓
Identify possible actions
↓
Classify business meaning
↓
Classify risk
↓
Execute safe actions
↓
Observe new state
↓
Update candidate ABM
↓
Suggest tests
```

## Action policy

``` text
SAFE
CAUTION
DESTRUCTIVE
UNKNOWN
```

UNKNOWN defaults to no autonomous action.

## Example

SAFE: - search; - browse products.

CAUTION: - add item; - modify cart.

DESTRUCTIVE: - place order; - issue refund; - delete account.

## Kill criterion

If exploration creates too much noise or cannot reliably distinguish
risky actions, constrain it to guided exploration.

------------------------------------------------------------------------

# 20. I13 --- One Demonstration → Test Family

V1 begins this as AI suggestion.

Mature version uses the ABM to systematically expand:

``` text
Demonstrated:
Valid checkout

Generate candidates:
Happy
Negative
Boundary
State
Interaction
Adversarial
```

The important evolution is from LLM creativity to application-grounded
generation.

------------------------------------------------------------------------

# 21. I14 --- Failure Reproduction Intelligence

Beyond replaying the same test.

Veyra identifies the minimum state necessary to reproduce.

Example:

``` text
Required:
Product = Watch
Coupon = SAVE20
Quantity = 2
Payment = Test Visa
Browser = WebKit

Not required:
Search path
Home page navigation
```

It can propose a shorter reproduction flow.

Human reviews before using.

------------------------------------------------------------------------

# 22. I15 --- Scientific / Counterfactual Debugging

## Concept

Compare failed and successful executions and isolate variables.

Example:

``` text
Success:
Build A
Coupon SAVE10
/orders 200

Failure:
Build B
Coupon SAVE10
/orders 500
```

Then propose experiment:

``` text
Run Build B with previous order-service version.
```

Goal:

Move from: \> "What changed?"

to: \> "What smallest experiment would help isolate the cause?"

This is high-value but requires strong evidence and environment
integration.

------------------------------------------------------------------------

# 23. I16 --- Historical Defect Immunity

Escaped production defect:

``` text
Two discount codes trigger free shipping.
```

Veyra converts approved incident knowledge into:

-   regression invariant;
-   related test;
-   combination risk;
-   historical risk factor.

Future coupon/shipping changes automatically surface this history.

Core principle:

> **Every escaped defect should permanently increase the application's
> immunity to that class of failure.**

------------------------------------------------------------------------

# 24. I17 --- ABM Diff

Compare application knowledge across releases:

``` text
ABM v31
vs
ABM v32
```

Show:

``` text
Changed behaviour
New behaviour
Removed behaviour
Uncertain behaviour
Changed dependencies
Affected historical failures
```

This becomes a major input to regression intelligence.

------------------------------------------------------------------------

# 25. I18 --- Risk-Based Regression Selection

## Inputs

``` text
Change impact
Historical failures
Business impact
Usage frequency
Dependency centrality
Flakiness
Coverage gaps
```

## Output

Instead of:

``` text
Run all 800 tests.
```

Veyra says:

``` text
Recommended first:
67 tests

Why:
• Checkout changed
• Coupon dependency changed
• 4 historical defects touch these areas
• 2 critical flows currently unvalidated
```

Users can always run all tests.

------------------------------------------------------------------------

# 26. I19 --- Predictive Quality Intelligence

More ambitious:

> Which parts of this release are most likely to fail?

Potential features:

-   change frequency;
-   historical failure rate;
-   dependency complexity;
-   previous regressions;
-   execution instability;
-   code/change signals later.

## Critical rule

Predictions require calibration and evidence.

Never present opaque "AI risk = 92%" without explanation.

------------------------------------------------------------------------

# 27. I20 --- Usage-Aware Testing

Optional production analytics enrich risk.

Example:

``` text
Search      80% of sessions
Checkout    15%
Refund       1%
```

Risk priority can include usage.

But business impact matters too:

Refund may be low-volume but financially sensitive.

Potential model:

``` text
Risk =
Failure likelihood
× Business impact
× Usage
× Change impact
× Historical propensity
```

Weights must be configurable/validated.

------------------------------------------------------------------------

# 28. I21 --- Quality Knowledge Coverage

## Strategic concept

Measure:

> **How much important application behaviour do we actually understand
> and validate?**

Potential dimensions:

``` text
Known behaviours
Known states
Known transitions
Approved rules
Validated transitions
High-risk paths
Uncertain behaviours
Historical-risk coverage
```

## Good metric

``` text
Known checkout transitions: 20
Validated: 16

Transition coverage = 80%
```

## Bad metric

``` text
Veyra understands your application 94%.
```

unless a defensible denominator exists.

## Research objective

Define rigorous denominators before creating a headline score.

------------------------------------------------------------------------

# 29. I22 --- Release Confidence

Veyra should eventually answer:

``` text
What changed?
What failed?
What is untested?
What is historically risky?
What should be tested next?
```

Potential dashboard:

``` text
Critical workflows
18 / 20 validated

Changed workflows
7 / 8 validated

High-risk untested paths
2

New failures
3

Recurring failures
1
```

Human decides:

``` text
GO / NO-GO
```

Veyra never claims to guarantee release safety.

------------------------------------------------------------------------

# 30. I23 --- Requirements-to-Coverage

Inputs: - PRD; - user story; - acceptance criteria; - release notes.

Example:

``` text
Requirement:
Expired coupons must not reduce Cart total.
```

Veyra maps to:

``` text
Known rule
Existing tests
Last validation
Coverage gap
```

If none:

``` text
No test validates this requirement.

[Generate Candidate Test]
```

------------------------------------------------------------------------

# 31. I24 --- Pre-Implementation Quality

Before feature exists:

``` text
New feature:
Buy Now bypasses Cart and opens Checkout.
```

Veyra uses existing ABM:

``` text
Product
Checkout
Payment
Order
```

and proposes:

-   affected behaviour;
-   dependencies;
-   tests needed;
-   historical risks.

This moves Veyra upstream from QA execution into quality planning.

------------------------------------------------------------------------

# 32. I25 --- Executable Living Documentation

Ask:

> How does Checkout work?

Veyra shows:

``` text
Observed flow
Business actions
Preconditions
Expected outcomes
Dependencies
Screenshots
Tests
Known failures
Last verified
```

Because this is generated from executable knowledge, it may stay more
current than traditional documentation.

Treat as a by-product of the ABM rather than an initial product
category.

------------------------------------------------------------------------

# 33. I26 --- Conversational Quality Interface

Examples:

> What hasn't been tested in Checkout?

> Why did yesterday's regression fail?

> Which Coupon tests should I run after this change?

> Generate refund edge cases.

Architecture:

``` text
Natural language
↓
Structured ABM query/action
↓
Deterministic data
↓
Explanation
```

The LLM should not invent application knowledge.

------------------------------------------------------------------------

# 34. I27 --- Cross-Application QA Ontology

Long-term Veyra can learn generic patterns:

``` text
Product
Cart
Coupon
Checkout
Payment
Order
Refund
```

without sharing customer-specific data.

This could improve first-use intelligence.

Example:

New application exposes: - product list; - cart; - checkout.

Veyra can suggest likely generic commerce concepts.

------------------------------------------------------------------------

# 35. I28 --- Privacy-Safe Cross-Customer Learning

Potential learnable generic signals:

-   common semantic element patterns;
-   generic workflow structures;
-   failure classifications;
-   safe exploration heuristics;
-   reusable QA strategies.

Never centralise: - customer credentials; - proprietary screenshots; -
private business rules; - customer-specific ABMs

for generic training without explicit lawful permission and product
policy.

This is both a privacy requirement and a trust requirement.

------------------------------------------------------------------------

# 36. I29 --- Application Immunity Index --- Research Only

Possible future concept:

Measure whether previously discovered defect classes remain protected by
trusted regression knowledge.

Example:

``` text
Historical critical defects: 20
Protected by active regression: 18
Stale protection: 1
Unprotected: 1
```

This is more defensible than a vague quality score.

Research whether customers find this valuable.

------------------------------------------------------------------------

# 37. I30 --- ABM Confidence Decay

Knowledge should not remain trusted forever.

Potential signals:

-   underlying workflow changed;
-   module not executed recently;
-   related page changed;
-   conflicting observation;
-   dependency changed.

Then:

``` text
Trusted
→
Needs Verification
```

This prevents old application knowledge from becoming misleading.

------------------------------------------------------------------------

# 38. I31 --- Semantic Test Maintenance

User should eventually stop thinking:

``` text
37 tests broke.
```

Veyra should say:

``` text
One underlying behaviour changed:
Select Shipping Method

Affected tests:
37

Proposed update:
...
```

This is a major expression of the ABM thesis.

------------------------------------------------------------------------

# 39. I32 --- Autonomous Maintenance

Only after semantic maintenance is trustworthy.

Potential:

``` text
UI implementation changed.
Business behaviour appears unchanged.
Confidence 99.4%.

Update implementation automatically?
```

Policy:

``` text
Suggest only
Auto-update high confidence
Never auto-update semantics
```

This is different from unrestricted self-healing.

------------------------------------------------------------------------

# 40. I33 --- Intelligent Test Retirement

Test suites accumulate obsolete tests.

Veyra can eventually detect:

-   duplicate semantic coverage;
-   deprecated behaviour;
-   tests superseded by modules;
-   tests never relevant to current app;
-   tests covering removed states.

Output:

``` text
12 tests appear redundant or obsolete.

[Review]
```

Human decides.

------------------------------------------------------------------------

# 41. I34 --- Coverage-Driven Test Budgeting

When execution time is limited:

``` text
You have 20 minutes.
```

Veyra chooses a candidate set maximising:

``` text
risk coverage
+
changed behaviour
+
historical failure coverage
+
critical workflows
```

This is practical risk intelligence.

------------------------------------------------------------------------

# 42. I35 --- Quality Memory Timeline

Application area:

``` text
Checkout
```

Timeline:

``` text
Jan — Checkout taught
Feb — Coupon added
Mar — Payment timeout defect
Apr — Checkout UI redesigned
Jun — Order API incident
Sep — Shipping dependency changed
```

This gives teams institutional memory.

Potential enterprise value is high.

------------------------------------------------------------------------

# 43. I36 --- Behavioural Blast Radius

Given change:

``` text
Coupon calculation changed.
```

Veyra maps:

``` text
Direct
Apply Coupon

Dependent
Cart Total
Shipping Threshold
Checkout Total
Refund Calculation

Historical
Free Shipping defect

Tests
24 affected
```

This is a strong ABM use case.

------------------------------------------------------------------------

# 44. I37 --- Intent-Preserving Refactoring

If many tests contain similar but non-identical behaviour, Veyra
proposes consolidation.

Example:

``` text
17 tests contain variations of Product Search.

Create one semantic Search Product module?

Differences:
• sort
• category
• query

Suggested inputs:
query
category?
sort?
```

This goes beyond simple identical-sequence detection.

------------------------------------------------------------------------

# 45. I38 --- Quality Recommendation Feed

Instead of generic alerts:

``` text
Recommended today

1. Re-run Coupon Regression
   Coupon behaviour changed.

2. Review WebKit Checkout failure
   New browser-specific regression.

3. Add Partial Refund test
   Known state transition has no validation.
```

Every recommendation must include **why**.

------------------------------------------------------------------------

# 46. I39 --- Quality Agent

Only after underlying structured capabilities mature.

A future Veyra agent could execute a bounded objective:

> Validate the changed Checkout area in Staging.

Agent plan:

``` text
Inspect ABM change
Select relevant tests
Check prerequisites
Run safe tests
Generate candidate missing tests
Ask permission for risky tests
Diagnose failures
Produce quality brief
```

The agent orchestrates trusted Veyra capabilities.

It does not replace the ABM with free-form reasoning.

------------------------------------------------------------------------

# 47. I40 --- Pre-Release Quality Brief

Future output:

``` text
Release Quality Brief

Changed:
Checkout, Coupon

Validated:
6/7 changed behaviours

Failures:
1 new WebKit failure

Historical risk:
2 previous Coupon incidents

Untested:
Coupon + Gift Card + Partial Refund

Recommendation:
Investigate WebKit failure and validate untested pricing interaction before release.
```

This may become one of Veyra's highest-value management outputs.

------------------------------------------------------------------------

# 48. Innovation Priority Matrix

  ------------------------------------------------------------------------------------------------------------------
  Innovation                 Horizon                Value   Differentiation   Feasibility          ABM Priority
                                                                                            dependency 
  -------------------------- ---------------- ----------- ----------------- ------------- ------------ -------------
  Assisted semantic healing  Next                       5                 2             5            3 High

  Flakiness intelligence     Next                       5                 3             4            2 High

  Semantic change detection  Next                       5                 4             3            4 High

  Risk-aware ordering        Next                       4                 3             4            3 High

  Learned invariants         Later                      5                 4             3            4 High

  Goal-based testing         Research                   5                 5             2            5 High research

  State-space model          Later                      5                 4             3            5 High

  Combinatorial intelligence Later                      5                 4             4            4 High

  Adversarial testing        Later                      5                 4             3            4 High

  Safe Explore Mode          Research/Later             5                 4             2            5 High research

  Counterfactual debugging   Later                      5                 4             3            4 High

  Defect immunity            Later                      5                 5             4            4 Very high

  ABM diff                   Later                      5                 4             3            5 High

  Risk-based regression      Later                      5                 4             3            5 Very high

  Predictive quality         Research                   5                 5             2            5 Research

  Quality Knowledge Coverage Research                   5                 5             2            5 Very high
                                                                                                       research

  Release Confidence         Later                      5                 4             3            5 High

  Requirements-to-coverage   Later                      4                 3             4            4 Medium-high

  Pre-implementation quality Research/Later             4                 4             3            5 Medium-high

  Executable documentation   Later                      3                 3             4            5 Medium

  Conversational QA          Later                      4                 3             4            4 Medium

  Cross-app ontology         Research                   5                 5             2            5 Long-term

  Confidence decay           Later                      4                 4             4            5 High

  Semantic maintenance       Later                      5                 5             3            5 Very high

  Intelligent retirement     Later                      3                 4             3            5 Medium

  Behavioural blast radius   Later                      5                 5             3            5 Very high

  Quality agent              Later                      5                 3             3            5 After
                                                                                                       foundations

  Quality brief              Later                      5                 4             4            5 High
  ------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 49. Recommended Innovation Sequence

Do not implement by excitement.

Recommended dependency order:

``` text
V0/V1 FOUNDATION
Semantic modules
Provenance
Dependencies
Failure memory
Run history
Evidence
        ↓
RESILIENCE
Assisted healing
Flakiness
Semantic change detection
        ↓
KNOWLEDGE
Learned invariants
State model
Confidence decay
        ↓
DISCOVERY
Test families
Missing transitions
Combinatorial testing
Adversarial testing
        ↓
CHANGE + RISK
ABM diff
Blast radius
Risk regression
Defect immunity
        ↓
QUALITY INTELLIGENCE
Knowledge Coverage
Release Confidence
Quality Brief
        ↓
AUTONOMY
Explore Mode
Quality Agent
Predictive Quality
```

------------------------------------------------------------------------

# 50. Innovations We Should Not Rush

## Full autonomous self-healing

Because semantic false positives are dangerous.

## Full autonomous exploration

Because destructive actions and noisy discoveries can destroy trust.

## Predictive quality scores

Because poorly calibrated risk scores look intelligent while being
misleading.

## Universal ABM ontology

Because applications differ and premature ontology design creates
complexity.

## Cross-customer learning

Because privacy, data rights and usefulness must be proven.

## Quality Knowledge percentage

Because a denominator must be defensible.

## Agent-first UX

Because agents should orchestrate reliable capabilities rather than
compensate for missing foundations.

------------------------------------------------------------------------

# 51. Innovation Kill Rules

Veyra should be willing to kill ideas.

An innovation should be paused/killed if:

1.  customers do not understand the benefit;
2.  it adds more review work than it removes;
3.  precision is too low for the risk level;
4.  it requires frontier-model calls at uneconomic frequency;
5.  it cannot provide evidence for consequential recommendations;
6.  it silently changes business intent;
7.  it does not improve the ABM or commercial workflow;
8.  a simpler deterministic technique performs equally well;
9.  competitors commoditise it before we establish advantage;
10. customer usage shows a different problem is more valuable.

------------------------------------------------------------------------

# 52. Research Experiment Template

Every Research innovation should start with:

``` text
Hypothesis
Customer problem
Required data
Prototype
Baseline
Success metric
Safety constraint
Cost ceiling
Kill threshold
```

Example:

``` text
Hypothesis:
ABM-driven regression can reduce execution by 60%
without materially reducing critical defect detection.

Baseline:
Full regression.

Experiment:
Compare ABM-selected subset against full suite
across historical releases.

Success:
Major runtime reduction while preserving
critical-failure detection.

Kill:
Misses unacceptable critical failures.
```

------------------------------------------------------------------------

# 53. Innovation Evaluation Dataset

Veyra should build an internal evaluation corpus using the controlled
commerce fixture.

Include:

``` text
UI renames
DOM redesigns
API failures
Timing failures
Coupon defects
Shipping defects
Order defects
Refund defects
Browser-specific defects
Data expiry
Parallel-state conflicts
Historical recurring defects
```

Every intelligence feature should be evaluated against reproducible
scenarios.

------------------------------------------------------------------------

# 54. Human-Control Requirement by Risk

## Low-risk suggestions

Examples: - module name; - description.

Can be automatically suggested.

## Medium-risk changes

Examples: - parameter; - assertion; - locator replacement.

Require visible review.

## High-risk semantic changes

Examples: - expected business outcome; - goal equivalence; - destructive
Explore action.

Require explicit human approval.

The higher the semantic/business risk, the stronger the governance.

------------------------------------------------------------------------

# 55. Intelligence Cost Requirement

For every AI-heavy innovation, benchmark:

``` text
Deterministic baseline
Classical ML baseline
Local model
Cloud small model
Frontier model
```

Select the cheapest tier meeting quality requirements.

Do not assume the most capable model belongs in the runtime loop.

------------------------------------------------------------------------

# 56. Innovation Moat Hierarchy

Individual AI features are copyable.

Potential defensibility compounds across layers:

``` text
Exceptional UX
      +
Low-cost local-first execution
      +
Customer-specific ABM
      +
Historical quality memory
      +
Application-grounded recommendations
      +
Privacy-safe generic QA intelligence
```

The ABM and accumulated quality memory should make later innovations
better.

------------------------------------------------------------------------

# 57. Near-Term Innovation Backlog

After V1 stabilises, recommended first experiments:

### Experiment 1

Semantic assisted healing.

### Experiment 2

Flakiness detection from run history.

### Experiment 3

Learned candidate invariants for 3--5 common commerce actions.

### Experiment 4

Historical failure → regression recommendation.

### Experiment 5

Basic behavioural blast radius from explicit dependencies.

These are sufficiently bounded to validate the larger thesis.

------------------------------------------------------------------------

# 58. Mid-Term Innovation Backlog

If near-term experiments work:

1.  ABM diff;
2.  state modelling for Checkout/Order;
3.  missing-transition discovery;
4.  combinatorial pricing tests;
5.  adversarial checkout mutations;
6.  confidence decay;
7.  semantic maintenance;
8.  risk-based regression subset.

------------------------------------------------------------------------

# 59. Long-Term Research Backlog

Only after mature ABM:

1.  Goal-based execution;
2.  Safe Explore Mode;
3.  predictive quality;
4.  Quality Knowledge Coverage;
5.  pre-implementation quality;
6.  cross-application ontology;
7.  Quality Agent;
8.  application-wide release intelligence.

------------------------------------------------------------------------

# 60. Strategic North-Star Experiment

The ultimate experiment:

Give Veyra:

``` text
Staging commerce URL
Safe credentials
Environment policy
```

without authored tests.

Ask:

> **"Understand enough of this application to tell me what should be
> tested."**

A successful future Veyra should:

1.  explore safe areas;
2.  identify commerce entities/actions;
3.  construct candidate ABM;
4.  identify important workflows;
5.  propose expected outcomes;
6.  generate candidate tests;
7.  ask for human confirmation;
8.  execute approved safe tests;
9.  identify anomalies;
10. learn from corrections.

That is the transition from:

``` text
Test Automation
```

to:

``` text
Application Quality Intelligence
```

------------------------------------------------------------------------

# 61. Innovation Queue Summary

The innovation portfolio should be treated as a **compounding ladder**,
not a feature wishlist.

``` text
SEMANTIC AUTOMATION
      ↓
APPLICATION KNOWLEDGE
      ↓
FAILURE + CHANGE MEMORY
      ↓
DISCOVERY
      ↓
RISK INTELLIGENCE
      ↓
QUALITY KNOWLEDGE
      ↓
SAFE AUTONOMY
```

The most important strategic bets are:

1.  semantic application knowledge;
2.  historical defect immunity;
3.  semantic maintenance;
4.  behavioural blast radius;
5.  risk-based regression;
6.  state/knowledge coverage;
7.  human-governed exploration;
8.  local-first intelligent economics.

Veyra should earn the right to build each layer by proving the layer
beneath it.

The final product principle remains:

> **Veyra should become more valuable because it remembers what the
> application means, what has changed, what has failed before and what
> remains uncertain---not simply because its underlying AI model becomes
> more powerful.**
