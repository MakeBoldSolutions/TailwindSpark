# Requirements Checklist — 0001-dependency-upgrade

> **TL;DR for the Product Owner**
> *What*: Tests whether this spec's requirements are complete, clear, consistent, and measurable — not whether the code works.
> *Why*: Required pre-flight gate for Feature-tier work before `bold.build` executes.
> *Status*: 9 of 12 items pass; 3 gaps noted (none block build — they're refinements a future spec revision could pick up).

- CHK001 [Completeness] Is an exact target version stated for every major-bump decision, not just a qualitative description? — spec `### Resolved`: TypeScript → 7.0.2, npm → 12.0.0 both cited exactly. **Pass.**
- CHK002 [Completeness] Does the spec state what happens if the TypeScript major bump breaks something un-fixably? — spec `### Resolved`: fallback to pinning `^6.0.x` + follow-up. **Pass.**
- CHK003 [Completeness] Does the spec state what happens if a *minor/patch* bump (not TypeScript) breaks something un-fixably? — no equivalent fallback/escalation guidance exists for e.g. `react-router-dom` or `vite`. **[Gap]**
- CHK004 [Clarity] Is "existing baseline" (AC5, test coverage) quantified anywhere reachable from the spec? — yes, indirectly via `bold-docs/system/guides/TESTING.md`'s documented 40% floor (cited by the collector's `system_docs`, not restated inline — acceptable, avoids duplicating the source of truth). **Pass.**
- CHK005 [Clarity] Is "shippable state" (Intent) given a concrete, checkable definition? — yes, immediately operationalized as the named build/test/lint/type-check commands. **Pass.**
- CHK006 [Consistency] Do `## Affected Files` and `## Tasks` agree on which files change? — checked: 4 `package.json` paths + `package-lock.json` + `deploy.yml`, matched exactly by T001–T004 and T010. **Pass.**
- CHK007 [Consistency] Does the version table's "deferred" marking for `npm` agree with `### Resolved` and the Tasks section's "Excluded" note? — yes, all three agree. **Pass.**
- CHK008 [Measurability] Is "any breaking change ... called out explicitly" (AC10) objectively checkable, or does it rely on subjective judgment of what counts as "breaking"? — no definition of the threshold (e.g., a lockfile-only diff vs. a forced code change). A reviewer could reasonably disagree on whether something needed flagging. **[Gap]**
- CHK009 [Measurability] Is "no changes to tracked source" (AC4, backbone principle 9) mechanically checkable? — yes, `git status --porcelain` after `npm run build` is a binary check. **Pass.**
- CHK010 [Coverage] Are accessibility, security, or performance non-functional attributes addressed, where relevant to this deliverable? — not applicable; this is build-tooling-only, no user-facing surface changes. Correctly out of scope, not a silent omission. **Pass (N/A).**
- CHK011 [Coverage] Does the spec address the review burden of a large `package-lock.json` diff (~19 packages across 4 workspaces)? — no guidance on whether this ships as one PR or needs a specific reviewer callout for lockfile size. **[Gap]**
- CHK012 [Completeness] Is the newly-discovered CI gap (lint/type-check not previously blocking) documented precisely enough to act on without re-deriving it? — yes, Intent states the exact current steps and the exact two missing ones, with file path. **Pass.**

## Gaps summary

CHK003, CHK008, CHK011 are refinements, not defects — none change what "done" means for the Acceptance Criteria already in the spec. Recommend acknowledging and proceeding to build rather than another clarify round; revisit if a future dependency-upgrade feature reuses this spec as a template.
