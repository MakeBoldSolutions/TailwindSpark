# Coding Standards

> **TL;DR for the Product Owner**
> _What_: The full detail behind each backbone principle — sub-rules, evidence in the codebase, and the reasoning.
> _Why_: `backbone.md` states the rule tersely; this is where the "why" and the specifics live.
> _Status_: Migrated from DevSpark's constitution.md, current as of migration.
> _Decision needed_: none.

Each section corresponds to the same-numbered principle in `bold-docs/backbone.md`. Original DevSpark severity levels (CRITICAL/HIGH/MEDIUM/RECOMMENDED) are preserved here for reference — Bold itself doesn't use this scale, see backbone.md's "Deliberately not carried forward."

## 1. Type Safety

- All packages must have `strict: true` in tsconfig.json (CRITICAL)
- All React components must use TypeScript interfaces for props (CRITICAL)
- Components must use the `React.FC` pattern for functional components (CRITICAL)
- Explicit return types must be provided for all exported functions (HIGH)
- TypeScript-aware lint warnings such as `no-explicit-any` must be justified in comments (MEDIUM)

**Evidence**: `apps/demo-app/tsconfig.app.json` has strict mode enabled; all components follow the interface pattern (e.g. `ButtonProps`, `CardProps`).

**Rationale**: Type safety prevents runtime errors, improves developer experience, and serves as living documentation for this educational showcase project.

## 2. Testing Standards

- All code must have Vitest tests in co-located `*.test.tsx`/`*.test.ts` files (CRITICAL)
- Minimum 40% coverage required for statements, branches, functions, and lines (CRITICAL)
- Test files must be co-located with source files, not in separate directories (HIGH)
- Coverage reports must be generated in CI/CD (HIGH)
- Tests must use `@testing-library/react` for component testing (HIGH)

**Evidence**: All 13 test files use the `.test.tsx` suffix; `vitest.config.ts` workspace configuration.

**Rationale**: A 40% enforced baseline preserves a mandatory quality gate during the current migration phase while remaining achievable across legacy and newly migrated surfaces. The threshold may be raised in a future amendment once broader coverage improvements are completed.

## 3. Design System & Semantic Tokens

- All components must use semantic design tokens from `packages/design-tokens` (CRITICAL)
- Raw Tailwind color classes (e.g. `bg-blue-600`, `text-gray-900`) are forbidden (CRITICAL)
- Custom lint rule `no-raw-primary-class` must pass; violations are blocking errors (CRITICAL)
- Dark mode must be implemented using the `.dark` class strategy with CSS variables (CRITICAL)
- All colors must use semantic names: `brand`, `surface`, `text`, `success`, `warning`, `error` (HIGH)
- Tailwind CSS 4.1's `@theme` directive must be used for token definitions (HIGH)

**Evidence**: `packages/design-tokens/theme.css` contains centralized `@theme` definitions; `.oxlintrc.json` loads `eslint-rules/no-raw-primary-class.js` as an Oxlint JS plugin to enforce semantic usage.

**Rationale**: Semantic tokens enable consistent theming, dark mode support, and demonstrate modern design system practices crucial for this educational resource.

## 4. Accessibility Standards

- All components must meet WCAG AA standards (CRITICAL)
- Oxlint jsx-a11y-compatible rules are blocking errors, with documented false-positive exclusions in `.oxlintrc.json` (CRITICAL)
- Interactive elements must have appropriate ARIA attributes (CRITICAL)
- Keyboard navigation must be supported for all interactive components (HIGH)
- Color contrast ratios must meet WCAG AA minimums (4.5:1 text, 3:1 UI) (HIGH)
- Semantic HTML elements must be used where applicable (HIGH)

**Evidence**: `.oxlintrc.json` enables the `jsx-a11y` plugin; extensive ARIA usage in `Modal.tsx` and `DashboardLayout.tsx`.

**Rationale**: Accessibility is non-negotiable — TailwindSpark serves as an educational example and must demonstrate inclusive design practices.

## 5. Documentation Standards

- All exported components must have JSDoc comments with description (CRITICAL)
- All exported functions must document `@param` and `@returns` (CRITICAL)
- Complex logic must include inline comments explaining "why", not "what" (HIGH)
- Public API changes must be documented in component JSDoc (HIGH)
- README files must be kept current with feature additions (MEDIUM)

**Evidence**: `.github/copilot-instructions.md` establishes documentation standards.

**Known gap at migration time**: JSDoc coverage was ~5% (4 of 74 files) against a 100%-of-exports target — see `implementation-gaps.md`.

**Rationale**: As an educational showcase, TailwindSpark must serve as self-documenting example code.

## 6. Code Quality & Formatting

- All code must pass Oxlint (including custom rules) and be Prettier-formatted per project config (CRITICAL)
- Oxlint errors are blocking errors in CI/CD (CRITICAL)
- Prettier configuration must not be overridden per-file (HIGH)
- Pre-commit hooks should run linting and formatting (RECOMMENDED)
- `console.log` is discouraged in favor of `console.warn`/`console.error` (MEDIUM)
- Dead code is deleted, never commented out; entire unused files are deleted (CRITICAL/HIGH)
- Version control is the archive for removed code — don't preserve dead code "for reference" (HIGH)

**Evidence**: `.prettierrc` (single quotes, 100 char width, Tailwind plugin); `.oxlintrc.json`.

**Rationale**: Consistent formatting and linting reduce cognitive load and eliminate style debates. Commented-out code creates confusion about intent and degrades readability — git history already preserves every prior implementation.

## 7. Monorepo Architecture

- Turborepo must be used for build orchestration (CRITICAL)
- npm workspaces must manage package dependencies (CRITICAL)
- Shared code lives in `packages/`, applications in `apps/` (CRITICAL)
- Packages must be independently buildable and testable (HIGH)
- Cross-package imports use workspace references, never relative paths (HIGH)
- Breaking changes in shared packages are documented in CHANGELOG.md (MEDIUM)

**Evidence**: `package.json` workspaces (`packages/*`, `apps/*`); `turbo.json` pipeline; `packages/design-tokens/`, `packages/ui-components/`.

**Rationale**: Monorepo structure enables code sharing, consistent tooling, and efficient builds while demonstrating modern scalable architecture.

## 8. CI/CD & Automation

- GitHub Actions run on all PRs and main-branch pushes; all builds must pass before merge (CRITICAL)
- Standard build commands must not modify tracked source files or documentation (CRITICAL)
- Build outputs go only to ignored artifact directories (`dist/`, `coverage/`, tool caches) (CRITICAL)
- Deployment metadata generated at build/release time goes into artifact directories, never tracked source (CRITICAL)
- Data refresh/snapshot ingestion are explicit commands, separate from normal build (HIGH)
- `npm audit` runs in CI/CD (HIGH); Lighthouse CI should run for performance (RECOMMENDED)
- Automated deploys to GitHub Pages on main-branch updates (HIGH)

**Evidence**: `.github/workflows/deploy.yml`, `.github/workflows/security.yml`.

**Rationale**: Automated quality gates ensure reliability and demonstrate modern DevOps practices.

## 9. Source and Build Artifact Separation

- Tracked source (`src/`, `public/`, root manifests) must not be rewritten by `npm run build`/`turbo run build`/build hooks (CRITICAL)
- Generated files needed only for deployment/preview/analysis/coverage/packaging go into ignored output locations (CRITICAL)
- Root build commands must be repeatable — running twice with no source changes produces no additional tracked-file diff (CRITICAL)
- Explicit content-snapshot commands may update tracked source snapshots when intentionally treated as reviewed inputs, but must never be hidden behind normal build hooks (HIGH)
- Version bumps, changelog stamping, release metadata are explicit release actions, never implicit build side effects (HIGH)
- Build-analysis reports are opt-in, never generated by default during standard builds (HIGH)

**Evidence**: root `package.json` keeps `build` separate from `version:bump`; `apps/demo-app/package.json` keeps `sync:data` separate from `build`; `scripts/generate-meta.ts` writes deployment metadata directly into `dist/`.

**Rationale**: Reproducible builds keep git history meaningful, prevent accidental source churn, and make CI/CD outputs clearly distinguishable from maintained source.

## 10. Component Organization

Components are organized into three categories:

- `components/` — reusable UI components used across multiple pages
- `pages/` — route-specific page components
- `sections/` — feature-specific sections within pages

Naming: components use PascalCase (`ButtonShowcase.tsx`); hooks use camelCase starting with `use` (`useAnalytics.ts`); pages may use kebab-case or PascalCase, consistently within each application.

## 11. Dark Mode Support

- All themes must support both light and dark modes (CRITICAL)
- Dark mode uses the `.dark` class strategy with CSS variables (CRITICAL)
- Color tokens have light and dark variants defined in `theme.css` (HIGH)

## 12. Error Handling

- Page-level components should be wrapped in `ErrorBoundary` (RECOMMENDED)
- Error boundaries must log errors to analytics when available (HIGH)
- User-facing error messages must be clear and actionable (MEDIUM)

## 13. Source Snapshots vs Artifacts

- Reviewed content snapshots that ship with the app may live in tracked source locations when treated as canonical runtime-fallback inputs
- Such snapshots refresh only through explicit ingestion commands (e.g. `sync:data`), never standard build hooks
- Pure deployment artifacts (generated `robots.txt`, `sitemap.xml`, bundle analysis, packaged outputs, coverage reports) must not be committed as maintained source without an explicit archival reason
