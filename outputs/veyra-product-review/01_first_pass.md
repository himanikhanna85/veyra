# Veyra — first-pass product assessment

**Stage 1: product understanding, not competitive validation.** This assessment is based on the repository documents, not a running-app inspection or current competitor research. It is an opinion for discussion; no product decisions or implementation changes have been approved.

## My overall view

**Veyra has a coherent and promising thesis: turn a manual tester's knowledge of business behavior into reusable, trustworthy regression automation.** The strongest part is not the word “AI.” It is the combination of understandable teaching, reusable business behaviors, explicit expectations, and evidence that a human can inspect.

The main risk is the distance between the first useful product and the much larger quality-intelligence vision. A customer can understand “stop repeating this checkout test manually” immediately. “Application Quality Intelligence Platform” and “Application Behaviour Model” describe the strategy, but do not yet demonstrate the benefit.

I would keep the long-term ambition, while making the initial customer outcome considerably more concrete. That is a recommendation, not an approved positioning change.

## What I understand Veyra to be

A working explanation, consistent with the current thesis:

> Veyra helps manual QA testers teach a browser workflow, turn it into reusable tests, and see evidence of whether the expected business behavior still works—without writing automation code.

The deeper idea is that Veyra should retain what the workflow means: its inputs, outputs, preconditions, expected outcomes and relationships to other behaviors. Over time, that knowledge could support coverage discovery, maintenance and risk-focused testing. Those later benefits must not be presented as already delivered.

For example, recording “click this button” is not enough. Teaching “add an available product to the cart, then verify that the correct item and quantity are present” captures the business outcome. A reusable `AddToCart(product, quantity)` module would be useful because its meaning and expected result persist across tests—not merely because a sequence of clicks has a name.

## What is strongest

**The initial user and pain are clear.** Manual and low-code testers understand journeys and expected outcomes but should not have to become selector, framework or infrastructure specialists.

**Trust is built into the thesis.** Actions and assertions are separate; evidence precedes explanations; consequential semantic changes require human approval. An automation blockage should not be casually reported as an application defect, and a completed sequence of clicks should not imply that a business outcome was validated.

**Reuse offers a measurable product benefit.** If one approved business module can support many tests, and a legitimate workflow change can be maintained in one place, Veyra can reduce repetitive authoring and maintenance. This is a more persuasive benefit than simply generating more tests.

**Local-first and AI-optional are coherent choices.** They offer a path to greater data control and less model dependence. Actual cost, reliability and performance benefits remain to be measured; local execution does not remove support, packaging or maintenance costs.

## What needs sharper thinking

| Question | My first-pass assessment |
|---|---|
| Is Veyra a recorder, automation product or quality-intelligence platform? | The first commercial product is browser regression automation for manual testers. Quality intelligence is the longer-term destination. Marketing should not collapse the two. |
| Is “Teach” meaningfully different from “Record”? | Only if teaching captures approved intent, variables and outcomes—not just readable clicks. The interface name alone proves nothing. |
| Is the ABM already a moat? | No. It is a defensibility hypothesis. It must produce observable benefits in reuse, maintenance, diagnostics or coverage before its label matters. |
| Are no-code, AI suggestions and reusable flows unique? | Uniqueness is not established in this stage. We must compare equivalent competitor capabilities, not their terminology. |
| Does local-first fit all QA teams? | It may suit an initial desktop workflow, but the planned V0 exclusions leave gaps for teams that depend on scheduling, parallel runs, CI or shared execution. We need to validate the initial segment. |
| How much should V0 do? | Enough to complete a trustworthy Teach → Test → Results loop. Adding the whole innovation queue before proving that loop would increase delivery and usability risk. |

The wording “Test continuously” in the thesis's working message deserves care: README explicitly excludes scheduling and CI/CD integrations from V0. For V0, “run repeatedly” is a safer description unless continuous testing is clearly identified as future scope.

## Main features: keep three layers separate

**Initial product scope:** controlled Chromium; readable teaching; a visual editor; assertions and checkpoints; variables and datasets; reusable semantic modules; repeatable execution; results with evidence; history and developer reports; optional, inspectable AI assistance.

**Later capability:** API testing, multiple browsers, parallel and scheduled execution, team capabilities, richer diagnostics and failure memory.

**Long-term differentiation hypothesis:** a persistent, human-governed behavior model that supports trusted composition, change-aware maintenance, missing-behavior discovery and risk-focused regression.

According to `status_quo.md`, foundation, persistence, projects/environments, secrets, controlled-browser work and parts of Teach are implemented. It reports E06.T04 as awaiting user verification. Many editor, module, execution and reporting requirements remain unchecked in `tasks.md`. This is a reading of repository status, not independent confirmation of runtime behavior. README's status section is behind that anchor.

## What I would want proven first

Can a representative manual tester teach one meaningful journey, make its expectations explicit, reuse it across a small dataset, run it again, and understand an intentional failure without developer help?

Next, can the tester reuse a shared behavior in another test and maintain that shared behavior without silently changing what either test is intended to prove?

Those demonstrations would test the commercial promise and the beginnings of the ABM thesis. We have not executed them in this stage.

## Next small step

Read **`docs/02_Competitive_Validation.md`**, the actual location of the requested competitive material. Summarize its evidence and claims before deciding whether any current web research is necessary. Separate competitor capabilities, Veyra's proposed response and claims that remain unvalidated. Only then brainstorm positioning and differentiation.

## Sources and scope

Read: `README.md`, `groundrules.md`, `AGENTS.md`, `jevprotocol.md`, `status_quo.md`, the beginning and structure of `tasks.md`, and `docs/01_Product_Thesis_and_Innovation_Pillars.md`.

No competitor-document analysis or external research has been performed yet. No PRD decisions, application code, tests, builds or dev-server state were changed. Repository bookkeeping records the staged request.

**Jev:** considered but not used; this is a small, ambiguous strategic judgment rather than high-volume predefined classification. No Jev requests or savings claims.

**Reticle:** skipped because this stage changes no application behavior or UI.

**Manus credits:** no estimate is available. Credit and billing questions should be directed to https://help.manus.im; the work is scoped into small stages rather than assigned an invented credit budget.
