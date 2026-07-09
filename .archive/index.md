# Archive Index

## 2026-07-09 — DevSpark → Bold migration harvest

- `2026-07-09-001-multi-theme-platform/` — work products (plan, tasks, quickstart, research, data-model, contracts, checklists, gates) from the completed **Multi-Theme Design System Platform** feature (shipped 2026-04-13, critic gate: pass). Durable knowledge promoted to `bold-docs/system/theme-platform.md`.
- `2026-07-09-pr-review/` — completed PR review record (`pr-130.md`).
- `2026-07-09-releases/` — release notes + metrics for v1.0.0 and v1.0.1, including a bundled release-time copy of the multi-theme-platform spec. Historical record, not actively maintained day to day.
- `2026-07-09-repo-story/` — repo narrative history (`history.json` + two dated repo-story reports).
- `2026-07-09-devspark-templates/` — TailwindSpark's project-customized DevSpark templates (`spec-template.md` etc. — verified to differ from `.devspark/`'s generic defaults, not boilerplate). Superseded going forward by Bold's own starter spec templates (`source/starters/*/spec-template.md`); kept here for reference, not wired up as active.
- `2026-07-09-copilot-sessions/` — Copilot session/audit artifacts from `.documentation/copilot/`, plus `documentation-guide.md` (the old `.documentation/` orientation doc, superseded by the generated `AGENTS.md`).

Durable project documentation that was *not* DevSpark tooling, despite living under `.documentation/`, was promoted instead of archived: 6 project guides (architecture, branding, changelog, deployment, getting-started, testing) → `bold-docs/system/guides/`; 3 ADRs → `bold-docs/system/decisions/`.

## Pre-Bold history

TailwindSpark ran its own `.archive/` convention under DevSpark before migrating to Bold — preserved here verbatim since it documents real completed work (GitHub Repositories Explorer, ReactSpark migration, constitution-compliance remediation, and routine documentation maintenance) that predates this index.

### Contents (as of migration)

| Folder | Date | Description |
|--------|------|-------------|
| 2026-04-11/ | 2026-04-11 | Harvested completed feature artifacts and archived superseded copilot reports to keep the active documentation surface current |
| 2026-04-08/ | 2026-04-08 | Completed session documents: documentation reorganization report and historical harvest report from March |
| 2026-03-26/ | 2026-03-26 | Session artifacts from March 7, 2026 and harvest scan results |
| 2026-03-07/ | 2026-03-07 | Legacy session history, completed specs, and superseded audit artifacts |

Archived during routine documentation maintenance:

- `.documentation/copilot/archive-2026-04-08.md` - Superseded archive report retained only for historical traceability
- `.documentation/copilot/harvest-2026-04-08.md` - Superseded harvest report whose durable knowledge already lives in active docs
- `.documentation/copilot/preharvest-doc-audit-2026-03-26.json` - Historical preharvest scan output no longer needed in the active documentation surface
- `.documentation/copilot/session=2026-03-07/` - Old copilot session workspace no longer needed in the active documentation surface

### 2026-04-11 Harvest Run

Archived during knowledge harvest:

- `.documentation/specs/001-github-repos-explorer/` - Completed GitHub Repositories Explorer spec set after changelog capture
- `.documentation/specs/003-reactspark-migration/` - Completed ReactSpark migration spec set after closure-task reconciliation and changelog harvest
- `.documentation/specs/1-constitution-compliance/` - Completed constitution-remediation spec artifact removed from the active spec surface after harvest confirmed its durable outcomes were already preserved
- `.documentation/specs/pr-review/pr-122.md` - Completed PR review for the repositories explorer work
- `.documentation/copilot/audit/2026-04-09_results.md` - Completed audit output superseded by harvested living docs
- `.documentation/copilot/audit/2026-04-11_results.md` - Pre-closeout audit snapshot retained for traceability after the completed specs were reconciled and archived
- `.documentation/memory/constitution.md.20260410.bak` - Superseded constitution backup retained only for traceability

Knowledge extracted and preserved in:

- `.documentation/guides/CHANGELOG.md` - Added the GitHub Repositories Explorer delivery entry
- `.documentation/guides/CHANGELOG.md` - Added the ReactSpark migration delivery entry and recorded closure of the completed spec artifacts
- `.documentation/Guide.md` - Clarified that active specs are in-flight only and completed specs move to `.archive/`
- `.documentation/copilot/harvest-2026-04-11.md` - Recorded harvested artifacts, intentional keeps, and follow-up notes

### 2026-04-08 Archive Run

Archived during routine documentation maintenance:

- `.documentation/copilot/harvest-2026-03-26.md` - Historical harvest report from March 26
- `.documentation/copilot/documentation-reorganization-2026-04-08.md` - Completion report for docs/ to .documentation/guides/ migration

Knowledge extracted and preserved in:

- `.documentation/guides/CHANGELOG.md` - Added documentation reorganization entry
- `.documentation/Guide.md` - Created living orientation guide for .documentation/ structure

### 2026-03-26 Archive Run

Archived during harvest workflow:

- Session artifacts from `.documentation/copilot/session=2026-03-07/`
- Harvest scan results and audit pre-scan data

### 2026-03-07 Cleanup

Archived during repository documentation cleanup:

- legacy top-level `copilot/` session history
- completed `.documentation/specs/002-audit-criticals/`
- completed `.documentation/specs/1-constitution-compliance/`
- generated `.documentation/copilot/session=2026-03-01/` implementation notes
- superseded audit artifacts from `.documentation/copilot/audit/`
