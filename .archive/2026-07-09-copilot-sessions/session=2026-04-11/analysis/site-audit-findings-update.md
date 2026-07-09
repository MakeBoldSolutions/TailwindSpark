# Site Audit Findings Update

**Date**: 2026-04-11
**Source Audit Data**: `audit_results.json` regenerated at 2026-04-11T13:22:01Z
**Constitution Version Reviewed**: 2.2.0
**Scope**: Update site-audit findings after source/build artifact separation changes

## Executive Summary

The previous critical audit blockers tied to active draft specs on `main` are no longer current. The live `.documentation/specs/` tree no longer contains active spec artifacts, and the repository now reflects the newly formalized constitutional principle for source and build artifact separation.

The most important compliance improvement is that standard builds are now repeatable and side-effect free with respect to tracked source. Version bumping, content sync, bundle analysis, and deployment metadata generation are all separated from the normal build path. This materially improves compliance with Constitution Principle VIII and the new Principle IX.

## Findings Status

| Severity | Count | Notes |
|----------|-------|-------|
| CRITICAL | 0 | Previous spec-lifecycle blockers are no longer present in the active spec tree |
| HIGH | 0 | No current high-severity findings were confirmed by the refreshed review |
| MEDIUM | 2 | Remaining issues are audit signal quality and still-open constitution gaps outside this change set |
| LOW | 1 | Intentional tracked snapshots remain a process consideration, not a build violation |

## Resolved Since Prior Audit

### 1. Spec lifecycle blockers resolved

The earlier 2026-04-11 archived audit reported draft specs and incomplete tasks living on `main`. That is no longer true in the active repository state.

Current observation:
- `.documentation/specs/` no longer contains active `spec.md` or `tasks.md` files.
- The previous findings against `003-reactspark-migration` and `1-constitution-compliance` were tied to archived material, not the current active spec tree.

**Updated status**: Resolved.

### 2. Constitution updated to formalize source/build separation

The constitution now records Version `2.2.0` and includes:
- `VIII. CI/CD & Automation` rules that standard builds must not modify tracked source files.
- `IX. Source and Build Artifact Separation (MANDATORY)`.
- explicit treatment of reviewed source snapshots versus generated artifacts.

Evidence observed:
- `.documentation/memory/constitution.md` includes Principle IX.
- The constitution explicitly states that normal builds must be repeatable and git-clean.

**Updated status**: Resolved and formalized.

### 3. Standard build path no longer mutates tracked source

The refreshed repository state confirms the architectural changes behind the new constitutional rule:
- Root `package.json` separates `build` from `version:bump`.
- Root `package.json` exposes `sync:data` as an explicit command rather than a build side effect.
- `apps/demo-app/package.json` separates `sync:data`, `build`, `postbuild`, and `build:analyze`.
- `scripts/generate-meta.ts` writes `sitemap.xml` and `robots.txt` into the build output directory rather than tracked source.
- Generated `robots.txt` and `sitemap.xml` were removed from `apps/demo-app/public/`.
- Bundle analysis is opt-in through `build:analyze`.

**Updated status**: Resolved.

## Current Findings

### MEDIUM 1. Audit pattern checks still report known false positives

The regenerated `audit_results.json` still reports:
- a potential hardcoded secret in `apps/demo-app/src/sections/FormShowcase.tsx`
- a potential TODO/BUG comment in `apps/demo-app/src/components/BuildInfo.tsx`

These are not new defects introduced by the current work. They remain audit-noise items that require human interpretation.

Impact:
- The audit output can still overstate risk if consumed without review.

Recommendation:
- Tune the site-audit pattern heuristics so validation messages and prose comments are excluded from secret/TODO findings where feasible.
- Continue treating these entries as informational until the audit logic is improved.

### MEDIUM 2. Constitution implementation gaps remain open outside this remediation

The build/source separation work is complete, but the constitution still records broader implementation gaps that were not re-audited away by this change set, especially around JSDoc coverage.

Impact:
- The repository is more compliant operationally, but not yet fully aligned with every documentation-related constitutional requirement.

Recommendation:
- Run a targeted follow-up on Principle V documentation coverage rather than treating the source/build remediation as full constitutional closure.

### LOW 1. Tracked data snapshots remain a process-sensitive area

The JSON files under `apps/demo-app/public/data/` remain tracked inputs. Under the updated constitution this is acceptable only because they are treated as reviewed source snapshots and refreshed explicitly via `sync:data`.

Impact:
- This is compliant under the new policy, but it depends on process discipline.

Recommendation:
- Keep snapshot refresh isolated to `npm run sync:data`.
- Do not reintroduce those sync scripts into `build`, `prebuild`, or deployment hooks.

## Compliance Reassessment

| Area | Updated Status | Notes |
|------|----------------|-------|
| Spec Lifecycle | PASS | No active draft spec artifacts found in `.documentation/specs/` |
| Constitution Tracking | PASS | Audit data now reflects constitution version 2.2.0 |
| CI/CD & Automation | PASS | Standard build no longer mutates tracked source |
| Source/Artifact Separation | PASS | Principle IX is formalized and implemented in build flow |
| Audit Signal Quality | PARTIAL | False positives remain in pattern-based findings |
| Documentation Standards | PARTIAL | Existing JSDoc implementation gap remains outside this fix |

## Recommended Next Actions

1. Update the site-audit script/report template so false-positive secret and TODO detections are downgraded or filtered more precisely.
2. Run a focused audit for Principle V documentation coverage if constitutional remediation is continuing.
3. Keep `sync:data`, `version:bump`, and `build:analyze` explicit and separate from normal builds going forward.

## Conclusion

The build/source artifact separation changes materially improve the repository’s compliance posture. The prior critical audit findings about active draft specs are no longer current, and the new constitutional requirements around repeatable, git-clean builds are now both documented and implemented.

The remaining issues are not blockers for this remediation. They are follow-up items: audit false positives and broader documentation coverage work that sits outside the build/artifact separation scope.
