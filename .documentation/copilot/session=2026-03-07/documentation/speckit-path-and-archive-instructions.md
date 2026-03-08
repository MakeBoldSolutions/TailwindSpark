# SpecKit Path And Archive Instructions

## Purpose

This note captures the documentation-path and archive issues identified during the March 7, 2026 cleanup and the rules that should be followed going forward.

## Problem Summary

The repository had drift between active SpecKit process files and historical documentation:

- some instructions still referenced top-level `copilot/` instead of `/.documentation/copilot/`
- one helper script targeted a duplicate Copilot instructions file under `.github/agents/`
- several agent definitions referenced `scripts/powershell/...` even though the actual scripts live under `/.documentation/scripts/powershell/`
- completed specs and generated working notes remained in the live documentation surface instead of being archived

These issues caused confusion about the canonical instruction source, made some process paths stale, and left too much historical material in the active docs set.

## Canonical Rules

### 1. Use One Canonical Copilot Instructions File

- The only canonical Copilot instructions file is `/.github/copilot-instructions.md`.
- Do not create or regenerate `/.github/agents/copilot-instructions.md`.
- Any script or tool that updates Copilot instructions must target `/.github/copilot-instructions.md`.

### 2. Treat `.github/prompts` And `.github/agents` Differently

- `/.github/prompts/*.prompt.md` are thin wrappers that select an agent.
- `/.github/agents/*.agent.md` contain the actual agent behavior, handoffs, and execution guidance.
- Keep the agent files. They are necessary and are not just pointers.

### 3. All SpecKit Helper Scripts Must Point To `/.documentation/scripts/powershell/`

- When an agent or process doc tells the user to run a helper script, it must use the real path under `/.documentation/scripts/powershell/`.
- Do not reference `scripts/powershell/...` unless the script actually exists there.

Examples:

- Correct: `/.documentation/scripts/powershell/evolution-context.ps1`
- Correct: `/.documentation/scripts/powershell/site-audit.ps1`
- Incorrect: `scripts/powershell/evolution-context.ps1`

### 4. Active Documentation Must Stay Small And Current

Keep active documentation limited to the current operational set:

- `docs/` for maintained project documentation
- `/.documentation/memory/` for constitution and active memory artifacts
- `/.documentation/specs/` for the currently active feature spec set
- `/.documentation/copilot/audit/` for current operational audit outputs
- `/.documentation/copilot/session={YYYY-MM-DD}/` for current session-generated artifacts

### 5. Archive Completed Or Historical Working Material

Move outdated or completed documentation to `/.archive/` when it is useful for traceability but should not remain in the live docs surface.

Archive candidates include:

- completed feature spec folders no longer driving active work
- generated implementation notes and session artifacts from prior efforts
- superseded audit reports and compliance summaries
- legacy top-level documentation trees such as old `copilot/` session folders

### 6. Keep Live References Clean After Moves

After moving or archiving documentation:

- search active docs and process files for stale references
- update any references in `docs/`, `/.github/`, `/.documentation/scripts/`, and active spec files
- do not treat matches inside `/.archive/` as active problems

## Required Workflow For Future Cleanup Or Refactors

1. Identify the canonical live path before editing process docs.
2. Update active instructions first: prompts, agents, scripts, architecture docs, and Copilot instructions.
3. Move outdated material into `/.archive/` with a date-based folder.
4. Add or update `/.archive/README.md` if the archive policy or scope changes.
5. Verify the live tree only:
   - `docs/`
   - `/.github/`
   - `/.documentation/`
   - `scripts/`
6. Ignore expected historical references inside `/.archive/`.

## Current Resolved State

The following repository conventions are now the expected baseline:

- canonical Copilot instructions: `/.github/copilot-instructions.md`
- active SpecKit PowerShell helpers: `/.documentation/scripts/powershell/`
- active session docs location: `/.documentation/copilot/session={YYYY-MM-DD}/`
- active audit location: `/.documentation/copilot/audit/`
- archive root: `/.archive/`

## Developer Checklist

- [ ] No duplicate Copilot instructions files created under `/.github/agents/`
- [ ] No stale `scripts/powershell/...` references when the real file is under `/.documentation/scripts/powershell/`
- [ ] No new top-level `copilot/` documentation created
- [ ] Completed specs and working notes moved out of the live documentation surface
- [ ] Live references verified after any move or consolidation

## Related Files

- `/.github/copilot-instructions.md`
- `/.github/agents/`
- `/.github/prompts/`
- `/.documentation/scripts/powershell/`
- `/.archive/README.md`