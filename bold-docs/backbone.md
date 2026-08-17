# Backbone — TailwindSpark

> **TL;DR for the Product Owner**
> _What_: The non-negotiable rules for this repo, migrated from TailwindSpark's DevSpark constitution (v1.4.0, 9 MANDATORY principles + 4 additional standards).
> _Why_: These were already law under DevSpark — migration restates them in Bold's format, it doesn't relitigate them.
> _Status_: Ratified — ported as `enforced` (the 9 original MANDATORY principles) and `adopting` (the 4 additional standards, which were never marked MANDATORY in the source).
> _Decision needed_: none.

Full detail for every principle below (sub-rules, evidence, original severity levels) lives in `bold-docs/system/coding-standards.md` — this file states the rule, that file explains it.

## Principles

1. **All code uses TypeScript in strict mode with full type coverage** — components use typed props and the `React.FC` pattern, exported functions declare explicit return types.
   <!-- source: migrated(constitution.md §I Type Safety) -->

   **Status**: enforced

2. **All code has test coverage via Vitest, co-located with the source it tests** — minimum 40% coverage (statements/branches/functions/lines), enforced in CI.
   <!-- source: migrated(constitution.md §II Testing Standards) -->

   **Status**: enforced

3. **UI components use the centralized design system's semantic tokens — raw Tailwind utility colors are forbidden**, enforced by the custom lint rule (`no-raw-primary-class`).
   <!-- source: migrated(constitution.md §III Design System & Semantic Tokens) -->

   **Status**: enforced

4. **All UI components meet WCAG AA accessibility standards**, enforced via jsx-a11y-compatible lint rules as blocking errors.
   <!-- source: migrated(constitution.md §IV Accessibility Standards) -->

   **Status**: enforced

5. **All exported components, functions, and types carry JSDoc documentation.**
   <!-- source: migrated(constitution.md §V Documentation Standards) -->

   **Status**: enforced

6. **All code passes Oxlint and Prettier with zero errors; dead code is deleted, never commented out** — git history is the archive, not the working tree.
   <!-- source: migrated(constitution.md §VI Code Quality & Formatting) -->

   **Status**: enforced

7. **The monorepo structure is Turborepo + npm workspaces, with shared code in `packages/` and applications in `apps/`** — cross-package imports use workspace references, never relative paths across package boundaries.
   <!-- source: migrated(constitution.md §VII Monorepo Architecture) -->

   **Status**: enforced

8. **All changes pass automated CI/CD before deployment** — GitHub Actions on every PR and main-branch push, builds must pass, deploys to GitHub Pages happen automatically from main.
   <!-- source: migrated(constitution.md §VIII CI/CD & Automation) -->

   **Status**: enforced

9. **Tracked source and generated build artifacts stay strictly separated** — a repository-root build command must never rewrite tracked source, and running it twice produces no additional diff.
   <!-- source: migrated(constitution.md §IX Source and Build Artifact Separation) -->

   **Status**: enforced

10. **Components are organized into `components/`, `pages/`, and `sections/`**, with PascalCase component names and camelCase `use`-prefixed hook names.
    <!-- source: migrated(constitution.md, Additional Standards: Component Organization) -->

    **Status**: adopting

11. **Every theme supports both light and dark mode** via the `.dark` class strategy with CSS variables.
    <!-- source: migrated(constitution.md, Additional Standards: Dark Mode Support) -->

    **Status**: adopting

12. **Page-level components are wrapped in an ErrorBoundary that logs to analytics**, with clear, actionable user-facing error messages.
    <!-- source: migrated(constitution.md, Additional Standards: Error Handling) -->

    **Status**: adopting

13. **Reviewed content snapshots that ship with the app may live in tracked source, but only refresh through explicit ingestion commands** (e.g. `sync:data`) — never as a side effect of a standard build.
    <!-- source: migrated(constitution.md, Additional Standards: Source Snapshots vs Artifacts) -->
    **Status**: adopting

## Deliberately not carried forward

DevSpark's constitution had its own governance ceremony (severity levels CRITICAL/HIGH/MEDIUM/RECOMMENDED, a formal semver amendment process, a quarterly review cycle, `/devspark.site-audit` compliance auditing). Bold's own governance is simpler by design — `enforced`/`adopting` status plus the waiver mechanism (`source/commands/WAIVERS.md`) — so this machinery wasn't ported. The original severity level for each principle is preserved in `bold-docs/system/coding-standards.md` for reference, not reproduced as active process here.
