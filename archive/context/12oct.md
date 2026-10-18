# VEYRA — Updated Product Context for AI Research

**Product:** Veyra  
**Category:** Application Quality Intelligence Platform  
**Stage:** Product research, architecture discovery, and feasibility validation

## 1. Product Vision

Veyra is an **Application Quality Intelligence Platform** designed to transform manual QA workflows into intelligent, reusable, scalable, and maintainable browser automation.

The central philosophy is:

**A manual tester should be able to demonstrate an application workflow once, and Veyra should learn enough about that workflow to reproduce, parameterize, validate, and scale it without requiring the tester to write automation code.**

Veyra is not intended to be another AI agent that repeatedly navigates websites using expensive LLM calls.

Instead, it should combine:

- Manual workflow recording
- Browser DOM intelligence
- Structured action and event capture
- AI-assisted workflow understanding
- Reusable automation generation
- Parameterized test execution
- Application behaviour modelling
- Evidence-backed test reporting
- Low-cost, deterministic execution at scale

The product must support different application categories, including e-commerce, CMS platforms, enterprise applications, SaaS products, and complex business workflows.

### Core Product Promise

"Teach Veyra how your application works once. Veyra learns the workflow, converts it into reusable automation, and intelligently validates the application at scale."

**Critical architectural principle: AI should be used to understand and build automation, not to repeatedly execute every test step.**

---

## 2. The Three Testing Approaches

The handwritten client notes identify three connected approaches.

### Approach 1 — Manual Tester Workflow

A human tester opens a website and performs a sequence of actions.

For example, in an e-commerce application:

1. Open the website.
2. Navigate to the signup page.
3. Enter registration information.
4. Submit the form.
5. Search for a product.
6. Open the product details.
7. Add the product to the cart.
8. Proceed to checkout.
9. Complete the purchase workflow.
10. Verify the expected outcome.

During this process, the tester understands the application's business logic.

The tester may identify:

- Expected functionality
- Actual functionality
- Missing features
- Unexpected behaviour
- Validation errors
- Application defects
- Business rule violations

Traditionally, this information is recorded manually through test cases, screenshots, defect reports, or test-management systems.

**Veyra should convert this demonstration into structured, machine-readable QA knowledge.**

### Approach 2 — AI Intelligence Path

The second approach is the most important differentiation opportunity.

Veyra should capture the tester's demonstrated workflow and convert it into an **AI Intelligence Path**.

This path should include:

- Pages visited and navigation transitions
- Browser URLs and route changes
- Screenshots and visual snapshots
- DOM elements and their attributes
- User actions and operations
- Fields accessed
- Values entered
- Element states
- Expected results and assertions
- Actual observed results
- Workflow dependencies
- Reusable business operations

For example:

**Demonstrated action**

The tester opens a signup page, enters an email address, fills in a password, and clicks Register.

**Structured interpretation**

- Page: Signup
- Operation: Enter text
- Element: Email input
- Parameter: `email`
- Operation: Enter text
- Element: Password input
- Parameter: `password`
- Operation: Click
- Element: Register button
- Expected outcome: Account created or relevant validation message displayed

Veyra should recognize that the captured workflow can potentially support multiple test scenarios.

For example:

- Valid registration
- Invalid email
- Missing password
- Existing email address
- Password policy validation
- Mandatory field validation

However, these variations must not be invented without evidence or business-rule confirmation.

Veyra should distinguish between:

1. **Observed behaviour** — what was actually demonstrated.
2. **Confirmed expectations** — what the tester explicitly asserted or approved.
3. **Inferred possibilities** — additional scenarios suggested by AI.
4. **Approved automation** — workflows and validations authorized for execution.

This distinction is essential to prevent hallucinated test cases and incorrect business assumptions.

### Approach 3 — Automation Framework

Once the intelligence path has been created and approved, Veyra should transform it into a maintainable automation framework.

The client's handwritten notes suggest separating automation knowledge into reusable components.

For example:

- Page definitions
- DOM element definitions
- Operations and actions
- Workflow sequences
- Test data
- Assertions
- Execution orchestration

These may be implemented using JavaScript or TypeScript modules.

Conceptual structure:

```text
automation/
  pages/
    signup.page.ts
    checkout.page.ts

  elements/
    signup.elements.ts
    checkout.elements.ts

  operations/
    browser.actions.ts
    form.actions.ts

  workflows/
    signup.workflow.ts
    checkout.workflow.ts

  tests/
    signup.spec.ts
    checkout.spec.ts

  data/
    signup.datasets.json

  assertions/
    signup.assertions.ts
```

The exact storage and framework design must be researched rather than assumed.

Veyra should be able to determine which page, element, operation, parameter, and assertion must be used at each execution step.

A workflow should not require fresh LLM reasoning every time it runs.

---

## 3. Browser Capture: DOM, Screenshots, and MCP

A key part of the product is capturing browser interaction accurately.

A screenshot captures the visual appearance of the application.

The DOM captures structured information about the webpage and its elements.

For reliable automation, Veyra should combine both with browser execution information.

### Information to capture

**Browser and page context**

- URL and navigation
- Page title
- Browser state
- Relevant DOM structure
- Accessibility information
- Screenshots where appropriate

**Element context**

- Element type
- Accessible role and name
- Stable attributes
- Candidate locators
- Text content where relevant
- DOM relationships
- Visibility and enabled state

**Action context**

- Click
- Type
- Select
- Navigate
- Submit
- Scroll
- Upload
- Wait
- Validate

**Execution context**

- Input parameters
- Action sequence
- Expected state
- Observed state
- Relevant network or console evidence
- Errors and failures

### MCP considerations

The client mentions MCP as part of the intelligence and automation architecture.

Research must distinguish between:

- Browser instrumentation, which captures actual events and DOM changes.
- Browser automation frameworks, which replay interactions.
- MCP, which can expose browser capabilities and application context to AI agents.
- AI reasoning, which interprets captured information.

**MCP should not be assumed to be the browser recording mechanism itself.**

The research agent should investigate whether Playwright, Chrome DevTools Protocol, browser extensions, MCP servers, or a combination of these provides the most reliable and cost-efficient capture architecture.

---

## 4. Application Behaviour Model (ABM)

The long-term foundation of Veyra is a continuously evolving, human-governed **Application Behaviour Model (ABM)**.

The ABM should become the structured source of knowledge about how an application behaves.

It should connect:

- Pages and screens
- Elements
- Features
- User journeys
- Business rules
- Workflow dependencies
- Parameters
- Assertions
- Test cases
- Execution results
- Historical defects
- Approved changes

For example:

A signup workflow is not simply a sequence of clicks.

It represents a business capability with preconditions, actions, expected outcomes, and potentially reusable subflows.

The ABM should allow Veyra to understand relationships such as:

- Registration enables login.
- Login may be required before checkout.
- Adding to cart depends on product availability.
- Publishing content in a CMS depends on roles and permissions.

Over time, Veyra should be able to identify which existing workflows are affected when a feature or page changes.

However, the ABM should be built incrementally from evidence, rather than claiming to understand an entire application after one demonstration.

---

## 5. AI Intelligence: From One Workflow to Many Test Scenarios

An important product requirement is the ability to derive reusable and parameterized automation from demonstrated workflows.

Suppose the tester demonstrates a signup process with valid data.

Veyra should identify potential variables:

- Email
- Password
- Username
- User role
- Country
- Account type

The system could then suggest variations, such as:

| Scenario | Data variation | Expected result |
|---|---|---|
| Valid signup | Valid input | Successful registration |
| Invalid email | Malformed email | Validation error |
| Missing password | Empty password | Required-field error |
| Duplicate email | Existing account | Duplicate-account handling |
| Weak password | Noncompliant password | Policy validation |

These are illustrative candidate scenarios. The expected results must be grounded in approved requirements, observed behaviour, or tester confirmation.

### Parameterization

The tester should be able to label captured values as parameters.

For example:

`email = A`  
`password = B`  
`accountType = C`

The workflow can then run against multiple approved datasets.

The same automation logic should be reused rather than regenerated for each dataset.

### Intelligent workflow composition

Veyra should also investigate how recorded workflows can be combined.

For example:

- Signup
- Login
- Search
- Add to cart
- Checkout

These could be composed into larger journeys when their preconditions, outputs, and dependencies are compatible.

This should be driven primarily by structured workflow metadata, dependency rules, and reusable modules rather than repeated free-form LLM reasoning.

---

## 6. Large-Scale Test Generation and Execution

A major concern is scalability.

An application may require thousands or even 15,000 or more test cases.

It is not economically or technically desirable to ask an LLM to independently generate and execute every test case.

Veyra needs a different architecture.

### Proposed principle

**Capture once → Understand once → Structure once → Generate reusable variations → Execute deterministically at scale.**

The system should maintain reference snapshots and structured evidence for demonstrated application states.

These references may include:

- DOM snapshots
- Visual screenshots
- Element metadata
- Approved assertions
- Workflow graphs
- Parameter definitions
- Expected state transitions

These become the foundation for subsequent automation.

### Scaling mechanisms to research

- Data-driven testing
- Parameterized workflow templates
- Combinatorial and pairwise test generation
- Boundary-value testing
- Equivalence partitioning
- State-transition testing
- Model-based testing
- Reusable fixtures
- Dependency-aware workflow composition
- Risk-based test selection
- Parallel execution

The number of test cases should be driven by meaningful coverage, not an arbitrary target.

15,000 tests should not mean 15,000 AI-generated scripts or 15,000 independent LLM conversations.

A smaller number of reusable workflows may produce many deterministic executions using different inputs, states, environments, and assertions.

---

## 7. Token Economics: A Fundamental Product Constraint

Veyra must avoid the high AI-token consumption associated with repeated agent-driven browser testing.

Tools such as Spurtest, Claude Code, and Codex demonstrate that AI can interact with browsers and build automation.

However, repeated agentic reasoning can become expensive, particularly when agents repeatedly inspect webpages, reason about actions, and recover from failures.

Veyra should not rely on this model for ordinary regression execution.

### Preferred intelligence distribution

| Activity | Preferred execution |
|---|---|
| Record browser actions | Browser instrumentation |
| Capture DOM and screenshots | Browser tooling |
| Identify obvious elements | Deterministic extraction |
| Understand workflow intent | AI, selectively |
| Suggest test variations | AI plus testing rules |
| Generate reusable automation | AI-assisted compilation |
| Execute approved tests | Deterministic test runner |
| Validate explicit assertions | Deterministic checks |
| Detect visual changes | Visual comparison tools |
| Classify known failures | Rules and historical patterns |
| Diagnose unfamiliar failures | AI escalation |
| Update approved behaviour | Human-governed process |

### Cost objective

Routine execution should require **zero LLM inference calls wherever technically feasible**.

AI usage should be concentrated around:

1. Initial workflow interpretation
2. Ambiguous element or intent resolution
3. Test-design suggestions
4. Automation generation and repair
5. Novel failure diagnosis
6. Application change analysis

The research should investigate caching, local models, small models, model routing, structured outputs, and incremental analysis to reduce costs further.

Veyra must be architected so that test execution volume can grow substantially without AI costs growing proportionally.

---

## 8. Multi-Domain Application Support

Veyra must not become an e-commerce-specific testing platform.

Different application categories have different workflow characteristics.

### E-commerce

- Product search
- Cart management
- Checkout
- Discounts
- Inventory
- Payment integrations
- Order lifecycle

### CMS applications

- Content creation
- Drafting
- Editing
- Publishing
- Scheduling
- Media management
- Content permissions
- Approval workflows

### Enterprise and SaaS

- Role-based access
- Multi-step approvals
- Dashboards
- Data entry
- Workflow transitions
- Administrative actions
- Integrations

The underlying automation engine should remain generic.

Domain-specific intelligence should be introduced through configurable behaviour models, workflow templates, business rules, and testing strategies.

Research should explore how to support multiple application types without building separate automation engines for each industry.

---

## 9. Proposed Agent Responsibilities

The product may contain several logical agents or intelligence services, but the research should not assume that every component needs a separate LLM agent.

### Agent A — Workflow Capture

Observes tester interactions and produces structured browser events, element information, snapshots, and execution evidence.

Primarily deterministic.

### Agent B — Workflow Intelligence

Interprets captured workflows, identifies intent, proposes reusable modules, detects parameters, and suggests assertions or test variations.

Uses AI selectively.

### Agent C — Automation Builder

Converts approved intelligence paths into executable, reusable automation.

Maintains separation between page information, elements, operations, workflows, and tests.

AI-assisted generation followed by deterministic execution.

### Agent D — Test Execution

Runs approved automation using structured workflows, datasets, and assertions.

Handles retries, execution scheduling, evidence collection, and reporting.

Should not require LLM reasoning for normal execution.

### Agent E — Failure Intelligence

Analyzes failures using logs, screenshots, DOM differences, previous execution history, and known defects.

Deterministic classification first; AI escalation when necessary.

### Agent F — Application Behaviour Intelligence

Maintains the evolving ABM and identifies relationships between workflows, business rules, test coverage, and application changes.

Changes to authoritative business expectations require appropriate human approval.

These are logical responsibilities, not a mandate to build six independently running agents.

---

## 10. Competitive Research

Research Spurtest and other relevant AI-native QA platforms.

Reference: https://www.spurtest.com/

Also evaluate traditional and modern browser automation approaches, including Playwright and relevant MCP-based browser tooling.

The research should determine:

- Which competitors use repeated AI reasoning during test execution?
- Which compile AI-generated workflows into reusable deterministic automation?
- Which support human demonstrations?
- Which capture DOM, screenshots, and structured events?
- Which support reusable test modules and parameterization?
- Which can scale to thousands of tests economically?
- Which support multiple application categories?
- How do they maintain tests when the UI changes?
- How do they distinguish observed behaviour from expected behaviour?
- What are their actual architectural limitations?

Do not assume competitors' internal implementations or token consumption without verifiable evidence.

The objective is not simply to reproduce Spurtest.

**The objective is to discover an architecture that combines the usability of AI-native testing with the cost structure, repeatability, and control of conventional automation.**

---

## 11. Important Technical Risks

The research must explicitly evaluate the following.

**DOM stability:** Modern applications use dynamic elements, generated identifiers, asynchronous rendering, and complex component frameworks.

**Visual-only interfaces:** Canvas, graphical widgets, and some embedded interfaces cannot be reliably understood from DOM alone.

**Cross-application workflows:** Browser interactions may cross domains, authentication systems, popups, and third-party services.

**Expected-result ambiguity:** Observing an outcome does not prove that the outcome is correct.

**Test-data management:** Generated variations must use controlled datasets and avoid unsafe production mutations.

**Snapshot drift:** Captured references can become outdated after legitimate application changes.

**Automation maintenance:** Generated scripts should not become thousands of brittle, independent artifacts.

**Test explosion:** Combinatorial possibilities can grow much faster than useful coverage.

**Security and privacy:** Captured workflows may contain passwords, authentication tokens, personal data, and commercially sensitive information.

**LLM economics:** Intelligence operations must have measurable cost budgets and predictable escalation behaviour.

---

## 12. Research Questions to Answer

The AI Research Agent should investigate and propose concrete answers to these questions.

1. What is the best browser capture architecture for recording manual workflows, DOM information, screenshots, and user interactions?

2. How should Veyra represent an AI Intelligence Path internally: event stream, JSON DSL, workflow graph, state machine, or another model?

3. What should the Application Behaviour Model contain, and how should it evolve over time?

4. How can a demonstrated workflow be compiled into reusable Playwright or equivalent automation?

5. How should page objects, locators, operations, parameters, assertions, and workflows be stored to minimize duplication?

6. How can Veyra generate meaningful test variations using deterministic algorithms rather than thousands of LLM requests?

7. How can multiple captured workflows be intelligently composed into larger test journeys?

8. How can 15,000 or more test executions run with minimal or zero inference cost during normal execution?

9. How should Veyra distinguish approved expected behaviour from observed behaviour and AI-generated hypotheses?

10. What is the best way to detect application changes and repair automation without excessive AI usage?

11. Which parts of the architecture benefit from LLMs, small local models, conventional algorithms, or deterministic code?

12. What are the true technical and economic differentiators compared with Spurtest and other AI QA platforms?

13. What would be the smallest feasible MVP that proves demonstration-to-automation, parameterization, and low-cost repeated execution?

14. How should the platform measure reliability, test coverage, false positives, maintenance effort, and cost per execution?

---

## 13. Proposed MVP Direction

The first version should focus on proving one complete workflow.

**MVP journey**

1. A manual tester opens a browser session through Veyra.
2. The tester demonstrates a business workflow.
3. Veyra records actions, DOM elements, and relevant snapshots.
4. The tester defines or confirms expected outcomes.
5. AI converts the recording into a structured intelligence path.
6. Veyra identifies reusable steps and potential parameters.
7. The tester reviews suggested variations.
8. Veyra generates maintainable browser automation.
9. The automation runs repeatedly with different approved datasets.
10. Veyra captures execution evidence and reports failures.
11. Subsequent routine executions run without LLM calls.

The MVP should demonstrate both a simple signup workflow and a second, structurally different workflow, such as CMS content publishing.

This will help establish whether the architecture is truly application-independent.

### Suggested success criteria

- Reliable capture and replay of supported browser actions
- Explicit expected-result validation
- Parameterized workflow reuse
- Repeated execution without LLM inference
- Evidence-backed failure reports
- Demonstrable reduction in manual automation authoring
- Measurable AI cost per workflow creation
- Measurable infrastructure cost per execution
- Controlled handling of application changes

---

## 14. Final Product Positioning

Veyra should not be positioned simply as an AI browser-testing agent, a record-and-playback tool, or an LLM-powered test-script generator.

Its intended differentiation is the combination of three capabilities:

**1. Demonstration-driven learning**

Manual testers teach the application through real workflows, supported by DOM and browser evidence.

**2. Persistent application intelligence**

Veyra develops a reusable, human-governed understanding of workflows, parameters, assertions, dependencies, and business behaviour.

**3. Economical automation at scale**

Veyra converts approved intelligence into deterministic automation that can run repeatedly without expensive agent reasoning.

### Strategic thesis

**Veyra should spend intelligence to learn the application, not spend intelligence every time it tests the application.**

The AI Research Agent must challenge this thesis technically, compare possible implementations, identify limitations, and recommend an architecture that is reliable, maintainable, application-independent, and economically scalable.

The research deliverable should include a proposed architecture, technology stack, workflow data model, capture mechanism, AI usage boundaries, execution model, cost analysis, competitor comparison, technical risks, and phased MVP roadmap.

Clearly distinguish validated findings, engineering recommendations, and hypotheses requiring proof-of-concept testing.
