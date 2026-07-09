# Analyze — 0001-dependency-upgrade

> **TL;DR for the Product Owner**
> *What*: Consistency check of the ratified spec against itself, the backbone, and `system/` docs — no code touched.
> *Why*: Required pre-flight gate for Feature-tier work before `bold.build` executes.
> *Status*: 2 findings, both resolved — F001 informational (noted), F002 ratified (fix now, folded into spec).
> *Decision needed*: None.

## Checked

- **Duplication**: none. Acceptance Criteria are each distinct in scope (bump vs. range-reconcile vs. install vs. build vs. test vs. lint vs. type-check vs. CI-wiring vs. CI-pass vs. PR documentation).
- **Ambiguity (wording)**: none. No unquantified adjectives or TODO/TBD placeholders. "Existing baseline" (AC5) and "shippable state" (Intent) are both operationally defined — the former by reference to `bold-docs/system/guides/TESTING.md`'s documented 40% floor, the latter by the named commands that follow it.
- **Underspecification**: none. Every task in `## Tasks` names an exact file path already listed in `## Affected Files`.
- **Coverage gaps**: none. All 10 Acceptance Criteria trace to Intent, and all 10 trace to at least one task (T001–T012); every task traces back to an AC. Verified both directions.
- **Backbone consistency**: 1 finding (F002 below).
- **System consistency**: 1 finding (F001 below).

## Findings

**F001 — Intent's CI description is incomplete** (informational)
Spec line 16 states `deploy.yml` "currently runs ... npm audit --audit-level moderate ... " alongside the other steps as if all are equivalent gates. Actual file (`​.github/workflows/deploy.yml:30-32`) has `continue-on-error: true` on that step — an audit failure does **not** currently fail CI. This doesn't change any Acceptance Criterion (AC3 already scopes the audit check to `npm install`/local, not CI), but the Intent text should say so precisely rather than imply audit is CI-enforced today.

**F002 — Backbone consistency: principle 8 partially addressed** — **Resolved.**
Ratified: fix now. AC8 and T010 updated to also remove `continue-on-error: true` from the `npm audit` step in `deploy.yml`, in the same PR as the lint/type-check gate fix.

No other findings.
