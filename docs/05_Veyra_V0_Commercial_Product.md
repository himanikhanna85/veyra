# 05 --- Veyra V0 Commercial Product

**Product:** Veyra\
**Category:** Application Quality Intelligence Platform\
**Release:** V0\
**Commercial positioning:** Intelligent desktop browser QA for manual
and low-code QA teams\
**Primary execution environment:** Local desktop\
**Initial browser:** Chromium via Playwright\
**Core differentiator in V0:** Teach + semantic modules +
evidence-backed execution + human-governed intelligence

------------------------------------------------------------------------

# 1. V0 Objective

Veyra V0 must answer one customer question exceptionally well:

> **Can a manual QA professional teach a real browser workflow once,
> convert it into maintainable reusable automation, run it with
> different data, and get trustworthy evidence without becoming an
> automation engineer?**

V0 is not an AI demo.

V0 is not a prototype.

V0 is not a thin GUI over Playwright.

V0 must be a product a QA team can install, understand, trust and use
repeatedly for real regression work.

------------------------------------------------------------------------

# 2. V0 Product Promise

### Working promise

> **Teach Veyra once. Re-run the workflow anytime. Get clear evidence
> when it works, breaks or becomes blocked.**

A QA user should be able to:

1.  install Veyra;
2.  create an application project;
3.  open the application through Veyra;
4.  demonstrate an e-commerce workflow;
5.  confirm what Veyra understood;
6.  parameterise reusable values;
7.  extract reusable business modules;
8.  add business assertions;
9.  run the test again using different input data;
10. receive PASS / FAIL / BLOCKED;
11. inspect screenshots and technical evidence;
12. export a developer-ready report.

No Playwright code should be required.

------------------------------------------------------------------------

# 3. Target Customer

## Primary user

Manual or low-code QA professional.

They understand: - how the e-commerce application should behave; - what
users do; - what constitutes success; - where defects usually occur; -
which workflows are important.

They may not understand: - Playwright; - selectors; - automation
frameworks; - page-object models; - test infrastructure; - model
prompting; - CI pipelines.

## Primary organisation

Initial ideal customer:

-   product/SaaS/e-commerce team;
-   meaningful browser regression workload;
-   2--20 QA/product testers;
-   repetitive manual testing;
-   limited dedicated automation engineering;
-   need to produce evidence for developers;
-   unwilling to spend heavily on enterprise test-cloud infrastructure.

------------------------------------------------------------------------

# 4. Core V0 Jobs To Be Done

## Job 1 --- Automate what I already know how to test

> "I already know how Checkout should work. Let me show Veyra once
> instead of writing automation."

## Job 2 --- Reuse business behaviour

> "Search Product and Add To Cart appear in many tests. I want to define
> them once."

## Job 3 --- Test multiple inputs

> "Run the same product flow with Laptop, Watch and Backpack."

## Job 4 --- Know whether the app failed or automation failed

> "Do not tell me a test failed just because the button moved."

## Job 5 --- Give developers evidence

> "Show exactly what happened, what was expected, what was observed and
> the relevant browser/network evidence."

## Job 6 --- Make maintenance understandable

> "If a shared workflow changes, update the reusable behaviour instead
> of fixing fifteen copies."

------------------------------------------------------------------------

# 5. V0 Product Philosophy

V0 should feel like:

``` text
Teach
Test
Results
```

not:

``` text
Selectors
Page Objects
Scripts
Locators
Workers
Traces
Fixtures
```

The technical complexity exists underneath.

Progressive disclosure should reveal advanced details only when a user
needs them.

------------------------------------------------------------------------

# 6. V0 Information Architecture

Primary navigation:

``` text
Home
Projects
  └── Project
      ├── Teach
      ├── Tests
      ├── Modules
      ├── Runs / Results
      ├── Data
      └── Settings
```

Do not expose the full ABM as a top-level concept yet.

The V0 ABM exists through: - semantic modules; - inputs; - outputs; -
preconditions; - expected outcomes; - relationships to tests.

------------------------------------------------------------------------

# 7. First-Run Experience

The first-run experience is commercially critical.

A new user should not land on an empty enterprise dashboard.

### First screen

``` text
Welcome to Veyra

Teach your first workflow and turn it into a reusable browser test.

[Create Project]
```

Project creation asks only:

``` text
Project name
Application URL
Environment name
```

Optional: - credentials; - browser settings.

Then:

``` text
[Teach First Workflow]
```

The user should be in a controlled browser within a few clicks.

------------------------------------------------------------------------

# 8. The V0 Magic Moment

The first "wow" should happen quickly.

Recommended magic moment:

A user demonstrates:

``` text
Search "Laptop"
Open first product
Add to Cart
Open Cart
Verify product is present
```

Veyra then proposes:

``` text
I UNDERSTOOD

Goal
Add a selected product to the shopping cart.

Possible variable
"Laptop" → product

Reusable behaviours
Search Product
Add To Cart

Expected outcome
Selected product appears in Cart.

[Looks Right] [Edit]
```

The user accepts `product` as a variable.

Veyra then offers:

``` text
Run this with another value?

product = Watch

[Run]
```

The test runs successfully.

That demonstrates in one session:

-   Teach;
-   abstraction;
-   variable detection;
-   reuse;
-   execution;
-   evidence.

This should be the emotional centre of V0 onboarding.

------------------------------------------------------------------------

# 9. Screen 1 --- Home

Purpose:

Get users to useful work immediately.

Recommended content:

``` text
Veyra

Recent Projects

Commerce Storefront
12 tests
Last run: 8 min ago
10 passed / 1 failed / 1 blocked

[Open]

[+ New Project]
```

Secondary:

-   recent failures;
-   recent runs;
-   storage warning if relevant.

Avoid dense analytics in V0.

------------------------------------------------------------------------

# 10. Screen 2 --- Project Overview

Example:

``` text
Commerce Storefront

Environment: Staging

Tests             18
Modules            7
Last Run           14 min ago
Pass Rate          89%

[Teach New Workflow]
[Run Tests]
```

Below:

``` text
Recent Runs
Recent Failures
Reusable Modules
```

Do not add "Quality Score" in V0.

We do not yet have a defensible Quality Knowledge metric.

------------------------------------------------------------------------

# 11. Screen 3 --- Teach

This is the signature V0 experience.

Layout:

``` text
┌───────────────────────────────────────────┐
│ Veyra                                    │
│ Teaching: Product Purchase Flow          │
├───────────────┬───────────────────────────┤
│ Steps         │ Controlled Browser        │
│               │                           │
│ 1 Search      │                           │
│ 2 Select      │                           │
│ 3 Add Cart    │                           │
│               │                           │
├───────────────┴───────────────────────────┤
│ [Pause] [Add Checkpoint] [Finish Teaching]│
└───────────────────────────────────────────┘
```

During teaching:

Veyra should show readable events, not raw selectors.

Example:

``` text
Search for "Laptop"
Open product "Dell..."
Click "Add to Cart"
Open Cart
```

Avoid:

``` text
click div:nth-child(3) > button...
```

------------------------------------------------------------------------

# 12. Teach Noise Filtering

Browser interaction produces noise.

V0 should attempt to ignore: - incidental mouse movement; - meaningless
focus events; - duplicate clicks; - layout-only events; - internal
browser UI; - insignificant scrolls.

Record meaningful intent-bearing operations.

Users must be able to: - remove accidental step; - pause; - insert step
manually.

------------------------------------------------------------------------

# 13. Teach Checkpoints

User can click:

``` text
[Add Checkpoint]
```

Recommended checkpoint actions:

``` text
Verify text appears
Verify element is visible
Verify URL
Verify value
Verify count
```

Example:

``` text
Verify Cart contains selected product
```

V0 should encourage business checkpoints without requiring technical
selectors.

------------------------------------------------------------------------

# 14. Teach Variable Marking

The user can manually mark a recorded value:

``` text
Laptop

[Make Variable]
```

Dialog:

``` text
Variable name
product

Type
Text

Default
Laptop
```

AI can also propose:

> "Laptop looks reusable. Convert it to variable `product`?"

Options:

``` text
[Convert]
[Edit]
[Keep Fixed]
```

Manual path must always exist.

------------------------------------------------------------------------

# 15. Teach Completion

When the user clicks **Finish Teaching**, Veyra should not immediately
save opaque automation.

It creates a confirmation summary.

``` text
VEYRA UNDERSTOOD

Workflow
Search for a product and add it to Cart.

Inputs
product

Expected outcomes
Product appears in Cart.

Suggested reusable modules
Search Product
Add To Cart

5 browser actions will be stored underneath.

[Looks Right]
[Edit]
[Back to Teaching]
```

This is the user's semantic approval point.

------------------------------------------------------------------------

# 16. "I Understood" Requirements

The summary must be:

-   short;
-   business-readable;
-   editable;
-   free of automation jargon.

Users are validating:

> "Did Veyra understand what I meant?"

not:

> "Did the AI write the correct code?"

------------------------------------------------------------------------

# 17. Screen 4 --- Test Editor

After teaching:

``` text
Test: Add Product to Cart
Goal: Customer can add a selected product to Cart
```

Flow displayed as cards:

``` text
[Search Product]
Input: {{product}}

      ↓

[Open Product]

      ↓

[Add To Cart]

      ↓

✓ Cart contains {{product}}
```

Advanced expansion reveals browser-level implementation.

Default view stays semantic.

------------------------------------------------------------------------

# 18. Test Editor Capabilities

V0 P0:

-   rename test;
-   edit description/goal;
-   add step;
-   delete step;
-   reorder;
-   edit values;
-   add assertion;
-   change variable;
-   convert steps to module;
-   insert existing module;
-   duplicate test;
-   save;
-   run.

P1:

-   tags;
-   timeout;
-   retry;
-   environment override.

------------------------------------------------------------------------

# 19. Manual Step Creation

Users must never be dependent on recording.

Add Step:

``` text
Browser
  Open URL
  Click
  Type
  Select
  Press Key
  Wait

Validation
  Verify Text
  Verify Element
  Verify URL
  Verify Value
  Verify Count

Reusable
  Run Module
```

This is the product's fail-safe authoring mode.

------------------------------------------------------------------------

# 20. Screen 5 --- Modules

Example:

``` text
Reusable Modules

Search Product
Used in 7 tests

Add To Cart
Used in 11 tests

Login
Used in 14 tests
```

Open:

``` text
Add To Cart

Intent
Add a selected purchasable product to Cart.

Input
product

Output
cart_state

Expected Outcomes
Product appears in Cart.
Cart count increases.

Used by
11 tests
```

Then:

``` text
[Edit Module]
```

Before saving a shared change:

> "This module is used by 11 tests."

Show affected tests.

------------------------------------------------------------------------

# 21. Minimum Viable ABM in V0

V0 should not build the full ABM graph.

The minimum Veyra ABM object is:

``` text
Business Module
├── Name
├── Intent
├── Inputs
├── Outputs
├── Preconditions
├── Expected Outcomes
├── Browser Implementation
├── Dependent Tests
└── Evidence
```

This is enough to validate whether semantic application knowledge is
more useful than grouped recorded steps.

------------------------------------------------------------------------

# 22. Module Inputs and Outputs

Inputs must be visible.

Example:

``` text
Search Product

Input
product_query
```

Outputs can initially be simple.

Example:

``` text
Output
selected_product_name
selected_product_url
```

Output values can feed later modules/assertions.

Example:

``` text
Verify Cart Item

expected_product =
{{selected_product_name}}
```

This is a key V0 capability.

------------------------------------------------------------------------

# 23. Screen 6 --- Data

Simple V0 dataset editor:

``` text
Dataset: Product Regression

product       quantity
Laptop        1
Watch         2
Backpack      1

[+ Row]
[Import CSV]
```

Attach dataset to test.

Then:

``` text
Run 3 cases
```

Each row creates a distinct result.

------------------------------------------------------------------------

# 24. Data Run Results

Example:

``` text
Add Product to Cart

Laptop      PASS
Watch       FAIL
Backpack    PASS
```

Opening Watch shows its unique evidence.

Do not collapse dataset execution into one aggregate PASS/FAIL.

------------------------------------------------------------------------

# 25. Screen 7 --- Run Configuration

User clicks **Run**.

Dialog:

``` text
Run Tests

Environment
Staging

Browser
Chromium

Mode
● Visible Browser
○ Headless

Data
Product Regression

[Run]
```

Advanced:

-   timeout;
-   retries;
-   diagnostic trace.

V0 should default to a visible browser during onboarding because it
builds trust.

------------------------------------------------------------------------

# 26. Live Run View

``` text
Running: Add Product to Cart

✓ Search Product
✓ Open Product
→ Add To Cart
○ Verify Product in Cart

Browser visible alongside
```

Events should update live.

Buttons:

``` text
[Pause]
[Stop]
```

Advanced: - current variable values; - console/network indicator.

------------------------------------------------------------------------

# 27. Result States

## PASS

Expected business behaviour occurred.

Example:

``` text
PASS
Product "Watch" was added to Cart.
```

## FAIL

Application behaviour contradicted an assertion.

Example:

``` text
FAIL
Expected cart count: 1
Actual cart count: 0
```

## BLOCKED

Veyra could not reliably perform or evaluate the intended action.

Example:

``` text
BLOCKED
Veyra could not confidently locate "Add to Cart".
```

This distinction is mandatory.

------------------------------------------------------------------------

# 28. Internal Runtime Errors

Do not surface product crashes as test FAIL.

Separate:

``` text
ERROR
Veyra execution engine encountered an internal error.
```

This prevents customer application quality from being confused with
Veyra reliability.

------------------------------------------------------------------------

# 29. Screen 8 --- Results

Default result:

``` text
Add Product to Cart

Status
FAIL

Duration
14.2 sec

Environment
Staging

Browser
Chromium
```

Timeline:

``` text
✓ Search Product
✓ Open Product
✓ Click Add to Cart
✕ Verify Cart contains product
```

Click failure:

``` text
Expected
Cart contains "Watch"

Actual
Product not found in Cart
```

Evidence: - screenshot; - URL; - timestamp; - console/network
indicators.

------------------------------------------------------------------------

# 30. Failure Evidence

V0 should automatically show the most useful evidence first.

Example:

``` text
Failure

Expected
Cart contains selected product.

Observed
Cart is empty.

Network
POST /cart returned 500.

Console
1 related error.

Screenshot
[preview]
```

This may be rule-based in V0.

It should not require a frontier LLM.

------------------------------------------------------------------------

# 31. Evidence Viewer

Allow expansion:

``` text
Screenshot
Console
Network
DOM snapshot
Locator details
```

Default user does not need to see everything.

Developer/debug mode can reveal the details.

------------------------------------------------------------------------

# 32. Developer-Ready Report

V0 report should answer:

``` text
What test was run?
What data was used?
What was expected?
What actually happened?
Where did it fail?
What evidence exists?
Can someone reproduce it?
```

Example:

``` text
Test
Add Product to Cart

Input
product = Watch

Failure
Expected selected product in Cart.
Cart remained empty.

Evidence
POST /cart returned 500 at 14:31:04.
Screenshot attached.

Browser
Chromium 143...
```

Export:

-   HTML;
-   PDF.

------------------------------------------------------------------------

# 33. Screen 9 --- Run History

``` text
Runs

Today 14:31
Product Regression
2 pass / 1 fail

Today 11:10
Checkout Smoke
8 pass

Yesterday 17:42
Full Regression
31 pass / 2 blocked
```

Run history is essential for repeat usage.

------------------------------------------------------------------------

# 34. Screen 10 --- Settings

V0 project settings:

``` text
General
Environment
Browser
Secrets
Storage
Evidence
AI
```

AI:

``` text
AI Assistance

Parameter suggestions       ON
Module suggestions          ON
Readable descriptions       ON

Cloud AI
OFF
```

If local AI unavailable, core Veyra continues to function.

------------------------------------------------------------------------

# 35. Secrets

Secrets examples:

-   username;
-   password;
-   test payment token;
-   private API key later.

Requirements:

-   OS secure storage;
-   masked UI;
-   never embedded in reports;
-   never shown in screenshots if Veyra controls entry where feasible;
-   never automatically sent to cloud AI.

------------------------------------------------------------------------

# 36. Locator UX

Users should not be required to understand selectors.

When editing a click step:

``` text
Target
Add to Cart button
```

Advanced:

``` text
How Veyra identifies this element
Role: button
Name: Add to Cart
data-testid: add-cart
```

If locator fails:

``` text
Veyra could not confidently find:
"Add to Cart"

Possible match:
"Add to Basket"
Confidence: 92%

[Use for this run]
[Edit target]
[Mark blocked]
```

V0 may restrict automatic updating of the saved test.

Persistent assisted healing can remain V1.x.

------------------------------------------------------------------------

# 37. V0 AI Capabilities

AI in V0 should be **assistive**, not foundational.

Recommended:

## Parameter suggestion

Example:

> "Laptop may be reusable as `product`."

## Module suggestion

> "These four steps appear to form a reusable 'Search Product'
> behaviour."

## Readable descriptions

Turn raw browser events into human-friendly language.

## Basic intent suggestion

> "This workflow appears to add a selected product to Cart."

Everything is: - inspectable; - editable; - rejectable.

------------------------------------------------------------------------

# 38. V0 Non-AI Intelligence

Prefer deterministic/algorithmic approaches for:

-   selector candidate scoring;
-   repeated sequence detection;
-   variable heuristics;
-   screenshot timing;
-   browser events;
-   network error detection;
-   console classification;
-   test result;
-   retries;
-   step execution.

This keeps inference cost and nondeterminism low.

------------------------------------------------------------------------

# 39. V0 Human-Control Contract

Every generated suggestion must support the appropriate subset of:

``` text
Accept
Edit
Reject
Keep Fixed
Create Manually
Undo
```

No V0 AI feature may block completion of the same task manually.

------------------------------------------------------------------------

# 40. V0 Onboarding Tutorial

Do not use a long slideshow.

Use an interactive commerce demo.

Veyra can ship with a tiny hosted/local demo store or an internal
sandbox.

Tutorial:

``` text
1. Search for "Watch".
2. Add it to Cart.
3. Add an assertion.
4. Finish Teaching.
5. Accept "product" as a variable.
6. Re-run with "Backpack".
```

This teaches the core product by using it.

------------------------------------------------------------------------

# 41. Time-To-Value Goal

Target user should reach:

**First successful recorded test:** very quickly.

**First parameterised re-run:** within the first onboarding session.

Do not define a marketing SLA until usability testing validates actual
timing.

Track:

``` text
Install → project
Project → Teach
Teach → saved test
Saved test → first run
First run → parameterised run
```

------------------------------------------------------------------------

# 42. V0 Commercial Readiness Requirements

A feature-complete prototype is not automatically commercial.

Commercial V0 additionally requires:

-   reliable installer;
-   automatic updates;
-   crash recovery;
-   migration strategy;
-   secure secrets;
-   storage cleanup;
-   browser binary management;
-   licensing/account approach;
-   privacy policy;
-   telemetry consent;
-   error reporting;
-   backup/export;
-   basic product documentation;
-   onboarding tutorial;
-   support path.

------------------------------------------------------------------------

# 43. Reliability Standard

The product must not create more uncertainty than manual testing.

Focus engineering quality heavily on:

-   recorder reliability;
-   browser execution;
-   selectors;
-   cancellation;
-   state cleanup;
-   evidence consistency;
-   database migrations.

A flashy AI feature is less valuable than a test runner users trust.

------------------------------------------------------------------------

# 44. V0 Performance Targets

These are engineering targets to validate, not external guarantees.

### Desktop

-   UI remains responsive during runs.
-   Browser execution happens outside renderer process.
-   Project with hundreds of tests remains navigable.
-   Evidence viewer loads lazily.

### Recorder

-   meaningful browser action appears in step list almost immediately.
-   accidental noise does not create a flood of steps.

### Run

-   Veyra overhead should remain small relative to application/browser
    time.

### Local AI

-   never freezes test execution;
-   runs asynchronously where possible;
-   deterministic/manual fallback always available.

------------------------------------------------------------------------

# 45. Accessibility and UX Quality

Although accessibility testing is not a V0 test capability, Veyra itself
should follow good accessibility practices:

-   keyboard-accessible primary interactions;
-   readable contrast;
-   proper labels;
-   meaningful status text;
-   do not convey PASS/FAIL solely through colour;
-   scalable text/layout.

Better UX is part of the moat.

------------------------------------------------------------------------

# 46. V0 Pricing Architecture

This document does not freeze final price.

But V0 architecture should support pricing that does **not** force
cloud-browser-minute economics.

Potential commercial units:

``` text
Per user / seat
Per workspace
Per application/project
```

Optional later metering:

``` text
Cloud AI usage
Cloud parallel execution
Team collaboration tier
```

Avoid metering local runs individually unless customer research strongly
supports it.

Veyra's local-first cost advantage should be visible commercially.

------------------------------------------------------------------------

# 47. Free / Trial Experience

Recommended future trial structure:

Allow enough functionality for the user to experience the magic moment:

-   create project;
-   Teach;
-   parameterise;
-   run locally;
-   inspect evidence.

Do not cripple the core experience before the user understands Veyra.

Possible limits: - number of saved projects; - number of tests; - team
features; - cloud AI; - cloud execution.

Final packaging requires pricing research.

------------------------------------------------------------------------

# 48. V0 Acceptance Scenario A --- Parameterised Product Test

Given: - a project exists; - staging store is available.

User:

1.  starts Teach;
2.  searches "Laptop";
3.  opens product;
4.  adds to Cart;
5.  verifies Cart contains product;
6.  finishes Teach.

Veyra:

-   records readable steps;
-   proposes `product` variable;
-   creates reusable semantic behaviour;
-   saves test.

User changes:

``` text
product = Watch
```

Run:

-   uses Watch;
-   executes successfully;
-   creates PASS evidence.

**Acceptance:** No automation code written.

------------------------------------------------------------------------

# 49. V0 Acceptance Scenario B --- Application Failure

Application configured so:

``` text
POST /cart → 500
```

User runs Add Product to Cart.

Veyra result:

``` text
FAIL
```

because explicit expected business outcome was violated.

Veyra shows: - expected; - actual; - screenshot; - relevant failed
network request.

**Acceptance:** failure is clearly distinguishable from
locator/automation failure.

------------------------------------------------------------------------

# 50. V0 Acceptance Scenario C --- Automation Blocked

Application changes:

``` text
Add to Cart → Add to Basket
```

and Veyra lacks sufficient confidence to continue.

Result:

``` text
BLOCKED
```

not FAIL.

Veyra shows: - expected target; - possible replacement; - confidence; -
manual options.

**Acceptance:** Veyra does not silently redefine test intent.

------------------------------------------------------------------------

# 51. V0 Acceptance Scenario D --- Module Reuse

Tests:

``` text
Add Product to Cart
Checkout Product
Apply Coupon to Cart
```

all use `Search Product`.

User edits Search Product module.

Veyra shows:

``` text
Used by 3 tests
```

and updates future executions after user confirmation.

**Acceptance:** no duplicated editing across three tests.

------------------------------------------------------------------------

# 52. V0 Acceptance Scenario E --- Dataset

Dataset:

``` text
Laptop
Watch
Backpack
```

User runs one test template.

Veyra creates three separately inspectable run results.

**Acceptance:** failure in Watch does not hide PASS for Laptop/Backpack.

------------------------------------------------------------------------

# 53. V0 Acceptance Scenario F --- AI Disabled

User disables AI assistance.

They can still:

-   Teach/record;
-   edit steps;
-   manually create variables;
-   create modules;
-   add assertions;
-   run tests;
-   see evidence;
-   export report.

**Acceptance:** core product remains fully usable.

------------------------------------------------------------------------

# 54. V0 Acceptance Scenario G --- Secrets

User stores credentials.

Veyra:

-   stores them securely;
-   types them during login;
-   masks them;
-   excludes plaintext secret from report/log.

**Acceptance:** no secret leakage through ordinary V0 workflows.

------------------------------------------------------------------------

# 55. V0 Acceptance Scenario H --- Browser Crash

Browser worker crashes during test.

Desktop UI remains alive.

Run marked:

``` text
ERROR / INTERRUPTED
```

with explanation.

**Acceptance:** project state is preserved and user can retry.

------------------------------------------------------------------------

# 56. V0 Acceptance Scenario I --- Exported Report

User exports failed test report.

Developer who does not use Veyra can understand:

-   test goal;
-   input data;
-   failing checkpoint;
-   expected behaviour;
-   observed behaviour;
-   screenshot;
-   network/console evidence;
-   environment/browser.

**Acceptance:** report is usable independently.

------------------------------------------------------------------------

# 57. V0 Acceptance Scenario J --- Manual Authoring

User chooses not to Teach.

They create test manually:

``` text
Open URL
Click Search
Type {{product}}
Click Search
Verify result visible
```

Run succeeds.

**Acceptance:** AI/recording is never mandatory.

------------------------------------------------------------------------

# 58. V0 Explicit Exclusions

Do **not** include in V0:

-   API testing;
-   test scheduling;
-   parallel execution;
-   native mobile;
-   visual regression;
-   accessibility testing;
-   full self-healing;
-   CI/CD integrations;
-   Jira;
-   Slack;
-   GitHub;
-   autonomous exploratory testing;
-   Quality Knowledge Coverage;
-   Release Confidence;
-   predictive regression;
-   production analytics;
-   requirements ingestion;
-   full conversational QA;
-   full state-machine ABM;
-   cloud browser farm;
-   autonomous destructive actions.

These are intentionally excluded.

------------------------------------------------------------------------

# 59. V0 P0 Feature Checklist

## Product

-   [ ] desktop install;
-   [ ] project creation;
-   [ ] environment;
-   [ ] secure secrets.

## Teach

-   [ ] controlled Chromium;
-   [ ] record meaningful actions;
-   [ ] readable step translation;
-   [ ] pause/resume;
-   [ ] checkpoint;
-   [ ] manual variable marking;
-   [ ] parameter suggestion;
-   [ ] completion understanding screen.

## Author

-   [ ] visual test editor;
-   [ ] manual step creation;
-   [ ] assertions;
-   [ ] variables;
-   [ ] datasets;
-   [ ] reusable modules;
-   [ ] inputs/outputs;
-   [ ] expected outcomes;
-   [ ] suites.

## Execute

-   [ ] Playwright Chromium;
-   [ ] visible/headless;
-   [ ] stop;
-   [ ] isolated context;
-   [ ] dataset runs.

## Evidence

-   [ ] screenshot;
-   [ ] URL;
-   [ ] timestamp;
-   [ ] expected/actual;
-   [ ] console;
-   [ ] network failures;
-   [ ] failure DOM/locator diagnostics.

## Results

-   [ ] PASS;
-   [ ] FAIL;
-   [ ] BLOCKED;
-   [ ] run timeline;
-   [ ] history;
-   [ ] HTML report;
-   [ ] PDF report.

## Maintenance

-   [ ] module usage;
-   [ ] update shared module;
-   [ ] basic locator candidates.

## Governance

-   [ ] Accept/Edit/Reject;
-   [ ] manual path;
-   [ ] undo where applicable.

------------------------------------------------------------------------

# 60. V0 P1 Feature Checklist

-   [ ] Windows + macOS;
-   [ ] tags;
-   [ ] CSV import;
-   [ ] module suggestions;
-   [ ] typed narration;
-   [ ] backup selectors;
-   [ ] step-through execution;
-   [ ] trace-on-failure;
-   [ ] project backup/export;
-   [ ] app auto-update;
-   [ ] storage management;
-   [ ] crash recovery;
-   [ ] product telemetry;
-   [ ] interactive tutorial.

------------------------------------------------------------------------

# 61. V0 Definition of Done

V0 is ready to call a commercial product only when all of the following
are true:

### Functional

Core P0 workflows operate end-to-end.

### Reliable

Normal e-commerce workflows can be repeatedly executed without frequent
false BLOCKED states.

### Understandable

A manual QA user can create and run useful tests without automation
training.

### Trustworthy

PASS/FAIL/BLOCKED accurately describe what happened.

### Maintainable

Reusable modules produce clear value over duplicated recordings.

### Evidence-backed

Failures produce useful evidence without manual screenshot/report work.

### Governed

AI does not silently change business meaning.

### Secure

Secrets and sensitive evidence have safe defaults.

### Distributable

Installer, updates, migrations and browser binaries work reliably.

### Supportable

Errors are diagnosable and users can recover from common failure states.

------------------------------------------------------------------------

# 62. V0 Success Metrics

## Activation

-   Project created.
-   First Teach session completed.
-   First saved test.
-   First successful run.
-   First parameterised second run.

## Engagement

-   tests run per active project;
-   repeat runs per week;
-   modules reused;
-   datasets used;
-   reports exported.

## Trust

-   BLOCKED rate;
-   false FAIL reports;
-   locator suggestion acceptance;
-   AI proposal acceptance/edit/reject;
-   manual overrides.

## Value

-   estimated manual regression time avoided;
-   number of workflows automated;
-   report preparation time reduced;
-   maintenance operations avoided through module reuse.

## Reliability

-   app crash rate;
-   worker crash rate;
-   recorder failure rate;
-   corrupted project incidents.

------------------------------------------------------------------------

# 63. V0 Customer Validation Questions

During pilot use, measure:

1.  Can users understand **Teach** without training?
2.  Do semantic modules feel more useful than normal reusable step
    groups?
3.  Do users understand PASS vs FAIL vs BLOCKED?
4.  Does the "I Understood" screen increase trust or create friction?
5.  Do users naturally create variables/datasets?
6.  Are developer reports actually used?
7.  Which evidence developers open first?
8.  How often do users need the advanced selector view?
9.  Does local execution feel like an advantage?
10. Would users pay primarily for time saved, maintenance saved, or
    diagnostic value?

------------------------------------------------------------------------

# 64. Pilot Definition

Before broad launch, run Veyra with a small set of real e-commerce-style
applications.

Each pilot should include:

-   search;
-   product detail;
-   cart;
-   checkout;
-   coupon;
-   order confirmation.

Goal:

Validate not only execution, but abstraction.

Can Veyra correctly identify reusable concepts across different UI
implementations?

------------------------------------------------------------------------

# 65. Internal Demo Application

Maintain Veyra's controlled fixture commerce app.

Demo flags:

``` text
RENAME_ADD_TO_CART
FAIL_CART_API
DELAY_SEARCH
BREAK_CART_COUNT
EXPIRE_COUPON
FAIL_ORDER
WRONG_TOTAL
```

This becomes:

-   onboarding sandbox;
-   product demo;
-   automated regression environment;
-   AI evaluation environment;
-   support reproduction environment.

------------------------------------------------------------------------

# 66. Product Copy Direction

Avoid:

> "AI-powered no-code automation platform."

Too generic.

V0 copy should stay concrete.

Potential headline:

> **Teach your browser test once. Let Veyra handle the repetition.**

Supporting:

> **Create reusable e-commerce tests by demonstrating real workflows.
> Run them with different data and get evidence-backed PASS, FAIL or
> BLOCKED results---without writing automation code.**

Long-term category language can introduce Application Quality
Intelligence later.

------------------------------------------------------------------------

# 67. Veyra V0 vs Traditional Recorder

Traditional:

``` text
Record
↓
Replay
↓
Fix brittle script
```

Veyra V0:

``` text
Teach
↓
Understand
↓
Parameterise
↓
Modularise
↓
Validate meaning
↓
Execute
↓
Capture evidence
```

That distinction should be felt in the first session.

------------------------------------------------------------------------

# 68. Veyra V0 vs Full North Star

V0 does **not** yet promise:

> "Veyra understands your entire application."

It promises:

> "Veyra can understand reusable behaviour you teach it."

This is an important honesty boundary.

The full Application Behaviour Model should emerge through validated
product usage rather than marketing ahead of capability.

------------------------------------------------------------------------

# 69. V0 Build Order

Recommended implementation sequence:

``` text
1. Desktop shell
2. Playwright controlled Chromium
3. Recorder
4. Normalised readable actions
5. Manual visual editor
6. Assertions
7. Variables
8. Execution compiler
9. Evidence/result engine
10. Run history/report
11. Semantic modules
12. Module inputs/outputs
13. Datasets
14. Teach completion summary
15. Parameter/module assistance
16. Commercial hardening
```

Do not start by training models.

------------------------------------------------------------------------

# 70. V0 Commercial Hardening Sprint

After functional feature completion, explicitly reserve engineering time
for:

-   installer;
-   browser binary management;
-   migrations;
-   updates;
-   corrupted state recovery;
-   storage cleanup;
-   crash handling;
-   permissions;
-   Windows edge cases;
-   offline behaviour;
-   report formatting;
-   secret masking;
-   telemetry;
-   onboarding.

This work is often the difference between "works in demo" and "can be
sold."

------------------------------------------------------------------------

# 71. V0 Go / No-Go Gate

Before commercial launch, evaluate five gates.

## Gate 1 --- Reliability

Can Veyra repeatedly execute ordinary taught e-commerce flows with a low
enough false-BLOCKED rate to be trusted?

## Gate 2 --- Usability

Can a manual tester create a parameterised reusable test without
automation-engineering help?

## Gate 3 --- Differentiation

Does Teach + semantic modules feel materially better than
record-and-replay?

## Gate 4 --- Evidence

Do failures reduce developer/QA debugging effort?

## Gate 5 --- Economics

Can local execution + selective AI support pricing meaningfully below
cloud-heavy competitors while maintaining margin?

If any gate is clearly failing, fix it before expanding V1 scope.

------------------------------------------------------------------------

# 72. What V0 Must Prove Strategically

V0 is not required to prove the entire Application Quality Intelligence
vision.

It must prove three strategic hypotheses:

### Hypothesis A

Manual QA users prefer **teaching business behaviour** over authoring
automation.

### Hypothesis B

Semantic reusable modules with inputs/outputs/outcomes create more value
than ordinary reusable step groups.

### Hypothesis C

A local-first evidence-rich product can deliver enough value and trust
to become the foundation for an ABM.

If these three hypotheses survive real users, V1 becomes justified.

------------------------------------------------------------------------

# 73. V0 Summary

Veyra V0 is:

> **A desktop browser QA product that lets a tester teach an e-commerce
> workflow, convert it into reusable parameterised semantic automation,
> execute it locally with deterministic reliability, and automatically
> produce trustworthy evidence-backed results.**

The user experience is:

``` text
TEACH → TEST → RESULTS
```

The hidden technical foundation is:

``` text
Semantic Module
+ Execution Plan
+ Playwright
+ Evidence
+ Human Governance
```

The strategic seed is:

``` text
Minimum Viable Application Behaviour Model
```

The V0 product succeeds if a tester can say:

> **"I showed Veyra what this behaviour means once. Now Veyra can
> reliably test it for me."**

That is the bridge from ordinary test automation to the long-term Veyra
vision of Application Quality Intelligence.
