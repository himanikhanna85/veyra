# 04 --- Product Architecture

**Product:** Application Quality Intelligence Platform\
**Core engine:** Application Behaviour Model (ABM)\
**Initial commercial form:** Desktop-first intelligent browser QA\
**Architecture horizon:** V0 → V1 → V1.x → Quality Intelligence
Platform\
**Domain examples:** E-commerce only

------------------------------------------------------------------------

# 1. Architectural Objective

The architecture must satisfy two goals that pull in different
directions:

1.  **Ship V0 quickly and reliably** as a desktop browser-testing
    product.
2.  **Avoid architectural dead ends** that prevent evolution into the
    Application Behaviour Model, local AI, API testing, failure
    intelligence, change intelligence and later cloud execution.

The architecture should therefore be:

-   local-first;
-   modular;
-   deterministic-first;
-   event-driven where useful;
-   evidence-preserving;
-   model-provider independent;
-   ABM-centric;
-   human-governed;
-   capable of moving execution workers from local desktop to cloud
    later without rewriting the product model.

The architecture should **not** begin as a distributed microservices
platform.

V0 should be a well-structured desktop monolith with explicit internal
service boundaries.

------------------------------------------------------------------------

# 2. Recommended V0 Technology Stack

## Desktop shell

**Electron + React + TypeScript**

### Recommendation

Use Electron rather than Tauri for V0.

The primary reason is architectural simplicity:

-   Playwright is Node/TypeScript-native.
-   Test orchestration can remain in the same runtime family.
-   ONNX/local inference has Node options.
-   report generation and filesystem access are straightforward;
-   debugging a single TypeScript/Node product is easier for an early
    product team;
-   browser binaries and worker subprocesses are simpler to manage.

Tauri may produce a smaller/native-feeling desktop shell, but would
likely introduce a Rust application plus Node/Playwright sidecar
architecture before we have product-market fit.

Revisit Tauri only if Electron memory/installer/security constraints
become materially problematic.

## UI

-   React
-   TypeScript
-   a small component system
-   local state store for UI concerns
-   IPC/RPC client for core services

Do not place test-business logic in React components.

## Core runtime

**Node.js + TypeScript**

Responsibilities:

-   project lifecycle;
-   Playwright orchestration;
-   recording;
-   execution;
-   evidence capture;
-   ABM services;
-   model routing;
-   report generation;
-   API testing;
-   scheduling;
-   local database access.

## Browser automation

**Playwright**

Initial browser:

-   Chromium

V1:

-   Firefox
-   WebKit

Playwright should remain an **execution engine**, not our product model.

The user creates application knowledge and tests. The runtime compiles
that knowledge into Playwright operations.

## Local persistence

**SQLite**

Use SQLite as the authoritative local metadata/database store.

Recommended approach:

-   relational core schema;
-   JSON columns only where structure is genuinely flexible;
-   versioned migrations;
-   immutable event/run records where possible;
-   file/blob store for screenshots/traces.

Do not begin with a graph database.

The ABM can be represented relationally plus typed relationships. If
graph-style traversal becomes a real bottleneck later, introduce a graph
projection or dedicated graph store.

## Evidence storage

Filesystem/object abstraction:

``` text
project-data/
├── db.sqlite
├── artifacts/
│   ├── screenshots/
│   ├── traces/
│   ├── network/
│   ├── dom/
│   └── reports/
└── models/
```

Database stores artifact metadata and content hashes, not large binary
evidence itself.

## Local ML

Potential initial runtime:

-   ONNX Runtime Node;
-   lightweight JS/TS algorithms;
-   optional embeddings runtime.

Use local ML only when it beats deterministic logic on a clearly defined
task.

## Local LLM

Create an abstraction over an embedded local inference runtime.

Do not hard-code the product to a specific local model.

Conceptual interface:

``` ts
interface LocalLanguageModel {
  generate(task: ModelTask): Promise<ModelResult>
  supports(capability: Capability): boolean
  health(): Promise<ModelHealth>
}
```

The runtime can later support different quantized models according to: -
OS; - RAM; - CPU; - GPU/NPU; - user privacy mode.

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
┌─────────────────────────────────────────────────────────────┐
│                    DESKTOP APPLICATION                      │
│                                                             │
│  ┌──────────────── UI / EXPERIENCE ──────────────────────┐  │
│  │ Teach | Test | Results | Advanced                    │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │ IPC/RPC                           │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │                APPLICATION CORE                      │  │
│  │                                                     │  │
│  │ Project Service          Test Authoring Service      │  │
│  │ Module Service           Dataset Service             │  │
│  │ ABM Service              Result Service              │  │
│  │ Governance Service       Report Service              │  │
│  └──────────┬──────────────────┬────────────────────────┘  │
│             │                  │                           │
│  ┌──────────▼─────────┐  ┌────▼──────────────────────┐    │
│  │ EXECUTION ENGINE   │  │ INTELLIGENCE ENGINE       │    │
│  │                    │  │                           │    │
│  │ Playwright Worker  │  │ Rules                    │    │
│  │ API Worker         │  │ Algorithms               │    │
│  │ Scheduler          │  │ Classical ML             │    │
│  │ Evidence Capture   │  │ Local LLM                │    │
│  │ Locator Engine     │  │ Cloud Escalation Router  │    │
│  └──────────┬─────────┘  └────────────┬──────────────┘    │
│             │                         │                   │
│  ┌──────────▼─────────────────────────▼───────────────┐   │
│  │                 LOCAL DATA LAYER                   │   │
│  │ SQLite | Secrets | Artifacts | Model Cache         │   │
│  └──────────────────────────┬─────────────────────────┘   │
└─────────────────────────────┼─────────────────────────────┘
                              │ optional
                              ▼
                 ┌──────────────────────────┐
                 │       CLOUD LAYER        │
                 │                          │
                 │ Accounts / Team Sync     │
                 │ AI Escalation            │
                 │ Collaboration            │
                 │ Scheduled Orchestration  │
                 │ Cloud Workers later      │
                 └──────────────────────────┘
```

------------------------------------------------------------------------

# 4. Core Architectural Principle: Product Model ≠ Playwright Model

This is one of the most important architectural decisions.

Bad architecture:

``` text
UI
 ↓
Playwright scripts
 ↓
Reports
```

This eventually turns the product into an editor around browser scripts.

Recommended architecture:

``` text
USER INTENT / ABM / TEST MODEL
              ↓
        EXECUTION PLAN
              ↓
        PLAYWRIGHT ADAPTER
              ↓
           BROWSER
```

Playwright is replaceable infrastructure.

The product-owned representation must survive: - browser changes; -
selector changes; - mobile expansion; - API steps; - execution in cloud
workers; - changes in Playwright itself.

------------------------------------------------------------------------

# 5. Core Domain Model

``` text
Workspace
└── Project
    ├── Environment
    ├── Secret
    ├── Dataset
    ├── BusinessModule
    ├── TestTemplate
    ├── TestCase
    ├── TestSuite
    ├── ABMNode
    ├── ABMRelationship
    └── Run
        ├── RunStep
        ├── AssertionResult
        ├── EvidenceArtifact
        └── Diagnostic
```

------------------------------------------------------------------------

# 6. Project

Conceptual schema:

``` ts
Project {
  id
  name
  applicationType
  defaultEnvironmentId
  createdAt
  updatedAt
  settings
  aiPolicy
  executionPolicy
}
```

A Project corresponds to one logical application/product.

Example:

``` text
Project: Commerce Storefront
```

------------------------------------------------------------------------

# 7. Environment

``` ts
Environment {
  id
  projectId
  name
  baseUrl
  browserProfile
  variableSet
  secretRefs
  executionSettings
}
```

Examples:

-   Local
-   QA
-   Staging

Production execution should require explicit policy and warnings.

------------------------------------------------------------------------

# 8. Variable System

Variables should be typed.

``` ts
VariableDefinition {
  id
  name
  type
  scope
  sensitive
  defaultValue?
  source?
}
```

Scopes:

``` text
ENVIRONMENT
TEST
MODULE
DATASET
RUNTIME
GENERATED
SECRET
```

Types:

``` text
string
number
boolean
date
url
email
enum
json
secret
entity-reference
```

Typed variables become important later for semantic modules and ABM
reasoning.

------------------------------------------------------------------------

# 9. Semantic Business Module

This is the smallest meaningful ABM unit.

Example:

``` ts
BusinessModule {
  id
  projectId

  name: "Add Product To Cart"
  intent: "Add an available product to the shopping cart"

  inputs: [
    ProductReference
  ]

  outputs: [
    CartState
  ]

  preconditions: [
    ProductIsPurchasable
  ]

  expectedOutcomes: [
    ProductAppearsInCart,
    CartCountIncreases
  ]

  implementation:
    ExecutionPlan

  version
  provenance
  confidence
}
```

Underlying steps might be:

``` text
click(Add to Cart)
wait(cart update)
```

The **module is not the steps**.

The module is the business behaviour the steps currently implement.

------------------------------------------------------------------------

# 10. Execution Plan

Introduce an internal intermediate representation.

``` ts
ExecutionPlan {
  steps: ExecutionNode[]
}
```

Possible nodes:

``` text
Navigate
Click
Fill
Select
Press
Wait
Extract
Assert
CallAPI
RunModule
Branch
Loop
SetVariable
CaptureEvidence
```

Example:

``` text
RunModule(AddToCart)
```

compiles into:

``` text
Resolve Product
Locate Add To Cart
Click
Wait for observable state
Assert cart count
Extract CartState
Capture evidence
```

The Execution Plan separates semantic objects from the browser engine.

------------------------------------------------------------------------

# 11. Test Model

``` ts
TestTemplate {
  id
  projectId
  name
  goal
  moduleRefs
  steps
  variables
  tags
  riskLevel
  version
}
```

A concrete test:

``` ts
TestCase {
  templateId
  datasetRow?
  overrides?
}
```

Example:

``` text
Template:
Purchase Product

Dataset:
Laptop, Qty 1
Watch, Qty 2
Backpack, Qty 1
```

------------------------------------------------------------------------

# 12. Run Model

Runs should be immutable historical evidence.

``` ts
Run {
  id
  projectId
  testId
  environmentId

  startedAt
  finishedAt

  status
  applicationVersion?
  browserVersion
  engineVersion
  testVersion
  moduleVersions

  resultSummary
}
```

Statuses:

``` text
QUEUED
RUNNING
PASS
FAIL
BLOCKED
CANCELLED
ERROR
```

PASS / FAIL / BLOCKED remain user-facing test outcomes.

ERROR may represent internal product/runtime failure.

------------------------------------------------------------------------

# 13. Evidence Model

``` ts
EvidenceArtifact {
  id
  runId
  runStepId?

  type
  path
  hash
  createdAt

  metadata
}
```

Types:

``` text
SCREENSHOT
DOM_SNAPSHOT
TRACE
NETWORK_EVENT
CONSOLE_EVENT
VIDEO
HAR
REPORT
```

Artifacts should be content-addressable or hashed where practical.

Benefits: - detect duplicates; - verify integrity; - simplify
upload/sync later.

------------------------------------------------------------------------

# 14. Recording / Teach Architecture

Flow:

``` text
User enters Teach mode
        ↓
Recorder starts browser instrumentation
        ↓
Raw browser events captured
        ↓
Noise filtering
        ↓
Semantic element resolution
        ↓
Candidate business step
        ↓
User narration / intent
        ↓
Teach Interpretation Engine
        ↓
"I understood" proposal
        ↓
Human confirmation
        ↓
Module/Test/ABM updates
```

Important:

**Raw recorder events should never directly become the permanent product
model.**

Keep three layers:

``` text
RAW EVENT
   ↓
NORMALISED ACTION
   ↓
SEMANTIC BEHAVIOUR
```

Example:

``` text
RAW
mousedown on DOM node #product-482-add

NORMALISED
Click button "Add to Cart"

SEMANTIC
Add product to shopping cart
```

This layering is essential for later maintenance intelligence.

------------------------------------------------------------------------

# 15. Browser Instrumentation

During Teach and Run collect:

-   DOM/accessibility locator candidates;
-   role;
-   accessible name;
-   visible text;
-   stable attributes;
-   test IDs;
-   element geometry;
-   parent/child semantic relationships;
-   URL;
-   page title;
-   navigation events;
-   network events;
-   console errors;
-   page lifecycle;
-   screenshots at meaningful points.

Do not capture every possible browser signal indefinitely.

Use policies to balance evidence value against: - storage; - privacy; -
performance.

------------------------------------------------------------------------

# 16. Locator Engine

The locator engine should be independent of Playwright selectors stored
in tests.

Conceptual object:

``` ts
ElementIdentity {
  semanticRole
  accessibleName
  testId?
  stableId?
  label?
  textHints[]
  structuralHints[]
  historicalLocators[]
}
```

Runtime:

``` text
ElementIdentity
      ↓
Candidate Generator
      ↓
Candidate Scorer
      ↓
Confidence
      ↓
Playwright Locator
```

Initial scoring can be deterministic.

Example:

``` text
data-testid          +100
role + accessible    +90
stable id            +80
label match          +70
meaningful text      +60
structural context   +40
nth-child            -40
absolute XPath       -80
```

Weights should be telemetry-driven later.

------------------------------------------------------------------------

# 17. Locator Failure Flow

``` text
Expected Element
       ↓
Normal locator fails
       ↓
Generate semantic candidates
       ↓
Score candidates
       ↓
High-confidence candidate?
      / \
    no   yes
    ↓     ↓
BLOCKED  Suggest replacement
           ↓
   Human / policy decision
```

V0:

-   report BLOCKED;
-   show candidates where possible.

V1.x:

-   Use Once;
-   Accept & Update;
-   Reject;
-   policy-controlled healing.

Never silently modify business intent.

------------------------------------------------------------------------

# 18. Assertion Engine

Assertions should be first-class objects.

``` ts
Assertion {
  id
  target
  operator
  expected
  severity
  source
}
```

Examples:

``` text
element.visible == true
cart.count == previous + 1
url.matches("/checkout")
order.number exists
```

Later assertions may link directly to ABM invariants.

------------------------------------------------------------------------

# 19. Evidence Capture Pipeline

``` text
EXECUTION EVENT
      ↓
Evidence Policy
      ↓
Capture
      ↓
Normalise metadata
      ↓
Persist artifact
      ↓
Link to RunStep
      ↓
Result/Diagnostic Engine
```

Default V0 policy:

At each checkpoint: - screenshot; - URL; - timestamp; - expected; -
actual.

Always collect lightweight: - console errors; - network failures.

On failure: - stronger screenshot; - DOM snapshot; - locator
diagnostics; - nearby network context.

This keeps successful runs lighter than failures.

------------------------------------------------------------------------

# 20. Playwright Tracing

Playwright's trace facilities are useful for advanced diagnostics.

V0 recommendation:

-   do not force full traces on every basic run;
-   support trace-on-failure or diagnostic mode.

V1:

-   configurable traces;
-   link trace artifact from failure view.

This prevents excessive disk usage while retaining deep debugging when
needed.

------------------------------------------------------------------------

# 21. API Testing Architecture --- V1

Do not bolt API tests on as a separate product.

Add API operations to the same Execution Plan.

``` text
UI Step
 ↓
API Request
 ↓
Extract response value
 ↓
UI Step
 ↓
Assertion
```

Example:

``` text
POST /test-data/products
  ↓
extract productId
  ↓
Open /products/{productId}
  ↓
Add to Cart
```

API definition:

``` ts
ApiStep {
  method
  url
  headers
  query
  body
  auth
  extracts
  assertions
}
```

This makes UI/API relationships available to diagnostics and ABM later.

------------------------------------------------------------------------

# 22. Application Behaviour Model Architecture

The ABM should be a **typed knowledge model**, not an AI-generated blob.

Core node types:

``` text
Screen
Element
Entity
BusinessAction
Module
State
BusinessRule
Invariant
TestDataRequirement
Test
FailurePattern
ApplicationVersion
```

Relationship types:

``` text
CONTAINS
NAVIGATES_TO
ACTS_ON
PRODUCES
REQUIRES
TRANSITIONS_TO
VALIDATED_BY
DEPENDS_ON
VIOLATES
OBSERVED_IN
AFFECTED_BY
FAILED_IN
DERIVED_FROM
```

Example:

``` text
[Product]
   |
   | ACTS_ON
   ▼
[Add To Cart]
   |
   | PRODUCES
   ▼
[Cart: Contains Product]

[Add To Cart]
   |
   | VALIDATED_BY
   ▼
[Test: Product Added Successfully]
```

------------------------------------------------------------------------

# 23. Why Not a Graph Database Initially?

The ABM is graph-shaped.

That does not mean the first persistence layer must be Neo4j or another
graph database.

V0/V1 can model:

``` text
abm_nodes
abm_relationships
abm_facts
abm_evidence
```

in SQLite/PostgreSQL.

Advantages: - simpler deployment; - simpler backup; - fewer moving
pieces; - local-first friendly; - enough traversal capability for early
model sizes.

Later options:

1.  maintain relational source-of-truth and create graph projection;
2.  sync selected ABM objects to cloud graph infrastructure;
3.  introduce graph storage only after query patterns prove the need.

------------------------------------------------------------------------

# 24. ABM Fact Model

Any learned fact must carry evidence and provenance.

``` ts
ABMFact {
  id
  projectId

  subject
  predicate
  object

  sourceType
  sourceRef

  confidence
  approvalState

  observedAt
  lastVerifiedAt

  validFrom?
  validTo?

  version
}
```

Example:

``` text
Subject:
Apply Coupon

Predicate:
REQUIRES

Object:
Cart subtotal > ₹500

Source:
Human-approved assertion

Confidence:
1.0

Approval:
TRUSTED
```

------------------------------------------------------------------------

# 25. ABM Knowledge Lifecycle

``` text
OBSERVED
  ↓
SUGGESTED
  ↓
APPROVED
  ↓
TRUSTED
  ↓
STALE
  ↓
DEPRECATED
```

Do not allow a model observation to jump directly from OBSERVED to
TRUSTED without an explicit policy.

This prevents a recurring bug from silently becoming accepted business
behaviour.

------------------------------------------------------------------------

# 26. Failure Memory

Failure memory is a first-class ABM object.

``` ts
FailurePattern {
  id

  semanticArea
  symptoms
  suspectedCause?
  reproductionContext
  relatedEntities
  relatedModules
  relatedTests

  firstSeen
  lastSeen
  occurrences

  escapedToProduction
  businessImpact

  resolution?
}
```

Example:

``` text
Discount stacking unexpectedly activates free shipping
```

Later, change intelligence can query:

``` text
Coupon module changed
  ↓
Which historical failure patterns touched Coupon?
  ↓
Raise regression priority
```

------------------------------------------------------------------------

# 27. Intelligence Engine

One service interface:

``` ts
interface IntelligenceEngine {
  detectParameters(context)
  detectRepeatedSequences(context)
  suggestModule(context)
  describeStep(context)
  inferIntent(context)
  suggestAssertions(context)
  generateTests(context)
  diagnoseFailure(context)
  rankAlternativeElements(context)
  assessRisk(context)
}
```

Each capability delegates to the cheapest reliable provider.

------------------------------------------------------------------------

# 28. Intelligence Routing

``` text
REQUEST
  ↓
Capability Policy
  ↓
Can rules solve it?
  ├─ yes → Rules
  ↓ no
Can algorithm/ML solve it?
  ├─ yes → Local ML
  ↓ no
Can local LLM solve it?
  ├─ yes → Local LLM
  ↓ no
Cloud permitted?
  ├─ no → deterministic/manual fallback
  ↓ yes
Cloud small model
  ↓ if insufficient
Frontier model
```

Routing inputs:

-   task type;
-   privacy policy;
-   latency target;
-   cost budget;
-   model availability;
-   machine capabilities;
-   required confidence.

------------------------------------------------------------------------

# 29. AI Result Contract

Every AI capability should return structured output.

Bad:

``` text
"Looks like this might be a product variable."
```

Better:

``` json
{
  "proposalType": "parameter",
  "target": "Laptop",
  "suggestedName": "product",
  "confidence": 0.91,
  "evidence": [
    "entered into search field",
    "used as selected product context"
  ]
}
```

The UI can then render: - Accept; - Edit; - Keep fixed.

Structured responses also make provider substitution much easier.

------------------------------------------------------------------------

# 30. Local LLM Architecture

The app should not assume every machine can run the same model.

At startup:

``` text
Detect hardware
  ↓
Classify inference tier
  ↓
Select available runtime/model
  ↓
Benchmark quick health probe
  ↓
Register capabilities
```

Example tiers:

``` text
Tier 0
No local LLM

Tier 1
Small CPU model

Tier 2
Medium local model / acceleration

Tier 3
High-performance local inference
```

The product must work in Tier 0.

This prevents AI hardware requirements from blocking core QA
functionality.

------------------------------------------------------------------------

# 31. Model Distribution

Do not necessarily bundle every model into the main installer.

Recommended:

-   small bootstrap installer;
-   model download on demand;
-   versioned model cache;
-   checksum/signature verification;
-   user-visible disk usage;
-   remove/re-download model support.

Enterprise/local-only packages can later bundle approved models.

------------------------------------------------------------------------

# 32. ML / Embeddings Layer

Potential non-LLM services:

``` text
ElementSimilarityService
SequenceSimilarityService
ParameterClassifier
FailureClassifier
AnomalyDetector
FlakinessAnalyzer
RiskModel
```

Each model should have: - version; - training/source metadata; -
confidence calibration; - fallback.

Do not call something "AI" internally if a deterministic algorithm
solves it more reliably.

------------------------------------------------------------------------

# 33. Cloud Architecture --- V1

Cloud should initially be lightweight.

``` text
API Gateway
│
├── Identity
├── Workspace Sync
├── AI Gateway
├── Team Service
├── Scheduling Coordinator
└── Artifact Sync (optional)
```

Suggested stack can remain conventional:

-   TypeScript/Node backend;
-   PostgreSQL;
-   object storage;
-   queue for scheduled jobs;
-   secure secrets/KMS;
-   observability.

Do not build Kubernetes-first unless actual scale requires it.

------------------------------------------------------------------------

# 34. Cloud AI Gateway

All cloud model calls pass through one service.

Responsibilities:

-   provider abstraction;
-   routing;
-   redaction;
-   token/cost accounting;
-   retries;
-   rate limits;
-   prompt/version registry;
-   model policy;
-   customer privacy controls;
-   auditability.

The desktop app should never directly depend on individual
frontier-model vendor APIs in product logic.

------------------------------------------------------------------------

# 35. Cloud Execution Worker --- Later

Design the local execution interface so a run can later execute
elsewhere.

Concept:

``` ts
interface ExecutionWorker {
  capabilities()
  execute(plan, context)
  cancel(runId)
  streamEvents(runId)
}
```

Implementations:

``` text
LocalExecutionWorker
CloudExecutionWorker
EnterprisePrivateWorker
```

The Test/ABM model remains unchanged.

This prevents a painful rewrite when paid cloud parallelism arrives.

------------------------------------------------------------------------

# 36. Execution Event Stream

Workers should emit typed events:

``` text
RunStarted
StepStarted
ElementResolved
ActionPerformed
AssertionEvaluated
EvidenceCaptured
NetworkFailureObserved
ConsoleErrorObserved
StepPassed
StepFailed
StepBlocked
RunCompleted
```

This event stream powers:

-   live UI;
-   reports;
-   evidence linking;
-   diagnostics;
-   future cloud execution;
-   analytics.

------------------------------------------------------------------------

# 37. Scheduler

V1 scheduling can be simple:

``` text
Schedule
  ↓
Resolve tests/environment
  ↓
Create RunBatch
  ↓
Dispatch workers
  ↓
Collect Run events
  ↓
Aggregate
```

Local desktop scheduling requires the machine/app to be available.

Cloud scheduling can later dispatch cloud workers.

UI must make this distinction explicit.

------------------------------------------------------------------------

# 38. Parallel Execution

V1 local parallelism:

-   one browser context per test where possible;
-   configurable worker count;
-   basic resource isolation;
-   independent variable contexts.

Later:

ABM can mark resources:

``` text
UserAccount: shared/exclusive
Coupon: consumable
Order: mutable
Inventory: shared
```

Scheduler can then avoid unsafe parallel combinations.

------------------------------------------------------------------------

# 39. Result Engine

Result Engine consumes execution events.

Responsibilities:

-   PASS / FAIL / BLOCKED;
-   assertion aggregation;
-   evidence association;
-   timing;
-   failure classification;
-   diagnostic trigger;
-   suite aggregation.

Rules should determine base status.

AI must not decide whether an explicit deterministic assertion passed.

------------------------------------------------------------------------

# 40. Diagnostic Engine

Pipeline:

``` text
FAIL / BLOCKED
      ↓
Collect context
      ↓
Deterministic classifiers
      ↓
Compare successful run
      ↓
Network / console / DOM analysis
      ↓
Known failure pattern lookup
      ↓
ML / local AI
      ↓
Cloud escalation if allowed/needed
      ↓
Structured Diagnostic
```

Output:

``` ts
Diagnostic {
  observedFailure
  probableLayer
  probableCause
  confidence
  evidenceRefs
  relatedKnownFailures
  suggestedNextAction
}
```

Example:

``` text
Observed:
Order confirmation did not appear.

Probable layer:
Order API.

Evidence:
POST /orders returned 500.
Payment authorization succeeded.

Confidence:
0.91.

Interpretation:
Checkout UI likely completed correctly; order creation failed downstream.
```

------------------------------------------------------------------------

# 41. Counterfactual Diagnostics

When a prior successful run is available:

``` text
FAILED RUN
   ↕
LAST COMPARABLE SUCCESS
```

Compare:

-   module versions;
-   app version;
-   browser;
-   variables/data;
-   DOM;
-   endpoints;
-   response schemas;
-   console;
-   timings.

Rank meaningful differences.

Do not give every difference equal weight.

------------------------------------------------------------------------

# 42. Reporting Architecture

Reports should be generated from structured run data.

Do not compose reports directly from UI state.

Input:

``` text
Run
RunSteps
Assertions
Evidence
Diagnostics
Environment metadata
```

Outputs:

-   in-app Results view;
-   HTML;
-   PDF;
-   shareable cloud link later;
-   machine-readable JSON later.

This keeps reporting independent of the desktop UI.

------------------------------------------------------------------------

# 43. Reproduce Failure

V1 should store a **Reproduction Manifest** where safe.

``` ts
ReproductionManifest {
  testVersion
  moduleVersions
  environment
  browser
  dataset
  nonSecretVariables
  secretRefs
  relevantRuntimeState
}
```

Clicking Reproduce Failure:

1.  resolves current/retained versions;
2.  warns if the environment changed;
3.  recreates safe test context;
4.  reruns.

Never persist raw secret values into the manifest.

------------------------------------------------------------------------

# 44. Security Architecture

Security matters because the product handles:

-   application credentials;
-   customer data;
-   browser sessions;
-   screenshots;
-   network traffic;
-   potentially source/API information.

## V0 requirements

### Secrets

Use OS-native secure credential storage.

Database stores secret references, not plaintext values.

### IPC

Electron renderer must not receive unrestricted Node privileges.

Use: - context isolation; - explicit preload bridge; - allow-listed IPC
operations; - no arbitrary shell access from renderer.

### Browser

Each run uses isolated contexts where feasible.

### Artifacts

Support: - configurable retention; - deletion; - masking; - exclusion
policies.

### Logs

Never log secrets.

### Reports

Mask fields marked sensitive.

------------------------------------------------------------------------

# 45. Privacy Architecture

Project-level AI policy:

``` text
LOCAL_ONLY
HYBRID
CLOUD_ENHANCED
```

Before cloud model call:

``` text
Context
  ↓
Sensitivity scanner
  ↓
Redaction
  ↓
Policy check
  ↓
Cloud AI Gateway
```

Potential redactions: - passwords; - auth tokens; - customer emails; -
payment data; - cookies; - personal addresses.

Allow users to inspect what would be sent before enabling cloud AI in
sensitive environments.

------------------------------------------------------------------------

# 46. Data Retention

Separate retention policies:

-   run metadata;
-   screenshots;
-   traces;
-   DOM snapshots;
-   video;
-   network payloads.

Example defaults:

``` text
Run metadata: retain
Screenshots: retain
Full trace: failure-only / limited
DOM snapshots: failure-only
Video: opt-in
Request bodies: redacted / opt-in
```

Enterprise policies can override later.

------------------------------------------------------------------------

# 47. Versioning Strategy

Version these independently:

-   project schema;
-   test;
-   module;
-   ABM knowledge;
-   execution engine;
-   local model;
-   locator algorithm;
-   diagnostic logic.

Runs should record relevant versions.

Without version lineage, historical failures become hard to interpret.

------------------------------------------------------------------------

# 48. Change Tracking

V0:

-   test/module versioning basics;
-   application version optional metadata.

V1:

-   detect observable page/DOM changes;
-   module impact.

Later:

``` text
ABM Version N
      ↓ diff
ABM Version N+1
      ↓
Changed behaviours
      ↓
Affected tests
      ↓
Historical risk
      ↓
Regression recommendation
```

------------------------------------------------------------------------

# 49. Quality Knowledge Coverage Architecture

Research feature, not V0.

Potential dimensions:

``` text
Known Behaviour Coverage
State Transition Coverage
Rule Validation Coverage
Historical Risk Coverage
Changed Behaviour Coverage
Uncertainty
```

Do not compute a single arbitrary percentage until each dimension has a
defensible denominator.

Example:

``` text
Known transitions: 40
Tested transitions: 31
Transition coverage: 77.5%
```

That is defensible.

"Application understanding = 92%" is not defensible unless the
denominator can be established.

------------------------------------------------------------------------

# 50. Usage-Aware Risk --- Later

Optional external signals:

``` text
Flow usage frequency
Transaction volume
Revenue impact
Support incidents
Production errors
```

These should enter the risk engine only through explicit
connectors/imports.

Core product must work without production analytics.

------------------------------------------------------------------------

# 51. Autonomous Explore Architecture --- Later

Explore mode needs its own policy engine.

``` text
Observed Page
    ↓
Possible Actions
    ↓
Semantic Classification
    ↓
Risk Classification
    ↓
Allowed?
   /   \
 no     yes
 ↓       ↓
record  execute
only
```

Action classes:

``` text
SAFE
CAUTION
DESTRUCTIVE
UNKNOWN
```

UNKNOWN defaults to no autonomous execution.

Examples:

**SAFE** - open product; - search; - navigate.

**CAUTION** - add/remove cart item; - modify quantity; - apply coupon.

**DESTRUCTIVE** - place real order; - issue refund; - delete account; -
send customer message.

Policies vary by environment.

A staging sandbox may permit more.

------------------------------------------------------------------------

# 52. Business-Aware Adversarial Engine --- Later

Input:

``` text
ABM workflow
+ known states
+ constraints
+ historical defects
```

Mutation library:

-   double action;
-   refresh;
-   back navigation;
-   repeated submission;
-   concurrency;
-   alternate order;
-   invalid boundary;
-   interruption.

The engine should generate **semantically meaningful mutations**, not
random browser chaos.

------------------------------------------------------------------------

# 53. Requirements Ingestion --- Later

Documents should not become raw LLM context forever.

Pipeline:

``` text
Requirement document
       ↓
Extractor
       ↓
Candidate requirement facts
       ↓
Human validation
       ↓
ABM facts
       ↓
Coverage mapping
```

Example:

``` text
Requirement:
Coupons expire at midnight on expiry date.

ABM rule candidate:
Coupon(expired) MUST_NOT reduce total.
```

Then identify tests validating that rule.

------------------------------------------------------------------------

# 54. Conversational QA Architecture --- Later

Natural language should query the structured model.

User:

> What hasn't been tested in Checkout?

Pipeline:

``` text
NL question
   ↓
Intent / query translation
   ↓
Structured ABM query
   ↓
Deterministic result
   ↓
Natural-language presentation
```

Avoid answering from an LLM's memory of the app.

The ABM remains the source of truth.

------------------------------------------------------------------------

# 55. Observability

We need product observability from V0.

Track locally/with consent:

-   execution engine errors;
-   browser crashes;
-   locator resolution failure;
-   recorder problems;
-   model latency;
-   model fallback;
-   report-generation errors.

Internal product metrics:

``` text
Teach completion rate
Recorded → saved test conversion
Module reuse
Test-run success
BLOCKED rate
False locator suggestions
AI proposal acceptance
Time to first successful run
Time to diagnose failure
```

These metrics are more important early than sophisticated ABM metrics.

------------------------------------------------------------------------

# 56. Testing Our Testing Product

The product itself requires layered QA.

## Unit

-   parsers;
-   variable resolution;
-   locator scoring;
-   ABM services;
-   result logic.

## Component

-   recorder;
-   execution compiler;
-   report generator;
-   intelligence router.

## Integration

Use controlled fixture e-commerce apps with known behaviours and
defects.

Examples:

``` text
Fixture A
Stable checkout

Fixture B
Renamed Add to Cart button

Fixture C
/order returns 500

Fixture D
Coupon calculation defect

Fixture E
Delayed search results
```

## Golden recordings

Maintain deterministic recordings and expected semantic interpretations.

## End-to-end

Desktop: Teach → save → run → fail → inspect result → report.

------------------------------------------------------------------------

# 57. Test Fixture Application

Build an internal synthetic e-commerce application specifically for
product engineering.

It should support feature flags to inject defects:

``` text
FAIL_ORDER_API
DELAY_SEARCH
BREAK_CART_COUNT
RENAME_ADD_BUTTON
EXPIRE_COUPON
DOUBLE_CHARGE
WRONG_FREE_SHIPPING
```

Benefits:

-   deterministic regression;
-   demos;
-   model evaluation;
-   locator testing;
-   failure diagnostics;
-   ABM research;
-   adversarial testing.

This internal fixture is an important engineering asset.

------------------------------------------------------------------------

# 58. Monorepo Recommendation

Suggested initial repository:

``` text
/apps
  /desktop
  /fixture-commerce

/packages
  /domain
  /abm
  /execution
  /playwright-adapter
  /recorder
  /locator-engine
  /evidence
  /results
  /reports
  /intelligence
  /local-ai
  /api-testing
  /storage
  /security
  /shared-ui

/services
  /cloud-api          # V1
```

Use explicit package boundaries without prematurely deploying each
package as a service.

------------------------------------------------------------------------

# 59. Process Boundaries in Electron

Recommended:

``` text
Renderer Process
UI only
        ↓ IPC
Main Process
Application orchestration
        ↓
Worker Processes
Browser execution / heavy inference
```

Do not run Playwright execution or heavy ML directly in the UI renderer.

Benefits: - UI responsiveness; - failure isolation; - easier
cancellation; - later remote worker compatibility.

------------------------------------------------------------------------

# 60. Execution Worker Process

A local run can spawn a worker process.

``` text
Desktop Main
   ↓
Run specification
   ↓
Worker Process
   ↓
Playwright
   ↓
Events
   ↓
Desktop Main / Result Engine
```

If a browser crashes, the UI remains alive.

The same event protocol can later be used by cloud workers.

------------------------------------------------------------------------

# 61. Cancellation and Recovery

Every long operation should be cancellable:

-   Teach session;
-   run;
-   AI generation;
-   model download;
-   report generation.

Crash recovery:

At app startup detect: - incomplete runs; - abandoned Teach sessions; -
uncommitted artifacts.

Mark stale runs as interrupted rather than silently deleting them.

------------------------------------------------------------------------

# 62. Desktop Update Strategy

Because Playwright browser binaries are version-coupled, update
management must account for:

-   app version;
-   Playwright version;
-   browser binary version.

Use a managed update workflow that: 1. updates app; 2. verifies required
browser binaries; 3. downloads missing version; 4. runs health check.

Keep at least one rollback-safe version until update succeeds.

------------------------------------------------------------------------

# 63. Storage Growth

Evidence can grow much faster than metadata.

Implement from V0:

-   project storage usage;
-   artifact cleanup;
-   retention policy;
-   "delete old successful-run artifacts";
-   keep metadata after artifact expiry.

Later allow external/object storage.

------------------------------------------------------------------------

# 64. Import / Export

V0: - project backup/export; - report export.

V1: - Playwright export; - structured project export.

Possible format:

``` text
project.json
tests/
modules/
datasets/
abm/
```

Secrets excluded.

This supports customer ownership and reduces lock-in concern.

------------------------------------------------------------------------

# 65. Error Taxonomy

Separate failures:

``` text
APPLICATION_FAILURE
ASSERTION_FAILURE
AUTOMATION_BLOCKED
TEST_DATA_FAILURE
ENVIRONMENT_FAILURE
PRODUCT_RUNTIME_ERROR
AI_SERVICE_ERROR
```

Only the first two should ordinarily appear as FAIL.

Examples:

``` text
Place Order returns server error
→ APPLICATION_FAILURE

Expected ₹500 but got ₹550
→ ASSERTION_FAILURE

Button could not be confidently located
→ AUTOMATION_BLOCKED

Coupon expired before test
→ TEST_DATA_FAILURE

Staging is offline
→ ENVIRONMENT_FAILURE
```

This taxonomy becomes critical for diagnostics and trust.

------------------------------------------------------------------------

# 66. Human Governance Service

Do not scatter AI-approval behavior throughout UI code.

Create a shared proposal model:

``` ts
Proposal {
  id
  type
  source
  target
  suggestedChange
  evidence
  confidence
  status
}
```

Statuses:

``` text
PENDING
ACCEPTED
EDITED
REJECTED
EXPIRED
```

Proposal types:

``` text
PARAMETER
MODULE
ASSERTION
LOCATOR_REPLACEMENT
BUSINESS_RULE
TEST
RISK
HEAL
ABM_FACT
```

This creates consistent user control across the product.

------------------------------------------------------------------------

# 67. Auditability

Record meaningful semantic changes:

``` text
User approved invariant
User rejected locator replacement
AI generated test
User edited generated test
Module v4 updated
ABM rule deprecated
```

V0 can store basic local history.

V1 team environments need stronger audit logs.

------------------------------------------------------------------------

# 68. Architecture by Release

## V0

``` text
Electron Desktop
├── React UI
├── Node/TS Core
├── Playwright Chromium Worker
├── Recorder
├── Test Compiler
├── Locator Engine
├── Evidence Engine
├── Result/Report Engine
├── SQLite
├── File Artifacts
├── Rules/Algorithms
└── Optional Local AI
```

No mandatory cloud.

Optional cloud can be limited to: - account/licensing; - opt-in AI.

## V1

Add:

``` text
API Engine
Scheduler
Parallel Workers
Firefox/WebKit
Team Cloud
Cloud AI Gateway
Provenance/ABM expansion
Diagnostics
Failure Memory
```

## V1.x

Add:

``` text
Assisted Healing
Flakiness Intelligence
Advanced Local AI
Change Intelligence
Resource Isolation
```

## Later

Add:

``` text
Cloud Workers
Explore Engine
Risk Engine
State-space Model
Knowledge Coverage
Production Signal Connectors
Mobile
Visual
Accessibility
```

------------------------------------------------------------------------

# 69. Key Architectural Decisions

## Decision 1

**Electron + React + TypeScript for V0.**

Reason: Lowest integration friction with Playwright/Node/local
inference.

## Decision 2

**Playwright is execution infrastructure, not the product domain
model.**

Reason: Protect ABM/product semantics from framework coupling.

## Decision 3

**SQLite + filesystem first.**

Reason: Local-first simplicity; ABM does not justify a graph database
yet.

## Decision 4

**Typed semantic modules are the V0 Minimum Viable ABM.**

Reason: They provide immediate reuse and establish the
application-behaviour abstraction.

## Decision 5

**Runs/evidence are immutable historical records.**

Reason: Diagnostics, comparison, failure memory and auditability rely on
trustworthy history.

## Decision 6

**All AI is accessed through capability interfaces.**

Reason: Rules/ML/local/cloud providers remain swappable.

## Decision 7

**Core product works without an LLM.**

Reason: Reliability, privacy, cost and hardware inclusivity.

## Decision 8

**Human governance is a platform service, not isolated UI buttons.**

Reason: AI proposals must be consistently
inspectable/editable/rejectable.

## Decision 9

**Local execution worker uses an abstract worker protocol from day
one.**

Reason: Allows future cloud execution without rewriting tests.

## Decision 10

**Full ABM grows incrementally from validated semantic objects.**

Reason: Avoid speculative graph complexity.

------------------------------------------------------------------------

# 70. Architecture Risks

## Risk A --- Electron resource usage

Mitigation: - isolate workers; - lazy-load AI models; - monitor
memory; - avoid heavyweight UI dependencies.

Re-evaluate Tauri/native shell if measured resource use becomes
unacceptable.

## Risk B --- Browser binaries make distribution heavy

Mitigation: - Chromium-only V0; - download/manage browser binaries
separately; - transparent disk usage.

## Risk C --- ABM overengineering

Mitigation: Start with semantic modules, inputs, outputs, outcomes and
preconditions.

Do not build a universal ontology before customer use proves it.

## Risk D --- Local LLM inconsistency

Mitigation: Core product never depends on local LLM success.

Use rules/algorithms first and cloud/manual fallback.

## Risk E --- Evidence privacy

Mitigation: redaction, retention, explicit capture settings, local-first
storage.

## Risk F --- Incorrect AI knowledge

Mitigation: provenance, confidence, proposal lifecycle, human approval.

## Risk G --- Desktop scheduling limitations

Mitigation: clearly distinguish local schedules from cloud schedules.

## Risk H --- Product becomes a Playwright GUI

Mitigation: all enduring product objects remain above the execution
adapter.

------------------------------------------------------------------------

# 71. First Technical Vertical Slice

Before building every V0 screen, prove this end-to-end path:

``` text
1. Create Project
2. Open controlled Chromium
3. Teach:
   Search for "Laptop"
   Open product
   Add to Cart
4. Capture semantic locator information
5. Convert "Laptop" → suggested {{product}}
6. User accepts parameter
7. User marks cart assertion
8. Extract "Search Product" and "Add To Cart" modules
9. Save
10. Run using "Watch"
11. Capture screenshot/network/console
12. PASS / FAIL / BLOCKED
13. Produce result timeline
14. Export HTML report
```

This slice simultaneously proves:

-   desktop shell;
-   Playwright;
-   recording;
-   semantic events;
-   parameters;
-   modules;
-   minimum ABM;
-   execution compiler;
-   evidence;
-   reports;
-   governance.

If this slice feels magical to a manual QA tester, the core architecture
is likely correct.

------------------------------------------------------------------------

# 72. Second Technical Vertical Slice

Inject an e-commerce defect:

``` text
POST /orders → 500
```

Run checkout test.

Expected product output:

``` text
FAIL

Observed:
Order confirmation did not appear.

Evidence:
POST /orders returned HTTP 500.
Payment step completed.

Likely failure area:
Order creation service.

Screenshot:
attached

[Re-run] [Open Evidence] [Export Report]
```

This proves the architecture can evolve toward quality intelligence
rather than stopping at recording.

------------------------------------------------------------------------

# 73. Architecture Validation Gates

Before V0 implementation is considered architecturally healthy,
validate:

### Gate 1

Can the domain model execute without knowing Playwright-specific syntax?

### Gate 2

Can modules expose typed inputs/outputs?

### Gate 3

Can execution emit a complete event stream?

### Gate 4

Can a browser worker crash without taking down the UI?

### Gate 5

Can evidence be deleted independently of historical metadata?

### Gate 6

Can AI be disabled and core testing still work?

### Gate 7

Can an AI provider be swapped without changing UI/domain objects?

### Gate 8

Can a test eventually be sent to a remote worker using the same
Execution Plan?

### Gate 9

Can every learned fact retain provenance?

### Gate 10

Can every consequential AI proposal be rejected manually?

If any answer is **No**, fix the architecture before adding more
intelligence.

------------------------------------------------------------------------

# 74. Suggested Initial Engineering Team

For a focused V0, architecture maps cleanly to a small senior team:

### Desktop/Product Engineer

-   Electron;
-   React;
-   UX;
-   IPC.

### Automation/Runtime Engineer

-   Playwright;
-   recorder;
-   worker;
-   locator engine.

### Backend/Domain Engineer

-   domain model;
-   SQLite;
-   modules;
-   test compiler;
-   reports.

### AI/ML Engineer

Can initially be fractional/shared: - inference router; - parameter
detection; - sequence detection; - local model experiments.

A strong full-stack engineer can cover multiple areas early.

Avoid building separate teams for cloud/platform/mobile before V0
validation.

------------------------------------------------------------------------

# 75. Architectural North Star

The architecture ultimately supports:

``` text
APPLICATION
    ↓
OBSERVATION + REQUIREMENTS + HISTORY
    ↓
APPLICATION BEHAVIOUR MODEL
    ↓
┌─────────────────────────────────────────┐
│ Test Composition                        │
│ Coverage Discovery                      │
│ Safe Exploration                        │
│ Failure Diagnosis                       │
│ Change Intelligence                     │
│ Risk Prediction                         │
│ Quality Knowledge                       │
└─────────────────────────────────────────┘
    ↓
HUMAN-GOVERNED QUALITY DECISIONS
```

The browser automation engine is one execution mechanism inside that
system.

------------------------------------------------------------------------

# 76. Architecture Summary

The recommended implementation strategy is intentionally conservative at
the infrastructure level and ambitious at the product-model level.

Build V0 as:

> **Electron + React + TypeScript + Node + Playwright + SQLite + local
> filesystem + deterministic intelligence + optional local AI.**

Own:

> **Teach + semantic modules + Execution Plan + ABM + governance +
> evidence semantics + quality intelligence.**

Borrow:

> **browser automation + databases + ML runtimes + local inference
> runtimes + commodity infrastructure.**

The most important technical principle remains:

> **Do not store the application as scripts. Store what the scripts
> mean.**

That single decision creates the architectural path from a useful V0
testing product to the full Application Quality Intelligence Platform.

------------------------------------------------------------------------

# 77. Current Technology Validation Notes

Architecture choices were checked against current official technical
documentation in September 2026.

-   Playwright supports Chromium, Firefox and WebKit and manages
    version-specific browser binaries.
-   Playwright supports headed/headless execution and parallel test
    execution.
-   Playwright tracing can capture browser operations, network activity,
    screenshots and snapshots for failure analysis.
-   ONNX Runtime supports JavaScript/Node deployment and on-device
    inference options, supporting the proposed local-first ML
    architecture.

Primary references:

-   Playwright Browsers: https://playwright.dev/docs/browsers
-   Playwright Running Tests: https://playwright.dev/docs/running-tests
-   Playwright Tracing: https://playwright.dev/docs/api/class-tracing
-   Playwright Trace Viewer: https://playwright.dev/docs/trace-viewer
-   ONNX Runtime Web/JavaScript:
    https://onnxruntime.ai/docs/tutorials/web/
-   ONNX Runtime Web App Architecture:
    https://onnxruntime.ai/docs/tutorials/web/build-web-app.html
