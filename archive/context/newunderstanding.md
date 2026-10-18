## My updated understanding of Veyra

Veyra is best described at stakeholder level as:

> Veyra helps manual QA teams teach a business workflow once, turn it into approved reusable automation, and execute it repeatedly with trustworthy evidence—without paying for fresh AI reasoning on every run.

The product has three layers:

1. Immediate product: Teach → Test → Results for manual and low-code testers.
2. Structural advantage: reusable, parameterized business operations with explicit expected outcomes.
3. Long-term intelligence: a human-governed Application Behaviour Model built from approved workflows, rules, dependencies, executions, and failures.

The architectural thesis is now especially clear:

> Spend intelligence while learning and maintaining an application—not every time a test executes.

That direction is coherent with the architecture already implemented. I do not recommend a rewrite.

## What changed after 12oct.md

The new context makes several distinctions much more important:

- Observed behaviour is not automatically expected behaviour.
- AI-generated possibilities are not approved test cases.
- A successful click sequence is not a verified business outcome.
- MCP is an interface layer, not necessarily the recording mechanism.
- Fifteen thousand executions should come from reusable workflows, datasets, pairwise/boundary generation, and deterministic runners—not fifteen thousand independently generated AI scripts.
- The ABM must grow from evidence and approval; it cannot be claimed after one recording.
- The real value is not “AI writes Playwright.” That market is already crowded.

The existing competitive research strongly supports this conclusion. Sixteen competitors were reviewed, and recording, natural-language authoring, reusable steps, AI repair, assertions, local runners, and evidence are already common or adjacent capabilities.

The possible Veyra wedge is the combination of:

- tester-owned workflow teaching;
- explicit business outcomes;
- trustworthy PASS / FAIL / BLOCKED;
- semantic reuse with inputs, outputs, and dependencies;
- inspectable evidence;
- deterministic repeat execution;
- human-governed AI changes.

That combination remains a hypothesis to validate, not yet a proven moat.

## What I think we should do next

I would not continue building the entire existing backlog sequentially without inserting a product-proof milestone.

The next goal should be one complete “golden vertical slice”:

1. A manual tester teaches one meaningful workflow.
2. Veyra captures and explains the workflow.
3. The tester confirms the expected outcome.
4. One literal is converted into a parameter.
5. Two or three approved datasets are supplied.
6. Veyra compiles the workflow into deterministic execution.
7. It reruns without an LLM call.
8. One deliberate application failure produces FAIL.
9. One locator/environment problem produces BLOCKED.
10. A developer can understand the result from Veyra’s evidence alone.

This proves the core commercial promise. The second structurally different workflow—such as CMS publishing—should follow only after the first loop works.

The immediate implementation sequence should therefore be:

1. Manually verify the pending E06.T04 Teach timeline.
2. Finish the remaining Teach controls: remove, insert, checkpoint, and finish.
3. Build the smallest possible post-Teach understanding/approval screen.
4. Add one assertion type, one parameter, and a tiny dataset.
5. Compile and execute the approved workflow deterministically.
6. Produce a basic evidence-backed verdict.
7. Pilot it with a real manual tester before expanding the editor, ABM, or AI feature set.

The alternative is to continue epic-by-epic according to the large PRD. That preserves architectural completeness, but risks spending months before testing whether the central user experience is actually useful.

This recommendation becomes wrong if the client’s immediate priority is a technology demonstration rather than customer validation, or if a committed buyer requires a different first workflow.

## Manus update

The .manus artifact contains the queued workflow specification, not the completed answer itself. It requested:

- 16 competitor research agents;
- one buyer-needs agent;
- one synthesis agent;
- 18 planned agent calls;
- an effective maximum of 20 calls.

The completed outputs are elsewhere:

- Competitive research (outputs/veyra-product-review/02_competitive_research.md)
- Comparison CSV (outputs/veyra-product-review/03_competitor_comparison.csv)
- Product-review checklist (docs/_wip_veyra_product_review.md)

The research reports all 16 competitor profiles completed with no coverage failure and 64 cited sources. Importantly, 18 agent calls are not the same as 18 Manus credits. The repository contains no actual Manus billing or credit-consumption receipt.

## Repository cleanup assessment

The repository is crowded, but most of the 2.1 GB is under apps/, likely dependencies/build artifacts rather than documentation. We should not blindly move everything into an archive.

I recommend three cleanup classes:

- Canonical and active: remain where required.
- Historical but useful: move to archive/ with a dated index.
- Generated/recreatable: delete or gitignore after confirming they are not needed.

Likely archive candidates include:

- old handoff files;
- superseded product-analysis drafts;
- old screenshots and design comparisons;
- outputs/veyra-product-review/ after approved conclusions are incorporated;
- e02-test-output/;
- obsolete standalone images;
- old design inspiration exports.

Items such as .reticle, .manus, .work, application source, package manifests, active tests, and current product documents need separate treatment. Some should be ignored, some retained, and some archived; they should not be bulk-moved together.

There are also consistency problems to resolve:

- groundrules.md names root PRD.md, but the real source is docs/Veyra_PRD.md.
- It requires bugs3.md, but no bug log is currently present.
- README.md is behind status_quo.md.
- handovertocodex.md is stale relative to the current implementation.
- status_quo.md says E06.T05 should start next, while tasks.md already marks E06.T05 and T06 complete.
- The PRD already says idea.md must remain the brainstorming source, but the file does not exist.

## idea.md and ground rules

I recommend creating docs/idea.md, not root idea.md, because the ground rules already say product documents belong under docs/.

It should be a short stakeholder document containing:

- the problem;
- target user;
- product promise;
- how Teach → Test → Results works;
- why AI is used selectively;
- what makes Veyra different;
- current V0 boundary;
- long-term ABM direction;
- what is validated versus still hypothetical.

I would also update the canonical-files table in groundrules.md to explicitly include:

docs/idea.md — stakeholder-level product idea and strategic narrative
docs/Veyra_PRD.md — detailed product requirements and decision reasoning

I have not made these edits yet because this turn was explicitly a read-and-discuss stage, and the repository’s own project-review workflow says product decisions should be agreed before being written into canonical sources.

## Credits and quotas

I cannot truthfully provide an exact credit cost for the proposed work before execution. Credit use depends on model, reasoning level, context size, tools, task complexity, and whether work runs locally or in the cloud. OpenAI explicitly says the allowance does not map to a fixed number of tasks or messages.

I also cannot see your personal Settings → Usage page from this session, so I cannot state your exact weekly allowance or remaining percentage. Official guidance says to check:

- ChatGPT Desktop → Settings → Usage, or
- /status in an active Codex CLI session.

Depending on the plan, limits can include a five-hour window and a weekly window. Some Pro tiers do not currently have the five-hour limit, but still have an included allowance. Official OpenAI usage guidance, Codex plan guidance

Therefore:

- I cannot give an honest exact credit number.
- I cannot calculate depletion percentages without your visible remaining hourly/five-hour and weekly balances.
- The “18 calls / maximum 20” in Manus is an agent-call budget, not a credit budget.

For control, I suggest chunking the next work as:

1. Decision chunk: agree on the golden vertical slice and product positioning.
2. Documentation chunk: create docs/idea.md, fix governance inconsistencies, and update status/tasks.
3. Inventory chunk: produce a proposed move/delete/keep manifest without moving anything.
4. Cleanup chunk: execute only the approved manifest.
5. Implementation chunks: one user-visible capability at a time, each separately verified.