# Veyra Design Specification

**Status:** Approved product direction  
**Last updated:** 2026-09-15  
**Applies to:** Desktop V0 and all later screens unless this file is explicitly amended  
**Product model:** Teach → Understanding → Test → Run → Results

This is the design source of truth for Veyra. The approved visual reference is
`design_inspirations/New UI Mockups/Veyra Prototype.dc.html`; the four
design-system captures supplied on 2026-09-15 are detail references from that
same artifact. The prototype rail above the application frame is a review aid,
not production UI.

When this specification and an auxiliary inspiration file disagree, this file
and the approved Veyra prototype win. In particular, the unrelated Modernist
support theme under `_ds/` is not Veyra's product design system.

## Screen Progress

| # | Screen Name | Screen ID | Status | Clarifications Needed | Last Updated |
|---|---|---|---|---|---|
| 1 | Overview | `SCR-OVERVIEW` | Approved | None | 2026-09-15 |
| 2 | Teach | `SCR-TEACH` | Approved | None | 2026-09-15 |
| 3 | Understanding Review | `SCR-UNDERSTANDING` | Approved | None | 2026-09-15 |
| 4 | Visual Test Editor | `SCR-EDITOR` | Approved | None | 2026-09-15 |
| 5 | Data & Run Configuration | `SCR-RUN-CONFIG` | Approved | None | 2026-09-15 |
| 6 | Live Run | `SCR-LIVE-RUN` | Approved | None | 2026-09-15 |
| 7 | Result Detail | `SCR-RESULT` | Approved | None | 2026-09-15 |
| — | Design System Reference | `REF-DESIGN-SYSTEM` | Approved, internal only | None | 2026-09-15 |

The seven screens are the approved representative V0 journey. Project creation,
standalone Tests/Modules/Run History lists, Settings, onboarding and storage
management are required by the PRD but are not separate approved mockups. They
must reuse the shell, tokens and components below; their detailed layouts are
implementation tasks and may not introduce another visual language.

### Application identity asset

- The approved desktop mark is `docs/brand/veyra-app-icon-source.png`: a
  2000 × 2000 transparent RGBA source using navigation ink and action orange.
- `apps/desktop/build/icon.png` is its deterministic 1024 × 1024 packaging
  derivative and must retain transparency and the source safe area.
- Use it for the macOS application/Dock icon, Windows executable/installer icon
  and development desktop window. Platform-native masks and scaling are allowed.
- Do not crop or redraw the mark, add a wordmark/background, or pre-round the
  corners. Changes require a new approved source and a DEC update.
- In-product branding uses the separate approved sources
  `docs/brand/veyra_tr_icon.png` and `docs/brand/veyra_rectlogo.png`. In the
  dark sidebar, show the transparent mark inside a 28 × 28 px white tile with
  7 px radius, followed by the rectlogo's exact wordmark artwork at 17 px high.
  Do not substitute a font-rendered label or generic symbol. Expose the complete
  lockup as one accessible image named “Veyra”; its child artwork is decorative.

## 1. Product Design Principles

1. **Business language first.** Primary UI says “Teach”, “Add to cart”,
   “The order was not created”, and “Review blockage”; Playwright, selectors and
   model internals appear only in advanced detail.
2. **Meaning before mechanism.** Show intent, inputs, outputs and expected
   outcomes before browser actions or locator data.
3. **Evidence beside the claim.** A failure explanation, screenshot,
   expected/observed result and related network/console evidence remain within
   one visible result workspace.
4. **Action is not assertion.** User actions are neutral cards. Assertions use
   a teal rail and tint so “what happened” cannot be confused with “what must
   be true”.
5. **Status semantics are explicit.** PASS means the expected outcome held;
   FAIL means the application contradicted it; BLOCKED means Veyra could not
   act confidently; ERROR means Veyra itself failed; INTERRUPTED means the run
   stopped before a conclusion.
6. **Human semantic sovereignty.** AI outputs are proposals with Accept, Edit
   and Reject controls plus provenance. Nothing consequential is silently
   saved.
7. **Calm work surface, energetic moments.** Most UI is neutral. Orange marks
   the single high-energy action on a screen; blue confirms or selects; teal
   links meaning and evidence.
8. **Local trust is visible.** “Runs locally”, “Protected session”, secret
   references and storage copy reinforce the privacy model without dominating.

## 2. Platform, Frame and Responsive Contract

- Platform: native desktop application for macOS and Windows; no mobile or
  tablet layout in V0.
- Approved reference viewport: **1440 × 960 px application frame**. The
  prototype review rail is excluded.
- Minimum supported window: **1280 × 800 px**. Below it, prevent further
  resizing rather than scaling the UI or hiding controls.
- At 1280–1439 px, reduce main page horizontal padding from 40 to 24 px and
  panel gaps from 24/20 to 16 px. Keep the 232 px sidebar and 64 px header.
- At 1440 px and wider, use the approved dimensions exactly. Content may gain
  whitespace, but readable prose stays constrained and diagnostic grids do not
  exceed useful line lengths.
- Long content scrolls inside the main workspace or designated panel. The app
  shell, command header and critical run controls remain fixed.
- Never reflow the desktop application into a mobile bottom navigation.

## 3. Global Application Shell

### 3.1 Structure

- Root workspace: `#F6F7F5`, primary text `#18202B`.
- Sidebar: 232 px wide, `#101827`, full height, 20 px top padding.
- Header: 64 px high, white, 1 px bottom border `#E2E6EA`, 32 px horizontal
  padding.
- Main content: flexes to remaining width; typical page padding 36–40 px.
- Sidebar order: approved Veyra mark-and-wordmark lockup, project switcher, Overview, Teach, Tests, Modules,
  Runs, Data; Settings, Help and profile are anchored at the bottom.
- Header order: project/page breadcrumb, 360 px maximum command search,
  environment pill, local-run pill, notification control and avatar.

### 3.2 Navigation states

- Default: transparent, text `#9AA6B8`.
- Hover: `#18202F`, text `#E8ECF2`.
- Selected: `rgba(36,87,230,.16)`, white text, 3 px `#2457E6` rail aligned to
  the sidebar edge.
- Disabled: `#4A5465`, no pointer affordance.
- Keyboard focus: global blue focus ring; never rely on selected fill alone.

### 3.3 Data & storage support screen

The Data destination owns local storage inspection and project portability in
addition to later dataset work. Its E02 empty/management state uses the global
shell and standard components; it may not introduce a second visual language.

- Page heading: uppercase `Local workspace` eyebrow, `Data & storage` title and
  one sentence explaining that structured records and evidence are separate.
- Header actions: blue `Restore project`, then secondary `Refresh`. Use the
  shared button icon slot with a 7 px icon-to-label gap. Both are disabled
  outside the desktop runtime with an explanatory neutral notice.
- Summary: three equal white 18 px-radius cards for Structured data, Evidence
  (including file count) and Total local usage.
- Projects: one bordered white panel. Each row shows project name, evidence
  bytes/file count, secondary Export and secondary Clean evidence controls.
- Evidence cleanup is destructive and therefore requires a second deliberate
  click labelled `Confirm clean`. Before confirmation, announce that only
  evidence older than 30 days is removed and definitions/run history remain.
- Restore/export use native file pickers. The renderer never displays or owns a
  local filesystem path. Results and cleanup totals are announced in an
  `aria-live="polite"` region.
- Counts are 11.5 px tabular labels aligned to the trailing edge.

### 3.3 Global search and context controls

- Search placeholder: “Search tests, modules, runs”; show `⌘K` on macOS and
  `Ctrl K` on Windows.
- Environment is always visible when a project is open.
- “Runs locally” uses a lock icon, teal text and teal-tinted surface.
- Notification unread state adds a 6 px orange dot plus an accessible count.
- Project switcher truncates one-line project names with an accessible full
  label.

## 4. Design Tokens

### 4.1 Core color tokens

| Token | Value | Use |
|---|---:|---|
| `color.app` | `#F6F7F5` | Application background |
| `color.surface` | `#FFFFFF` | Panels, header, controls |
| `color.nav` | `#101827` | Sidebar/navigation ink |
| `color.text.primary` | `#18202B` | Main content |
| `color.text.secondary` | `#657080` | Supporting text |
| `color.border` | `#E2E6EA` | Standard 1 px borders |
| `color.blue` | `#2457E6` | Confirmation, selection, focus, progress |
| `color.blue.hover` | `#1C48C9` | Blue hover/pressed text |
| `color.orange` | `#F47A3C` | High-energy action |
| `color.orange.hover` | `#E06A2D` | Orange hover/pressed |
| `color.teal` | `#087F8C` | Links, assertions, semantic evidence |
| `color.teal.hover` | `#066A75` | Teal hover/strong text |
| `color.pass` | `#16835B` | PASS/complete |
| `color.fail` | `#C73A52` | FAIL/destructive consequence |
| `color.blocked` | `#B7791F` | BLOCKED/warning |
| `color.error` | `#596579` | Product/runtime ERROR |

Tinted surfaces and borders:

- Blue: surface `#EDF1FD`, pale selected `#FAFBFF`, border `#C9D7FA`.
- Teal: surface `#F1F8F9` or assertion `#F7FCFC`, border `#CFE3E5`.
- Green: surface `#F1F8F4`, border `#CBE3D5`.
- Crimson: surface `#FCF3F4`, border `#E4B7BF` or soft `#F1D8DD`.
- Amber: surface `#FDF8EC`, border `#E6D4AF`, strong text `#8F5F14`.
- Neutral inset: `#F1F3F6`; subtle row/header: `#FBFBFA`.

### 4.2 Typography

| Role | Font | Size / Weight | Notes |
|---|---|---|---|
| Expressive heading | Instrument Serif | 32 / 400 | Welcome and Understanding/empty states only |
| Page title | Inter | 30 / 600 | `-0.02em`; overview-level only |
| Section heading | Inter | 21 / 600 | `-0.02em` |
| Panel title | Inter | 15 / 600 | Dense work surfaces |
| Body | Inter | 14 / 400 | Default line height 1.5 |
| Secondary | Inter | 13 / 400 | Never below 12.5 px |
| Group label | Inter | 11 / 600 | Uppercase, `0.08em` tracking |
| Variable/evidence | UI monospace | 12–12.5 / 500–600 | Variables, selectors, URLs, network and console only |

Use Inter 500 for controls and 600 for decisions. Do not use Instrument Serif
for tables, diagnostics, buttons or navigation. Numeric duration/count fields
use tabular numerals.

### 4.3 Spacing, sizing and radii

- Base unit: 8 px; 4 px for tight icon gaps.
- Standard internal padding: 16 px; large panel padding: 20–24 px.
- Standard panel gap: 24 px; dense diagnostic gap: 16–20 px.
- Page horizontal padding: 40 px at reference width.
- Panel radius: 18 px; dense cards: 14–16 px; controls: 10–12 px; chips:
  7–8 px; status only: 999 px pill.
- Primary control height: 42–44 px. Compact toolbar control: 32–36 px.
- Icon sizes: 14–18 px with 1.7–2.4 px round strokes.
- Panel shadow: `0 1px 2px rgba(24,32,43,.04)`. Use
  `0 2px 10px rgba(24,32,43,.06)` only for app frame/floating layers.
- Selected ring: 1 px blue border plus `0 0 0 3px rgba(36,87,230,.10)`.
- Keyboard ring: 2 px `#2457E6`, 2 px offset on every interactive element.

## 5. Component System

Use accessible headless primitives with Veyra-owned styling. Use one coherent
round-stroke icon set (Lucide is the reference) and do not mix filled and
outline families.

### 5.1 Buttons

- **High-energy:** orange, white label, 12 px radius, 14 px/600. Reserved for
  Start/Finish teaching, Run test/cases and Export. At most one visible orange
  action per screen.
- **Primary confirm:** blue, white label. Used for approval, save-and-continue,
  re-run and selected positive decisions.
- **Secondary:** white, primary text, 1 px border; subtle neutral hover.
- **Text link:** teal, no fill/border; underline on hover and focus.
- **Destructive:** white/crimson border and text; crimson tint on hover. A
  confirmation is required when data or an active run would be lost.
- **Disabled:** `#F1F3F6`, `#B4BBC5`, standard border; no click handler.
- **Busy:** replace the leading icon with a spinner, preserve button width,
  disable repeat submission and use an `aria-live` label such as “Running”.

### 5.2 Form controls

- Text fields: 40–42 px high, 11 px radius, 1 px border, 12 px horizontal
  padding; focused border blue plus 3 px 10% blue ring.
- Labels are visible and programmatically associated; placeholders never act
  as the only label.
- Radio cards use a 16 px radio and a full-card hit target. Selected state uses
  blue border, pale blue background and ring.
- Toggle: 38 × 22 px; blue on, `#D8DCE2` off; 16 px white thumb. Announce state.
- Inline-edit table cells reveal the neutral border on hover and blue border on
  focus without shifting columns.
- Validation appears directly below/inside the affected control with an icon,
  clear repair text and `aria-describedby`.

### 5.3 Cards, rows and semantic blocks

- Work panel: white, 1 px border, 18 px radius, nearly invisible shadow.
- Selected card: pale blue, blue border and blue ring.
- Empty/add card: transparent/white, 1 px dashed `#CBD2DA`, 14 px radius.
- Action card: white/neutral border; gray uppercase “ACTION” or “MODULE”.
- Assertion card: `#F7FCFC`, teal border and 3 px left rail, check icon and
  teal label. Never style an action as an assertion.
- Clickable rows receive hover fill/border and a visible chevron or link;
  non-clickable summaries must not receive pointer styling.

### 5.4 Status badges

Every status includes icon + uppercase label + accessible text. Never use
colour alone.

| Status | Icon | Color treatment | Meaning |
|---|---|---|---|
| PASS | Check in circle | Green tint/border | Expected outcome held |
| FAIL | X in circle | Crimson tint/border | Application contradicted expectation |
| BLOCKED | Pause in circle | Amber tint/border | Veyra could not act confidently |
| ERROR | Warning triangle | Neutral gray tint/border | Veyra/runtime failed |
| INTERRUPTED | Stop square | Neutral gray/crimson detail | User/system stopped before conclusion |
| RUNNING | Spinner | Blue tint/border | Execution active |
| QUEUED | Clock | White/gray border | Waiting to execute |

### 5.5 Tabs, tables and technical evidence

- Tabs sit on a subtle neutral bar. Active tab has primary text/600 and a 2 px
  blue bottom bar; arrow keys change focus, Enter/Space activates.
- Tables use an 11 px uppercase header on `#FBFBFA`, 1 px row dividers and
  tabular numeric columns.
- Technical evidence uses monospace only for the value, not its explanation.
- Large screenshots and traces load lazily with a stable placeholder size.

### 5.6 Motion

- Hover/focus/selection transitions: 120–160 ms ease-out; no spring effects.
- Spinner: 0.9 s linear infinite. Pulse: 1.2–1.4 s ease-in-out. Indeterminate
  progress sweep: 1.4 s ease-in-out.
- Drag uses a 2–4 px lift and selected shadow; the list opens a stable insertion
  gap. Reordering must also work by keyboard controls.
- With `prefers-reduced-motion`, stop pulse/sweep and use static status icons or
  determinate text; focus and state changes remain immediate.

## 6. Accessibility Contract

- Target WCAG 2.2 AA for text, controls and focus indicators.
- Full keyboard access is required for navigation, teaching controls, editor
  ordering, datasets, run controls, result tabs and evidence.
- Minimum pointer target is 40 × 40 px for primary controls and 32 × 32 px for
  dense icon toolbars, with 40 px effective hit area where possible.
- Focus order follows visual order and returns to the invoking control when a
  dialog/popover closes.
- Dialogs trap focus, have a labelled title, close on Escape unless destructive
  work is actively committing, and describe irreversible impact.
- Status, confidence and progress include text equivalents; spinners and live
  run changes use polite live regions, while failure/stop uses assertive only
  when immediate attention is required.
- Error text states what happened and how to recover. Do not expose raw stack
  traces outside advanced details.
- At 200% text zoom within the supported desktop window, content scrolls rather
  than overlaps; critical actions remain reachable.

## 7. Screen Specifications

### 7.1 Overview

**Screen ID:** `SCR-OVERVIEW`  
**Platform:** Desktop app  
**Breakpoints:** Global desktop contract; approved reference 1440 × 960  
**User goal:** Understand project health and start teaching, running or
investigating without navigating through setup screens.  
**Entry:** Project selection, app launch with an existing project, Overview nav.  
**Exit:** Teach, live/recent run, result detail, module/test/data surfaces.

#### 1. Layout & Structure

Use the global shell. Main content has 36 px top/40 px horizontal padding and
24 px vertical gaps. Stack: greeting/action row; four equal metric cards; a
two-column working area at approximately 1.55:1. The left column contains Last
run and Needs your attention; the right contains Reusable modules and Setup
progress.

#### 2. Header/Navigation

Select Overview. Breadcrumb is `Commerce Storefront › Overview`; search and
environment controls remain visible.

#### 3. Hero/Above-fold

Show project/environment eyebrow, “Good morning, {first_name}” at 30/600 and
Instrument Serif support line “What should Veyra validate today?”. Right-align
orange **Teach new workflow** and blue **Run regression**.

#### 4. Content Sections

- Metrics: Tests, Reusable modules, Last run and 7-day Pass rate.
- Last run: name, age, duration, proportional status bar and explicit counts.
- Needs attention: FAIL and BLOCKED rows with reason, evidence hint/input and
  time.
- Reusable modules: top modules with usage counts and All link.
- Setup progress: completed/total, next recommended action and Add dataset.

#### 5. Interactive Components

Primary actions route to Teach/run configuration. Metric cards are not links
unless the whole card receives link semantics. Attention rows open the exact
case/step. Modules open editor/module detail. Setup action opens the associated
test dataset.

#### 6. Typography Hierarchy

Page greeting 30/600; expressive support 25/400; metric value 24/600; panel
titles 15/600; row title 14/600; metadata 12.5–13.

#### 7. Color Usage

One orange action, one blue secondary primary path. Status bars and rows use
green/crimson/amber with text/icons. Links use teal.

#### 8. Spacing & Sizing

Metric gap 16; working columns 20; panel padding 20–22; attention row padding
14 × 12; standard panel radius 18.

#### 9. Icons & Imagery

Use semantic outline icons for Teach, Run, PASS, FAIL, BLOCKED and modules. No
decorative hero image.

#### 10. Micro-Interactions & Animations

Rows gain subtle border/fill on hover. Status bars load without celebratory
motion. Greeting does not animate.

#### 11. Responsive Behavior

At standard width reduce gaps/padding globally; keep four metrics in one row.
Truncate long run/module names after one line with full accessible label.

#### 12. Accessibility

Read the last-run bar as “12 passed, 1 failed, 1 blocked”; ensure attention
items announce status before title. Do not make a whole card and its child link
separate duplicate tab stops.

#### 13. Edge Cases & States

- Empty project: replace metrics/work panels with an Instrument Serif welcome,
  short explanation and orange Teach first workflow.
- No recent run: neutral empty panel with Run a test.
- All passing: keep Needs attention collapsed/empty; do not manufacture alerts.
- Loading: stable card skeletons; error: inline retry with diagnostic link.
- Large counts/durations localize and use tabular numerals.

### 7.2 Teach

**Screen ID:** `SCR-TEACH`  
**Platform:** Desktop app with controlled Chromium surface  
**Breakpoints:** Global desktop contract  
**User goal:** Demonstrate a browser workflow while Veyra records readable
intent, parameters and checkpoints.  
**Entry:** Teach new workflow; Resume teaching.  
**Exit:** Understanding Review, discard/return, browser/session error recovery.

#### 1. Layout & Structure

Under the shell, show a recording header, a 38% recorder timeline column and a
62% protected browser canvas. Anchor a bottom action bar across the workspace.
The timeline and browser scroll independently; controls never scroll away.

#### 2. Header/Navigation

Select Teach. Recording header includes red recording indicator, title,
elapsed time, environment, AI assistance state and Inspect policy.

#### 3. Hero/Above-fold

N/A. This is a focused work surface; the active recorder state is the primary
orientation.

#### 4. Content Sections

- Readable numbered timeline of normalized actions.
- Parameter suggestion attached to the originating action.
- Active step treatment and captured checkpoint/assertion.
- Protected browser chrome: environment URL and engine.
- Browser content plus “Veyra is watching…” trust message.

#### 5. Interactive Components

Pause/Resume recording, select timeline step, remove step, add manual step,
add checkpoint, explain step, accept/edit/reject parameter proposal, inspect AI
policy, and orange Finish teaching. Finishing stops capture and opens
Understanding Review; it does not save semantics silently.

#### 6. Typography Hierarchy

Recording title 17/600; step titles 14–14.5/500–600; uppercase types 11/600;
metadata 12–12.5; narration 13.

#### 7. Color Usage

Orange only for Finish teaching; red dot indicates active recording with text;
teal checkpoint/assertion; blue active/proposal state; browser content remains
visually subordinate.

#### 8. Spacing & Sizing

Header controls 10–13 px vertical padding; timeline cards 14–16 px; bottom bar
18 px top/20 px bottom and 32 px horizontal.

#### 9. Icons & Imagery

Record/pause, checkpoint, microphone, protected-session lock and browser
actions use outline icons. Captured site imagery is product content, not Veyra
decoration.

#### 10. Micro-Interactions & Animations

Recording indicator may pulse at 1.4 s; active timeline step gets blue ring;
new steps enter without moving focus. Pause freezes indicator and changes label
to Resume.

#### 11. Responsive Behavior

Keep both panes visible at supported widths; timeline can narrow to 360 px but
not below. Bottom help text may truncate before action buttons wrap.

#### 12. Accessibility

Announce “Recording started/paused”; elapsed time must not update a live region
each second. Timeline is an ordered list. Every observed action has readable
text independent of its icon. Browser focus and Veyra chrome focus are visibly
distinct.

#### 13. Edge Cases & States

Handle browser launch failure, navigation error, recorder permission failure,
paused session, zero recorded steps, secret-field redaction, unsupported
interaction, session timeout and dirty discard. Finish is disabled with no
meaningful steps and explains why.

### 7.3 Understanding Review

**Screen ID:** `SCR-UNDERSTANDING`  
**Platform:** Desktop app  
**Breakpoints:** Global desktop contract; content max-width 920 px  
**User goal:** Validate or correct Veyra's interpretation before a test is
created.  
**Entry:** Finish teaching.  
**Exit:** Create test/editor, return to teaching, edit/reject proposals.

#### 1. Layout & Structure

Centered 920 px column with 32 × 40 px page padding and 18 px gaps. Place an
expressive heading above one white 20 px-radius review panel divided into Goal,
Candidate input, Reusable behaviours and Expected outcome. Footer actions sit
outside the panel.

#### 2. Header/Navigation

Select Teach because review is part of teaching. Breadcrumb reads
`Commerce Storefront › Understanding review`.

#### 3. Hero/Above-fold

Instrument Serif 32 heading “Here’s what I understood” and explicit copy:
“Nothing is stored until you confirm.”

#### 4. Content Sections

- Goal with source steps and segmented confidence.
- Candidate input showing literal → variable, use count and type.
- Suggested reusable behaviours with source step ranges.
- Expected outcomes derived from checkpoint.
- Collapsible raw browser actions count underneath.

#### 5. Interactive Components

Each proposal has Accept, Edit and Reject. Candidate literals add Convert to
input and Keep fixed. Footer offers Back to teaching, Edit understanding and
blue Looks right — create test. Confirm is disabled until required proposal
conflicts are resolved.

#### 6. Typography Hierarchy

Expressive heading 32/400; goal 17/500; card titles 14/600; section labels
11/600 uppercase; provenance/confidence 12.

#### 7. Color Usage

Teal-tinted Accept and expected outcomes; blue conversion/confirm; neutral Edit;
Reject begins neutral and becomes crimson on hover/focus. Confidence uses blue
segments plus readable label, never a bare percentage.

#### 8. Spacing & Sizing

Panel sections 20 × 24 px; proposal cards 14–16 px; two reusable behaviour
cards split evenly with 14 px gap.

#### 9. Icons & Imagery

Use domain icons for search/cart behaviours and check icons for expected
outcomes. No generated illustration.

#### 10. Micro-Interactions & Animations

Accept locks into an accepted state with Undo; Edit expands an inline field and
places focus; Reject collapses with a reversible undo toast. Confidence does not
animate.

#### 11. Responsive Behavior

At standard width keep one main column. Reusable behaviour cards may stack only
if the 920 px content region cannot preserve 320 px per card.

#### 12. Accessibility

Proposal groups use headings and fieldsets. Confidence exposes text such as
“High confidence, 3 of 4 signals”. Reject buttons include proposal name.
Inline edits preserve focus on save/cancel.

#### 13. Edge Cases & States

Support no parameter candidate, no module candidate, low-confidence goal,
conflicting candidates, rejected all suggestions, changed recording provenance,
AI disabled (deterministic summary/manual edit), save failure and stale draft.

### 7.4 Visual Test Editor

**Screen ID:** `SCR-EDITOR`  
**Platform:** Desktop app  
**Breakpoints:** Global desktop contract  
**User goal:** Inspect and edit a test as a semantic flow without dealing with
raw automation by default.  
**Entry:** Create test, open test/module, duplicate/version history.  
**Exit:** Save, run configuration, module detail, discard/leave.

#### 1. Layout & Structure

Use a fixed editor title bar, fixed command toolbar, then a two-column body:
flexible flow canvas and 352 px inspector. Canvas cards form one ordered column;
inspector changes with selection.

#### 2. Header/Navigation

Select Tests (or Modules when a standalone module opens). Title bar shows name,
Draft/version/edited metadata, Version history, Save and orange Run test.

#### 3. Hero/Above-fold

N/A. Identity, draft state and primary actions occupy the title bar.

#### 4. Content Sections

- Toolbar: Add step, Insert module, Add assertion, duplicate, reorder and
  undo/redo.
- Flow: numbered action/module cards, inputs/outputs and assertion cards.
- Inspector: intent, inputs, outputs, preconditions, expected outcomes,
  dependent tests and collapsed browser implementation.

#### 5. Interactive Components

Select, edit, duplicate, delete and reorder cards; add browser/manual step;
insert module; add/edit assertion; edit target/value; save; open version
history; open module; run test. Keyboard reorder buttons are equivalent to drag.

#### 6. Typography Hierarchy

Title bar 17/600; card title 14.5/600; inspector title 16/600; semantic labels
11/600 uppercase; values 12.5 monospace.

#### 7. Color Usage

Orange Run test; blue selected module and control focus; teal assertion; amber
Draft; neutral actions. Delete is crimson only in the destructive affordance.

#### 8. Spacing & Sizing

Title bar 18 × 32 px; toolbar 12 × 32 px; canvas 24 top/28–32 horizontal;
cards 16 × 18 px with 12 px vertical gap; inspector 22 × 24 px.

#### 9. Icons & Imagery

Use grab handle, plus, layers/module, check/assertion, duplicate, vertical
reorder and undo/redo icons. No imagery.

#### 10. Micro-Interactions & Animations

Selection ring appears in 120 ms. Drag opens a stable insertion gap; saving
changes Draft → Saved without page navigation. Undo/redo changes announce
succinctly.

#### 11. Responsive Behavior

Keep 352 px inspector fixed at reference width. At 1280 px it may narrow to
320 px; canvas never below 560 px. Long values wrap inside chips or truncate
with accessible full value.

#### 12. Accessibility

Flow is an ordered list. Cards expose selection state and position. Provide
Move up/Move down keyboard actions and announce new position. Inspector headings
associate with selected card; tooltips label icon-only buttons.

#### 13. Edge Cases & States

Handle unsaved changes, save conflict, invalid variable, missing module version,
module impact warning, empty test, deleted dependency, unreachable assertion,
undo stack empty, read-only historical version and failed save with retry.

### 7.5 Data & Run Configuration

**Screen ID:** `SCR-RUN-CONFIG`  
**Platform:** Desktop app  
**Breakpoints:** Global desktop contract  
**User goal:** Bind a dataset, choose execution settings and start one or many
test cases with clear local/privacy semantics.  
**Entry:** Run test, Data nav, Add dataset.  
**Exit:** Live Run, return to editor, manage secrets.

#### 1. Layout & Structure

Split flexible dataset workspace from a fixed 372 px Run summary sidebar.
Dataset column uses 32 px vertical, 40 px left and 28 px right padding. Summary
uses 28 px padding and anchors the privacy note/run action at the bottom.

#### 2. Header/Navigation

Select Data when editing data, Tests when launched as transient run config;
breadcrumb title is Run configuration. Global environment must match summary.

#### 3. Hero/Above-fold

Dataset title, explanation that each row runs once, and binding chips mapping
column names to test variables.

#### 4. Content Sections

- Dataset table: Case, Product, Quantity and row action.
- Add row, Import CSV and local case count.
- Secret reference card; never a secret value.
- Run summary: test, environment, browser and data.
- Mode cards: Visible browser and Headless.
- Advanced: timeout, blockage retries and trace-on-failure.
- Local privacy notice and run button.

#### 5. Interactive Components

Edit cells, add/remove row, import/validate CSV, edit bindings, manage secrets,
select mode, expand Advanced, set timeout/retry/trace and orange Run N cases.
The run action validates all rows first and focuses the first error.

#### 6. Typography Hierarchy

Dataset title 22/600; summary title 15/600; table/group labels 11/600; cells
13.5; variables/secrets 12.5 monospace.

#### 7. Color Usage

Bindings blue; secret trust card teal; selection blue; validation crimson;
orange only for Run cases.

#### 8. Spacing & Sizing

Dataset panel radius 18; table rows approximately 49 px; grid columns 56 px,
flex, 180 px and 52 px; summary fields use 12 px vertical gaps.

#### 9. Icons & Imagery

Database, upload, delete, lock, radio and play icons. No imagery.

#### 10. Micro-Interactions & Animations

Inline cells reveal on hover/focus. Adding a row focuses its first cell.
Advanced expands in 160 ms without shifting the run button offscreen. Start
button becomes width-stable Running state after submit.

#### 11. Responsive Behavior

Summary narrows to 340 px at standard width; Product remains flexible. Never
hide Quantity or validation. Horizontal table scrolling is allowed only for
user-added extra columns.

#### 12. Accessibility

Use an actual editable table or equivalent grid semantics. Delete announces
case identity. Mode is a radio group. Import errors provide row/column and
repair text. Secret values never reach accessible names or DOM text.

#### 13. Edge Cases & States

Cover empty dataset, one row minimum, duplicate headers, malformed CSV, missing
required variable, invalid type, unresolved secret, unavailable browser,
environment mismatch, zero/very large case count and start failure. Large
datasets virtualize rows while keeping keyboard navigation coherent.

### 7.6 Live Run

**Screen ID:** `SCR-LIVE-RUN`  
**Platform:** Desktop app with optional visible controlled browser  
**Breakpoints:** Global desktop contract  
**User goal:** See what is running, current case/step, progress and browser
activity; pause or stop safely.  
**Entry:** Start run.  
**Exit:** Result detail, interrupted result, resume, technical details.

#### 1. Layout & Structure

Use fixed run header, fixed case strip and a two-column body near 0.9:1.5.
Left work panel contains steps and current variables; right contains live
browser plus Activity strip.

#### 2. Header/Navigation

Select Runs. Header shows spinner, “Running {test}”, current case, elapsed time,
Pause and destructive-outline Stop.

#### 3. Hero/Above-fold

N/A. Active run identity and case progress are the orientation layer.

#### 4. Content Sections

- Case chips: completed PASS, active RUNNING, later QUEUED.
- Overall determinate progress.
- Step timeline: COMPLETE, ACTIVE and PENDING.
- Current variables.
- Protected live browser with current interaction emphasis.
- Network/console Activity summary and technical details link.

#### 5. Interactive Components

Select a case, Pause/Resume, Stop with confirmation, open technical details and
focus the current browser action. Users cannot edit the test while it runs.

#### 6. Typography Hierarchy

Run title 17/600; panel title 14/600; step label 14/500–600; status 11.5–12/600
uppercase; durations and variables use tabular/monospace treatment.

#### 7. Color Usage

Blue running/active/progress; green complete/pass; queued neutral; Stop crimson
outline. A later blocked/fail case replaces blue with semantic state only after
classification.

#### 8. Spacing & Sizing

Header 18 × 32 px; case strip 14 × 32 px; body 24 × 32 px with 20 px gap;
panels 18 px radius; step rows 13 × 14 px.

#### 9. Icons & Imagery

Spinner, check, clock, pause/stop, lock and activity icons. The live browser is
evidence, not decorative imagery.

#### 10. Micro-Interactions & Animations

Spinner 0.9 s; active progress sweep 1.4 s; current browser target uses a
static blue focus halo plus optional reduced pulse. Progress updates smoothly
but labels update at meaningful state boundaries.

#### 11. Responsive Behavior

Preserve both columns at supported widths; left panel may shrink to 380 px.
Activity metadata wraps before browser content is squeezed below usability.

#### 12. Accessibility

Announce case/step state transitions politely, not every timer tick. Pause and
Stop remain keyboard reachable. Progress has current/max/value text. Visible
browser focus does not steal keyboard focus without user action.

#### 13. Edge Cases & States

Cover pausing, resume, stop confirmation, interrupted result, worker crash,
browser crash, timeout, retry, blockage requiring review, headless mode (replace
browser with last evidence/step detail), network offline and app restart with
recoverable interrupted state.

### 7.7 Result Detail

**Screen ID:** `SCR-RESULT`  
**Platform:** Desktop app  
**Breakpoints:** Global desktop contract  
**User goal:** Distinguish product failure from automation trouble, understand
the cause and share useful evidence.  
**Entry:** Completed/interrupted run, run history, Overview attention item.  
**Exit:** Re-run, evidence viewer, developer report export, blockage review,
test/module detail.

#### 1. Layout & Structure

Use a fixed result summary, fixed tab strip, flexible tab content and compact
suite rollup footer. Overview tab is a three-column grid near 0.85:1.15:1 for
steps, screenshot and expected/observed plus technical evidence.

#### 2. Header/Navigation

Select Runs. Breadcrumb is `Commerce Storefront › Run {id} — result`. Summary
contains status badge, human conclusion, semantic explanation, Re-run, Open
evidence and orange Export developer report.

#### 3. Hero/Above-fold

Status and plain-language outcome are the hero. For FAIL, state that the
application contradicted the expectation and Veyra completed successfully. For
BLOCKED/ERROR, use their own meanings; never reuse failure copy.

#### 4. Content Sections

- Run metadata: test, inputs, environment, browser and duration.
- Tabs: Overview, Steps, Evidence, Network, Console, Locator details.
- Overview steps with selected failure/assertion.
- Screenshot at failure, URL and timestamp.
- Expected versus Observed.
- Correlated network/console evidence.
- Suite rollup with PASS/FAIL/BLOCKED cases and Review blockage.

#### 5. Interactive Components

Re-run, open evidence, export report, select tabs/steps/evidence, filter/open
network/console details, open developer locator details and review blockage.
Export shows deterministic progress and a success location/open action.

#### 6. Typography Hierarchy

Outcome 21/600; status 14/700 uppercase; panel/tab content 13.5–14; metadata
13; technical values 12.5 monospace; developer-only label 11.5 uppercase.

#### 7. Color Usage

Summary status drives one semantic accent. Re-run is blue; Export is the one
orange action; evidence links teal. FAIL uses crimson, BLOCKED amber, PASS green,
ERROR/INTERRUPTED neutral with explicit icon/label.

#### 8. Spacing & Sizing

Summary 22 × 32 px; tab padding 13 × 16 px; body 20 top/32 horizontal/24 bottom;
three-column gap 16; standard 18 px panels.

#### 9. Icons & Imagery

Status icons, rerun, download/export and evidence-type icons. Screenshots retain
original aspect ratio and expose zoom/open-original; use no illustrative art.

#### 10. Micro-Interactions & Animations

Tab and step selection use blue ring/bar without page reload. Evidence lazy-load
uses stable placeholders. Export button becomes busy without introducing a
second orange action. Failure screenshot highlight is static or reduced-motion
safe.

#### 11. Responsive Behavior

At standard width, reduce gaps and let the third evidence column scroll; keep
Expected/Observed reachable without a modal. Tabs may horizontally scroll with
visible controls; they may not silently disappear.

#### 12. Accessibility

Place the plain-language outcome immediately after status in reading order.
Tabs implement ARIA tab semantics. Screenshots have contextual alt text; visual
failure rectangles are described in adjacent text. Tables expose headers.
Export success/failure is announced.

#### 13. Edge Cases & States

Support every result state, mixed suite results, absent screenshot/trace,
redacted evidence, huge console/network logs, multiple failed assertions,
locator blockage with candidates, historical deleted test/module, export
failure, corrupted evidence and a result captured under an older version.

## 8. Required Supporting Overlays and States

These are not standalone screens, but the PRD requires them to complete the
approved flow. All use the same tokens and accessibility contract.

| Overlay/state | Trigger | Required content/action |
|---|---|---|
| Project switcher | Sidebar project control | Search/recent projects, Create project, current indicator |
| Command search | `⌘/Ctrl K` | Grouped Tests/Modules/Runs results, keyboard selection, empty state |
| AI policy | Inspect policy | Current mode, data sent/redacted, disable control, policy link |
| Edit proposal | Understanding Edit | Original, editable wording, provenance, Save/Cancel |
| Add step/module/assertion | Editor toolbar | Search/type picker, keyboard selection, empty/no-result path |
| Version history | Editor link | Immutable versions, author/time, open read-only, restore as new version |
| Unsaved changes | Navigation from dirty editor | Save, discard, cancel; no silent loss |
| Import CSV | Dataset action | File selection, preview, column binding, validation summary |
| Stop run | Live run Stop | Consequence, Stop run, Keep running; focus returns correctly |
| Evidence viewer | Open evidence/thumbnail | Original image/trace, step/time/URL, zoom/download, redaction state |
| Export report | Result Export | Format HTML/PDF, redaction confirmation, progress, saved location |
| Review blockage | BLOCKED result | Intended target, ranked candidates, Use once/Edit target/Cancel |

## 9. Content and Copy Rules

- Use sentence case except uppercase group labels and status badges.
- Describe the user's outcome first: “The order was not created.” Follow with
  technical evidence, not the reverse.
- Use **Teach**, not Record, for the product journey; “recording” is acceptable
  only for the active capture state.
- Use **test**, **module**, **dataset**, **case**, **run**, **assertion** and
  **evidence** consistently with the PRD.
- Never call FAIL “broken automation”. Never call BLOCKED an application bug.
- Avoid “AI-powered”, “magic”, confidence theatre and generic success copy.
- Secret copy states “Referenced, never stored in the dataset.”
- Empty states answer: what is empty, why it matters and the single next action.

## 10. Design QA Acceptance Checklist

A screen is conformant only when all applicable checks pass:

- [ ] Global shell dimensions, tokens, Inter/Instrument Serif roles and spacing
  match this specification.
- [ ] No screen shows more than one orange action.
- [ ] Action and assertion blocks are visually and semantically distinct.
- [ ] Every status includes icon, label and correct meaning.
- [ ] All controls expose hover, focus, active, disabled and busy states.
- [ ] Keyboard navigation works through the primary journey without a pointer.
- [ ] Focus is visible with the 2 px blue ring and 2 px offset.
- [ ] Technical details are available but not dominant.
- [ ] Secret/evidence redaction is preserved in visible and accessible text.
- [ ] Loading, empty, error and recovery states are implemented.
- [ ] 1280 × 800 and 1440 × 960 layouts avoid clipping/overlap.
- [ ] Reduced motion replaces spinners/pulses with understandable static state.
- [ ] Result copy preserves PASS/FAIL/BLOCKED/ERROR/INTERRUPTED semantics.
- [ ] The seven-screen flow can be completed with the expected entry/exit paths.

## 11. Approved Reference Mapping

| Specification area | Approved prototype section |
|---|---|
| Shell and Overview | `overview` |
| Recorder and protected browser | `teach` |
| Human review and semantic proposals | `understand` |
| Flow cards, assertion distinction and inspector | `editor` |
| Dataset, secrets and run setup | `data` |
| Case/step progress and live browser | `run` |
| Failure explanation and diagnostic tabs | `result` |
| Tokens and component states | `system` |

The prototype contains illustrative commerce data and a fictional Northwind
Supply site. Those names and values are fixtures, not production hard-coded
content. Layout, hierarchy, component treatments and interaction semantics are
the approved product direction.
