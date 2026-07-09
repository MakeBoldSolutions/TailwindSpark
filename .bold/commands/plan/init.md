---
command: bold.plan
subcommand: init
description: Detect repo entry path (migrate / discover / greenfield) and route accordingly.
collector: collect-entry-path-context
args: []
---

# bold.plan init

Detect which of three entry paths applies, then route. All three converge on identical artifacts: a ratified backbone, a populated project genome, and a seeded `system/` taxonomy.

## Definition of Done

Done when a ratified backbone, a populated `project.json`, and a seeded `system/` all exist — regardless of which entry path produced them. For migrate specifically, done also requires meeting the acceptance bar below; for discover, route to `bold.plan discover` and its own Definition of Done applies.

## Detect entry path

Read the collector output.

- `.devspark/` or `.documentation/` present → **Migrate**
- Existing codebase, no methodology install, `bold-docs/` not already populated → **Discover**
- Empty or near-empty repo → **Greenfield**

## Migrate

DevSpark migration is brownfield discovery with a richer evidence source: a DevSpark repo is a fully documented brownfield in the predecessor's dialect.

1. **Collect** — inventory the DevSpark install (commands, scripts, constitution, feature dirs, waivers, multi-app config).
2. **Reason** — produce a migration report mapping DevSpark artifacts to Bold equivalents: `.documentation/memory/constitution.md` → `backbone.md` (restated, `source: migrated(constitution.md)`, `enforced`); team overrides → `bold-docs/overrides/`; feature dirs → `features/` (in-flight) or `.archive/` (complete, harvested on entry); `devspark.json` → workspace config. The report opens with its own Product Owner TL;DR.
3. **Ratify** — human confirms the report; it becomes the contract.
4. **Execute** — write the transformed artifacts, verify them, then delete `.devspark/` and legacy files. The deletion is the last step, never the first.

**Acceptance bar**: after migration, the repo must be indistinguishable from one born on Bold — nothing in the finished repo carries legacy DevSpark naming or structure.

## Discover

Route to `bold.plan discover`.

## Greenfield

1. **Starter/kit selection** — offer the catalog (`source/starters/`, `source/kits/`); a kit is a preset composition (starter + stacks + flavors + answer defaults), layers are the power-user path for picking stacks/flavors individually.
2. **Stack detection** from existing files, to suggest (not force) a starting selection.
3. **Compose** — run `compose-layers` with the chosen starter (+ stacks/flavors, or the chosen kit). **If it reports any `conflicts`, halt and ask**: name the colliding question `id` and which layers both defined it — never silently pick one (bold-tool-plan.md §12.3, "conflicts halt and ask, never silent last-wins"). This is the one thing in this step that isn't a judgment call.
4. **Questionnaire** — ask every question in `composed_questions`, in order, skipping any whose `when` names a layer not in this composition. For each, the effective default is `kit_answer_defaults[id]` if present, else the question's own `default` — Enter-mashing through all of them still yields a valid project. Write each answer into `project.json` under the genome key its `maps_to` names, with `source: asked`.
5. **Generate** a provenance-annotated backbone (cite each `backbone_fragments` entry's `source` layer), a seeded `system/`, and `AGENTS.md`.
