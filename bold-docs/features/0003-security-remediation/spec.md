# Security remediation and Dependabot resolution

> **TL;DR for the Product Owner**
> _What_: Consolidate all ten open Dependabot updates and resolve dependency and code scanning findings.
> _Why_: Vulnerable dependencies block PR builds; three snapshot writes need documented trust-boundary review.
> _Status_: In Progress.
> _Decision needed_: None. Feature tier and execution approved by the owner on 2026-10-11.

**Tier**: Feature
**Status**: In Progress

## Intent

Apply the version changes requested by PRs #216, #218, #224, #226, #228, #230, #231, #233, #234, and #235 in one remediation branch. Allow newer compatible security patches, including fast-uri beyond #218's version. Align the Vitest packages (now 5.0.3 after the owner refreshed root dependencies), explicitly provide root Vite for the hoisted React plugin, repair current npm audit findings without blind forced upgrades, and preserve Node 26/npm 12 and existing workspace contracts.

Review CodeQL alerts #89–#91 against their actual data flow. Keep fixed output paths and schema normalization; strengthen timeouts, download size limits, and snapshot continuity where needed. Document and dismiss only findings proven to describe intentional validated JSON ingestion, with precise evidence. Do not exclude the scripts or query from scanning.

Publish and merge the consolidated repair only after CI succeeds; then close the ten superseded Dependabot PRs and verify the default branch's dependency alerts and CodeQL state. The owner's instruction to get all findings resolved authorizes this delivery. A failed check requires repair before merge. A normal source build must remain deterministic; no remote snapshot refresh is needed for local build validation. Rollback is a revert of the consolidated commit.

## Acceptance Criteria

- AC1: All ten PR version changes or newer compatible security patches are present in manifests, lockfile, and workflows; React and React DOM stay aligned.
- AC2: A clean npm ci succeeds and npm audit reports zero vulnerabilities across all severities.
- AC3: Each CodeQL finding has a documented review of fixed paths, source URLs, validation, and browser consumption. Snapshot downloads enforce a 10-second timeout and byte limits before full buffering; failed refresh preserves an existing snapshot. Rejected payloads and interrupted downloads are tested.
- AC4: Lint, type checking, tests, coverage (all four metrics >=40%), production build, build idempotence, and changed-file formatting pass. Existing unrelated formatting debt is documented rather than included.
- AC5: A consolidated PR passes GitHub build and security checks before merge; all ten Dependabot PRs are resolved; default-branch security alert status is verified after rescanning.
- AC6: Feature artifacts and durable ingestion documentation describe final behavior, validation, alert dispositions, and rollback.

## Affected Files

Root and workspace package.json files, package-lock.json, .github/workflows/_.yml, scripts/sync-_-data.mjs, co-located script tests, bold-docs/system/guides/BUILD_SYSTEM.md, and this feature's artifacts.

## Open Questions

None. Scope, security targets, failure handling, integration constraints, delivery, and measurable acceptance criteria are clear. Secrets scanning is disabled upstream; enabling a new paid/security service is outside this repair.

## Tasks

- [x] T001 Apply Dependabot and audited security versions in package.json, apps/demo-app/package.json, packages/ui-components/package.json, package-lock.json, and .github/workflows/*.yml (AC1, AC2).
- [x] T002 Review alerts and harden scripts/sync-*-data.mjs with co-located regression tests and documented dispositions (AC3).
- [x] T003 Run all acceptance gates and repair regressions in affected files (AC4).
- [x] T004 Update bold-docs/system/guides/BUILD_SYSTEM.md and feature gate/verification artifacts (AC6).
- [ ] T005 Publish, validate CI, merge the consolidated PR, close superseded Dependabot PRs, and verify default-branch alerts (AC5).

## Verification Results

- Clean `npm ci` succeeds under Node 26.7.0/npm 12.0.2; `npm audit` reports zero vulnerabilities.
- Lint and workspace/script strict type checks pass; existing app lint warnings remain (41 warnings, zero errors).
- Workspace coverage: 154 UI-component and 770 demo-app tests pass. UI coverage: 98.19% statements / 96.10% branches / 96.15% functions / 98.18% lines. Demo coverage: 66.14% / 59.15% / 56.79% / 68.67%.
- Snapshot tests: 38 pass; shared downloader/URL helper coverage is 100% on all four metrics.
- Two forced production builds pass with identical tracked diffs. Chromium smoke tests: 2 pass using CI’s VITE_BASE_URL=/ configuration. The initial local smoke invocation used the default /TailwindSpark/ build base, then passed after rebuilding with the CI base; no application regression was found.
- Targeted Prettier and git diff --check pass. Legacy repository-wide formatting debt is unchanged.
- Remote CI, merge, and alert-state verification are pending in T005.

## Waivers

None.

## Build repair after dependency refresh

The owner refreshed root tool versions while this feature was in flight. This moved Vite into workspace-local node_modules directories while the hoisted React plugin resolved from the root, producing ERR_MODULE_NOT_FOUND during npm run build. A direct root Vite devDependency restores peer resolution. UI workspace Vitest/UI are aligned to root Vitest/coverage 5.0.3, and a root install reconciles stale nested packages. The regenerated lockfile resolves one Vite 8.3.4 and one Vitest 5.0.3 across workspaces. Existing owner package upgrades are retained. Clean npm ci, ordinary and forced builds, repeat-build diff checks, 924 workspace coverage tests, 38 script tests, lint, and type checks all pass for this dependency set. Audit remains at zero vulnerabilities. Remote CI is repeated before merge.
