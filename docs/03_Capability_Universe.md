# 03 --- Capability Universe

**Product:** Application Quality Intelligence Platform\
**Core engine:** Application Behaviour Model (ABM)\
**Commercial wedge:** Desktop-first intelligent browser QA\
**Planning horizon:** V0 → V1 → V1.x → Later / V2+ → Research\
**Domain examples:** E-commerce only

------------------------------------------------------------------------

# 1. Purpose

This document is the master capability inventory for the product. It
consolidates:

-   commercial table stakes;
-   decisions from the Q1--Q56 ideation;
-   competitive-validation implications;
-   ABM capabilities;
-   AI/ML capabilities;
-   execution capabilities;
-   evidence and diagnostics;
-   safety and governance;
-   future quality-intelligence innovations.

It is deliberately broader than any single release.

A capability appearing here does **not** mean it should be built
immediately.

------------------------------------------------------------------------

# 2. Release Labels

  -----------------------------------------------------------------------
  Label                               Meaning
  ----------------------------------- -----------------------------------
  **V0**                              Smallest commercially credible
                                      browser QA product

  **V1**                              First broader AI QA Automation
                                      release

  **V1.x**                            Resilience, maintenance and
                                      intelligence maturation

  **Later**                           Valuable platform expansion after
                                      core product-market fit

  **Research**                        High-upside hypothesis requiring
                                      validation before commitment

  **Foundation**                      Architectural decision that should
                                      exist early even if invisible
  -----------------------------------------------------------------------

Priority:

-   **P0** --- essential;
-   **P1** --- important;
-   **P2** --- valuable;
-   **P3** --- optional/later.

------------------------------------------------------------------------

# 3. Capability Map

``` text
APPLICATION QUALITY INTELLIGENCE PLATFORM
│
├── A. Desktop & Workspace
├── B. Teach / Recording
├── C. Test Authoring
├── D. Variables, Data & Environments
├── E. Modules & Composition
├── F. Browser Execution
├── G. Assertions & Evidence
├── H. Results & Reporting
├── I. Locator Resilience
├── J. API Testing
├── K. Scheduling & Parallelism
├── L. Application Behaviour Model
├── M. AI / ML Intelligence
├── N. Test Discovery & Generation
├── O. Diagnostics & Failure Intelligence
├── P. Change, Risk & Regression Intelligence
├── Q. Exploration & Adversarial Testing
├── R. Quality Knowledge & Release Intelligence
├── S. Human Governance & Safety
├── T. Local / Cloud Intelligence Architecture
├── U. Collaboration & Integrations
└── V. Future Platform Expansion
```

------------------------------------------------------------------------

# 4. A --- Desktop & Workspace

  ------------------------------------------------------------------------------------------
  Capability              Release                       Priority Notes / Dependencies
  ----------------------- ---------------- --------------------- ---------------------------
  Desktop application     V0                                  P0 Initial primary surface
  shell                                                          

  macOS support           V0                                  P0 Confirm packaging/update
                                                                 strategy

  Windows support         V0/V1                               P0 Commercially important

  Project creation        V0                                  P0 Root workspace object

  Multiple projects       V0                                  P0 Separate
                                                                 applications/environments

  Project dashboard       V0                                  P0 Recent runs, tests,
                                                                 failures

  Local project storage   V0                                  P0 Foundation for local-first
                                                                 execution

  Secure local secrets    V0                                  P0 OS keychain/credential
  storage                                                        vault preferred

  Automatic application   V0                                  P1 Desktop distribution
  updates                                                        requirement

  Workspace/team accounts V1                                  P1 Cloud sync dependency

  Roles and permissions   V1                                  P1 Team/enterprise

  Audit log               V1.x                                P1 Enterprise governance

  Offline/local-only mode V1.x                                P1 Privacy differentiator

  Hybrid/cloud-enhanced   V1                                  P1 Intelligence routing
  modes                                                          
  ------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 5. B --- Teach / Recording

## Objective

Make **Teach** the signature interaction rather than exposing raw
browser automation.

  ---------------------------------------------------------------------------------------------
  Capability           Release                       Priority Notes
  -------------------- ---------------- --------------------- ---------------------------------
  Launch controlled    V0                                  P0 Playwright Chromium
  browser                                                     

  Record navigation    V0                                  P0 

  Record clicks        V0                                  P0 

  Record text entry    V0                                  P0 Secret-aware

  Record               V0                                  P0 
  select/dropdown                                             

  Record keyboard      V0                                  P1 
  actions                                                     

  Record scroll where  V0                                  P1 Avoid noisy steps
  meaningful                                                  

  Record               V0                                  P1 
  upload/download                                             

  Capture              V0                                  P0 Required for resilient locators
  DOM/accessibility                                           
  context                                                     

  Convert raw events   V0                                  P0 Rules/local model
  to readable steps                                           

  Pause/resume         V0                                  P1 
  teaching                                                    

  Mark checkpoint      V0                                  P0 
  while teaching                                              

  Mark value as        V0                                  P0 
  variable                                                    

  AI                   V0                                  P1 Human confirms
  candidate-variable                                          
  detection                                                   

  AI repeated-sequence V0/V1                               P1 Not unique; convenience
  detection                                                   

  Teach summary: "I    V0                                  P0 Goal/variables/outcomes/modules
  understood"                                                 

  Edit understanding   V0                                  P0 Human sovereignty
  before save                                                 

  Typed narration      V0/V1                               P1 Intent enrichment
  during Teach                                                

  Spoken narration     V1                                  P2 Multimodal signature
  during Teach                                                

  Intent + observation V1                                  P1 Feeds ABM
  fusion                                                      

  Automatic            V1                                  P1 Generalise Laptop → Product
  abstraction from                                            
  example values                                              

  Learn alternative    V1                                  P1 Human approved
  valid outcomes                                              

  Passive observation  Later                               P2 Learn from manual QA usage
  mode                                                        
  ---------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 6. C --- Test Authoring

  ------------------------------------------------------------------------------------
  Capability                Release                       Priority Notes
  ------------------------- ---------------- --------------------- -------------------
  Visual step editor        V0                                  P0 

  Add/edit/delete/reorder   V0                                  P0 
  steps                                                            

  Insert assertion          V0                                  P0 

  Insert wait               V0                                  P0 

  Conditional logic         V0/V1                               P1 

  Basic loops               V1                                  P2 Avoid complexity in
                                                                   V0

  Duplicate test            V0                                  P1 

  Test name/description     V0                                  P0 

  Tags                      V0                                  P1 

  Test folders/suites       V0                                  P0 

  Search/filter tests       V0                                  P1 

  Test templates            V0                                  P1 

  Natural-language test     V1                                  P1 
  editing                                                          

  Natural-language test     V1                                  P1 Market parity
  generation                                                       

  Advanced code escape      V1                                  P2 JS/Playwright
  hatch                                                            fragment

  Goal/intention field      V0/V1                               P1 Foundation for
                                                                   goal-based testing

  Goal → execution-plan     Research/Later                      P1 Requires mature ABM
  generation                                                       

  Export test to Playwright V1                                  P1 Trust/portability

  Import existing           Later                               P2 Migration path
  Playwright tests                                                 
  ------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 7. D --- Variables, Data & Environments

  Capability                          Release     Priority Notes
  ----------------------------------- --------- ---------- -----------------------------------
  Test variables                      V0                P0 
  Module inputs                       V0                P0 
  Module outputs                      V0                P0 Important semantic differentiator
  Environment variables               V0                P0 
  Secrets                             V0                P0 Never expose in reports
  Generated/runtime variables         V0/V1             P1 IDs/order numbers
  Presets                             V0                P1 Saved reusable configurations
  Multiple environments               V0                P0 Dev/staging/etc.
  Base URL configuration              V0                P0 
  Credential presets                  V0                P1 
  CSV/table datasets                  V0                P0 
  Data-row execution                  V0                P0 
  Per-row result separation           V0                P0 
  Data masking                        V0                P1 
  Synthetic data generation           V1                P2 
  Test-data precondition validation   V1                P1 ABM dependency
  Test-data replacement suggestion    V1                P1 e.g. expired coupon
  Test-data lifecycle management      Later             P2 

------------------------------------------------------------------------

# 8. E --- Modules & Composition

## Strategic importance

Modules must become **semantic business functions**, not merely grouped
browser steps.

  ----------------------------------------------------------------------------
  Capability           Release                       Priority Notes
  -------------------- ---------------- --------------------- ----------------
  Create reusable      V0                                  P0 
  module manually                                             

  Extract steps into   V0                                  P0 
  module                                                      

  Module inputs        V0                                  P0 

  Module outputs       V0                                  P0 

  Module expected      V0                                  P0 Minimum Viable
  outcomes                                                    ABM

  Module preconditions V0/V1                               P1 

  Module               V0                                  P1 
  description/intent                                          

  Module library       V0                                  P0 

  Show module usage    V0                                  P1 Maintenance
  count                                                       

  Update module across V0                                  P0 Major value
  dependent tests                                             

  Version modules      V1                                  P1 

  Impact preview       V1                                  P1 
  before update                                               

  Detect repeated      V0/V1                               P1 AI suggestion
  sequences                                                   

  Suggest module name  V0                                  P2 Local LLM

  Semantic module      V1                                  P1 
  composition                                                 

  Self-compose new     V1/Later                            P1 High-value
  tests from trusted                                          intelligence
  modules                                                     

  Generate only        V1/Later                            P1 Reduces model
  missing module                                              usage
  behaviour                                                   

  Cross-project        Later                               P2 Privacy controls
  generic module                                              
  patterns                                                    
  ----------------------------------------------------------------------------

------------------------------------------------------------------------

# 9. F --- Browser Execution

  Capability                         Release     Priority Notes
  ---------------------------------- --------- ---------- -------------------------------
  Playwright execution engine        V0                P0 Deterministic core
  Chromium                           V0                P0 
  Headed execution                   V0                P0 Important for trust/debugging
  Headless execution                 V0                P1 
  Stop/pause run                     V0                P0 
  Step-through execution             V0                P1 
  Retry test                         V0                P1 
  Retry failed step policy           V0/V1             P1 Must not hide real defects
  Configurable timeout               V0                P1 
  Browser context isolation          V0                P0 
  Cookie/session handling            V0                P0 
  Download handling                  V0                P1 
  Upload handling                    V0                P1 
  New tab/window handling            V0                P1 
  iframe handling                    V0                P1 
  Chromium device viewport presets   V0/V1             P2 
  Firefox                            V1                P1 
  WebKit                             V1                P1 
  Cross-browser matrix               V1                P1 
  Cloud browser execution            Later             P2 Paid upgrade
  Distributed execution              Later             P2 
  Browser/device farm                Later             P3 Avoid infrastructure trap

------------------------------------------------------------------------

# 10. G --- Assertions & Evidence

  -------------------------------------------------------------------------------
  Capability              Release                       Priority Notes
  ----------------------- ---------------- --------------------- ----------------
  Element visible         V0                                  P0 
  assertion                                                      

  Text assertion          V0                                  P0 

  URL assertion           V0                                  P0 

  Element state assertion V0                                  P0 

  Value assertion         V0                                  P0 

  Count assertion         V0                                  P0 e.g. cart count

  Basic numeric           V0                                  P1 
  comparison                                                     

  Screenshot at           V0                                  P0 
  checkpoint                                                     

  Timestamp               V0                                  P0 

  Current URL             V0                                  P0 

  Expected vs actual      V0                                  P0 

  Console error capture   V0                                  P0 Background
                                                                 diagnostic

  Network failure capture V0                                  P0 

  Relevant                V0/V1                               P1 Privacy filters
  request/response                                               
  metadata                                                       

  Locator metadata        V0                                  P1 

  DOM snapshot on failure V0/V1                               P1 

  Full trace              V1                                  P1 

  Video                   V1                                  P2 

  HAR export              V1                                  P2 

  Visual comparison       Later                               P2 

  Accessibility           Later                               P2 
  assertions                                                     

  Learned candidate       V1/Research                         P1 Human approved
  assertions/invariants                                          
  -------------------------------------------------------------------------------

------------------------------------------------------------------------

# 11. H --- Results & Reporting

  Capability                       Release            Priority Notes
  -------------------------------- ---------------- ---------- --------------------------------------
  PASS                             V0                       P0 
  FAIL                             V0                       P0 App contradicted expectation
  BLOCKED                          V0                       P0 Automation couldn't reliably proceed
  Test-run timeline                V0                       P0 Human-readable
  Step-level status                V0                       P0 
  Evidence viewer                  V0                       P0 
  Run history                      V0                       P0 
  Compare runs                     V1                       P1 
  Filter failures                  V0                       P1 
  HTML report                      V0                       P0 
  PDF report                       V0                       P1 
  Share/export report              V0                       P1 
  Developer-ready defect summary   V0/V1                    P1 
  Copy failure package             V0/V1                    P1 
  Reproduce Failure action         V1                       P1 
  Suite summary                    V0                       P0 
  Trend reporting                  V1                       P1 
  Flakiness indicators             V1.x                     P1 
  Release intelligence dashboard   Later                    P1 
  Quality Knowledge dashboard      Research/Later           P1 

------------------------------------------------------------------------

# 12. I --- Locator Resilience

Preferred locator order:

``` text
data-testid
→ accessible role/name
→ stable ID
→ label
→ meaningful text
→ structural relationship
→ CSS/XPath fallback
```

  ----------------------------------------------------------------------------------------------
  Capability          Release                       Priority Notes
  ------------------- ---------------- --------------------- -----------------------------------
  Multi-hint locator  V0                                  P0 
  capture                                                    

  Semantic locator    V0                                  P0 
  preference                                                 

  Locator scoring     V0                                  P0 Deterministic/ML

  Backup locator      V0                                  P1 
  hints                                                      

  Element-not-found   V0                                  P0 
  diagnostics                                                

  Candidate           V0/V1                               P1 
  replacement                                                
  suggestion                                                 

  Confidence score    V0/V1                               P1 

  Use Once            V1.x                                P1 

  Accept & Update     V1.x                                P1 

  Reject              V1.x                                P1 

  Silent self-healing V1.x/Later                          P2 Only
                                                             high-confidence/policy-controlled

  Historical locator  V1.x                                P1 
  intelligence                                               

  Semantic change     V1.x                                P1 Must not change intent silently
  detection                                                  
  ----------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 13. J --- API Testing

  Capability                  Release      Priority Notes
  --------------------------- ---------- ---------- ---------------------
  REST request step           V1                 P0 
  GET/POST/PUT/PATCH/DELETE   V1                 P0 
  Headers                     V1                 P0 
  Query parameters            V1                 P0 
  JSON/body editor            V1                 P0 
  Auth configuration          V1                 P0 
  Response status assertion   V1                 P0 
  Response body assertion     V1                 P0 
  Extract response variable   V1                 P0 Feed UI steps
  API module                  V1                 P1 
  UI + API combined flow      V1                 P1 Diagnostic leverage
  OpenAPI import              V1/Later           P1 ABM enrichment
  API dependency mapping      Later              P1 
  Contract testing            Later              P2 
  GraphQL                     Later              P2 

------------------------------------------------------------------------

# 14. K --- Scheduling & Parallelism

  Capability                                 Release        Priority Notes
  ------------------------------------------ ------------ ---------- -------
  Run suite manually                         V0                   P0 
  Run selected tests                         V0                   P0 
  Local sequential suite                     V0                   P0 
  Scheduled runs                             V1                   P0 
  Local parallel execution                   V1                   P0 
  Configurable worker count                  V1                   P1 
  Basic test isolation                       V1                   P0 
  Detect obvious shared-resource conflicts   V1.x                 P1 
  ABM-aware isolation                        Later                P1 
  Cloud parallel execution                   Later                P2 
  Queue/orchestration                        Later                P2 
  Smart ordering by risk                     V1.x/Later           P1 
  Run highest-risk subset first              Later                P1 

------------------------------------------------------------------------

# 15. L --- Application Behaviour Model

## Minimum Viable ABM --- V0

``` text
Business Module
├── Name / intent
├── Inputs
├── Outputs
├── Preconditions
├── Expected outcomes
├── Browser implementation
└── Evidence
```

## Expanded ABM

  Capability                  Release         Priority
  --------------------------- ------------- ----------
  Semantic module/action      V0                    P0
  Inputs/outputs              V0                    P0
  Expected outcomes           V0                    P0
  Preconditions               V0/V1                 P1
  Screen/page model           V1                    P1
  Business entity model       V1                    P1
  Dependencies                V1                    P1
  States                      V1/Later              P1
  State transitions           V1/Later              P1
  Business rules              V1/Later              P1
  Known invariants            V1/Research           P1
  Permissions/roles           Later                 P2
  Test-data requirements      V1                    P1
  Linked tests                V0/V1                 P1
  Coverage relationships      V1/Later              P1
  Historical failures         V1                    P1
  Application changes         V1/Later              P1
  Risk                        Later                 P1
  Provenance                  V1                    P0
  Confidence                  V1                    P0
  Human-approved status       V1                    P0
  Last verified               V1                    P1
  Knowledge version           V1/Later              P1
  Staleness                   Later                 P1
  ABM visual explorer         V1/Later              P2
  ABM diff between releases   Later                 P1

------------------------------------------------------------------------

# 16. ABM Knowledge Lifecycle

Required eventual lifecycle:

``` text
Observed
→ Suggested
→ Human Approved
→ Trusted
→ Stale
→ Deprecated
```

  Capability                                   Release     Priority
  -------------------------------------------- --------- ----------
  Record source/provenance                     V1                P0
  Confidence score                             V1                P0
  Human approve/reject                         V1                P0
  Correct learned rule                         V1                P0
  Last verification date                       V1                P1
  Detect potentially stale knowledge           Later             P1
  Deprecate knowledge                          Later             P1
  Conflict detection across sources            Later             P1
  Requirement vs observed behaviour conflict   Later             P1

------------------------------------------------------------------------

# 17. M --- AI / ML Intelligence

## Deterministic first

  Capability               Preferred technique              Release
  ------------------------ -------------------------------- ---------
  Browser execution        Deterministic                    V0
  Assertions               Deterministic                    V0
  Locator scoring          Rules/ML                         V0
  Repeated sequences       Sequence algorithms/clustering   V0/V1
  Parameter candidates     Rules/classifier                 V0
  DOM change               Structural algorithms            V1
  Screenshot difference    CV                               Later
  Failure categorisation   Rules/ML                         V0/V1
  Flakiness correlation    Statistics/ML                    V1.x
  Risk scoring             Rules/ML                         Later
  Combinatorial tests      Pairwise algorithms              Later

## Local LLM

  Capability                        Release     Priority
  --------------------------------- --------- ----------
  Step description                  V0                P2
  Module naming                     V0                P2
  Simple intent extraction          V0/V1             P1
  Variable suggestion explanation   V0                P2
  Failure summary                   V1                P1
  Natural-language editing          V1                P1
  Semantic mapping                  V1                P1

## Cloud model

  Capability                       Release      Priority
  -------------------------------- ---------- ----------
  Complex test generation          V1                 P1
  PRD → candidate tests            Later              P2
  Deep multi-source diagnostics    V1/Later           P1
  Complex planning                 Later              P2
  Advanced exploratory reasoning   Later              P2

## Intelligence router

  Capability                   Release           Priority
  ---------------------------- --------------- ----------
  Capability-based AI API      Foundation/V0           P0
  Rules before models          Foundation/V0           P0
  Local model support          V0/V1                   P1
  Cloud escalation             V1                      P1
  Cost budget per task         V1                      P1
  Privacy policy per project   V1                      P1
  Model-provider abstraction   Foundation/V0           P0
  Quality/latency telemetry    V1                      P1

------------------------------------------------------------------------

# 18. N --- Test Discovery & Generation

  Capability                              Release            Priority Notes
  --------------------------------------- ---------------- ---------- ---------------
  Generate test from natural language     V1                       P1 Parity
  Generate from taught workflow           V0/V1                    P1 
  Candidate parameter expansion           V0/V1                    P1 
  Candidate negative tests                V1                       P1 
  Candidate boundary tests                V1                       P1 
  Test-family generation                  V1                       P1 Human selects
  Reuse trusted modules first             V1                       P1 
  Detect missing workflow coverage        Later                    P1 
  Detect untested state transitions       Later                    P1 
  Pairwise/combinatorial candidates       Later                    P1 
  Requirement → coverage mapping          Later                    P1 
  Requirement → missing test              Later                    P1 
  Generate tests before feature exists    Research/Later           P2 
  Cross-application pattern suggestions   Research                 P2 

------------------------------------------------------------------------

# 19. O --- Diagnostics & Failure Intelligence

  Capability                           Release      Priority
  ------------------------------------ ---------- ----------
  Failure screenshot                   V0                 P0
  Console/network evidence             V0                 P0
  Expected vs actual                   V0                 P0
  Basic failure classification         V0                 P1
  AI-readable failure summary          V1                 P1
  Probable failure location            V1                 P1
  Evidence-backed diagnosis            V1                 P1
  Confidence on diagnosis              V1                 P1
  UI vs API/backend distinction        V1                 P1
  Compare with last successful run     V1                 P1
  Counterfactual difference analysis   V1/Later           P1
  Recommend isolation experiment       Later              P2
  One-click reproduce failure          V1                 P1
  Failure clustering                   V1.x               P1
  Flakiness detection                  V1.x               P1
  Flakiness cause correlation          V1.x               P1
  Historical failure memory            V1                 P1
  Escaped production bug ingestion     V1/Later           P1

------------------------------------------------------------------------

# 20. P --- Change, Risk & Regression Intelligence

  Capability                         Release            Priority
  ---------------------------------- ---------------- ----------
  Compare test run changes           V1                       P1
  Detect page/DOM changes            V1                       P1
  Identify affected modules          V1                       P1
  Show dependent tests               V1                       P1
  ABM diff                           Later                    P1
  Change impact graph                Later                    P1
  Historical-risk score              Later                    P1
  Business-impact weighting          Later                    P1
  Usage-frequency weighting          Later                    P2
  Regression subset recommendation   Later                    P1
  Prioritise high-risk tests         V1.x/Later               P1
  Predict likely failure areas       Research/Later           P1
  Explain risk recommendation        Later                    P0
  Failure memory increases risk      Later                    P1

Potential risk function:

``` text
Risk =
Probability of Failure
× Business Impact
× Usage Frequency
× Change Impact
× Historical Failure Propensity
```

The exact model must be validated rather than treated as a fixed
formula.

------------------------------------------------------------------------

# 21. Q --- Exploration & Adversarial Testing

  Capability                         Release            Priority
  ---------------------------------- ---------------- ----------
  Safe Explore Mode                  Later                    P1
  Discover pages/screens             Later                    P1
  Discover actions                   Later                    P1
  Discover workflows                 Later                    P1
  Detect unexplored areas            Later                    P1
  Safe-action classification         V1/Later                 P0
  CAUTION-action policy              V1/Later                 P0
  DESTRUCTIVE-action policy          V1/Later                 P0
  Sandbox trust policy               Later                    P1
  Autonomous safe test execution     Later                    P1
  Adversarial behaviour generation   Later                    P2
  Double-submit testing              Later                    P2
  Refresh/back-navigation testing    Later                    P2
  Multi-tab behaviour                Later                    P2
  Network interruption               Later                    P2
  Business-aware chaos exploration   Research/Later           P2

------------------------------------------------------------------------

# 22. R --- Quality Knowledge & Release Intelligence

  Capability                   Release            Priority
  ---------------------------- ---------------- ----------
  Test pass rate               V0                       P0
  Suite pass rate              V0                       P0
  Failure trend                V1                       P1
  Known business actions       V1/Later                 P1
  Known states                 Later                    P1
  Known transitions            Later                    P1
  Approved business rules      Later                    P1
  Tested transitions           Later                    P1
  High-risk paths tested       Later                    P1
  Uncertain behaviour          Later                    P1
  Quality Knowledge Coverage   Research/Later           P1
  Release Confidence           Later                    P1
  Explain confidence factors   Later                    P0
  Changed-workflow coverage    Later                    P1
  Untested high-risk paths     Later                    P1
  Human Go/No-Go decision      Always                   P0

Important:

**Release Confidence must never be presented as a guarantee that a
release is safe.**

------------------------------------------------------------------------

# 23. S --- Human Governance & Safety

This capability family is non-negotiable.

  Capability                            Release        Priority
  ------------------------------------- ------------ ----------
  Inspect AI suggestion                 V0                   P0
  Accept                                V0                   P0
  Edit                                  V0                   P0
  Reject                                V0                   P0
  Manual alternative                    V0                   P0
  Show confidence where relevant        V0/V1                P0
  Show evidence/provenance              V1                   P0
  AI change history                     V1                   P1
  Undo AI-applied change                V0/V1                P0
  Semantic-change confirmation          V1                   P0
  Destructive-action permission         V1/Later             P0
  Per-project autonomy policy           Later                P1
  Explain why recommendation exists     V1/Later             P0
  Never silently redefine test intent   Foundation           P0

------------------------------------------------------------------------

# 24. T --- Local / Cloud Intelligence Architecture

  Capability                         Release           Priority
  ---------------------------------- --------------- ----------
  Local Playwright execution         V0                      P0
  Local evidence capture             V0                      P0
  Local rules engine                 V0                      P0
  Local ML/embeddings where useful   V0/V1                   P1
  Local quantized LLM                V0/V1                   P1
  Hardware capability detection      V0/V1                   P1
  Graceful no-local-LLM mode         V0                      P0
  Cloud AI escalation                V1                      P1
  Local Only mode                    V1.x                    P1
  Hybrid mode                        V1                      P1
  Cloud Enhanced mode                V1                      P2
  Model-provider abstraction         Foundation              P0
  Per-capability routing             Foundation/V1           P0
  Cost-aware routing                 V1                      P1
  Privacy-aware routing              V1                      P0
  Data redaction before cloud        V1                      P0
  Team cloud sync                    V1                      P1
  Cloud parallel execution           Later                   P2

------------------------------------------------------------------------

# 25. U --- Collaboration & Integrations

These are deliberately deferred unless customer discovery proves them
necessary earlier.

  Capability                  Release      Priority
  --------------------------- ---------- ----------
  Share report                V0                 P1
  Export report               V0                 P1
  Team workspace              V1                 P1
  Comments                    V1/Later           P2
  Test ownership              V1                 P2
  Jira                        Later              P2
  GitHub                      Later              P2
  Slack                       Later              P2
  CI/CD                       Later              P1
  Webhooks                    Later              P2
  Test-management imports     Later              P2
  PRD/document ingestion      Later              P2
  Release-note ingestion      Later              P2
  Analytics/usage ingestion   Later              P2

------------------------------------------------------------------------

# 26. V --- Future Platform Expansion

  Capability                              Release            Priority
  --------------------------------------- ---------------- ----------
  Firefox/WebKit                          V1                       P1
  Mobile web                              V1/Later                 P2
  Native mobile                           Later                    P2
  Visual regression                       Later                    P2
  Accessibility testing                   Later                    P2
  Performance signals                     Later                    P2
  Desktop app testing                     Later                    P3
  Large cloud browser grid                Later                    P3
  Cross-application QA ontology           Research                 P2
  Privacy-safe generic pattern learning   Research                 P2
  Pre-implementation quality planning     Research/Later           P2
  Executable living documentation         Later                    P2
  Conversational ABM interface            Later                    P1

------------------------------------------------------------------------

# 27. V0 Capability Boundary

V0 must answer one question exceptionally well:

> **Can a manual QA professional teach a real browser workflow once,
> turn it into maintainable reusable automation, run it with different
> data, and receive trustworthy evidence without becoming an automation
> engineer?**

## V0 P0

### Workspace

-   desktop app;
-   projects;
-   environments;
-   secure secrets.

### Teach

-   controlled Chromium;
-   recording;
-   readable steps;
-   checkpoints;
-   parameter marking;
-   Teach understanding confirmation.

### Author

-   visual editor;
-   assertions;
-   variables;
-   datasets;
-   modules;
-   module inputs/outputs;
-   module expected outcomes;
-   suites.

### Execute

-   Playwright;
-   isolated browser context;
-   headed/headless;
-   local sequential runs.

### Evidence

-   screenshots;
-   URL;
-   timestamp;
-   expected/actual;
-   console/network capture;
-   PASS/FAIL/BLOCKED.

### Results

-   timeline;
-   run history;
-   suite summary;
-   HTML report;
-   PDF/report export.

### Intelligence

-   candidate parameters;
-   basic module suggestions;
-   semantic locator scoring;
-   local/deterministic-first intelligence.

### Governance

-   inspect/edit/reject/manual override.

## Explicit V0 exclusions

-   full self-healing;
-   API testing;
-   scheduling;
-   parallel execution;
-   CI/CD;
-   native mobile;
-   visual regression;
-   accessibility;
-   full autonomous exploration;
-   full ABM state graph;
-   predictive quality;
-   release confidence;
-   Jira/Slack/GitHub integrations.

------------------------------------------------------------------------

# 28. V1 Capability Boundary

V1 should prove that the system is becoming more than a recorder.

## Commercial parity

-   API testing;
-   scheduling;
-   parallel execution;
-   Firefox/WebKit;
-   AI test creation;
-   AI diagnostics;
-   team/cloud capabilities.

## ABM advancement

-   semantic entities/actions;
-   dependencies;
-   provenance/confidence;
-   historical failure memory;
-   test-data preconditions;
-   learned candidate assertions;
-   test-family suggestions;
-   change-aware module/test impact.

## Intelligence

-   local/cloud routing;
-   natural-language editing;
-   evidence-backed diagnosis;
-   compare failed vs successful runs;
-   self-compose from trusted modules where possible.

------------------------------------------------------------------------

# 29. V1.x Capability Boundary

Focus: resilience and maintenance.

-   confidence-based assisted healing;
-   historical locator intelligence;
-   semantic change detection;
-   flakiness diagnosis;
-   failure clustering;
-   smarter resource isolation;
-   risk-aware test ordering;
-   stronger local models;
-   deeper application-change intelligence.

------------------------------------------------------------------------

# 30. Later / V2+ Capability Boundary

Focus: quality intelligence.

-   full ABM;
-   state/transition coverage;
-   safe autonomous exploration;
-   adversarial exploration;
-   risk-based regression;
-   predictive quality;
-   Quality Knowledge Coverage;
-   Release Confidence;
-   usage-aware prioritisation;
-   requirements-to-coverage;
-   pre-implementation testing;
-   executable living documentation;
-   conversational QA;
-   mobile/visual/accessibility/integrations as justified.

------------------------------------------------------------------------

# 31. Research Portfolio

These should be treated as hypotheses with measurable experiments rather
than promised roadmap items.

## R1 --- Goal-based execution

Can business intent remain stable while execution paths safely adapt?

## R2 --- Learned invariants

Can repeated successful observations reliably generate useful candidate
assertions without learning defects as truth?

## R3 --- Quality Knowledge Coverage

Can application understanding/validation be measured rigorously enough
to improve decisions?

## R4 --- Failure memory

Does semantic memory of escaped defects materially improve future
regression selection and defect discovery?

## R5 --- State-space discovery

Can the ABM discover useful missing transitions without overwhelming
users with low-value cases?

## R6 --- Autonomous exploration

Can the product safely discover meaningful workflows with low
false-positive/noise rates?

## R7 --- Predictive regression

Can change + history + dependency + business impact outperform simple
test selection?

## R8 --- Cross-application learning

Can privacy-safe generic behavioural patterns improve new-customer
onboarding enough to create a data moat?

## R9 --- Multimodal Teach

Does narration during demonstration materially improve abstraction
accuracy and user trust?

## R10 --- Local AI economics

Can local ML/LLM deliver sufficient quality across normal customer
hardware while producing a meaningful COGS/privacy advantage?

------------------------------------------------------------------------

# 32. Dependency Graph

``` text
PLAYWRIGHT EXECUTION
        ↓
RELIABLE RECORDING
        ↓
SEMANTIC LOCATORS
        ↓
VISUAL TEST EDITOR
        ↓
VARIABLES + ASSERTIONS
        ↓
SEMANTIC MODULES
        ↓
MINIMUM VIABLE ABM
        ↓
PROVENANCE + DEPENDENCIES + FAILURE MEMORY
        ↓
TEST DISCOVERY + DIAGNOSTICS
        ↓
CHANGE / RISK INTELLIGENCE
        ↓
STATE / KNOWLEDGE COVERAGE
        ↓
SAFE EXPLORATION + PREDICTION
```

Separate enabling chain:

``` text
LOCAL EXECUTION
   ↓
RULES / ML
   ↓
LOCAL LLM
   ↓
MODEL ROUTER
   ↓
OPTIONAL CLOUD ESCALATION
```

And governance wraps the entire system:

``` text
INSPECT → ACCEPT / EDIT / REJECT / MANUAL
```

------------------------------------------------------------------------

# 33. Build-vs-Buy Guidance

## Strong candidates to use existing technology

-   Playwright browser automation;
-   Chromium/Firefox/WebKit;
-   SQLite/local database;
-   OS secure credential storage;
-   standard embeddings runtimes;
-   quantized local-model runtime;
-   standard PDF/HTML generation;
-   crash/error telemetry;
-   desktop packaging framework.

## Capabilities that should remain our own product logic

-   Teach interaction;
-   semantic module abstraction;
-   ABM schema;
-   ABM knowledge lifecycle;
-   parameter/module inference orchestration;
-   human-governance workflow;
-   Quality Knowledge Coverage model;
-   failure-memory semantics;
-   ABM-driven test composition;
-   ABM-driven risk/coverage logic;
-   intelligence routing policy.

------------------------------------------------------------------------

# 34. Commercial Table Stakes vs Strategic Differentiators

## Table stakes

-   recorder;
-   visual editor;
-   assertions;
-   parameters;
-   datasets;
-   modules;
-   smart locators;
-   reports;
-   scheduling;
-   parallelism;
-   API testing;
-   AI test creation;
-   AI diagnostics;
-   self-healing.

We must execute these well but should not mistake them for the moat.

## Strategic differentiators

-   Teach as behavioural instruction;
-   semantic modules with inputs/outputs/outcomes;
-   persistent ABM;
-   provenance/confidence;
-   application failure memory;
-   goal vs execution separation;
-   Quality Knowledge Coverage;
-   ABM-driven risk regression;
-   compounding test composition;
-   exceptional progressive UX;
-   local-first cost/privacy architecture.

------------------------------------------------------------------------

# 35. Feature-Creep Gate

Before adding any capability, ask:

### Gate 1

Is this necessary for a commercially credible release?

### Gate 2

Does it materially improve Teach, Test or Results?

### Gate 3

Does it strengthen application knowledge/ABM?

### Gate 4

Does it materially improve reliability, evidence, diagnostics or trust?

### Gate 5

Has customer discovery shown this is blocking adoption?

If the answer to all five is **No**, defer it.

------------------------------------------------------------------------

# 36. Success Criteria by Generation

## V0 success

A manual QA user can: 1. install the app; 2. create an e-commerce
project; 3. teach a checkout-related workflow; 4. confirm the system's
understanding; 5. parameterise product/quantity; 6. reuse a business
module; 7. run multiple data cases; 8. see trustworthy evidence; 9.
identify a failure; 10. share a developer-ready report;

without writing Playwright code.

## V1 success

The product: - creates useful tests with AI; - tests UI + API; -
schedules/parallelises execution; - diagnoses failures with evidence; -
remembers prior failures; - begins recommending tests based on
application knowledge.

## North-Star success

Given a staging e-commerce application and safe credentials, the
platform can: - learn meaningful application behaviour; - construct an
ABM; - identify missing/high-risk coverage; - propose tests; - execute
safe tests; - diagnose anomalies; - remember historical defects; -
prioritise regression; - explain its recommendations; - continuously
improve with human governance.

------------------------------------------------------------------------

# 37. Final Capability Decision

The product should **not** attempt to build this entire universe.

The capability universe exists so that we can deliberately choose what
**not** to build.

The architectural centre remains:

> **Application behaviour is the primary QA knowledge object. Tests are
> executable validations of that knowledge.**

The immediate commercial centre remains:

> **Teach → Test → Results.**

The next document should translate this capability universe into the
concrete technical system required to make it real:

**`04_Product_Architecture.md`**
