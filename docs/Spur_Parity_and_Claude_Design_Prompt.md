# Spur Parity Review and Claude Design Prompt

**Date:** 15 September 2026  
**Purpose:** Compare Veyra's documented roadmap with Spur's current public product, then define the first Veyra design-inspiration brief.  
**Scope rule:** This review does not automatically promote Spur features into the Veyra roadmap.

## 1. Executive verdict

Veyra is **not** currently planned to build every capability Spur offers.

That is consistent with Veyra's strategy. V0 deliberately focuses on a trustworthy, local-first `Teach → Test → Results` browser workflow. V1 adds API testing, multiple browsers, parallel and scheduled execution, application-aware AI generation, diagnostics, and team capabilities. Native mobile, CI/CD, broad integrations, autonomous exploration, visual regression, and accessibility testing are explicitly deferred.

Spur is already broader in operational QA automation. Veyra's intended advantage is not feature-for-feature parity; it is the combination of live Teach, typed semantic business modules, a persistent Application Behaviour Model, explicit human governance, evidence-first result semantics, and local-first execution/economics.

## 2. Capability comparison

| Capability area | Spur today | Veyra roadmap | Assessment |
|---|---|---|---|
| No-code web testing | Plain-English intent-based web tests | V0 Teach, visual authoring, assertions, modules | Covered differently in V0 |
| Live demonstration | Video/Loom-to-test; manual authoring | Live controlled-browser Teach with understanding confirmation | Veyra has a distinct approach |
| Imports and generation | Video, Loom, scripts, existing suites, PDF, CSV, Markdown, and text prompts | V1 AI test generation; later requirements ingestion | Partial; several import paths are absent |
| Variables and data | Extractions, properties, secrets, scenario tables, generated data tables | V0 variables, presets, secrets, datasets, module I/O | Broadly covered |
| Reuse and composition | Suites, dependencies, saved patterns, login states | V0 semantic modules and suites; V1 dependencies/reuse-first composition | Covered, with stronger semantic ambition |
| Test setup/cleanup | Recursive dependencies, teardown tests, login-state reuse, caching | Preconditions and dependencies are planned; teardown/caching are not explicit | Partial gap |
| Browser actions | Click, hover, scroll, select, wait, type, tabs, redirects, refresh, back, file upload | Core browser actions are planned; advanced tab/file-upload coverage is not fully explicit | Partial gap |
| API and code escape hatches | API-call steps, JavaScript steps, network/log assertions | V1 API testing; no explicit customer-authored JavaScript escape hatch | Partial gap |
| Environments | Domains, deep links, properties, locale, network speed, certificates | V0 environments/secrets; V1 broader execution | Partial gap |
| Browser and viewport matrix | Chrome, Safari, Edge, Firefox, desktop/mobile viewports | V0 Chromium; V1 Firefox/WebKit | Partial; Edge/device matrix not explicit |
| Native mobile | iOS/Android, device actions, mobile streaming, deep links | Explicitly Later | Not near-term parity |
| Execution orchestration | Suites, folders, test plans, parallel execution, schedules, retries | V0 suites/sequential; V1 parallel/scheduling | V1 parity, except some organization conveniences |
| CI/CD and change-aware tests | GitHub/GitLab, PR/MR gates, GitHub agent generates change-aware tests | Explicitly Later; basic change awareness planned in V1 | Major near-term gap |
| Evidence | Screenshots, video, step analysis, console and network logs | V0 screenshots, expected/actual, console/network, DOM/locator evidence; video later | Strong V0 coverage, without default video |
| Result sharing | No-login share links, Jira/Linear/Azure tickets | V0 HTML/PDF reports; cloud share/integrations later | Partial gap |
| Failure review | Guided review queue, statuses, inline edit/rerun, warning suppression | V0 result timeline; V1 diagnostics, comparisons, reproduction, failure memory | Different; several review conveniences absent |
| AI assistant | Persistent in-app assistant for runs, triage, healing, generation, organization, and coverage | Narrow V0 assistance; V1 generation/diagnostics; conversational QA later | Spur is broader near-term |
| MCP/editor workflow | MCP for discovery, execution, triage, test-plan management, and code-fix workflows | No explicit MCP commitment | Unplanned gap |
| Exploratory/persona testing | Bounded exploratory prompts and specialized agents | Safe exploration/adversarial testing is Later/Research | Not near-term parity |
| Specialized testing | Localization, UI/UX issues, AI features, analytics/data-layer validation | Visual/accessibility later; other specialties not explicit | Partial/unplanned |
| Team/enterprise | Admin/member roles, Google/Azure SSO, SOC 2 Type 2, retention controls | V1 workspace/team/security expansion; SSO/compliance not frozen | Partial gap |
| Deployment model | Secure hosted cloud; no on-prem product | Local-first desktop with optional cloud | Deliberate Veyra difference |
| Application knowledge | Intent-based adaptation, dependencies, generation from suite patterns, change-aware tests | Typed semantic modules, provenance, confidence, failure memory, ABM, later knowledge coverage | Core Veyra differentiation hypothesis |

## 3. Product decision implied by the comparison

Do not turn the V0 design exercise into a Spur feature-parity exercise.

The first design set should prove Veyra's own wedge:

1. Teaching by demonstration feels natural.
2. Veyra exposes what it understood before saving automation.
3. Semantic modules make reuse understandable.
4. PASS, FAIL, BLOCKED, and ERROR are visibly distinct.
5. Failure evidence helps QA communicate with developers.
6. Local execution and optional AI feel trustworthy rather than limiting.

## 4. Copy-ready Claude Design prompt

```text
You are a senior product designer creating the first high-fidelity design-inspiration prototype for Veyra, a desktop Application Quality Intelligence Platform for manual and low-code QA teams.

Create one cohesive, clickable desktop application prototype containing seven representative screens. These are product UI screens, not a marketing landing page and not device mockups. Render each screen as a flat 1440 × 960 desktop frame so layouts can be reviewed precisely.

PRODUCT CONTEXT

Veyra lets a manual QA tester demonstrate a browser workflow in a controlled browser, confirms what Veyra understood, converts that behavior into reusable parameterized automation, runs it locally, and returns evidence-backed results without requiring Playwright code.

The core experience is:

TEACH → UNDERSTAND → TEST → RUN → RESULTS

The strategic idea is that Veyra stores business meaning rather than merely storing click scripts. Reusable modules are business functions with intent, inputs, outputs, preconditions, and expected outcomes. AI may suggest changes, but users can inspect, edit, reject, or create everything manually. The product must clearly distinguish application failure from automation blockage and internal product errors.

PRIMARY USER

A manual or low-code QA professional working on an e-commerce application. They understand workflows, business outcomes, edge cases, and bugs, but should not need to understand selectors, XPath, page objects, automation frameworks, or model prompting.

DESIGN OUTCOME

Make a sophisticated QA product feel calm, legible, and approachable. A first-time tester should understand what to do without training. The interface should communicate trust through clear states, evidence, and human control—not through generic AI sparkle effects.

VISUAL REFERENCES

Use the two attached screenshots only as visual references. Do not copy their logos, names, text, promotional overlays, or exact layouts.

Borrow from reference 1:
- generous white space;
- editorial calm;
- thin, quiet borders;
- a centered focal workspace;
- minimal visual noise;
- a restrained serif accent for an occasional welcome or empty-state headline.

Borrow from reference 2:
- a strong dark left navigation rail;
- a clear top utility bar;
- large rounded white work surfaces;
- structured action cards;
- compact quick actions;
- confident hierarchy for a serious desktop application.

Do not reproduce the angled monitor/laptop presentation. Design the actual flat product screens. Do not include YouTube banners, social-media overlays, fake browser chrome, or promotional plan banners.

VEYRA VISUAL DIRECTION

Overall personality:
- calm, intelligent, trustworthy, precise, modern, and quietly premium;
- consumer-grade usability with professional QA depth;
- mostly neutral, with purposeful color reserved for navigation, actions, links, and result states;
- avoid the sterile appearance of an all-greyscale enterprise dashboard.

Use this starter palette consistently:
- app background: warm off-white #F6F7F5;
- primary surface: #FFFFFF;
- dark navigation: deep ink navy #101827;
- primary blue: #2457E6 for selected navigation, primary confirmations, focus rings, and progress;
- action orange: #F47A3C for high-energy actions such as Start Teaching and Run Tests;
- link/accent teal: #087F8C for text links, secondary interactive accents, and informational callouts;
- primary text: #18202B;
- secondary text: #657080;
- border: #E2E6EA;
- PASS green: #16835B;
- FAIL crimson: #C73A52;
- BLOCKED amber: #B7791F;
- ERROR slate: #596579.

Do not use color alone for status. Every status must include an icon and a text label. Orange is a brand action color; BLOCKED uses amber plus a pause/obstruction icon so the meanings do not blur.

TYPOGRAPHY

- Use Inter, Geist, or a similarly clean sans-serif for all application UI.
- Use an editorial serif such as Instrument Serif or Newsreader only for one-line welcome/empty-state moments; never use serif for tables, controls, or dense operational content.
- Use sentence case, not title case everywhere.
- Avoid tiny grey text. Body copy should remain readable at normal desktop scale.

LAYOUT SYSTEM

- 8-point spacing grid.
- 232 px persistent dark left sidebar.
- 64 px top utility bar.
- Main canvas uses generous 32–40 px page padding.
- White content panels use 16–20 px corner radii, 1 px borders, and extremely subtle shadows.
- Controls use 10–12 px radii.
- Avoid excessive pill-shaped containers. Pills are reserved for compact status, environment, browser, and AI-policy labels.
- Use Lucide-style outline icons with consistent stroke weight.
- Keep component geometry and navigation identical across all seven screens.

GLOBAL APPLICATION CHROME

Left sidebar:
- Veyra wordmark and a small geometric mark at the top;
- workspace/project switcher: “Commerce Storefront”;
- navigation: Overview, Teach, Tests, Modules, Runs, Data;
- bottom navigation: Settings, Help, and user profile;
- selected item uses a soft blue highlight with a blue leading indicator;
- sidebar should feel premium and dark, not pure black or visually oppressive.

Top utility bar:
- breadcrumb or current page title;
- global search field with shortcut hint;
- environment pill: “Staging”;
- privacy/runtime pill: “Runs locally”;
- notifications;
- user avatar.

Use realistic e-commerce QA content throughout. Keep the same project, modules, tests, dataset, and failure story across every screen so the seven frames tell one connected narrative.

SCREEN 1 — PROJECT OVERVIEW

Purpose: give the tester an immediate, calm starting point without a dense analytics dashboard.

Content:
- greeting: “Good morning, Himani” with a short serif accent line, “What should Veyra validate today?”;
- project title: Commerce Storefront;
- environment: Staging;
- two prominent actions: orange “Teach new workflow” and blue “Run regression”;
- four compact metrics: 18 Tests, 7 Reusable modules, Last run 14 min ago, 89% Pass rate;
- recent-run card showing 12 passed, 1 failed, 1 blocked;
- recent failures list with “Checkout — Order confirmation missing” at the top;
- reusable modules list showing Search product, Add to cart, and Login with usage counts;
- small onboarding/progress card showing the next recommended action, but no promotional upsell.

Hierarchy: the Teach and Run actions should be obvious within three seconds. Avoid fake quality scores, vanity graphs, or crowded charts.

SCREEN 2 — TEACH WORKSPACE

Purpose: make live demonstration feel like the signature Veyra interaction.

Use a two-panel workspace:
- left panel, approximately 38%, contains the readable step timeline;
- right panel, approximately 62%, contains a controlled-browser preview of a clean fictional e-commerce storefront.

Header:
- “Teaching: Add product to cart”;
- live recording indicator;
- elapsed time;
- environment “Staging”;
- subtle “AI assistance on” label with a way to inspect the policy.

Readable step timeline:
1. Search for “Laptop”
2. Open product “AeroBook 14”
3. Click “Add to cart”
4. Open cart
5. Verify selected product appears in cart

Clearly style actions and assertions differently. Show a small candidate-variable suggestion beside “Laptop”: “May be reusable”. Do not expose CSS selectors.

Bottom control dock:
- Pause;
- Add checkpoint;
- Explain this step, with optional microphone icon;
- orange “Finish teaching”.

The controlled browser should look functional and believable but remain subordinate to the Veyra chrome. Include a subtle protected-session indicator. The screen should feel active, not like a static dashboard.

SCREEN 3 — UNDERSTANDING REVIEW

Purpose: show the human semantic approval point after teaching.

Headline: “Here’s what I understood” with supporting copy: “Review the meaning before Veyra saves the automation.”

Use a focused central review surface with four sections:
- Goal: “A customer can add a selected product to their cart.”
- Candidate input: “Laptop → product”; actions: Convert, Edit, Keep fixed.
- Reusable behaviors: Search product and Add to cart; each has a concise intent sentence.
- Expected outcome: selected product appears in cart and cart count increases by one.

Show “5 browser actions stored underneath” as quiet supporting information. Each suggestion should have provenance such as “Observed during steps 1–3” and a modest confidence indicator, without theatrical AI scoring.

Footer actions:
- text/teal link “Back to teaching”;
- secondary “Edit understanding”;
- blue primary “Looks right — create test”.

This screen must make correction feel safe and normal, not like rejecting an oracle.

SCREEN 4 — SEMANTIC TEST EDITOR

Purpose: show that Veyra edits business behavior rather than Playwright scripts.

Header:
- Test name: Add product to cart;
- Draft status;
- version indicator;
- Save;
- orange “Run test”.

Main canvas:
- a vertical, reorderable semantic flow made of spacious cards;
- Search product — input {{product}};
- Open product — output selected_product;
- Add to cart — input selected_product, output cart_state;
- assertion card: “Cart contains {{product}}” with a visibly different validation treatment.

Right inspector panel for the selected “Add to cart” module:
- Intent;
- Inputs;
- Outputs;
- Preconditions;
- Expected outcomes;
- Used by 11 tests;
- collapsed “Browser implementation” disclosure.

Include Add step, Insert module, Add assertion, duplicate, reorder, and undo affordances. Keep selector/locator details hidden by default. Use blue for selected structure and teal for links to related modules/tests.

SCREEN 5 — DATA AND RUN CONFIGURATION

Purpose: configure a transparent local data-driven run without enterprise complexity.

Left/main section:
- Dataset: Product regression;
- editable table with rows:
  Laptop | quantity 1
  Watch | quantity 2
  Backpack | quantity 1
- actions: Add row and Import CSV;
- clear binding labels showing product and quantity mapped to test variables.

Right run-summary panel:
- Test: Add product to cart;
- Environment: Staging;
- Browser: Chromium;
- Mode: Visible browser selected, Headless unselected;
- Data: Product regression — 3 cases;
- advanced disclosure for timeout, retries, and trace on failure;
- privacy note: “Runs locally. Secrets stay in your secure store.”;
- orange primary action: “Run 3 cases”.

Show sensitive fields as references, never plaintext credentials. The screen should feel simpler than a CI configuration form.

SCREEN 6 — LIVE RUN

Purpose: build trust by showing exactly what is happening during execution.

Header:
- “Running Add product to cart”;
- progress “Case 2 of 3 — Watch”;
- elapsed time;
- Pause and Stop controls.

Use a split workspace:
- left timeline shows completed, active, and pending semantic steps;
- right side shows the live controlled browser and a compact evidence/activity drawer.

Timeline state:
- Search product — complete;
- Open product — complete;
- Add to cart — active with blue progress;
- Verify product in cart — pending.

Top progress summary:
- Laptop PASS;
- Watch RUNNING;
- Backpack QUEUED.

Show current variables, one network activity indicator, and one console indicator without flooding the screen with logs. Provide a compact “Open technical details” link in teal.

SCREEN 7 — FAILURE RESULT AND EVIDENCE

Purpose: demonstrate Veyra's evidence-first differentiation and the difference between an application failure and an automation blockage.

Header outcome:
- prominent FAIL label with crimson icon;
- plain-language sentence: “The order was not created.”;
- supporting classification: “Application behavior contradicted the expected outcome. Veyra completed the automation successfully.”

Run metadata:
- Test: Complete checkout;
- Input: product = Watch, quantity = 2;
- Environment: Staging;
- Browser: Chromium;
- Duration: 14.2 sec.

Use a three-column or strong two-panel layout:
- left: semantic step timeline with the failed assertion selected;
- center: screenshot/evidence preview of the checkout page missing its confirmation;
- right: expected versus observed and related technical evidence.

Selected failure detail:
- Expected: “Order confirmation appears with an order number.”
- Observed: “Checkout remained on the processing state.”
- Network evidence: “POST /orders returned HTTP 500 at 09:31:04.”
- Console: one related error;
- Screenshot timestamp and URL.

Tabs:
- Overview;
- Steps;
- Evidence;
- Network;
- Console;
- Locator details.

Actions:
- blue “Re-run”;
- secondary “Open evidence”;
- orange “Export developer report”.

Include a compact suite summary showing PASS, FAIL, and BLOCKED examples. A BLOCKED item should say, “Veyra could not confidently locate ‘Add to cart’,” making it visibly different from the selected application FAIL. Include text and icons for every state.

COMPONENT AND INTERACTION REQUIREMENTS

- Make sidebar navigation, page tabs, primary calls to action, dataset editing, timeline selection, understanding-review controls, result tabs, and run controls clickable in the prototype.
- Use reusable components and identical tokens across every screen.
- Include hover, selected, focus, disabled, loading, success, failure, and blocked states where visible.
- Use realistic copy and data; do not fill screens with lorem ipsum.
- Use progressive disclosure: technical evidence is available but not dominant until a failure is opened.
- AI suggestions must always show Accept/Edit/Reject or an equivalent manual path.
- Do not use an AI chat box as the main interaction. Teach by demonstration is the signature behavior.
- Ensure accessible contrast, keyboard-visible focus rings, and labels that do not rely on color alone.

DO NOT

- do not design a marketing site;
- do not show code, selectors, XPath, or Playwright syntax in the default views;
- do not use a generic purple AI gradient;
- do not overuse glassmorphism, shadows, pills, or sparkles;
- do not use dense enterprise analytics dashboards;
- do not invent a “quality score” or “release confidence percentage”;
- do not silently imply that AI changed a test's meaning;
- do not make every button blue or every card equally prominent;
- do not copy the reference products' branding or content;
- do not place the UI inside a photographed monitor or laptop.

FINAL DELIVERABLE

Produce seven visually consistent, high-fidelity desktop frames and connect them into one prototype path:

Overview → Teach → Understanding review → Test editor → Run configuration → Live run → Failure result

Also provide a small accompanying design-system board containing:
- color tokens;
- typography scale;
- spacing scale;
- button variants;
- form controls;
- cards;
- navigation states;
- status badges for PASS, FAIL, BLOCKED, ERROR, RUNNING, and QUEUED;
- action versus assertion styling.

Optimize for desktop first. The result should look like a credible product a QA team could use daily, with a strong point of view: calm enough for first-time manual testers, precise enough for developers, and distinct from generic AI test-generation dashboards.
```

## 5. Spur sources reviewed

- [Spur homepage](https://www.spurtest.com/)
- [Spur documentation index](https://docs.spurtest.com/llms.txt)
- [Write your first test](https://docs.spurtest.com/getting-started/first-test)
- [AI Test Generation](https://docs.spurtest.com/authoring-tests/ai-test-generation)
- [Exploratory Tests](https://docs.spurtest.com/getting-started/prompt-library/exploratory-tests)
- [Test Plans](https://docs.spurtest.com/managing-tests/test-plans/test-plans)
- [Spur AI](https://docs.spurtest.com/analysing-tests/spur-ai-chat)
- [Test Plan Review](https://docs.spurtest.com/analysing-tests/test-plan-review)
- [Shareable Links](https://docs.spurtest.com/analysing-tests/shareable-links)
- [Network and Console Monitoring](https://docs.spurtest.com/additional-resources/network-console-monitoring)
- [User Roles](https://docs.spurtest.com/additional-resources/user-roles)
- [Frequently Asked Questions](https://docs.spurtest.com/getting-started/FAQ)
