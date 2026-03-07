# Feature Specification: Critical Audit Compliance Fixes

**Feature Branch**: `002-audit-criticals`  
**Created**: 2026-03-02  
**Status**: Draft  
**Input**: User description: "Address critical items from Site Audit: 47 violations including raw color classes, missing JSDoc, and coverage threshold enforcement"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Design Token Compliance in Utility Components (Priority: P1)

**As a** developer or site visitor  
**I want** the BundleAnalyzer and EcommerceLayout components to use semantic design tokens  
**So that** dark mode works correctly and the design system is consistent across all components

**Why this priority**: This is the most critical violation affecting 45 instances across 2 files (43 in BundleAnalyzer.tsx, 2 in EcommerceLayout.tsx). These raw color violations break dark mode functionality and directly violate Constitution Principle III (CRITICAL severity). While these are utility/layout components (not primary user-facing features), they must still comply with the design system to maintain visual consistency.

**Independent Test**: Can be fully tested by running ESLint `no-raw-primary-class` rule on the two affected files, manually toggling dark mode while viewing pages that use these components, and verifying zero violations. Delivers immediate value through restored dark mode support and design system consistency in these components.

**Acceptance Scenarios**:

1. **Given** a developer runs ESLint on BundleAnalyzer.tsx, **When** the `no-raw-primary-class` rule executes, **Then** zero violations are reported (currently 43 violations)
2. **Given** a user toggles dark mode on a page using EcommerceLayout, **When** they view the navigation and footer, **Then** all colors adapt correctly using semantic tokens (currently 2 bg-gray violations)
3. **Given** a developer inspects BundleAnalyzer.tsx code, **When** they review className attributes, **Then** all color classes use semantic tokens (`bg-brand`, `text-surface`, `bg-data-viz-*`) instead of raw values (`bg-purple-600`, `text-gray-900`)
4. **Given** the codebase has semantic tokens defined, **When** BundleAnalyzer renders charts/visualizations, **Then** data visualization colors use the 8 data-viz tokens from the design system

---

### User Story 2 - Main Application Component Documentation (Priority: P2)

**As a** developer (new contributor or existing maintainer)  
**I want** the main App components to have comprehensive JSDoc documentation  
**So that** I can understand their purpose, props, and usage through IDE IntelliSense without reading implementations

**Why this priority**: While only 2 JSDoc violations exist (App.tsx:158 and App-clean.tsx:3), these are the **main entry point components** for the application. Missing documentation on critical entry points severely degrades developer experience and violates Constitution Principle V (CRITICAL severity for exported components). With 99% of other components now documented (post-PR #90), these 2 files are the last blockers to achieving 100% JSDoc coverage.

**Independent Test**: Can be tested by hovering over the App and App-clean component imports in VS Code, verifying comprehensive JSDoc appears in IntelliSense tooltips, and confirming ESLint `require-jsdoc` rule passes. Delivers value through improved developer onboarding and consistent documentation standards.

**Acceptance Scenarios**:

1. **Given** a developer imports the App component from App.tsx, **When** they hover over the import in VS Code, **Then** they see comprehensive JSDoc with component description, purpose, and usage guidance
2. **Given** a developer opens App-clean.tsx, **When** they view line 3 (component definition), **Then** a JSDoc comment block exists above the component with `@component` tag and description
3. **Given** ESLint runs with `require-jsdoc` rule enabled, **When** it scans App.tsx and App-clean.tsx, **Then** zero JSDoc violations are reported
4. **Given** the project enforces documentation standards, **When** all files are checked, **Then** JSDoc coverage reaches 100% for all exported components

---

### User Story 3 - Test Coverage Enforcement (Priority: P3)

**As a** developer or CI/CD system  
**I want** test coverage thresholds automatically enforced during test runs  
**So that** code quality standards are maintained and coverage never drops below constitutional requirements

**Why this priority**: While 533 tests pass of 577 total (92.4% pass rate - excellent test infrastructure), coverage thresholds are **not enforced** in vitest.config.ts, violating Constitution Principle II (MANDATORY - 80% minimum coverage). This is lower priority than the other fixes because the test infrastructure and actual tests exist; only the enforcement mechanism is missing. However, it's still CRITICAL to constitutional compliance.

**Independent Test**: Can be tested by running `npm test -- --coverage` and verifying that builds fail if coverage drops below 80% for any metric (statements, branches, functions, lines). Also verify that coverage reports are generated correctly. Delivers value through automated quality gates and prevention of coverage regression.

**Acceptance Scenarios**:

1. **Given** vitest.config.ts has coverage thresholds configured, **When** `npm test -- --coverage` runs, **Then** the build enforces 80% minimum for statements, branches, functions, and lines
2. **Given** a developer runs tests with coverage, **When** coverage falls below 80% for any metric, **Then** the test command exits with error code 1 and displays which threshold(s) failed
3. **Given** the CI/CD pipeline runs, **When** tests execute in GitHub Actions, **Then** coverage thresholds are checked and PRs cannot merge if coverage is insufficient
4. **Given** coverage meets all thresholds, **When** tests complete successfully, **Then** coverage reports are generated in lcov, json, html, and text formats

---

### Edge Cases

- What happens when new components are added without semantic tokens? → ESLint `no-raw-primary-class` rule catches violations before commit
- How does the system handle JSDoc updates to existing components? → ESLint `require-jsdoc` validates completeness on every run
- What if coverage temporarily drops during refactoring? → Enforcement thresholds provide clear feedback; developer must add tests or adjust thresholds with justification
- How are legitimate raw color uses handled (e.g., in color picker demonstrations)? → Use `eslint-disable` comments with justification (already present in some files with `// eslint-disable-line no-raw-primary-class/no-raw-primary-class`)
- What if a developer doesn't know which semantic token to use? → Refer to `.documentation/copilot/session=2026-03-01/semantic-color-migration.md` guide

## Requirements *(mandatory)*

### Functional Requirements

#### User Story 1 Requirements (Design Tokens)

- **FR-001**: BundleAnalyzer.tsx MUST replace all 43 raw color class instances with semantic design tokens
- **FR-002**: EcommerceLayout.tsx MUST replace all 2 raw color class instances with semantic design tokens  
- **FR-003**: All purple color uses (bg-purple-600, text-purple-800, etc.) MUST map to appropriate semantic tokens (bg-brand, text-brand, or bg-data-viz-5)
- **FR-004**: All gray background/text uses (bg-gray-50, text-gray-900, dark:bg-gray-800, etc.) MUST map to semantic surface/text tokens
- **FR-005**: Data visualization colors in BundleAnalyzer MUST use the 8 data-viz tokens (bg-data-viz-1 through bg-data-viz-8)
- **FR-006**: ESLint `no-raw-primary-class` rule MUST pass with zero violations in both files
- **FR-007**: Dark mode MUST function correctly in all states (light/dark) with no visual breaks or hard-coded colors

#### User Story 2 Requirements (JSDoc)

- **FR-008**: App.tsx (line 158) MUST have a JSDoc comment block above the component definition
- **FR-009**: App-clean.tsx (line 3) MUST have a JSDoc comment block above the component definition
- **FR-010**: JSDoc comments MUST include: (1) @component tag, (2) description (minimum 1 sentence explaining purpose), (3) @returns with type description, (4) @example demonstrating basic usage
- **FR-011**: JSDoc comments MUST follow the established style guide in `.documentation/copilot/session=2026-03-01/jsdoc-style-guide.md`
- **FR-012**: ESLint `require-jsdoc` rule MUST pass with zero violations across entire codebase

#### User Story 3 Requirements (Coverage)

- **FR-013**: vitest.config.ts MUST define coverage thresholds with 80% minimum for statements
- **FR-014**: vitest.config.ts MUST define coverage thresholds with 80% minimum for branches
- **FR-015**: vitest.config.ts MUST define coverage thresholds with 80% minimum for functions
- **FR-016**: vitest.config.ts MUST define coverage thresholds with 80% minimum for lines
- **FR-017**: Test runs with `--coverage` flag MUST fail if any threshold is not met
- **FR-018**: Coverage reports MUST be generated in multiple formats (lcov, json, html, text)

### Key Entities *(N/A - Code quality fixes, no new data entities)*

This feature involves code quality fixes and does not introduce new data entities. It modifies:
- Existing component files (BundleAnalyzer.tsx, EcommerceLayout.tsx)
- Existing component files (App.tsx, App-clean.tsx)  
- Existing configuration file (vitest.config.ts)

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### Overall Compliance

- **SC-001**: Constitutional compliance score increases from 73% to 100% (all 8 principles fully compliant)
- **SC-002**: Total critical violations decrease from 47 to 0 (100% reduction)
- **SC-003**: ESLint runs successfully with zero errors across entire codebase

#### User Story 1 Success Criteria (Design Tokens)

- **SC-004**: ESLint `no-raw-primary-class` rule reports zero violations in BundleAnalyzer.tsx (down from 43)
- **SC-005**: ESLint `no-raw-primary-class` rule reports zero violations in EcommerceLayout.tsx (down from 2)
- **SC-006**: Raw color violations codebase-wide decrease from 45 to 0 (100% reduction for critical files)
- **SC-007**: Manual dark mode testing on all pages using BundleAnalyzer/EcommerceLayout shows zero visual breaks

#### User Story 2 Success Criteria (JSDoc)

- **SC-008**: ESLint `require-jsdoc` rule reports zero violations across entire codebase
- **SC-009**: JSDoc coverage reaches 100% for all exported components (up from 99.99%)
- **SC-010**: IntelliSense displays JSDoc tooltips with @component, description, @returns, and @example tags for App and App-clean components in VS Code

#### User Story 3 Success Criteria (Coverage)

- **SC-012**: Running `npm test -- --coverage` with coverage below 80% results in exit code 1 (test failure)
- **SC-013**: Running `npm test -- --coverage` with coverage above 80% results in exit code 0 (success)  
- **SC-014**: Coverage reports are generated successfully in all configured formats (lcov, json, html, text)
- **SC-015**: GitHub Actions workflows automatically enforce coverage thresholds via vitest.config.ts (no workflow modifications needed - existing `npm test` commands will respect thresholds)
- **SC-016**: Manual test: Temporarily reduce test coverage below threshold and verify build fails with clear error message

### Quality & Timeline Criteria

- **SC-017**: All fixes complete in under 2 hours total development time with zero regressions (all 533 passing tests of 577 total continue to pass) and documentation updated to reflect 100% constitutional compliance
- **SC-018**: Next site audit (2026-03-09) shows 0 critical violations

## Constraints & Assumptions *(mandatory)*

### Constraints

- Changes MUST maintain backward compatibility (no breaking API changes)
- All existing tests MUST continue to pass
- Dark mode functionality MUST work in both light and dark themes
- Changes MUST be completed on the `002-audit-criticals` feature branch

### Assumptions

- The 8 data-viz semantic tokens already exist in `packages/design-tokens/theme.css` (confirmed by PR #90)
- ESLint `no-raw-primary-class` rule is already strengthened to catch all patterns (confirmed by PR #90)
- The semantic color migration guide exists and is current (`.documentation/copilot/session=2026-03-01/semantic-color-migration.md`)
- The JSDoc style guide exists and is current (`.documentation/copilot/session=2026-03-01/jsdoc-style-guide.md`)
- Current test pass rate of 92.4% (533 passing of 577 total tests) will be maintained or improved
- The 44 failing tests are unrelated to these fixes and do not need to be addressed in this feature

### Dependencies

- Existing design tokens package (`packages/design-tokens`)
- Existing ESLint configuration with custom rules (`eslint.config.js`, `eslint-rules/no-raw-primary-class.js`)
- Existing Vitest configuration (`vitest.config.ts`)
- Existing JSDoc style guide and semantic color migration guide (created in PR #90)

## Non-Goals (Out of Scope)

- Fixing the 727 raw color violations in other files (identified in audit but not critical)
- Fixing the 44 failing tests (92.4% → 100% pass rate improvement)
- Refactoring large page files (MarketingPage.tsx at 568 lines, EcommercePage.tsx at 501 lines)
- Adding JSDoc to utility files beyond the 2 critical main App components
- Increasing coverage beyond current levels (only enforcement, not test creation)
- Modifying GitHub Actions workflows for coverage enforcement (existing workflows already run `npm test` which will enforce thresholds via vitest.config.ts)
- Resolving the TODO comment in BuildInfo.tsx:22
- Addressing Dependabot alert #26
- Performance optimizations or feature additions
- UI/UX improvements

## Scope Boundary

**In Scope**:
- Exactly 2 files for color token fixes (BundleAnalyzer.tsx, EcommerceLayout.tsx)
- Exactly 2 files for JSDoc additions (App.tsx, App-clean.tsx)  
- Exactly 1 config file for coverage thresholds (vitest.config.ts)
- ESLint validation for all fixes
- Manual dark mode testing for color fixes
- Documentation updates to reflect 100% compliance

**Out of Scope**:
- All other audit recommendations (medium/low priority)
- New feature development
- Test assertion fixes (beyond scope of coverage enforcement)
- Bulk remediation of remaining color violations

## References

- **Audit Report**: `.documentation/copilot/audit/2026-03-02_results.md`
- **Constitution**: `.documentation/memory/constitution.md` (Version 1.0.0)
- **Previous Compliance Work**: PR #90 (1-constitution-compliance)
- **Semantic Color Guide**: `.documentation/copilot/session=2026-03-01/semantic-color-migration.md`
- **JSDoc Style Guide**: `.documentation/copilot/session=2026-03-01/jsdoc-style-guide.md`
- **Design Tokens**: `packages/design-tokens/theme.css`
- **ESLint Rule**: `eslint-rules/no-raw-primary-class.js`

---

**Estimated Development Time**: 1-2 hours
**Estimated Testing Time**: 30 minutes  
**Target Completion**: 2026-03-02 (same day as audit)
**Risk Level**: Low (isolated fixes, well-documented patterns, no architecture changes)
