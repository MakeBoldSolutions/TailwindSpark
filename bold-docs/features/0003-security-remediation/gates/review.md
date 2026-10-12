# Delivery review

> **TL;DR for the Product Owner**: The security repair and build fix passed review, local checks, GitHub CI, and default-branch rescanning. All ten Dependabot PRs are resolved and no dependency or CodeQL alerts remain open.

The branch-sync gate passed against the unchanged main base before PR #236. The
four workflow files, dependency manifests/lockfile, three ingestion scripts, and
shared downloader were reviewed against AC1–AC6 and the enforced backbone. The
highest-risk download and write paths were read in full. Co-located tests and
documentation were checked against the implemented boundaries.

One subsite URL issue found during review was fixed in commit 42076e9: the value
written now matches the candidate whose protocol was validated. Its regression
test includes a non-string links.site field with a valid fallback URL. The later
root dependency refresh exposed missing Vite peer resolution and mixed Vitest
versions; commit 4d40623 declares root Vite and aligns the UI test tools. A clean
install, tests, coverage, builds, idempotence, lint, typing, and smoke tests pass.

PR #236 merged as 4a2188f93ead947d152ed6ae89b7c028eea479dd. Its build, CodeQL,
dependency review, and security checks passed. Default-branch build/deployment
and security workflows passed as well. Dependabot PRs #216, #218, #224, #226,
#228, #230, #231, #233, #234, and #235 are closed with their changes consolidated.
GitHub reports zero open dependency and code scanning alerts; CodeQL #89–#91
have state fixed. No scanner exclusions or alert dismissals were applied.

No open review findings. Existing app lint warnings and unrelated repository-wide
formatting debt remain documented. Rollback is a revert of the consolidated merge.
