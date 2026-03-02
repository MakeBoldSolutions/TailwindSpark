---
description: "Implementation tasks for Constitution Compliance Remediation"
---

# Tasks: Constitution Compliance Remediation

**Input**: Design documents from `.documentation/specs/1-constitution-compliance/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Feature Goal**: Remediate 86 constitution violations to improve compliance from 42% to 95%+

**Tests**: Test tasks are included in Phase 5 (User Story 3) as testing is a core requirement of this feature, not optional.

**Organization**: Tasks are grouped by user story (P1-P4) to enable independent implementation and testing of each priority area.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Implementation Strategy

**MVP Scope**: User Story 1 (Design System Compliance) alone delivers immediate visual value by restoring dark mode.

**Recommended Sequence**: P1 → P2 → P3 → P4 (priority order) OR parallelize US1+US4, then US2+US3

**Total Tasks**: 121 tasks across 7 phases

**Estimated Effort**: 54-76 hours (1.5-2 sprint cycles for single developer, 1 week for team of 2)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Install dependencies and configure tooling for constitution compliance work

- [ ] T001 Verify current branch is `1-constitution-compliance` and clean working directory
- [ ] T002 Install eslint-plugin-jsdoc as dev dependency in workspace root
- [ ] T003 [P] Review current design tokens in packages/design-tokens/theme.css
- [ ] T004 [P] Review existing ESLint rule in eslint-rules/no-raw-primary-class.js
- [ ] T005 [P] Review constitutional requirements in .documentation/memory/constitution.md

**Checkpoint**: Development environment ready, dependencies installed

---

## Phase 2: Foundational (Tooling & Configuration)

**Purpose**: Configure ESLint, Vitest, and tooling infrastructure that all user stories depend on

**⚠️ CRITICAL**: These configurations must be in place before starting user story implementation

- [ ] T006 Configure eslint-plugin-jsdoc rules in eslint.config.js for JSDoc enforcement
- [ ] T007 Configure no-console ESLint rule to warn on console.log, allow info/warn/error in eslint.config.js
- [ ] T008 [P] Create JSDoc style guide document in .documentation/copilot/session=2026-03-01/jsdoc-style-guide.md
- [ ] T009 [P] Create semantic color migration guide in .documentation/copilot/session=2026-03-01/semantic-color-migration.md
- [ ] T010 [P] Create testing implementation guide in .documentation/copilot/session=2026-03-01/testing-implementation.md

**Checkpoint**: Foundation ready - user story implementation can begin in parallel

---

## Phase 3: User Story 1 - Design System Color Compliance (Priority: P1) 🎯 MVP

**Goal**: Replace 50+ raw Tailwind color classes with semantic design tokens to restore dark mode and design system consistency

**Independent Test**: Run ESLint `no-raw-primary-class` rule (zero violations), manually toggle dark mode on all pages (no visual breaks), verify semantic tokens used

### Step 3A: Create Data Visualization Color Palette

- [ ] T011 [US1] Add 8 data-viz semantic color tokens to packages/design-tokens/theme.css
- [ ] T012 [US1] Update TypeScript definitions in packages/design-tokens/index.d.ts with data-viz token types
- [ ] T013 [US1] Verify design tokens package builds successfully without errors

### Step 3B: Fix AnimationShowcase.tsx (13 violations)

- [ ] T014 [US1] Replace raw blue/green colors (lines 46, 128-129) in apps/demo-app/src/sections/AnimationShowcase.tsx
- [ ] T015 [US1] Replace raw purple/red colors (lines 141, 155) in apps/demo-app/src/sections/AnimationShowcase.tsx
- [ ] T016 [US1] Replace raw gray colors and hover states (lines 188-189, 211, 296) in apps/demo-app/src/sections/AnimationShowcase.tsx
- [ ] T017 [US1] Test AnimationShowcase dark mode toggle - verify all animations work correctly

### Step 3C: Fix AnalyticsPage.tsx (37+ violations)

- [ ] T018 [US1] Replace traffic source data viz colors (lines 100-105) in apps/demo-app/src/pages/AnalyticsPage.tsx
- [ ] T019 [US1] Replace trend indicator colors (line 23) in apps/demo-app/src/pages/AnalyticsPage.tsx
- [ ] T020 [US1] Replace chart legend colors (lines 160, 164) in apps/demo-app/src/pages/AnalyticsPage.tsx
- [ ] T021 [US1] Replace bar chart colors with hover states (lines 187, 190) in apps/demo-app/src/pages/AnalyticsPage.tsx
- [ ] T022 [US1] Replace surface/background colors (lines 153, 155) in apps/demo-app/src/pages/AnalyticsPage.tsx
- [ ] T023 [US1] Replace active user count color (line 211) in apps/demo-app/src/pages/AnalyticsPage.tsx
- [ ] T024 [US1] Test AnalyticsPage dark mode - verify all charts and graphs render correctly

### Step 3D: Audit and Fix Remaining Files

- [ ] T025 [US1] Run ESLint across all apps/ and packages/ to identify remaining violations
- [ ] T026 [P] [US1] Audit MarketingPage.tsx (553 lines) for raw color usage in apps/demo-app/src/pages/MarketingPage.tsx
- [ ] T027 [P] [US1] Fix any raw color violations found in MarketingPage.tsx
- [ ] T028 [P] [US1] Audit and fix any other files flagged by ESLint (parallel per file)

### Step 3E: Strengthen ESLint Rule & Validation

- [ ] T029 [US1] Test ESLint no-raw-primary-class rule against known violations (should catch all 50+)
- [ ] T030 [US1] If needed, strengthen regex patterns in eslint-rules/no-raw-primary-class.js
- [ ] T031 [US1] Configure pre-commit hook to run ESLint no-raw-primary-class rule
- [ ] T032 [US1] Run full ESLint check - confirm zero raw color violations across entire codebase

**Checkpoint**: Design system compliance achieved - ESLint passes, dark mode works on all pages

---

## Phase 4: User Story 2 - Comprehensive Code Documentation (Priority: P2)

**Goal**: Add comprehensive JSDoc to 70+ exports to improve developer experience and IDE IntelliSense

**Independent Test**: Verify IntelliSense shows JSDoc for all exports, ESLint require-jsdoc rule passes, coverage reaches 100%

### Step 4A: Document packages/ui-components (12+ exports)

- [ ] T033 [P] [US2] Add JSDoc to Button component and ButtonProps in packages/ui-components/src/components/Button.tsx
- [ ] T034 [P] [US2] Add JSDoc to Card components (Card, CardHeader, CardContent, CardFooter) in packages/ui-components/src/components/Card.tsx
- [ ] T035 [P] [US2] Add JSDoc to Input component and InputProps in packages/ui-components/src/components/Form.tsx
- [ ] T036 [P] [US2] Add JSDoc to Textarea component and TextareaProps in packages/ui-components/src/components/Form.tsx
- [ ] T037 [P] [US2] Add JSDoc to Select component and SelectProps in packages/ui-components/src/components/Form.tsx
- [ ] T038 [P] [US2] Add JSDoc to Checkbox component and CheckboxProps in packages/ui-components/src/components/Form.tsx
- [ ] T039 [P] [US2] Add JSDoc to Radio component and RadioProps in packages/ui-components/src/components/Form.tsx
- [ ] T040 [P] [US2] Add JSDoc to Modal components (Modal, ModalHeader, ModalContent, ModalFooter) in packages/ui-components/src/components/Modal.tsx
- [ ] T041 [US2] Add module-level JSDoc to packages/ui-components/src/index.ts
- [ ] T042 [US2] Verify IntelliSense displays JSDoc for all ui-components exports

### Step 4B: Document packages/design-tokens (6 token categories)

- [ ] T043 [P] [US2] Add JSDoc to colors object in packages/design-tokens/tokens/index.ts
- [ ] T044 [P] [US2] Add JSDoc to spacing object in packages/design-tokens/tokens/index.ts
- [ ] T045 [P] [US2] Add JSDoc to borderRadius object in packages/design-tokens/tokens/index.ts
- [ ] T046 [P] [US2] Add JSDoc to shadows object in packages/design-tokens/tokens/index.ts
- [ ] T047 [US2] Add module-level JSDoc to packages/design-tokens/index.js
- [ ] T048 [US2] Add JSDoc to TypeScript definitions in packages/design-tokens/index.d.ts

### Step 4C: Document apps/demo-app Components (12 components)

- [ ] T049 [P] [US2] Add JSDoc to Layout component in apps/demo-app/src/components/Layout.tsx
- [ ] T050 [P] [US2] Add JSDoc to DashboardLayout component in apps/demo-app/src/components/DashboardLayout.tsx
- [ ] T051 [P] [US2] Add JSDoc to EcommerceLayout component in apps/demo-app/src/components/EcommerceLayout.tsx
- [ ] T052 [P] [US2] Add JSDoc to SearchComponent in apps/demo-app/src/components/SearchComponent.tsx
- [ ] T053 [P] [US2] Add JSDoc to QuickViewModal in apps/demo-app/src/components/QuickViewModal.tsx
- [ ] T054 [P] [US2] Add JSDoc to FilterPanel in apps/demo-app/src/components/FilterPanel.tsx
- [ ] T055 [P] [US2] Add JSDoc to PerformanceMonitor in apps/demo-app/src/components/PerformanceMonitor.tsx
- [ ] T056 [P] [US2] Add JSDoc to MemoryMonitorDisplay in apps/demo-app/src/components/MemoryMonitorDisplay.tsx
- [ ] T057 [P] [US2] Add JSDoc to ProductGrid in apps/demo-app/src/components/ProductGrid.tsx
- [ ] T058 [P] [US2] Add JSDoc to BundleAnalyzer in apps/demo-app/src/components/BundleAnalyzer.tsx
- [ ] T059 [P] [US2] Add JSDoc to MarketingLayout in apps/demo-app/src/components/MarketingLayout.tsx
- [ ] T060 [P] [US2] Add JSDoc to TailwindSparkBrand in apps/demo-app/src/components/TailwindSparkBrand.tsx

### Step 4D: Document apps/demo-app Pages (11 pages)

- [ ] T061 [P] [US2] Add JSDoc to HomePage in apps/demo-app/src/pages/HomePage.tsx
- [ ] T062 [P] [US2] Add JSDoc to DashboardPage in apps/demo-app/src/pages/DashboardPage.tsx
- [ ] T063 [P] [US2] Add JSDoc to AnalyticsPage in apps/demo-app/src/pages/AnalyticsPage.tsx
- [ ] T064 [P] [US2] Add JSDoc to MarketingPage in apps/demo-app/src/pages/MarketingPage.tsx
- [ ] T065 [P] [US2] Add JSDoc to EcommercePage in apps/demo-app/src/pages/EcommercePage.tsx
- [ ] T066 [P] [US2] Add JSDoc to SettingsPage in apps/demo-app/src/pages/SettingsPage.tsx
- [ ] T067 [P] [US2] Add JSDoc to remaining pages (DemosPage, DesignSystemPage, UsersPage, AnimationPage, SettingsPage_new) in apps/demo-app/src/pages/

### Step 4E: Document apps/demo-app Sections (5 sections)

- [ ] T068 [P] [US2] Add JSDoc to AnimationShowcase in apps/demo-app/src/sections/AnimationShowcase.tsx
- [ ] T069 [P] [US2] Add JSDoc to FormShowcase in apps/demo-app/src/sections/FormShowcase.tsx
- [ ] T070 [P] [US2] Add JSDoc to ModalShowcase in apps/demo-app/src/sections/ModalShowcase.tsx
- [ ] T071 [P] [US2] Add JSDoc to ButtonShowcase in apps/demo-app/src/sections/ButtonShowcase.tsx
- [ ] T072 [P] [US2] Add JSDoc to CardShowcase in apps/demo-app/src/sections/CardShowcase.tsx

### Step 4F: Validation

- [ ] T073 [US2] Run ESLint require-jsdoc rule across all packages - confirm 100% compliance
- [ ] T074 [US2] Manually test IntelliSense in VS Code - verify JSDoc appears for all exports

**Checkpoint**: Documentation complete - 100% JSDoc coverage, IntelliSense fully functional

---

## Phase 5: User Story 3 - Test Coverage Requirements (Priority: P3)

**Goal**: Increase test coverage from 24% to 80%+ by adding tests for 28 untested components/pages

**Independent Test**: Run `npm test -- --coverage`, verify all thresholds pass (80% statements/branches/functions/lines)

### Step 5A: Configure Coverage Thresholds

- [ ] T075 [US3] Add coverage thresholds (80% all metrics) to vitest.config.ts
- [ ] T076 [US3] Configure coverage reporters (text, json, html, lcov) in vitest.config.ts
- [ ] T077 [US3] Run initial coverage report to establish baseline (should fail thresholds)

### Step 5B: Test Pages (11 files - CRITICAL)

- [ ] T078 [P] [US3] Create HomePage.test.tsx with rendering and navigation tests in apps/demo-app/src/pages/HomePage.test.tsx
- [ ] T079 [P] [US3] Create DashboardPage.test.tsx with layout and widget tests in apps/demo-app/src/pages/DashboardPage.test.tsx
- [ ] T080 [P] [US3] Create AnalyticsPage.test.tsx with chart and data display tests in apps/demo-app/src/pages/AnalyticsPage.test.tsx
- [ ] T081 [P] [US3] Create MarketingPage.test.tsx with section rendering tests in apps/demo-app/src/pages/MarketingPage.test.tsx
- [ ] T082 [P] [US3] Create EcommercePage.test.tsx with product grid and filter tests in apps/demo-app/src/pages/EcommercePage.test.tsx
- [ ] T083 [P] [US3] Create SettingsPage.test.tsx with settings UI tests in apps/demo-app/src/pages/SettingsPage.test.tsx
- [ ] T084 [P] [US3] Create tests for remaining pages (DemosPage, DesignSystemPage, UsersPage, AnimationPage) in apps/demo-app/src/pages/*.test.tsx

### Step 5C: Test Sections (5 files - CRITICAL)

- [ ] T085 [P] [US3] Create FormShowcase.test.tsx with form validation and interaction tests in apps/demo-app/src/sections/FormShowcase.test.tsx
- [ ] T086 [P] [US3] Create ModalShowcase.test.tsx with accessibility and keyboard nav tests in apps/demo-app/src/sections/ModalShowcase.test.tsx
- [ ] T087 [P] [US3] Create AnimationShowcase.test.tsx with animation rendering tests in apps/demo-app/src/sections/AnimationShowcase.test.tsx
- [ ] T088 [P] [US3] Create ButtonShowcase.test.tsx with button variant tests in apps/demo-app/src/sections/ButtonShowcase.test.tsx
- [ ] T089 [P] [US3] Create CardShowcase.test.tsx with card layout tests in apps/demo-app/src/sections/CardShowcase.test.tsx

### Step 5D: Test Components (12 files - MEDIUM)

- [ ] T090 [P] [US3] Create SearchComponent.test.tsx with search and filter tests in apps/demo-app/src/components/SearchComponent.test.tsx
- [ ] T091 [P] [US3] Create QuickViewModal.test.tsx with modal behavior tests in apps/demo-app/src/components/QuickViewModal.test.tsx
- [ ] T092 [P] [US3] Create ProductGrid.test.tsx with grid rendering tests in apps/demo-app/src/components/ProductGrid.test.tsx
- [ ] T093 [P] [US3] Create PerformanceMonitor.test.tsx with performance tracking tests in apps/demo-app/src/components/PerformanceMonitor.test.tsx
- [ ] T094 [P] [US3] Create Layout.test.tsx with layout structure tests in apps/demo-app/src/components/Layout.test.tsx
- [ ] T095 [P] [US3] Create DashboardLayout.test.tsx with dashboard layout tests in apps/demo-app/src/components/DashboardLayout.test.tsx
- [ ] T096 [P] [US3] Create EcommerceLayout.test.tsx with ecommerce layout tests in apps/demo-app/src/components/EcommerceLayout.test.tsx
- [ ] T097 [P] [US3] Create FilterPanel.test.tsx with filter UI tests in apps/demo-app/src/components/FilterPanel.test.tsx
- [ ] T098 [P] [US3] Create MemoryMonitorDisplay.test.tsx with memory display tests in apps/demo-app/src/components/MemoryMonitorDisplay.test.tsx
- [ ] T099 [P] [US3] Create MarketingLayout.test.tsx with marketing layout tests in apps/demo-app/src/components/MarketingLayout.test.tsx
- [ ] T100 [P] [US3] Create BundleAnalyzer.test.tsx with bundle analysis tests in apps/demo-app/src/components/BundleAnalyzer.test.tsx
- [ ] T101 [P] [US3] Create TailwindSparkBrand.test.tsx with branding component tests in apps/demo-app/src/components/TailwindSparkBrand.test.tsx

### Step 5E: Coverage Validation & CI/CD Integration

- [ ] T102 [US3] Run full test suite with coverage - identify files below 80%
- [ ] T103 [US3] Add additional test cases for uncovered branches and edge cases
- [ ] T104 [US3] Verify coverage thresholds pass (80%+ all metrics)
- [ ] T105 [US3] Update .github/workflows/deploy.yml to run tests with coverage on PR
- [ ] T106 [US3] Configure coverage report upload as build artifact in CI/CD

**Checkpoint**: Test coverage achieved - 80%+ all metrics, CI/CD enforcing thresholds

---

## Phase 6: User Story 4 - Code Quality Standards (Priority: P4)

**Goal**: Fix 3 console.log violations and enforce proper logging patterns

**Independent Test**: Run ESLint no-console rule (zero console.log warnings), verify production build strips debug logs

- [ ] T107 [P] [US4] Replace console.log with conditional debug logging (line 333) in apps/demo-app/src/utils/memoryMonitor.ts
- [ ] T108 [P] [US4] Replace console.log with conditional debug logging (line 338) in apps/demo-app/src/utils/memoryMonitor.ts
- [ ] T109 [P] [US4] Replace console.log with conditional debug logging (line 192) in apps/demo-app/src/components/MemoryMonitorDisplay.tsx
- [ ] T110 [US4] Run ESLint no-console rule - verify zero console.log warnings
- [ ] T111 [US4] Build for production and verify debug logs are stripped from bundle

**Checkpoint**: Code quality standards met - proper logging patterns enforced

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation updates

- [ ] T112 [P] Run full ESLint check across all files - zero violations
- [ ] T113 [P] Run Prettier formatting check - all files formatted correctly
- [ ] T114 Run full test suite with coverage - all thresholds pass
- [ ] T115 Build for production - verify successful build with no errors
- [ ] T116 [P] Manual dark mode testing on all pages - verify visual consistency
- [ ] T117 [P] Manual IntelliSense testing - verify JSDoc appears for all exports
- [ ] T118 Review quickstart.md and verify all steps are implemented correctly
- [ ] T119 Update CHANGELOG.md with constitution compliance improvements
- [ ] T120 [P] Document any remaining edge cases or known issues
- [ ] T121 Create pull request with comprehensive description and metrics

**Checkpoint**: Feature complete - ready for PR review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - configures tooling for all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially by priority
  - **Recommended**: US1 (Design System) first for immediate visual value, then US2+US3 in parallel, then US4
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 - Design System (P1)**: Independent - can start after Foundational. Delivers immediate MVP value
- **US2 - Documentation (P2)**: Independent - can start after Foundational. Can run parallel with US1 or US4
- **US3 - Test Coverage (P3)**: Independent - can start after Foundational. Best after US1+US2 complete (tests documented code)
- **US4 - Code Quality (P4)**: Independent - can start after Foundational. Can run parallel with US1

### Within Each User Story

**US1 (Design System)**:
- T011-T013 (Data viz palette) MUST complete before T018-T024 (AnalyticsPage fixes)
- AnimationShowcase (T014-T017) can run parallel with data viz palette creation
- ESLint validation (T029-T032) MUST be last in US1

**US2 (Documentation)**:
- All JSDoc tasks (T033-T072) can run in parallel (different files)
- Validation tasks (T073-T074) MUST be last in US2

**US3 (Test Coverage)**:
- Configuration (T075-T077) MUST complete first
- All test creation tasks (T078-T101) can run in parallel
- Coverage validation (T102-T106) MUST be last in US3

**US4 (Code Quality)**:
- All console.log fixes (T107-T109) can run in parallel
- Validation (T110-T111) MUST be last in US4

### Parallel Opportunities

**Maximum Parallelization** (team of 4-5 developers):
- Phase 1: All 5 tasks can run in parallel
- Phase 2: Tasks T006-T010 can run in parallel after dependencies installed
- Phase 3 (US1): Tasks within each step can run in parallel (e.g., T014-T016 simultaneously)
- Phase 4 (US2): Up to 40 JSDoc tasks can run in parallel (T033-T072)
- Phase 5 (US3): Up to 28 test files can be created in parallel (T078-T101)
- Phase 6 (US4): All 3 console.log fixes can run in parallel (T107-T109)
- Phase 7: T112-T113, T116-T117, T120 can run in parallel

**Optimal Sequence for Solo Developer**:
1. Phase 1 → Phase 2 (linear, 1-2 hours)
2. Phase 3 (US1) - Design System (8-12 hours, highest visual impact)
3. Phase 6 (US4) - Code Quality (30 min, quick win)
4. Phase 4 (US2) - Documentation (20-28 hours)
5. Phase 5 (US3) - Test Coverage (25-35 hours)
6. Phase 7 - Polish (2-4 hours)

**Optimal Sequence for Team of 2**:
- Developer 1: Phase 1-2, then US1 (Design), then US3 (Testing)
- Developer 2: After Phase 2, US2 (Documentation), then US4 (Quality), then help with US3
- Both: Phase 7 together

---

## Parallel Example: User Story 1 (Design System)

```bash
# After foundational phase, these can run in parallel:

# Developer A: Data viz palette
git checkout -b us1-data-viz-palette
# Complete T011-T013

# Developer B: AnimationShowcase fixes
git checkout -b us1-animation-fixes
# Complete T014-T017

# Developer C: AnalyticsPage fixes (starts after T011-T013 complete)
git checkout -b us1-analytics-fixes
# Complete T018-T024

# Developer D: Remaining files audit
git checkout -b us1-remaining-fixes
# Complete T025-T028
```

---

## Parallel Example: User Story 2 (Documentation)

```bash
# Highly parallelizable - split by package/directory:

# Developer A: ui-components package
# Complete T033-T042

# Developer B: design-tokens package  
# Complete T043-T048

# Developer C: demo-app components
# Complete T049-T060

# Developer D: demo-app pages
# Complete T061-T067

# Developer E: demo-app sections
# Complete T068-T072

# All merge after T073-T074 validation
```

---

## Parallel Example: User Story 3 (Testing)

```bash
# After T075-T077 configuration, divide by test type:

# Developer A: Page tests (highest priority)
# Complete T078-T084

# Developer B: Section tests  
# Complete T085-T089

# Developer C: Component tests (first half)
# Complete T090-T095

# Developer D: Component tests (second half)
# Complete T096-T101

# All converge for T102-T106 validation
```

---

## Success Metrics

### Definition of Done (per User Story)

**US1 (Design System)**: 
- ✅ ESLint `no-raw-primary-class` reports zero violations
- ✅ Dark mode toggle works on all pages without visual breaks
- ✅ 8+ data viz semantic color tokens created
- ✅ Pre-commit hook blocks raw color commits

**US2 (Documentation)**:
- ✅ ESLint `require-jsdoc` rule passes with 100% compliance
- ✅ IntelliSense shows JSDoc for all exports (manual test)
- ✅ 70+ JSDoc blocks added across packages and demo app

**US3 (Test Coverage)**:
- ✅ Vitest coverage thresholds configured (80% min)
- ✅ All metrics (statements, branches, functions, lines) >= 80%
- ✅ 28 new test files created (11 pages + 5 sections + 12 components)
- ✅ CI/CD fails builds when coverage drops below 80%

**US4 (Code Quality)**:
- ✅ Zero console.log statements in codebase
- ✅ Production build strips debug logs
- ✅ ESLint no-console rule configured and passing

### Overall Feature Success

- ✅ Constitution compliance score: 42% → 95%+
- ✅ Total violations resolved: 86 (50 design + 3 quality + 28 untested + 70+ docs)
- ✅ All CRITICAL severity findings from audit addressed
- ✅ Project demonstrates education-quality best practices

---

## Implementation Notes

**Estimated Timeline** (solo developer, 40h/week at 75% efficiency = ~30h productive):
- Week 1: Phases 1-3 (Setup + Foundational + US1 Design System) = ~12-16 hours
- Week 2: Phases 4-6 (US2 Documentation + US3 Testing + US4 Quality) = ~45-65 hours (overflow)
- Week 3: Complete US3 Testing + Phase 7 Polish = ~10-15 hours

**Total**: ~67-96 hours → **2-3 weeks solo** or **1 week with team of 3-4**

**Parallelization Benefit**: With team of 3, US2+US3+US4 can run simultaneously after US1, reducing timeline from 2-3 weeks to 1 week.

**Risk Areas**:
- Test coverage may require iteration to reach 80% (budget 25-40% more time)
- Large files (AnalyticsPage.tsx, MarketingPage.tsx) may have hidden color violations
- JSDoc may reveal API design issues requiring more than documentation

**Mitigation**:
- Start with US1 (Design System) for immediate visual value
- Use existing test patterns (ErrorBoundary.test.tsx) as templates
- Reference a11y-utils.ts for JSDoc quality standards
