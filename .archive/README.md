# Archive

This folder stores historical documentation, completed implementation artifacts, and generated working notes that are no longer part of the active documentation set.

**Do not reference files in this folder from prompts, scripts, or active docs.** Files here are preserved for audit and traceability only.

## Archive Policy

Keep active operational documentation in these locations:

- `.documentation/guides/` for user-facing project documentation  
- `.documentation/memory/` for the active constitution and project memory
- `.documentation/specs/` for the currently active feature spec set
- `.documentation/copilot/` for recent session artifacts

Move outdated or completed material here when it is useful for traceability but no longer needed in the live documentation surface.

## Contents

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

## 2026-04-11 Harvest Run

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

## 2026-04-08 Archive Run

Archived during routine documentation maintenance:

- `.documentation/copilot/harvest-2026-03-26.md` - Historical harvest report from March 26
- `.documentation/copilot/documentation-reorganization-2026-04-08.md` - Completion report for docs/ to .documentation/guides/ migration

Knowledge extracted and preserved in:

- `.documentation/guides/CHANGELOG.md` - Added documentation reorganization entry
- `.documentation/Guide.md` - Created living orientation guide for .documentation/ structure

## 2026-03-26 Archive Run

Archived during harvest workflow:

- Session artifacts from `.documentation/copilot/session=2026-03-07/`
- Harvest scan results and audit pre-scan data

## 2026-03-07 Cleanup

Archived during repository documentation cleanup:

- legacy top-level `copilot/` session history
- completed `.documentation/specs/002-audit-criticals/`
- completed `.documentation/specs/1-constitution-compliance/`
- generated `.documentation/copilot/session=2026-03-01/` implementation notes
- superseded audit artifacts from `.documentation/copilot/audit/`
