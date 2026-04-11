<!--
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSTITUTION SYNC IMPACT REPORT                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Version Change: 2.1.0 → 2.2.0 (Source/artifact separation policy)          │
│ Ratified: 2026-03-01                                                        │
│ Last Amended: 2026-04-11                                                    │
│                                                                             │
│ PRINCIPLES FORMALIZED:                                                      │
│   ✓ I. Type Safety (MANDATORY)                                             │
│   ✓ II. Testing Standards (MANDATORY)                                      │
│   ✓ III. Design System & Semantic Tokens (MANDATORY)                       │
│   ✓ IV. Accessibility Standards (MANDATORY)                                │
│   ✓ V. Documentation Standards (MANDATORY)                                 │
│   ✓ VI. Code Quality & Formatting (MANDATORY)                              │
│   ✓ VII. Monorepo Architecture (MANDATORY)                                 │
│   ✓ VIII. CI/CD & Automation (MANDATORY)                                   │
│                                                                             │
│ SECTIONS ADDED:                                                             │
│   ✓ Additional Standards (component organization, dark mode, errors)       │
│   ✓ Source and Build Artifact Separation policy                            │
│   ✓ Implementation Gaps (critical TODOs)                                   │
│   ✓ Governance (authority, amendments, review cycle, compliance)           │
│                                                                             │
│ TEMPLATES REQUIRING VALIDATION:                                             │
│   ✅ plan-template.md - Contains "Constitution Check" section (verified)   │
│   ✅ spec-template.md - No constitution-specific content (verified)        │
│   ✅ tasks-template.md - No verification needed                            │
│   ✅ checklist-template.md - No verification needed                        │
│                                                                             │
│ IMPLEMENTATION ACTIONS REQUIRED:                                            │
│   ⚠ HIGH: Add JSDoc to all exports (~5% → 100% coverage)                  │
│   ✓ Coverage thresholds formalized in Vitest config (40% minimum)         │
│   ⚠ MEDIUM: Evaluate Zod for input validation                             │
│   ⚠ MEDIUM: Consider structured logging for production                    │
│                                                                             │
│ FOLLOW-UP ACTIONS:                                                          │
│   → Run /devspark.site-audit to validate compliance                        │
│   → Reassess whether the 40% baseline should be raised in a future amendment│
│   → Create JSDoc documentation plan for packages/ui-components             │
│   → Schedule quarterly constitution review (2026-06-01)                    │
│                                                                             │
│ SOURCE: Generated from codebase analysis of 74 TypeScript files            │
│ METHOD: /devspark.discover-constitution (8 interactive questions)          │
└─────────────────────────────────────────────────────────────────────────────┘
-->

# TailwindSpark Constitution

## Core Principles

### I. Type Safety (MANDATORY)

All code must use TypeScript in strict mode with comprehensive type coverage.

- All packages **MUST** have `strict: true` in tsconfig.json (CRITICAL)
- All React components **MUST** use TypeScript interfaces for props (CRITICAL)
- Components **MUST** use the React.FC pattern for functional components (CRITICAL)
- Explicit return types **MUST** be provided for all exported functions (HIGH)
- `@typescript-eslint/no-explicit-any` violations are **warnings**; justify usage in comments (MEDIUM)

**Evidence**: `apps/demo-app/tsconfig.app.json` has strict mode enabled; all components follow interface pattern (e.g., `ButtonProps`, `CardProps`)

**Rationale**: Type safety prevents runtime errors, improves developer experience, and serves as living documentation for this educational showcase project.

### II. Testing Standards (MANDATORY)

All code must have comprehensive test coverage using Vitest with co-located test files.

- All code **MUST** have Vitest tests in co-located `*.test.tsx` or `*.test.ts` files (CRITICAL)
- Minimum **40% coverage** required for statements, branches, functions, and lines (CRITICAL)
- Test files **MUST** be co-located with source files, not in separate directories (HIGH)
- Coverage reports **MUST** be generated in CI/CD pipelines (HIGH)
- Tests **MUST** use `@testing-library/react` for component testing (HIGH)

**Evidence**: All 13 test files use `.test.tsx` suffix; `vitest.config.ts` workspace configuration; comprehensive test examples in `apps/demo-app/src/components/ErrorBoundary.test.tsx`

**Rationale**: A 40% enforced baseline preserves a mandatory quality gate during the current migration phase while remaining achievable across legacy and newly migrated surfaces. The threshold may be raised in a future amendment once broader coverage improvements are completed.

### III. Design System & Semantic Tokens (MANDATORY)

All UI components must use the centralized design system with semantic tokens; raw Tailwind utilities are forbidden.

- All components **MUST** use semantic design tokens from `packages/design-tokens` (CRITICAL)
- Raw Tailwind color classes (e.g., `bg-blue-600`, `text-gray-900`) are **forbidden** (CRITICAL)
- Custom ESLint rule `no-raw-primary-class` **MUST** pass; violations are blocking errors (CRITICAL)
- Dark mode **MUST** be implemented using `.dark` class strategy with CSS variables (CRITICAL)
- All colors **MUST** use semantic names: `brand`, `surface`, `text`, `success`, `warning`, `error` (HIGH)
- Tailwind CSS 4.1's `@theme` directive **MUST** be used for token definitions (HIGH)

**Evidence**: `packages/design-tokens/theme.css` contains centralized `@theme` definitions; `eslint-rules/no-raw-primary-class.js` enforces semantic usage; `packages/ui-components/src/components/Button.tsx` uses `bg-brand` not raw colors

**Rationale**: Semantic tokens enable consistent theming, dark mode support, and demonstrate modern design system practices crucial for this educational resource.

### IV. Accessibility Standards (MANDATORY)

All UI components must meet WCAG AA accessibility standards with proper ARIA attributes.

- All components **MUST** meet WCAG AA standards (CRITICAL)
- ESLint `jsx-a11y` plugin rules are **blocking errors** (CRITICAL)
- Interactive elements **MUST** have appropriate ARIA attributes (`aria-label`, `aria-disabled`, etc.) (CRITICAL)
- Keyboard navigation **MUST** be supported for all interactive components (HIGH)
- Color contrast ratios **MUST** meet WCAG AA minimums (4.5:1 for text, 3:1 for UI) (HIGH)
- Semantic HTML elements **MUST** be used where applicable (HIGH)

**Evidence**: `eslint.config.js` configures `jsx-a11y` plugin with error-level rules; extensive ARIA usage in `packages/ui-components/src/components/Modal.tsx` and `apps/demo-app/src/components/DashboardLayout.tsx`

**Rationale**: Accessibility is non-negotiable. TailwindSpark serves as an educational example and must demonstrate inclusive design practices.

### V. Documentation Standards (MANDATORY)

All exported components, functions, and types must have JSDoc documentation.

- All exported components **MUST** have JSDoc comments with description (CRITICAL)
- All exported functions **MUST** document `@param` and `@returns` (CRITICAL)
- Complex logic **MUST** include inline comments explaining "why", not "what" (HIGH)
- Public API changes **MUST** be documented in component JSDoc (HIGH)
- README files **MUST** be kept current with feature additions (MEDIUM)

**Evidence**: `.github/copilot-instructions.md` establishes documentation standards

**Implementation Gap**: Current JSDoc coverage is ~5%; needs to reach 100% of exports

**Rationale**: As an educational showcase, TailwindSpark must serve as self-documenting example code. JSDoc provides IntelliSense and guides developers learning from this project.

### VI. Code Quality & Formatting (MANDATORY)

All code must pass ESLint and Prettier checks with zero errors.

- All code **MUST** pass ESLint checks, including custom rules (CRITICAL)
- All code **MUST** be formatted with Prettier using project configuration (CRITICAL)
- ESLint violations are **blocking errors** in CI/CD (CRITICAL)
- Prettier configuration **MUST NOT** be overridden per-file (HIGH)
- Pre-commit hooks **SHOULD** run linting and formatting (RECOMMENDED)
- Code **MUST** use `console.warn` or `console.error`; `console.log` is discouraged (MEDIUM)
- Dead code **MUST** be deleted, never commented out (CRITICAL)
- Commented-out code blocks **MUST NOT** be committed to the repository (CRITICAL)
- Unused exports, functions, types, interfaces, and constants **MUST** be removed promptly (HIGH)
- Entire files with no active imports **MUST** be deleted (HIGH)
- Version control (git) serves as the archive for removed code — do not preserve dead code "for reference" (HIGH)

**Evidence**: `.prettierrc` defines single quotes, 100 char width, Tailwind plugin; `eslint.config.js` has comprehensive rules including TypeScript, accessibility, and custom `no-raw-primary-class` rule

**Rationale**: Consistent formatting and linting reduces cognitive load, eliminates style debates, and ensures code quality across contributors. Commented-out code creates confusion about intent, inflates bundle analysis, and degrades readability. Git history preserves all prior implementations — the codebase itself must reflect only what is actively used.

### VII. Monorepo Architecture (MANDATORY)

All code must follow the established monorepo structure with clear package boundaries.

- Turborepo **MUST** be used for build orchestration (CRITICAL)
- npm workspaces **MUST** manage package dependencies (CRITICAL)
- Shared code **MUST** reside in `packages/` directory (CRITICAL)
- Applications **MUST** reside in `apps/` directory (CRITICAL)
- Packages **MUST** be independently buildable and testable (HIGH)
- Cross-package imports **MUST** use workspace references, not relative paths (HIGH)
- Breaking changes in shared packages **MUST** be documented in CHANGELOG.md (MEDIUM)

**Evidence**: `package.json` defines npm workspaces with `packages/*` and `apps/*`; `turbo.json` configures Turborepo pipeline; `packages/design-tokens/` and `packages/ui-components/` are shared libraries

**Rationale**: Monorepo structure enables code sharing, consistent tooling, and efficient builds while demonstrating modern scalable architecture patterns.

### VIII. CI/CD & Automation (MANDATORY)

All changes must pass automated CI/CD checks before deployment.

- GitHub Actions **MUST** run on all pull requests and main branch pushes (CRITICAL)
- All builds **MUST** pass before merging (CRITICAL)
- Standard build commands **MUST NOT** modify tracked source files or documentation (CRITICAL)
- Build outputs **MUST** be written only to ignored artifact directories such as `dist/`, `coverage/`, or tool-specific caches (CRITICAL)
- Deployment metadata generated during build or release **MUST** be written into artifact directories, never into tracked source trees such as `public/` or `src/` (CRITICAL)
- Data refresh and snapshot ingestion **MUST** be explicit commands separate from normal build commands (HIGH)
- Security audits (`npm audit`) **MUST** run in CI/CD (HIGH)
- Lighthouse CI **SHOULD** run for performance validation (RECOMMENDED)
- Automated deployments to GitHub Pages **MUST** occur on main branch updates (HIGH)

**Evidence**: `.github/workflows/deploy.yml` automates build and deployment; `.github/workflows/security.yml` runs security audits; `.github/workflows/lighthouse-ci.yml` monitors performance

**Rationale**: Automated quality gates ensure reliability and demonstrate modern DevOps practices for this showcase project.

### IX. Source and Build Artifact Separation (MANDATORY)

Tracked source and generated artifacts must remain strictly separated.

- Files under tracked source locations such as `src/`, `public/`, `.documentation/`, and repository-root manifests **MUST NOT** be rewritten by `npm run build`, `turbo run build`, or package-level build hooks (CRITICAL)
- Generated files needed only for deployment, preview, analysis, coverage, or packaging **MUST** be emitted into ignored output locations and regenerated as needed (CRITICAL)
- Repository-root build commands **MUST** be repeatable: running them twice in a row with no source changes **MUST** produce no additional tracked-file diffs (CRITICAL)
- Explicit content snapshot commands **MAY** update tracked source snapshots when those snapshots are intentionally treated as reviewed source inputs, but those commands **MUST NOT** be hidden behind normal build hooks (HIGH)
- Version bumps, changelog stamping, and release metadata updates **MUST** be explicit release actions, not implicit side effects of build commands (HIGH)
- Build-analysis reports **MUST** be opt-in and must not be generated by default during standard builds (HIGH)

**Evidence**: Root `package.json` now keeps `build` separate from `version:bump`; `apps/demo-app/package.json` keeps `sync:data` separate from `build`; `scripts/generate-meta.ts` writes deployment metadata directly into `dist/`.

**Rationale**: Reproducible builds keep git history meaningful, prevent accidental source churn, and make CI/CD outputs clearly distinguishable from maintained source.

## Additional Standards

### Component Organization

Components must be organized into three clear categories:

- `components/` - Reusable UI components used across multiple pages
- `pages/` - Route-specific page components
- `sections/` - Feature-specific sections within pages

File naming conventions:

- Components **MUST** use PascalCase (e.g., `ButtonShowcase.tsx`)
- Hooks **MUST** use camelCase starting with "use" (e.g., `useAnalytics.ts`)
- Pages **MAY** use kebab-case or PascalCase consistently within each application

### Dark Mode Support

- All themes **MUST** support both light and dark modes (CRITICAL)
- Dark mode **MUST** use `.dark` class strategy with CSS variables (CRITICAL)
- Color tokens **MUST** have light and dark variants defined in theme.css (HIGH)

### Error Handling

- Page-level components **SHOULD** be wrapped in ErrorBoundary (RECOMMENDED)
- Error boundaries **MUST** log errors to analytics when available (HIGH)
- User-facing error messages **MUST** be clear and actionable (MEDIUM)

### Source Snapshots vs Artifacts

- Reviewed content snapshots that ship with the app **MAY** live in tracked source locations when they are treated as canonical inputs for runtime fallback behavior
- Such snapshots **MUST** be refreshed only through explicit ingestion commands such as `sync:data`, never by standard build hooks
- Pure deployment artifacts such as generated `robots.txt`, `sitemap.xml`, bundle analysis reports, packaged outputs, and coverage reports **MUST NOT** be committed as maintained source unless there is an explicit archival reason

## Implementation Gaps

The following areas currently lack established patterns and require implementation to achieve full constitution compliance:

### Critical Gaps (Must Implement)

1. **JSDoc Documentation Coverage** (Principle V violation)
   - **Current**: ~5% of files have JSDoc (4 out of 74)
   - **Required**: 100% of exported components, functions, and types
   - **Action**: Add JSDoc to all exports in `packages/ui-components/src/` and `apps/demo-app/src/`
   - **Priority**: HIGH

2. **Coverage Threshold Maturity** (Principle II follow-up)
   - **Current**: 40% minimum coverage is formally enforced in Vitest configuration
   - **Required**: Maintain at least 40% minimum coverage (statements, branches, functions, lines)
   - **Action**: Re-evaluate the threshold in a future amendment after legacy coverage expands
   - **Priority**: MEDIUM

### Recommended Improvements

1. **Input Validation Library**
   - **Gap**: No Zod, Yup, or similar validation library detected
   - **Recommendation**: Add Zod for runtime type validation and form schemas
   - **Priority**: MEDIUM

2. **Structured Logging**
   - **Gap**: Using plain console.warn/error methods
   - **Recommendation**: Implement structured logging for production environments
   - **Priority**: MEDIUM

3. **API Mocking for Integration Tests**
   - **Gap**: No MSW or similar mocking tool found
   - **Recommendation**: Add Mock Service Worker (MSW) for API integration testing
   - **Priority**: LOW

4. **Import Order Enforcement**
   - **Gap**: No enforced import sorting standard
   - **Recommendation**: Add ESLint import sorting plugin (e.g., `eslint-plugin-import`)
   - **Priority**: LOW

## Governance

### Constitution Authority

This constitution supersedes all informal coding practices, verbal agreements, and individual preferences. All code contributions, reviews, and architectural decisions must align with these principles.

### Severity Levels

- **CRITICAL**: Blocking - pull requests cannot merge with violations
- **HIGH**: Requires explicit justification and team discussion before proceeding
- **MEDIUM**: Should be fixed but not blocking; track as technical debt
- **RECOMMENDED**: Best practice guidance; encouraged but not enforced

### Amendment Process

Constitution amendments require:

1. **Proposal**: Document the proposed change with rationale and impact analysis
2. **Discussion**: Team reviews and reaches consensus on the change
3. **Migration Plan**: For breaking changes, create implementation plan for existing code
4. **Version Increment**: Update version following semantic versioning:
   - **MAJOR**: Backward-incompatible governance changes or principle removals/redefinitions
   - **MINOR**: New principles added or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes

Minor clarifications may be made by project maintainers; major principle changes require team approval.

### Review Cycle

- Constitution **MUST** be reviewed quarterly to ensure alignment with project evolution
- After major architecture changes, constitution **MUST** be audited for conflicts
- New contributors **MUST** review constitution during onboarding

### Compliance Auditing

- Run `/devspark.site-audit` to check codebase compliance with constitution
- Audit reports **SHOULD** be generated before major releases
- Violations discovered in audits **MUST** be tracked as technical debt
- All pull requests **MUST** verify compliance with constitution principles

**Version**: 2.2.0 | **Ratified**: 2026-03-01 | **Last Amended**: 2026-04-11
