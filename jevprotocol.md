# Jev Protocol

Work through `tasks.md` sequentially and autonomously.

For every task:

1. Inspect the relevant existing implementation before modifying it.
2. Use deterministic tools for things that can be determined exactly.
3. Use Jev/TypeSafe for high-volume or repetitive semantic judgments where the possible outputs can be predefined: classification, relevance, routing, ranking, scoring and yes/no verification.
4. Use your own frontier-model reasoning for architecture, implementation, debugging, code generation and ambiguous problems.
5. If Jev returns low confidence, escalate the decision to your own reasoning rather than blindly accepting it.
6. After implementation, run tests/typecheck/lint as appropriate and fix regressions.
7. Update `tasks.md` only after verification.
8. Continue to the next task unless blocked by a decision that requires the product owner.

## Usage and evaluation record

For every task where Jev is used, record in the completion report:

- the task and bounded judgment Jev performed;
- the predefined output type: Choice, Score or yes/no verification;
- the number of items and Jev requests, including whether independent judgments were batched;
- confidence and any decisions escalated to frontier-model reasoning;
- observed latency and cost when available; and
- a clearly labelled estimate of frontier-model calls or tokens avoided, including the comparison baseline.

If Jev is considered but not used, briefly record why deterministic tooling or frontier-model reasoning was a better fit. Never claim savings without an explicit baseline; treat estimates as estimates until measured against representative tasks.

## Safety and quality boundaries

- Typed output guarantees an interface, not correctness. Validate Jev on representative Veyra cases and apply consequence-aware thresholds.
- Keep exact rules, calculations, code execution, tests and source-of-truth updates deterministic.
- Do not send secret values, credentials or unredacted sensitive evidence to Jev.
- A low-confidence or materially ambiguous result must escalate; it must not silently authorize destructive, security-sensitive or user-visible behavior.
- Jev usage must improve measured cost or speed without reducing correctness. If the evaluation record does not demonstrate that benefit, revise or stop using it for that judgment.

The live TypeSafe documentation is the source of truth for models, primitives, confidence behavior, SDKs and limits. Read the relevant current documentation before implementing or changing a Jev integration.
