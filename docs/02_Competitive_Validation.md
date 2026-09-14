# 02 --- Competitive Validation

**Research date:** 14 September 2026\
**Purpose:** Stress-test the proposed Application Quality Intelligence
Platform against current competitors before freezing V0/V1
differentiation.

## Executive Conclusion

The market is significantly more advanced than a simple "AI + recorder +
Playwright" thesis.

Current competitors already provide substantial portions of: -
record/playback; - no/low-code editing; - reusable groups/modules; -
parameterisation/data-driven testing; - API steps/testing; - parallel
execution; - scheduling; - smart locators; - self-healing; -
natural-language test creation; - AI-assisted failure analysis; -
agentic maintenance; - human-reviewed healing; - test generation from
requirements.

Therefore these capabilities are **commercial table stakes or roadmap
parity**, not our defensible innovation.

The strongest surviving differentiation hypothesis is the combination
of:

1.  **Teach** --- demonstration + optional narration/intention rather
    than recorder-only authoring.
2.  **Persistent Application Behaviour Model (ABM)** --- business
    actions, states, transitions, rules, dependencies, provenance,
    failures, changes and risk.
3.  **Quality Knowledge Coverage** --- measuring understood/validated
    behaviour rather than only test counts.
4.  **Application-memory-driven testing** --- historical defects,
    learned invariants and changes influence future coverage and
    regression priority.
5.  **Goal/intention separated from execution path** --- preserve
    business intent while allowing implementation paths to evolve under
    human governance.
6.  **Local-first intelligence and execution** ---
    deterministic/ML/local-model routing for lower cost and stronger
    privacy.
7.  **Consumer-grade progressive UX** --- hide automation engineering
    until the user asks for it.

These are hypotheses, not yet proven moats. Several adjacent
capabilities already exist in competitors, especially mabl, Testim,
Functionize and newer AI-native entrants.

------------------------------------------------------------------------

# 1. Market Archetypes

## A. Traditional / broad automation platforms

Example: Katalon.

Strength: - breadth; - web/mobile/API/desktop; - execution
infrastructure; - enterprise workflow; - scheduling/parallelism; -
mature test authoring.

Risk to us: Trying to match breadth early would destroy focus.

## B. No-code recorder platforms

Examples: Ghost Inspector, Autify.

Strength: - fast onboarding; - visual editing; - reusable steps; -
scheduling; - browser execution; - evidence.

Risk to us: Our V0 must be at least as intuitive for the core browser
workflow.

## C. AI-stabilised low-code platforms

Example: Testim.

Strength: - repeated-sequence detection; - reusable groups; -
parameterisation; - smart locators; - ML-assisted stability; -
natural-language/agentic creation.

Risk to us: "AI finds modules" and "AI creates tests" are not unique.

## D. Agentic / AI-native quality platforms

Examples: mabl, Functionize, Momentic.

Strength: - natural-language authoring; - autonomous/agentic
execution; - recovery/self-healing; - failure
classification/diagnostics; - reduced maintenance; - increasingly broad
quality signals.

Risk to us: "Autonomous QA" itself is no longer a differentiated
category claim.

------------------------------------------------------------------------

# 2. Competitor Snapshots

## mabl

### Verified strengths

mabl positions itself as AI-native across the testing lifecycle. Its
current materials describe: - natural-language test creation; -
generation from Jira requirements; - autonomous failure
triage/root-cause insights; - adaptive auto-healing; - multi-model AI; -
human-in-the-loop context when clarification is required; -
visual/performance monitoring; - continuous/agentic testing.

### Strategic implication

mabl is the strongest warning against positioning ourselves as: - "AI
creates tests"; - "AI diagnoses failures"; - "AI maintains tests"; -
"human-in-the-loop AI testing."

Those are already explicit mabl territory.

### Gap worth investigating

Its public positioning remains strongly test/coverage lifecycle
oriented. We need deeper product validation before claiming it lacks a
persistent business-level application model spanning states, rules,
provenance, historical failure memory and Quality Knowledge Coverage.

Sources: - https://www.mabl.com/ai-test-automation -
https://www.mabl.com/auto-healing-tests -
https://www.mabl.com/product/test-reliability

------------------------------------------------------------------------

## Testim

### Verified strengths

Testim currently offers: - recorder-based test creation; - automatic
recognition of repeated sequences; - reusable groups; - visual editor; -
parameters/data-driven testing; - API steps; - custom JavaScript; -
AI/ML Smart Locators; - confidence-based locator behaviour; - locator
controls/weighting; - scanning tests to identify repeated sequences and
deduplicate into reusable groups; - natural-language agentic test
creation.

### Strategic implication

The following are definitively **not unique**: - automatic module
detection; - reusable groups; - parameterisation; - smart locator
ranking; - AI test creation; - low-code + code escape hatch.

Our business-level module concept must go beyond grouped steps by adding
semantic inputs/outputs, state relationships and ABM context.

Sources: - https://www.testim.io/test-automation-tool/ -
https://www.testim.io/ai/ - https://www.testim.io/developers/

------------------------------------------------------------------------

## Autify

### Verified strengths

Autify NoCode currently promotes: - no-code creation by interacting with
the application; - cross-browser execution; - parallel execution; - step
groups; - AI-maintained scenarios; - visual change detection; -
self-healing suggestions/updates; - AI scenario creation; - visual
element recognition; - web and mobile coverage.

### Strategic implication

"Record by doing", "AI maintains scenarios", "step groups", and
"parallel no-code testing" are parity capabilities.

Our Teach concept needs to combine observed behaviour with explicit
human intent and turn it into persistent application knowledge rather
than merely scenario generation.

Sources: - https://nocode.autify.com/ -
https://nocode.autify.com/ai-labs

------------------------------------------------------------------------

## Katalon

### Verified strengths

Katalon is a broad automation IDE/platform supporting: - Web UI; -
API; - Mobile; - Desktop; - recorder/spy; - manual and script editing; -
reusable keywords; - smart wait; - self-healing; - smart locators; -
parallel execution; - scheduling; - cloud execution; - AI-assisted
creation/execution workflows.

Katalon Studio 11.4.0 (July 2026) added test-case-level parallel
execution and further AI Assistant agent capabilities.

### Strategic implication

Breadth is Katalon's advantage. We should not compete with breadth in
V0/V1.

API testing, parallel execution and scheduling are clear V1 parity
requirements, exactly as currently planned.

Sources: - https://www.katalon.com/katalon-studio -
https://docs.katalon.com/katalon-studio/about-katalon-studio -
https://docs.katalon.com/katalon-platform/execute/automated-executions/create-an-automated-test-run -
https://docs.katalon.com/katalon-studio/maintain-tests/self-healing-tests-in-katalon-studio

------------------------------------------------------------------------

## Ghost Inspector

### Verified strengths

Ghost Inspector currently provides: - browser extension recording; -
codeless visual editor; - actions/assertions; - screenshots; - CSS/XPath
targeting with backup selectors; - reusable modules; -
JavaScript/conditions; - parallel testing; - advanced scheduling; -
cloud execution; - failure evidence including screenshots/video.

### Strategic implication

A commercially credible V0 cannot ship with a substantially worse basic
recorder/editor/reporting experience.

Ghost Inspector demonstrates that "simple browser automation for
non-developers" is already a real category. Our differentiation must
appear immediately in Teach/understanding/modularisation and not only in
a distant roadmap.

Sources: - https://ghostinspector.com/ -
https://ghostinspector.com/features-non-coding/

------------------------------------------------------------------------

## Functionize

### Verified strengths

Functionize publicly describes: - plain-English/NLP test creation; -
self-healing; - analysis of hundreds of element attributes; - historical
attribute scoring; - visibility into changed elements; - parallel
cross-browser execution; - AI-powered testing and reduced maintenance.

### Strategic implication

Explainable self-healing and historical locator intelligence already
exist.

Our "evidence and confidence" principle remains valuable UX/trust
architecture, but is not independently novel.

Source: - https://www.functionize.com/self-healing

------------------------------------------------------------------------

## Momentic

### Verified strengths

Momentic's current platform highlights: - AI-native browser/mobile
testing; - local/CLI execution; - automatic parallelism based on host
CPU; - failure recovery; - failure classification; - AI actions that
plan/cache/self-heal; - modules; - mobile execution.

### Strategic implication

Local execution and AI recovery are not ours alone.

Our local-first differentiation must therefore be broader: - local
browser execution; - local ML; - local quantized LLM; - explicit
cost-aware intelligence routing; - privacy mode; - cloud escalation only
when needed.

Source: - https://momentic.ai/

------------------------------------------------------------------------

# 3. Feature Reality Check

Legend:

-   **Established** --- clearly available in multiple competitors.
-   **Emerging** --- available in some advanced products.
-   **Differentiation candidate** --- our proposed framing appears
    meaningfully beyond the verified public capabilities, but requires
    deeper validation.
-   **Not a moat alone** --- useful but readily copyable/available.

  --------------------------------------------------------------------------------
  Capability                     Market status           Our treatment
  ------------------------------ ----------------------- -------------------------
  Browser recording              Established             V0 table stake

  Visual/no-code editor          Established             V0 table stake

  Assertions                     Established             V0 table stake

  Screenshots/evidence           Established             V0 table stake

  Reusable groups/modules        Established             V0 table stake

  Parameterisation/data-driven   Established             V0 table stake
  tests                                                  

  Smart locators                 Established             V0 table stake

  Backup/self-healing selectors  Established             Basic resilience V0;
                                                         deeper healing later

  Parallel execution             Established             V1 parity

  Scheduling                     Established             V1 parity

  API testing/API steps          Established             V1 parity

  Natural-language test creation Established/emerging    V1 parity, not moat

  AI failure triage              Emerging/established at V1 parity
                                 leaders                 

  Autonomous self-healing        Established at leaders  V1.x; not moat

  Repeated-flow/module detection Established in Testim   V0/V1 convenience, not
                                                         moat

  Human-reviewed healing         Established in          Trust requirement, not
                                 mabl/Katalon/Autify     moat
                                 variants                

  Local execution                Exists                  Architecture/economics,
                                                         not moat alone

  Test generation from           Exists                  Future capability, not
  requirements                                           moat alone

  Agentic test lifecycle         Exists                  Avoid generic "autonomous
                                                         QA" positioning

  Multimodal Teach:              Differentiation         Signature UX
  demonstration + narration +    candidate               
  business-intent confirmation                           

  Persistent business-level ABM  Differentiation         Core architecture
                                 candidate               

  Provenance/confidence          Differentiation         Core trust architecture
  lifecycle for learned business candidate               
  rules                                                  

  Goal/intention separated from  Differentiation         Core ABM concept
  execution path                 candidate               

  Learned candidate business     Differentiation         Innovation queue
  invariants from observations   candidate               

  State-transition coverage      Differentiation         Innovation queue
                                 candidate               

  Quality Knowledge Coverage     Differentiation         Strategic metric
                                 candidate               

  Historical escaped-defect      Differentiation         Strategic ABM capability
  memory driving future tests    candidate               

  ABM change → risk-based        Differentiation         Strategic ABM capability
  regression selection           candidate               

  Self-composition from semantic Differentiation         Core evolution
  modules with typed             candidate               
  inputs/outputs                                         

  Safe autonomous application    Emerging adjacent       North Star; validate
  exploration feeding ABM        category                carefully

  Business-aware adversarial     Emerging adjacent       Innovation queue
  exploration                    category                

  Local ML + quantized LLM +     Differentiation         Architecture principle
  cloud escalation router        candidate as integrated 
                                 economics/privacy       
                                 architecture            
  --------------------------------------------------------------------------------

------------------------------------------------------------------------

# 4. What We Must Stop Calling "Innovation"

The following remain important, but should not be marketed internally as
unique inventions:

1.  Recorder.
2.  No-code editor.
3.  Reusable step groups.
4.  Parameters.
5.  Data-driven tests.
6.  Smart locators.
7.  AI-generated tests.
8.  AI failure summaries.
9.  Self-healing.
10. Parallel execution.
11. Scheduling.
12. API testing.
13. Human-in-the-loop healing.
14. Natural-language test creation.
15. Basic test generation from requirements.

These belong in table stakes, V1 parity, or supporting UX.

------------------------------------------------------------------------

# 5. Surviving Innovation Hypotheses

## H1 --- Teach Is More Than Record

### Hypothesis

Combining: - live demonstration; - optional spoken/typed business
explanation; - observed DOM/state; - automatic abstraction; - explicit
"I understood" confirmation;

creates a meaningfully better authoring paradigm than record/playback or
prompt-to-test.

### Why it may survive

Competitors commonly support recording and natural-language generation,
but our concept fuses the two into a teaching interaction whose output
is persistent application knowledge.

### Risk

Competitors can add narration/prompting relatively easily if the
underlying value is only UX.

### Required moat

Teach must materially improve the ABM, not merely create a test.

------------------------------------------------------------------------

## H2 --- Persistent Application Behaviour Model

### Hypothesis

A persistent model of business behaviour can become the product's
central asset.

It includes: - semantic actions; - typed inputs/outputs; - states; -
transitions; - dependencies; - approved rules; - invariants; -
provenance; - failures; - changes; - risk.

### Why it may survive

Verified competitors heavily discuss tests, locators, scenarios,
coverage, healing and agents. The ABM thesis moves the unit of
maintenance from test scripts to application knowledge.

### Risk

Competitors may have internal application models not exposed in
marketing. Deeper product demos/documentation/patent research are needed
before claiming uniqueness publicly.

### Decision

Keep as **core architectural hypothesis**, not yet a public "world
first" claim.

------------------------------------------------------------------------

## H3 --- Quality Knowledge Coverage

### Hypothesis

Measure how well application behaviour is known and validated rather
than only test pass rate or code/test coverage.

Possible dimensions: - known states; - known transitions; - approved
rules; - tested transitions; - high-risk path coverage; - uncertain
behaviour.

### Why it may survive

This creates a different management question:

> "How much of Checkout do we actually understand and validate?"

rather than:

> "How many tests passed?"

### Risk

Needs rigorous mathematical definition or it becomes an arbitrary vanity
score.

### Decision

High-potential research item.

------------------------------------------------------------------------

## H4 --- Failure Memory as Compounding Application Immunity

### Hypothesis

Escaped defects and historical failures become durable ABM knowledge
that automatically affects future: - test generation; - regression
selection; - risk; - combinatorial exploration.

### Why it may survive

Most tools retain run history and diagnose failures. The stronger
concept is **semantic failure memory that changes future testing
strategy**.

### Decision

Strong strategic differentiator candidate.

------------------------------------------------------------------------

## H5 --- Goal-Based Tests

### Hypothesis

Store business intent separately from execution path.

Example:

``` text
GOAL
Customer can purchase an in-stock product
        ↓
BEHAVIOURAL PLAN
        ↓
CURRENT EXECUTION PATH
```

UI/navigation may change while the goal remains.

### Why it may survive

This potentially reduces brittleness at a more meaningful layer than
selector healing.

### Risk

Unsafe semantic adaptation if the system changes the business meaning.

### Required control

Human governance for semantic changes.

------------------------------------------------------------------------

## H6 --- ABM-Driven Risk Regression

### Hypothesis

Use application changes + dependencies + historical failures +
usage/business impact to determine which tests deserve execution first.

### Why it may survive

Risk-based test selection exists as a broad concept in QA. Our potential
differentiation is tying it directly to the learned ABM and failure
memory.

### Decision

Strategically valuable even if not globally novel.

------------------------------------------------------------------------

## H7 --- Local-First Intelligence Economics

### Hypothesis

Most runtime intelligence can be handled by: - deterministic
algorithms; - classical ML; - embeddings; - local small LLM;

with cloud escalation only for hard reasoning.

### Why it matters

This can produce: - lower COGS; - faster interaction; - privacy; -
offline/enterprise options; - model-provider independence.

### Competitive reality

Local execution exists in products such as Momentic and traditional
frameworks. Therefore the moat is the **integrated cost/privacy
architecture**, not "runs locally."

### Decision

Keep as a foundational architecture/business-model advantage.

------------------------------------------------------------------------

# 6. Blue Ocean Reframe

The crowded market question is:

> "How do I create and maintain automated tests faster?"

Our desired question is:

> **"How well does the system understand my application, what behaviour
> is unverified, and what is most likely to break?"**

That shifts the centre:

``` text
TEST AUTHORING
      ↓
TEST AUTOMATION
      ↓
TEST MAINTENANCE
      ↓
QUALITY INTELLIGENCE
```

The first three are crowded. We need them commercially, but the fourth
is where the product should differentiate.

------------------------------------------------------------------------

# 7. UX Opportunity

The leading tools increasingly contain sophisticated AI and agentic
capabilities. Sophistication itself therefore cannot be our
differentiator.

Our UX opportunity is radical progressive disclosure.

### Default

``` text
Teach
Test
Results
```

### Teach

"Show me what this workflow means."

### Test

"What should I run / what should the system explore?"

### Results

"What changed, what failed, what is risky, and why?"

### Advanced

Only then expose: - modules; - variables; - datasets; - locators; -
traces; - ABM; - APIs; - environments; - execution controls.

This UX needs prototype testing because "simpler" can become "less
controllable" if advanced QA users cannot inspect details.

------------------------------------------------------------------------

# 8. Cost Opportunity

The cost strategy can become commercially important.

## Proposed execution stack

``` text
Customer desktop
├── Browser / Playwright
├── Evidence capture
├── Rules
├── ML / embeddings
└── Local quantized LLM (where hardware permits)

Cloud
├── Team/account sync
├── Optional orchestration
├── Cloud parallel execution
├── Model escalation
└── Shared generic intelligence
```

### Pricing implication

A local-first base product could potentially avoid the
per-browser-minute economics of cloud-first competitors.

Cloud parallelism can become a paid upgrade rather than mandatory
infrastructure.

This requires later benchmarking of: - local CPU/RAM requirements; -
model size; - inference latency; - installer size; - Windows/macOS
hardware variance; - enterprise security requirements.

------------------------------------------------------------------------

# 9. Competitive Risks

## Risk 1 --- mabl closes the conceptual gap

mabl already markets "coverage that builds itself, runs itself, and
recovers itself." It also combines multi-model AI, agentic creation,
triage and recovery.

**Response:** Do not compete on generic autonomy. Compete on transparent
application understanding, business-state modelling, UX and local
economics.

## Risk 2 --- Testim already owns reusable intelligence

Testim already detects repeated sequences and deduplicates them into
reusable groups.

**Response:** Our modules must be semantic business functions with
inputs/outputs and ABM relationships, not just grouped steps.

## Risk 3 --- incumbents can copy visible AI features

Narration, prompts, summaries and healing are copyable.

**Response:** The compounding asset must be persistent application
knowledge and historical quality memory.

## Risk 4 --- ABM becomes stale/incorrect

An inferred model can learn bugs or obsolete behaviour.

**Response:** provenance + confidence + lifecycle:
`Observed → Suggested → Approved → Trusted → Stale → Deprecated`.

## Risk 5 --- "quality score" becomes fake precision

A single score may look scientific without being valid.

**Response:** expose dimensions and evidence; do not collapse everything
into one opaque number until validated.

## Risk 6 --- local AI damages UX

Large downloads, slow inference or poor small-model quality can negate
cost benefits.

**Response:** benchmark every task and route intelligently. Local-first
is a strategy, not a religion.

------------------------------------------------------------------------

# 10. Competitive Positioning We Should Avoid

Do not lead with:

-   "AI-powered test automation"
-   "Agentic QA"
-   "Self-healing tests"
-   "Natural-language test creation"
-   "No-code testing"
-   "AI test generator"

All are crowded claims.

Potential direction:

> **Teach your application once. Build quality intelligence that gets
> smarter every release.**

or:

> **From test automation to application quality intelligence.**

These are working directions, not final messaging.

------------------------------------------------------------------------

# 11. Implications for V0

Competitive research strengthens the decision that V0 needs strong table
stakes.

A clever ABM demo on top of weak recording/execution will not be
commercial.

V0 must deliver:

1.  reliable Chromium/Playwright execution;
2.  excellent Teach/Record UX;
3.  visual test editor;
4.  assertions;
5.  parameters;
6.  datasets;
7.  reusable modules;
8.  presets/environments/secrets;
9.  resilient locators;
10. PASS/FAIL/BLOCKED;
11. screenshots and diagnostic evidence;
12. run history;
13. strong reports;
14. basic automatic parameter/module suggestions;
15. manual override.

### V0 differentiating slice

Do not attempt the full ABM.

Prove a **Minimum Viable ABM**:

``` text
Business module
├── Intent/name
├── Inputs
├── Outputs
├── Preconditions
├── Expected outcomes
├── Underlying browser steps
└── Evidence
```

If this abstraction proves useful, expand it toward states,
dependencies, rules, risk and coverage.

------------------------------------------------------------------------

# 12. Implications for V1

V1 parity additions remain correct:

-   API testing;
-   parallel execution;
-   scheduling;
-   AI test creation;
-   AI diagnostics.

But V1 should also advance the ABM enough that customers can feel the
product getting smarter.

Recommended ABM V1 candidates: - semantic modules; - learned candidate
assertions; - basic dependency graph; - historical failure memory; -
test-family recommendations; - change-aware regression recommendations.

Self-healing can remain V1.x.

------------------------------------------------------------------------

# 13. Innovation Scorecard

Scores: 1 = weak, 5 = strong. These are strategic assessments, not
market facts.

  --------------------------------------------------------------------------------------------------------
  Idea                           Customer   Differentiation     Technical V0 relevance Recommendation
                                    value         potential   feasibility              
  -------------------------- ------------ ----------------- ------------- ------------ -------------------
  Teach UX                              5                 4             4            5 Build early

  Parameter/module                      4                 2             5            5 Table stake+
  suggestions                                                                          

  Semantic modules with I/O             5                 4             4            5 Core V0 ABM

  Full ABM                              5                 5             2            2 Build incrementally

  Learned invariants                    5                 4             3            2 V1/research

  Goal-based tests                      5                 5             2            1 Strategic R&D

  State-space coverage                  5                 4             3            1 Innovation queue

  Failure memory                        5                 4             4            2 V1 candidate

  Risk regression                       5                 4             3            1 V1+/innovation

  Quality Knowledge Coverage            4                 5             2            1 Research/validate

  Local ML/LLM routing                  5                 3             4            4 Architecture now

  Autonomous exploration                5                 3             2            1 North Star

  Business-aware adversarial            4                 4             3            1 Innovation queue
  testing                                                                              

  Requirements-to-coverage              4                 3             4            1 Later

  Release confidence                    4                 3             3            1 Later

  Executable documentation              3                 3             4            1 By-product

  Cross-application learning            5                 5             1            1 Long-term moat
  --------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 14. Validation Verdict

## What survived strongly

-   ABM as the architectural centre;
-   semantic business modules rather than grouped clicks;
-   Teach as a signature UX;
-   human-governed intelligence;
-   Quality Knowledge Coverage as a research direction;
-   failure memory;
-   goal vs execution-path separation;
-   ABM-driven risk/coverage;
-   local-first cost/privacy architecture;
-   exceptional UX as an explicit competitive strategy.

## What moved to table stakes

-   recording;
-   visual editor;
-   reusable groups;
-   parameterisation;
-   data-driven testing;
-   smart locators;
-   scheduling;
-   parallelism;
-   API testing;
-   natural-language generation;
-   AI diagnostics;
-   self-healing.

## What requires further proof before public uniqueness claims

-   ABM uniqueness;
-   learned invariants;
-   goal-based testing;
-   Quality Knowledge Coverage;
-   autonomous exploration;
-   cross-application behavioural learning.

------------------------------------------------------------------------

# 15. Recommended Strategic Decision

Proceed.

But build the company around this distinction:

> **We are not trying to win because our AI writes browser tests better.
> We are trying to make the test script cease to be the primary unit of
> QA knowledge.**

The primary unit should progressively become **application behaviour**.

V0 proves that thesis at small scale through: - Teach; - semantic
modules; - inputs/outputs; - expected outcomes; - reusable parameterised
execution; - evidence.

V1 proves that the knowledge compounds through: - AI creation; -
diagnostics; - API context; - historical failure memory; - basic
dependency/change intelligence.

Only after those are validated should we invest heavily in the full
autonomous ABM North Star.

------------------------------------------------------------------------

# 16. Research Sources

Primary/current vendor materials consulted on 14 September 2026:

-   mabl --- AI Test Automation: https://www.mabl.com/ai-test-automation
-   mabl --- Auto-Healing Tests: https://www.mabl.com/auto-healing-tests
-   mabl --- Test Reliability:
    https://www.mabl.com/product/test-reliability
-   Testim --- Test Automation Tool:
    https://www.testim.io/test-automation-tool/
-   Testim --- AI: https://www.testim.io/ai/
-   Testim --- Developers: https://www.testim.io/developers/
-   Autify NoCode: https://nocode.autify.com/
-   Autify AI Labs: https://nocode.autify.com/ai-labs
-   Katalon Studio: https://www.katalon.com/katalon-studio
-   Katalon Docs --- About Studio:
    https://docs.katalon.com/katalon-studio/about-katalon-studio
-   Katalon Docs --- Automated Runs:
    https://docs.katalon.com/katalon-platform/execute/automated-executions/create-an-automated-test-run
-   Katalon Docs --- Self-Healing:
    https://docs.katalon.com/katalon-studio/maintain-tests/self-healing-tests-in-katalon-studio
-   Ghost Inspector: https://ghostinspector.com/
-   Ghost Inspector --- Codeless Browser Testing:
    https://ghostinspector.com/features-non-coding/
-   Functionize --- Self-Healing:
    https://www.functionize.com/self-healing
-   Momentic: https://momentic.ai/

## Research limitation

This pass validates publicly documented product capabilities and
positioning. It does **not** establish patentability, freedom to
operate, or prove that competitors lack unpublished/internal equivalents
of the ABM concepts. Before making strong public claims such as "first",
"unique", or "only", conduct: - hands-on competitor trials/demos; -
documentation deep dives; - customer interviews; - patent/prior-art
review; - technical prototype validation.
