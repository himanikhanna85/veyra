# 06 --- Veyra V1 Product

**Product:** Veyra\
**Category:** Application Quality Intelligence Platform\
**Release:** V1\
**V1 role:** First broader commercial release beyond browser-only V0\
**Primary shift:** From intelligent browser automation to
application-aware quality intelligence\
**Domain examples:** E-commerce

------------------------------------------------------------------------

# 1. V1 Objective

Veyra V1 should prove that the product becomes more useful as it
accumulates application knowledge.

V0 proves:

> A tester can teach reusable browser behaviour without becoming an
> automation engineer.

V1 must prove:

> Veyra can use browser behaviour, API context, historical failures,
> reusable modules, application dependencies and AI-assisted reasoning
> to create, execute and diagnose tests more intelligently over time.

V1 is where the Application Behaviour Model becomes visibly useful.

------------------------------------------------------------------------

# 2. V1 Product Promise

Working promise:

> **Veyra understands more of your application every time you teach,
> test and diagnose it --- then uses that knowledge to create better
> tests, run them faster and explain failures more clearly.**

A V1 QA team should be able to:

1.  continue using every V0 capability;
2.  test browser and API behaviour together;
3.  run suites in parallel;
4.  schedule regression runs;
5.  run across Chromium, Firefox and WebKit;
6.  generate candidate tests using AI;
7.  generate test families from taught workflows;
8.  diagnose failures using evidence across UI + API + history;
9.  reuse trusted business modules when generating new tests;
10. track provenance/confidence of learned knowledge;
11. remember important historical failures;
12. identify obvious impact when a shared module or behaviour changes.

------------------------------------------------------------------------

# 3. V1 Strategic Boundary

V1 is **not** yet:

-   a fully autonomous QA agent;
-   a fully self-healing platform;
-   a complete application state-space model;
-   a release decision engine;
-   a predictive quality system;
-   a cloud browser farm;
-   a mobile testing suite;
-   an autonomous exploratory testing product.

Those belong to V1.x, Later or Research.

V1 should be ambitious enough to feel substantially smarter than V0, but
disciplined enough to remain reliable and explainable.

------------------------------------------------------------------------

# 4. V1 Core Themes

V1 is built around six themes.

## Theme 1 --- Broader execution

-   API testing;
-   Chromium/Firefox/WebKit;
-   parallel execution;
-   scheduling.

## Theme 2 --- Application knowledge

-   richer ABM;
-   dependencies;
-   business entities/actions;
-   provenance;
-   confidence;
-   historical failure memory.

## Theme 3 --- AI creation

-   generate candidate tests;
-   test-family expansion;
-   natural-language editing;
-   reuse trusted modules first.

## Theme 4 --- Better diagnostics

-   correlate UI + network + API;
-   compare against successful runs;
-   provide evidence-backed probable cause.

## Theme 5 --- Intelligent data/preconditions

-   understand prerequisites;
-   validate test data;
-   detect obvious expired/invalid dependencies.

## Theme 6 --- Team readiness

-   workspace/team layer;
-   cloud sync where useful;
-   scheduling coordination;
-   shared test knowledge.

------------------------------------------------------------------------

# 5. V1 Information Architecture

Primary product navigation can evolve to:

``` text
Home
Projects
  └── Project
      ├── Teach
      ├── Tests
      ├── Modules
      ├── API
      ├── Runs
      ├── Results
      ├── Data
      ├── Knowledge
      └── Settings
```

"Knowledge" is the first user-facing doorway into the ABM.

It should not expose raw graph complexity.

It should expose useful application understanding.

------------------------------------------------------------------------

# 6. V1 Knowledge Surface

Example:

``` text
Application Knowledge

Business Areas
Search
Product
Cart
Checkout
Payment
Order
Refund

Known reusable behaviours
18

Known dependencies
26

Known historical failure patterns
7

Suggested new tests
12
```

Click Checkout:

``` text
Checkout

Known behaviours
- Start Checkout
- Apply Coupon
- Select Address
- Select Payment
- Place Order

Dependencies
- Cart contains purchasable item
- Shipping address exists
- Payment method available

Known failures
- Order API 500
- Coupon + free shipping defect

Related tests
23
```

This is the first visible expression of the ABM.

------------------------------------------------------------------------

# 7. V1 ABM Expansion

V0 ABM:

``` text
Business Module
├── Intent
├── Inputs
├── Outputs
├── Preconditions
├── Expected Outcomes
├── Implementation
└── Evidence
```

V1 adds:

``` text
Business Entity
Business Action
Dependency
Historical Failure
Provenance
Confidence
Human Approval
Last Verified
Related Tests
Related Modules
Observed Changes
```

Potential entity examples:

``` text
Product
Cart
Coupon
Checkout
Payment
Order
Refund
```

------------------------------------------------------------------------

# 8. Business Entity Model

Conceptual object:

``` ts
BusinessEntity {
  id
  name
  type
  attributes
  provenance
  confidence
}
```

Example:

``` text
Entity:
Coupon

Attributes:
code
expiry
discount_type
minimum_cart_value
```

V1 does not need a universal ontology.

Only model concepts actually learned/used in customer workflows.

------------------------------------------------------------------------

# 9. Business Action Model

``` ts
BusinessAction {
  id
  name
  actsOn
  inputs
  outputs
  preconditions
  expectedOutcomes
  implementationRefs
}
```

Example:

``` text
Apply Coupon

actsOn:
Cart

input:
coupon

preconditions:
Cart subtotal qualifies

expected outcomes:
discount applied
total recalculated
```

This is richer than an ordinary reusable test group.

------------------------------------------------------------------------

# 10. Dependency Model

V1 should capture practical execution dependencies.

Example:

``` text
Checkout
REQUIRES
Cart with purchasable item
```

``` text
Apply Coupon
REQUIRES
Valid coupon
```

``` text
Refund Order
REQUIRES
Eligible order
```

These dependencies help:

-   prevent bad test data;
-   explain BLOCKED tests;
-   generate better tests;
-   diagnose failures;
-   later support risk analysis.

------------------------------------------------------------------------

# 11. Provenance and Confidence

Every important learned V1 fact should contain:

``` text
Source
Confidence
Human Approved?
Last Verified
```

Examples of sources:

-   taught by user;
-   explicit assertion;
-   observed from run;
-   generated by AI;
-   inferred from API;
-   historical failure.

Example:

``` text
Rule:
"Expired coupon must not reduce total"

Source:
Human-approved generated test

Confidence:
1.0

Last Verified:
2026-09-10
```

------------------------------------------------------------------------

# 12. V1 Knowledge Lifecycle

Introduce the lifecycle:

``` text
Observed
→ Suggested
→ Human Approved
→ Trusted
→ Stale
→ Deprecated
```

V1 need not automate every transition.

But it should support:

-   Suggested;
-   Approved;
-   Trusted;
-   Deprecated.

Staleness can begin with simple rules.

------------------------------------------------------------------------

# 13. API Testing

API testing is a V1 P0 capability.

Veyra should support:

-   GET;
-   POST;
-   PUT;
-   PATCH;
-   DELETE;
-   headers;
-   query params;
-   JSON/body;
-   auth;
-   variables;
-   response extraction;
-   status assertions;
-   body assertions.

------------------------------------------------------------------------

# 14. API Test UX

API should use the same semantic product philosophy.

Example:

``` text
API Step
Create Test Product

POST
/api/products

Body
{
  "name": "{{product}}",
  "price": "{{price}}"
}

Extract
product_id = response.id

Expected
Status = 201
```

Then:

``` text
Open Product Page
/products/{{product_id}}
```

UI + API flows are one test model.

------------------------------------------------------------------------

# 15. UI + API Hybrid Testing

This is strategically important.

Example:

``` text
API
Create inventory item
      ↓
UI
Search product
      ↓
UI
Add to Cart
      ↓
API
Verify cart service contains item
      ↓
UI
Checkout
```

Benefits:

-   faster setup;
-   cleaner test data;
-   richer diagnostics;
-   less dependency on UI for every operation.

------------------------------------------------------------------------

# 16. OpenAPI Enrichment

V1 may include a first version of OpenAPI import.

Purpose:

-   create API request definitions;
-   recognise endpoint names;
-   suggest variable extraction;
-   enrich ABM dependencies.

Do not promise automatic complete API test generation from an OpenAPI
file in V1.

That can be later.

------------------------------------------------------------------------

# 17. Multi-Browser

V1 should add:

-   Firefox;
-   WebKit.

User can choose:

``` text
Browsers
☑ Chromium
☑ Firefox
☑ WebKit
```

Results remain separate.

Example:

``` text
Checkout

Chromium   PASS
Firefox    PASS
WebKit     FAIL
```

This is clear and useful.

------------------------------------------------------------------------

# 18. Browser Matrix

A test suite can run:

``` text
3 tests
×
3 browsers
=
9 run cases
```

Users should see this before execution.

Avoid surprising cost/time.

For local runs, warn about hardware implications.

------------------------------------------------------------------------

# 19. Parallel Execution

V1 P0.

User setting:

``` text
Parallel workers
4
```

Default based on machine capability.

Execution:

``` text
Test A → Worker 1
Test B → Worker 2
Test C → Worker 3
Test D → Worker 4
```

Each should have isolated browser context.

------------------------------------------------------------------------

# 20. Parallel Safety

V1 should include basic safeguards.

Potential shared resources:

-   same user;
-   same cart;
-   same coupon;
-   same order;
-   same inventory item.

V1 behaviour:

-   allow user to flag tests/resources as shared/exclusive;
-   warn when obviously conflicting tests are parallelised.

Full ABM-aware resource scheduling can wait.

------------------------------------------------------------------------

# 21. Scheduling

V1 P0.

Example:

``` text
Schedule
Checkout Regression

Every weekday
07:00

Environment
Staging

Browsers
Chromium + Firefox
```

Important distinction:

## Local schedule

Runs only if: - machine is awake; - Veyra is available.

## Cloud schedule

Only available if cloud execution exists in the selected plan.

V1 can support local schedules first.

------------------------------------------------------------------------

# 22. Schedule Results

User returns to:

``` text
Scheduled Runs

Checkout Regression
Today 07:00

31 passed
2 failed
1 blocked
```

Highlight changes since previous comparable run.

------------------------------------------------------------------------

# 23. AI Test Creation

V1 should support natural-language creation.

Example:

> "Test buying an in-stock watch using a valid coupon."

Veyra should first search existing trusted application knowledge.

It may find:

``` text
Search Product
Add To Cart
Apply Coupon
Checkout
Verify Order
```

Then compose:

``` text
Search Product(product=Watch)
Add To Cart()
Apply Coupon(coupon={{valid_coupon}})
Checkout()
Verify Order()
```

Generate new browser operations only for missing behaviour.

------------------------------------------------------------------------

# 24. Reuse-First Generation

Generation policy:

``` text
1. Use trusted existing modules.
2. Use trusted existing variables/data.
3. Reuse known assertions.
4. Generate only missing steps.
5. Show generated parts clearly.
```

This reduces:

-   hallucination;
-   model usage;
-   brittleness;
-   maintenance.

It also makes Veyra improve as its application knowledge grows.

------------------------------------------------------------------------

# 25. Generated Test Review

AI never silently adds tests to trusted regression.

Generated test:

``` text
Candidate Test
Purchase Watch With Coupon

Uses existing modules
✓ Search Product
✓ Add To Cart
✓ Apply Coupon
✓ Checkout

Generated
• Verify discounted total

[Accept]
[Edit]
[Reject]
```

User decides.

------------------------------------------------------------------------

# 26. Test-Family Generation

From one trusted workflow:

``` text
Successful checkout
```

Veyra can propose:

### Happy

-   checkout with standard product.

### Negative

-   invalid coupon;
-   declined payment.

### Boundary

-   maximum quantity;
-   coupon minimum threshold.

### Behaviour

-   double Place Order;
-   refresh before confirmation.

### State

-   expired coupon;
-   out-of-stock product.

V1 should start with candidate generation, not automatic execution of
every case.

------------------------------------------------------------------------

# 27. Test-Family UX

Example:

``` text
Veyra found 8 useful variations

☑ Invalid coupon
☑ Expired coupon
☑ Payment declined
☐ Maximum quantity
☐ Refresh during payment
☐ Double Place Order
☐ Out-of-stock after Cart
☐ Coupon minimum threshold

[Add Selected Tests]
```

This keeps humans in control and avoids test explosion.

------------------------------------------------------------------------

# 28. Learned Candidate Assertions

V1 can propose assertions based on repeated observations.

Example:

Over repeated successful Add To Cart runs:

``` text
cart count increases
product appears
subtotal changes
```

Veyra proposes:

``` text
These outcomes consistently follow Add To Cart.

Add as expected outcomes?

☑ Product appears in Cart
☑ Cart count increases
☐ Subtotal changes

[Approve]
```

These should remain candidates until approved.

------------------------------------------------------------------------

# 29. Guard Against Learning Bugs

Observed behaviour is not ground truth.

Example:

If a defect causes free shipping to be applied repeatedly, Veyra must
not automatically learn:

``` text
Two coupons → free shipping
```

Therefore:

``` text
Observation
≠
Trusted rule
```

Only: - explicit human assertion; - approved generated rule; - trusted
requirement; - explicit policy

can promote knowledge into trusted expectation.

------------------------------------------------------------------------

# 30. Test Preconditions

V1 should make preconditions visible.

Example test:

``` text
Checkout With Coupon
```

Preconditions:

``` text
User authenticated
Product in stock
Cart contains product
Coupon valid
```

Before execution:

``` text
Checking prerequisites...
```

------------------------------------------------------------------------

# 31. Test Data Failure

If coupon is expired:

Do not immediately FAIL the application.

Result may be:

``` text
BLOCKED

Precondition failed:
Coupon SAVE20 expired.

[Choose another coupon]
[Edit test]
[Run anyway]
```

This reduces noisy false defects.

------------------------------------------------------------------------

# 32. Replacement Suggestions

If Veyra knows other valid coupons:

``` text
SAVE20 expired.

Available candidate:
WELCOME10

[Use Once]
[Edit Data]
[Cancel]
```

V1 should not silently change test data because that can change test
intent.

------------------------------------------------------------------------

# 33. AI Diagnostics

V1 should significantly improve failure explanation.

Pipeline:

``` text
Failure
↓
Explicit assertion
↓
Browser state
↓
Console
↓
Network
↓
API context
↓
Previous success
↓
Known failure patterns
↓
Structured diagnosis
```

------------------------------------------------------------------------

# 34. Diagnostic Output

Example:

``` text
FAIL

Checkout did not create an order.

Evidence
• Payment authorization succeeded.
• POST /orders returned HTTP 500.
• Order confirmation page did not load.
• No browser-side exception before the request.

Likely failure area
Order creation service

Confidence
High

[Open Network Evidence]
[Compare With Last Success]
[Reproduce]
```

Important:

Veyra says **Likely**, not "definitely", unless deterministic evidence
proves it.

------------------------------------------------------------------------

# 35. Diagnostic Categories

V1 taxonomy:

``` text
UI_FAILURE
API_FAILURE
ASSERTION_FAILURE
AUTOMATION_BLOCKED
TEST_DATA_FAILURE
ENVIRONMENT_FAILURE
TIMING_FAILURE
UNKNOWN
```

A single run may have multiple observations but one primary
classification.

------------------------------------------------------------------------

# 36. Compare With Last Success

V1 P1.

Example:

``` text
Current Failure vs Last Successful Run

Changed
/orders response: 200 → 500
Checkout frontend build: unchanged
Browser: same
Payment provider: same
Coupon: same
```

This is the first step toward counterfactual debugging.

------------------------------------------------------------------------

# 37. Reproduce Failure

V1 should provide:

``` text
[Reproduce Failure]
```

Where safe.

Veyra restores:

-   test version;
-   module versions;
-   browser;
-   dataset;
-   environment;
-   non-secret state;
-   secret references.

Warn if environment/application version changed.

------------------------------------------------------------------------

# 38. Historical Failure Memory

V1 introduces semantic failure memory.

Example:

``` text
Known Failure Pattern

Area
Coupon / Shipping

Pattern
Two discount codes incorrectly triggered free shipping.

First seen
12 Jul

Last seen
12 Jul

Production escape
Yes

Related tests
Coupon Stack Regression
Shipping Threshold
```

This memory should be linked to relevant modules/entities.

------------------------------------------------------------------------

# 39. Failure Memory Usage in V1

When related tests/modules change:

``` text
Coupon behaviour changed.

This area has 2 known historical failure patterns.

Recommended:
Run Coupon Regression suite.
```

This is a simple V1 version of future risk-based regression.

------------------------------------------------------------------------

# 40. Change Awareness

V1 should detect practical changes.

Examples:

-   module changed;
-   element identity changed;
-   page structure changed significantly;
-   API response changed;
-   test dependency changed.

It should answer:

``` text
What tests might be affected?
```

------------------------------------------------------------------------

# 41. Module Impact View

Example:

``` text
Module Changed
Apply Coupon v4 → v5

Used by
17 tests

Historical failures linked
2

[Review Affected Tests]
```

No predictive score required yet.

------------------------------------------------------------------------

# 42. Basic Dependency Impact

Example:

``` text
Checkout depends on:
Cart
Coupon
Payment
Order

Coupon module changed.

Potentially affected:
Checkout With Coupon
Coupon Boundary
Checkout Regression
```

This can begin with explicit relationships rather than ML.

------------------------------------------------------------------------

# 43. V1 Knowledge Page --- Failure Memory

Example:

``` text
Failure Memory

Order Creation Failure
4 occurrences

Coupon / Free Shipping
1 production escape

Payment Timeout
3 occurrences
```

Click to see:

-   evidence;
-   related tests;
-   related modules;
-   resolution notes;
-   recurrence.

------------------------------------------------------------------------

# 44. Natural-Language Test Editing

Example:

> "Change this test to use quantity 3 and verify free shipping."

Veyra proposes structured changes:

``` text
Change quantity:
1 → 3

Add assertion:
Shipping cost = 0

[Apply]
[Edit]
[Cancel]
```

Again, proposal not silent action.

------------------------------------------------------------------------

# 45. Conversational Assistance Scope

V1 can support limited action-oriented queries:

-   create test;
-   edit test;
-   explain failure;
-   find module;
-   find historical failure;
-   summarize run.

Do not attempt a fully open conversational application-intelligence
interface yet.

------------------------------------------------------------------------

# 46. Team Workspace

V1 should support a team layer.

Capabilities:

-   shared projects;
-   shared tests;
-   shared modules;
-   shared datasets;
-   shared run history;
-   shared knowledge/failure memory.

Roles can initially be simple:

``` text
Admin
Editor
Viewer
```

------------------------------------------------------------------------

# 47. Sync Strategy

Local remains important.

Recommended V1 model:

``` text
Local project cache
        ↕
Cloud workspace
```

Cloud is authoritative for shared objects.

Execution artifacts may be: - local-only; - selectively synced; -
policy-controlled.

This supports privacy-sensitive customers.

------------------------------------------------------------------------

# 48. Conflict Handling

Shared editing needs version checks.

Example:

``` text
Search Product module was updated by another user.

Your version: v4
Current: v5

[Review Changes]
```

Avoid silent overwrites.

------------------------------------------------------------------------

# 49. AI Modes

V1 introduces explicit project modes:

``` text
Local Only
Hybrid
Cloud Enhanced
```

## Local Only

No test/application context sent to cloud AI.

## Hybrid

Rules/ML/local AI first; cloud escalation with policy.

## Cloud Enhanced

Use cloud reasoning more aggressively.

The core product remains deterministic regardless.

------------------------------------------------------------------------

# 50. Cloud AI Redaction

Before cloud call:

-   secrets removed;
-   cookies removed;
-   auth tokens removed;
-   payment details removed;
-   sensitive fields masked;
-   project policy checked.

Where practical, user can inspect or audit cloud use.

------------------------------------------------------------------------

# 51. AI Cost Controls

Workspace/project settings:

``` text
AI Budget
Standard

Prefer local
ON

Cloud escalation
Only when needed
```

Admin can see:

-   model calls;
-   estimated usage/cost;
-   task category.

This protects Veyra economics.

------------------------------------------------------------------------

# 52. Local Intelligence in V1

Local model tasks may include:

-   step description;
-   module naming;
-   simple intent;
-   semantic mapping;
-   basic failure summary;
-   natural-language parsing.

Cloud model tasks:

-   complex generation;
-   deep multi-source diagnosis;
-   long requirement reasoning;
-   complicated test-family creation.

------------------------------------------------------------------------

# 53. V1 Results Dashboard

V1 project dashboard should evolve from simple pass rate.

Example:

``` text
Last Regression

PASS        84
FAIL         5
BLOCKED      3

New failures
2

Recurring failures
3

Changed modules
1

Recommended review
Checkout / Coupon
```

Still avoid a fake "Quality Score."

------------------------------------------------------------------------

# 54. Run Comparison

V1 should allow:

``` text
Compare Runs
```

Useful dimensions:

-   pass/fail changes;
-   duration changes;
-   new blocked steps;
-   network failures;
-   API status changes;
-   browser differences;
-   module/test versions.

------------------------------------------------------------------------

# 55. Scheduling + Notifications

V1 can notify inside Veyra/cloud workspace when a scheduled run
completes.

External Slack/email integrations can wait unless customer demand proves
otherwise.

Notification example:

``` text
Checkout Regression completed.

2 new failures
1 recurring failure
0 blocked
```

------------------------------------------------------------------------

# 56. V1 Reports

Reports should improve beyond V0.

Add:

-   failure classification;
-   probable failure area;
-   confidence;
-   comparison to last success;
-   historical failure link;
-   related network/API evidence;
-   module/test versions.

Export still: - HTML; - PDF.

Potential: - structured JSON for integrations later.

------------------------------------------------------------------------

# 57. V1 P0 Scope

## Execution

-   API testing;
-   Firefox;
-   WebKit;
-   local parallel execution;
-   scheduling.

## AI authoring

-   natural-language test generation;
-   reuse-first composition;
-   natural-language editing.

## ABM

-   business actions;
-   entities;
-   dependencies;
-   provenance;
-   confidence;
-   approval state;
-   historical failure memory.

## Diagnostics

-   evidence-backed AI diagnosis;
-   UI/API correlation;
-   compare to prior success;
-   reproduce failure.

## Test intelligence

-   test-family suggestions;
-   candidate assertions;
-   precondition checks.

## Team

-   shared workspace;
-   basic roles;
-   sync.

------------------------------------------------------------------------

# 58. V1 P1 Scope

-   OpenAPI import;
-   change-aware affected-test list;
-   failure clustering;
-   local/cloud AI modes;
-   AI cost controls;
-   run comparison;
-   resource conflict warnings;
-   semantic module composition;
-   generated test review UX;
-   basic staleness indication;
-   structured diagnostic confidence.

------------------------------------------------------------------------

# 59. V1 Explicit Exclusions

Do not require for V1 launch:

-   full autonomous self-healing;
-   silent selector repair;
-   native mobile;
-   visual regression;
-   accessibility;
-   CI/CD;
-   Jira;
-   Slack;
-   GitHub;
-   full autonomous Explore Mode;
-   full state-transition graph;
-   Quality Knowledge Coverage;
-   Release Confidence;
-   predictive regression;
-   production usage analytics;
-   fully autonomous test selection;
-   pre-implementation test generation;
-   cross-customer learning;
-   large cloud browser farm.

------------------------------------------------------------------------

# 60. V1 Acceptance Scenario A --- Hybrid UI/API Test

Test:

``` text
API creates product
→ UI searches product
→ UI adds to Cart
→ API verifies cart content
```

Acceptance:

-   one Veyra test;
-   variables flow between API/UI;
-   one evidence timeline;
-   clear result.

------------------------------------------------------------------------

# 61. V1 Acceptance Scenario B --- AI Test Composition

Existing trusted modules:

``` text
Search Product
Add To Cart
Apply Coupon
Checkout
Verify Order
```

User asks:

> "Test buying a watch with a valid coupon."

Veyra creates candidate test primarily from existing modules.

Acceptance:

-   generated parts clearly identified;
-   user can accept/edit/reject;
-   no unnecessary duplicate browser logic.

------------------------------------------------------------------------

# 62. V1 Acceptance Scenario C --- Test Family

User teaches successful coupon checkout.

Veyra proposes:

``` text
Invalid coupon
Expired coupon
Minimum subtotal
Payment decline
```

User selects two.

Acceptance:

-   selected tests are created;
-   unselected tests are not;
-   candidate origin retained.

------------------------------------------------------------------------

# 63. V1 Acceptance Scenario D --- API Root Cause

UI order confirmation fails.

Evidence:

``` text
Payment authorization = success
POST /orders = 500
```

Veyra reports:

``` text
Likely failure area: Order creation API
```

Acceptance:

-   supporting evidence visible;
-   confidence shown;
-   diagnostic not presented as absolute certainty.

------------------------------------------------------------------------

# 64. V1 Acceptance Scenario E --- Prior Success Comparison

Yesterday:

``` text
/orders = 200
```

Today:

``` text
/orders = 500
```

Everything else equivalent enough.

Veyra shows this as the highest-value difference.

Acceptance:

No massive undifferentiated diff dump.

------------------------------------------------------------------------

# 65. V1 Acceptance Scenario F --- Historical Failure Memory

Known historical defect:

``` text
Coupon stacking triggers free shipping
```

Coupon module changes.

Veyra says:

``` text
This area has a linked historical failure.
Recommended: run Coupon Stack Regression.
```

Acceptance:

Historical knowledge influences current recommendation.

------------------------------------------------------------------------

# 66. V1 Acceptance Scenario G --- Precondition Failure

Test requires valid coupon.

Coupon expired.

Veyra returns:

``` text
BLOCKED / TEST DATA
```

rather than application FAIL.

Acceptance:

User can choose replacement or cancel.

------------------------------------------------------------------------

# 67. V1 Acceptance Scenario H --- Multi-Browser

Checkout suite executes on:

``` text
Chromium
Firefox
WebKit
```

Only WebKit fails.

Acceptance:

Veyra preserves browser-specific result/evidence.

------------------------------------------------------------------------

# 68. V1 Acceptance Scenario I --- Parallel Execution

20 tests run with four workers.

Acceptance:

-   UI remains responsive;
-   isolated tests do not leak state;
-   result aggregation correct;
-   cancellation works.

------------------------------------------------------------------------

# 69. V1 Acceptance Scenario J --- AI Policy

Project set to:

``` text
Local Only
```

Veyra performs normal execution and local AI tasks.

A cloud-only generation task is requested.

Acceptance:

Veyra asks user to enable permitted cloud escalation or offers
manual/local alternative.

No hidden cloud call.

------------------------------------------------------------------------

# 70. V1 Definition of Done

V1 is commercially complete when:

## Broader execution

UI + API + multi-browser + parallel + scheduled testing are reliable.

## Knowledge

Veyra retains meaningful business/dependency/failure knowledge across
runs.

## Intelligence

AI-generated tests reuse existing trusted behaviour rather than
constantly regenerating scripts.

## Diagnostics

Veyra can often move users from "test failed" toward "this is probably
where and why."

## Governance

Users retain control over generated tests, assertions and learned
knowledge.

## Team use

Shared application knowledge works across multiple users.

## Economics

Cloud/model usage remains bounded by intelligent routing and local
execution.

------------------------------------------------------------------------

# 71. V1 Success Metrics

## Test creation

-   \% generated tests primarily composed from existing modules;
-   generated test acceptance rate;
-   edit rate;
-   rejection rate.

## Diagnostics

-   diagnostic confidence;
-   developer usefulness rating;
-   time from failure to suspected root cause;
-   \% failures with useful technical evidence.

## Knowledge

-   semantic modules per project;
-   dependencies captured;
-   approved learned assertions;
-   historical failure patterns reused.

## Execution

-   parallel speedup;
-   scheduled run success;
-   browser-specific BLOCKED rate;
-   API/UI hybrid test usage.

## Economics

-   local vs cloud intelligence ratio;
-   average cloud inference cost per active project;
-   cloud escalation frequency.

------------------------------------------------------------------------

# 72. V1 Strategic Hypotheses

V1 must validate five deeper hypotheses.

## Hypothesis 1

Application knowledge compounds.

The 50th test should be easier to create and maintain than the 1st
because Veyra already knows more modules, entities, data and failure
history.

## Hypothesis 2

Reuse-first AI is better than prompt-to-script generation.

Generated tests should become more reliable as trusted application
knowledge grows.

## Hypothesis 3

UI + API evidence materially improves diagnosis.

A failure report should become useful beyond "element not found" or
"assertion failed."

## Hypothesis 4

Historical failure memory changes future QA behaviour.

Teams should actually use Veyra's memory to decide what deserves
regression attention.

## Hypothesis 5

Human-governed learning creates trust.

Users should accept application intelligence because they can inspect
and correct it.

------------------------------------------------------------------------

# 73. V1 UX Evolution

V0:

``` text
Teach | Test | Results
```

V1 preserves that simplicity.

But each surface gets smarter.

## Teach

Now enriches application knowledge.

## Test

Now creates/runs UI + API + AI-composed tests.

## Results

Now explains likely failure areas and historical context.

Advanced:

``` text
Knowledge
Modules
Data
API
Schedules
```

Progressive disclosure remains non-negotiable.

------------------------------------------------------------------------

# 74. V1 Positioning

Avoid:

> "Veyra uses AI to generate automated tests."

Too generic.

Better:

> **Veyra learns your application's reusable behaviour and uses that
> knowledge to create, run and diagnose tests more intelligently over
> time.**

Possible supporting line:

> **Teach once. Compose more. Diagnose faster.**

------------------------------------------------------------------------

# 75. V1 Commercial Packaging Direction

Potential tier structure for later validation:

## Veyra Local

-   desktop;
-   local runs;
-   core Teach/Test/Results;
-   local AI;
-   limited project count.

## Veyra Team

-   shared projects;
-   schedules;
-   team knowledge;
-   AI generation;
-   API testing;
-   parallel execution.

## Veyra Intelligence

Future: - advanced diagnostics; - cloud execution; - risk
intelligence; - Quality Knowledge features.

Do not freeze packaging before pricing/customer research.

------------------------------------------------------------------------

# 76. V1 Build Order

Recommended sequence after stable V0:

``` text
1. Multi-browser
2. Parallel worker orchestration
3. Scheduling
4. API engine
5. UI + API variables
6. Cloud/team sync
7. ABM entity/action/dependency expansion
8. Provenance/confidence
9. AI test generation
10. Reuse-first composition
11. Test-family generation
12. Diagnostics
13. Compare-with-success
14. Failure memory
15. Precondition intelligence
16. Commercial hardening
```

This sequence keeps execution fundamentals ahead of AI expansion.

------------------------------------------------------------------------

# 77. V1 Architecture Additions

From V0:

``` text
Electron
React
Node/TypeScript
Playwright
SQLite
Evidence
Local Intelligence
```

Add:

``` text
API Engine
Scheduler
Parallel Worker Pool
Cloud Workspace Service
AI Gateway
ABM Expansion
Failure Memory
Diagnostic Engine
Run Comparison
```

Keep the same product-domain model.

------------------------------------------------------------------------

# 78. V1 Data Model Additions

Add conceptual tables/entities:

``` text
business_entities
business_actions
dependencies
abm_facts
abm_fact_sources
failure_patterns
failure_occurrences
schedules
api_definitions
api_steps
workspace_members
sync_versions
ai_proposals
diagnostics
run_comparisons
```

Do not prematurely add a graph database.

------------------------------------------------------------------------

# 79. V1 Security Expansion

Add:

-   team authentication;
-   workspace authorization;
-   encrypted cloud transport;
-   server-side secret policy;
-   artifact sync policy;
-   project AI policy;
-   audit of cloud AI calls;
-   data-redaction pipeline.

Cloud workspace must not automatically upload all browser evidence by
default.

------------------------------------------------------------------------

# 80. V1 Commercial Risk

Biggest V1 danger:

> Trying to become Katalon + mabl + Testim in one release.

Avoid this.

V1 should not compete on feature breadth.

Its purpose is to prove:

> **Veyra's knowledge of the application makes testing better.**

API, parallelism and scheduling are parity.

The ABM, reuse-first generation, failure memory and evidence-backed
diagnosis are the strategic work.

------------------------------------------------------------------------

# 81. V1 Go / No-Go Gates

## Gate 1 --- V0 foundation remains trusted

V1 features must not destabilise core browser automation.

## Gate 2 --- Reuse-first AI works

Generated tests should demonstrably reuse trusted knowledge.

## Gate 3 --- Diagnostic value is real

Developers/QA should find the diagnosis materially useful.

## Gate 4 --- Knowledge remains correctable

Users can identify and repair incorrect ABM facts.

## Gate 5 --- Team sync does not compromise local-first value

Local execution/privacy remains a real advantage.

## Gate 6 --- Economics remain healthy

AI features should not create uncontrolled cloud inference cost.

------------------------------------------------------------------------

# 82. Transition From V1 to V1.x

V1.x should focus on **resilience and maintenance intelligence**, not
another breadth explosion.

Candidates:

-   assisted healing;
-   confidence-based locator repair;
-   historical locator intelligence;
-   flakiness analysis;
-   failure clustering;
-   advanced local AI;
-   semantic-change detection;
-   smarter parallel resource isolation;
-   risk-aware run ordering.

------------------------------------------------------------------------

# 83. Transition From V1 to Quality Intelligence

Once V1 proves application knowledge compounds, Veyra can move toward:

``` text
State-space coverage
Safe exploration
Combinatorial risk
Change-aware regression
Predictive quality
Quality Knowledge Coverage
Release Confidence
Requirements-to-coverage
Conversational QA
```

The full vision depends on V1 proving the ABM is useful, accurate and
trusted.

------------------------------------------------------------------------

# 84. Final V1 Definition

Veyra V1 is:

> **An application-aware QA automation platform that combines browser
> and API testing, parallel and scheduled execution, reuse-first AI test
> creation, evidence-backed diagnostics and an evolving Application
> Behaviour Model that remembers dependencies and failures across
> releases.**

The visible evolution is:

``` text
V0
Teach → Test → Results

V1
Teach → Understand
Test → Compose
Results → Diagnose
```

The strategic shift is:

``` text
AUTOMATION
      ↓
APPLICATION KNOWLEDGE
      ↓
QUALITY INTELLIGENCE
```

V1 succeeds when customers begin to feel:

> **"Veyra doesn't just remember my tests. It is beginning to remember
> how my application behaves and where it tends to break."**
