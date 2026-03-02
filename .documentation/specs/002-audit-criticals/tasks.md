---
description: "Task list for Critical Audit Compliance Fixes"
---

# Tasks: Critical Audit Compliance Fixes

**Input**: Design documents from `.documentation/specs/002-audit-criticals/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: No test tasks included (not requested in feature specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web application monorepo structure:
  - `apps/demo-app/src/` for application code
  - `vitest.config.ts` at repository root
  - `packages/design-tokens/` for design system

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify branch and baseline state

- [X] T001 Verify on branch 002-audit-criticals with clean working directory
- [X] T002 Run baseline ESLint to confirm 47 violations (45 colors + 2 JSDoc)
- [X] T003 [P] Run baseline test suite to confirm 533 passing tests of 577 total (92.4% pass rate)

**Checkpoint**: Baseline established - ready for implementation

---

## Phase 3: User Story 1 - Design Token Compliance in Utility Components (Priority: P1) 🎯 MVP

**Goal**: Replace all 45 raw color class violations with semantic design tokens to restore dark mode functionality and achieve design system consistency

**Independent Test**: Run ESLint `no-raw-primary-class` rule and manual dark mode toggle on pages using BundleAnalyzer/EcommerceLayout

**Note**: Tasks T004-T012 replace multiple color class instances per component line/section to address all 45 violations across both files.

### Implementation for User Story 1

- [X] T004 [P] [US1] Replace toggle button colors in apps/demo-app/src/components/BundleAnalyzer.tsx line 139 (bg-purple-600 → bg-brand, hover:bg-purple-700 → hover:bg-brand-hover, focus:ring-purple-500 → focus:ring-focus-ring)
- [X] T005 [P] [US1] Replace card container colors in apps/demo-app/src/components/BundleAnalyzer.tsx line 160 (bg-white → bg-surface, dark:border-gray-700 → border-border, remove dark:bg-gray-800)
- [X] T006 [P] [US1] Replace heading text colors in apps/demo-app/src/components/BundleAnalyzer.tsx line 162 (text-gray-900 dark:text-gray-100 → text-text)
- [X] T007 [P] [US1] Replace development badge colors in apps/demo-app/src/components/BundleAnalyzer.tsx line 165 (bg-purple-100 → bg-brand/10, text-purple-800 → text-brand, remove dark variants)
- [X] T008 [P] [US1] Replace JavaScript label/value colors in apps/demo-app/src/components/BundleAnalyzer.tsx lines 173-174 (text-gray-600 → text-text-muted, text-blue-600 → text-data-viz-1, remove dark variants)
- [X] T009 [P] [US1] Replace CSS label/value colors in apps/demo-app/src/components/BundleAnalyzer.tsx lines 180-181 (text-gray-600 → text-text-muted, text-green-600 → text-data-viz-2, remove dark variants)
- [X] T010 [P] [US1] Replace Total label/value colors in apps/demo-app/src/components/BundleAnalyzer.tsx lines 188-189 (text-gray-900 → text-text, text-purple-600 → text-brand, remove dark variants)
- [X] T011 [P] [US1] Replace chunks heading colors in apps/demo-app/src/components/BundleAnalyzer.tsx line 198 (text-gray-700 dark:text-gray-300 → text-text)
- [X] T012 [P] [US1] Replace navigation/footer background colors in apps/demo-app/src/components/EcommerceLayout.tsx lines 124-175 (bg-gray-50 → bg-surface-alt, hover:bg-gray-100 → hover:bg-surface-alt/80)
- [X] T013 [US1] Verify ESLint no-raw-primary-class reports 0 violations in BundleAnalyzer.tsx (down from 43)
- [X] T014 [US1] Verify ESLint no-raw-primary-class reports 0 violations in EcommerceLayout.tsx (down from 2)
- [ ] T015 [US1] Manual dark mode testing on pages using BundleAnalyzer component (verify colors transition correctly)
- [ ] T016 [US1] Manual dark mode testing on e-commerce page using EcommerceLayout (verify nav/footer colors adapt)

**Checkpoint**: User Story 1 complete - Dark mode functional, 45 color violations resolved

---

## Phase 4: User Story 2 - Main Application Component Documentation (Priority: P2)

**Goal**: Add comprehensive JSDoc documentation to main App components for improved developer experience and IntelliSense support

**Independent Test**: Hover over App component imports in VS Code and verify comprehensive JSDoc appears; run ESLint require-jsdoc rule

### Implementation for User Story 2

- [X] T017 [P] [US2] Add comprehensive JSDoc comment block above App component in apps/demo-app/src/App.tsx line 158 (include description, features list, @component, @returns, @example)
- [X] T018 [P] [US2] Add comprehensive JSDoc comment block above App function in apps/demo-app/src/App-clean.tsx line 3 (include description, relationship to main App, @component, @returns, @example)
- [X] T019 [US2] Verify IntelliSense displays JSDoc tooltip when hovering over App component import in VS Code
- [X] T020 [US2] Verify IntelliSense displays JSDoc tooltip when hovering over App-clean component
- [X] T021 [US2] Verify ESLint require-jsdoc reports 0 violations across entire codebase (100% JSDoc coverage achieved)

**Checkpoint**: User Story 2 complete - 100% JSDoc coverage, 2 documentation violations resolved

---

## Phase 5: User Story 3 - Test Coverage Enforcement (Priority: P3)

**Goal**: Configure Vitest coverage thresholds to enforce 80% minimum coverage across all metrics and prevent coverage regression

**Independent Test**: Run `npm test -- --coverage` and verify enforcement behavior (fail if below 80%, pass if above)

### Implementation for User Story 3

- [X] T022 [US3] Run baseline coverage report with npm test -- --coverage to determine current coverage levels
- [X] T023 [US3] Add 'lcov' to reporter array in vitest.config.ts coverage section (for CI/CD integration)
- [X] T024 [US3] Add thresholds object to vitest.config.ts coverage section with 80% minimums (or current level if below 80% with TODO comment)
- [X] T025 [US3] Configure threshold enforcement for statements: 80%
- [X] T026 [US3] Configure threshold enforcement for branches: 80%
- [X] T027 [US3] Configure threshold enforcement for functions: 80%
- [X] T028 [US3] Configure threshold enforcement for lines: 80%
- [ ] T029 [US3] Run npm test -- --coverage and verify build succeeds (current coverage meets thresholds)
- [ ] T030 [US3] Manual test: Temporarily lower threshold to verify enforcement works (should fail build)
- [ ] T031 [US3] Restore correct threshold values and verify build passes again

**Checkpoint**: User Story 3 complete - Coverage enforcement active, regression prevention in place

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation updates, and quality assurance

- [X] T032 [P] Run full ESLint validation with npm run lint (expect 0 errors, down from 47)
- [ ] T033 [P] Run full test suite with npm test (expect 533 passing tests of 577 total, 92.4% pass rate maintained)
- [ ] T034 Run complete validation per quickstart.md steps (ESLint, tests, coverage, manual dark mode)
- [ ] T035 Update .documentation/copilot/audit/ with compliance achievement notes (73% → 100%)
- [X] T036 [P] Verify all 5 target files modified correctly (BundleAnalyzer.tsx, EcommerceLayout.tsx, App.tsx, App-clean.tsx, vitest.config.ts)
- [ ] T037 Stage and commit all changes with descriptive commit message referencing .documentation/specs/002-audit-criticals/spec.md
- [ ] T038 Prepare PR description with before/after metrics (47 violations → 0, 73% compliance → 100%)

**Checkpoint**: Feature complete - Ready for PR and constitution-aware review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A - No foundational work required
- **User Stories (Phase 3-5)**: Can start immediately after Setup (Phase 1)
  - User stories can proceed in parallel (different files, no dependencies)
  - OR sequentially in priority order (P1 → P2 → P3) for single developer
- **Polish (Phase 6)**: Depends on all user stories (T004-T031) being complete

### User Story Dependencies

- **User Story 1 (P1 - Design Tokens)**: No dependencies - Can start after T003
- **User Story 2 (P2 - JSDoc)**: No dependencies - Can start after T003 (parallel to US1)
- **User Story 3 (P3 - Coverage)**: No dependencies - Can start after T003 (parallel to US1/US2)

**All three user stories are fully independent and can be implemented in parallel by different developers or sequentially in priority order.**

### Within Each User Story

**User Story 1 (Design Tokens)**:
- T004-T012 are all [P] - can run in parallel (different line ranges in files)
- T013-T014 validation depends on T004-T012 completion
- T015-T016 manual testing depends on T013-T014 passing

**User Story 2 (JSDoc)**:
- T017-T018 are [P] - can run in parallel (different files)
- T019-T021 validation depends on T017-T018 completion

**User Story 3 (Coverage)**:
- T022 must run first (baseline measurement)
- T023-T028 implementation can proceed after T022
- T029-T031 validation depends on T023-T028 completion

### Parallel Opportunities

#### Across User Stories (Maximum Parallelization)

```bash
# Three developers can work simultaneously:
Developer A: User Story 1 (T004-T016) - Design token fixes
Developer B: User Story 2 (T017-T021) - JSDoc additions  
Developer C: User Story 3 (T022-T031) - Coverage configuration
```

#### Within User Story 1 (Single Developer on US1)

```bash
# Launch all color replacement tasks together (T004-T012):
Task T004: "Toggle button colors (line 139)"
Task T005: "Card container colors (line 160)"
Task T006: "Heading text colors (line 162)"
Task T007: "Badge colors (line 165)"
Task T008: "JavaScript colors (lines 173-174)"
Task T009: "CSS colors (lines 180-181)"
Task T010: "Total colors (lines 188-189)"
Task T011: "Chunks heading (line 198)"
Task T012: "EcommerceLayout backgrounds (lines 124-175)"
# All tasks modify different line ranges, no conflicts
```

#### Within User Story 2 (Single Developer on US2)

```bash
# Launch both JSDoc additions in parallel (T017-T018):
Task T017: "Add JSDoc to App.tsx line 158"
Task T018: "Add JSDoc to App-clean.tsx line 3"
# Different files, no conflicts
```

---

## Parallel Example: All Three User Stories

```bash
# If you have 3 developers or want to tackle in sequence, here's the breakdown:

# PARALLEL OPTION (3 developers):
Team Member 1 focuses on: T004-T016 (User Story 1 - Design Tokens)
Team Member 2 focuses on: T017-T021 (User Story 2 - JSDoc)
Team Member 3 focuses on: T022-T031 (User Story 3 - Coverage)
Then all meet for: T032-T038 (Validation & Polish)

# SEQUENTIAL OPTION (1 developer):
Day 1: Complete T004-T016 (User Story 1) - Test independently
Day 2: Complete T017-T021 (User Story 2) - Test independently  
Day 3: Complete T022-T031 (User Story 3) - Test independently
Day 3: Complete T032-T038 (Final validation)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003) - 5 minutes
2. Complete Phase 3: User Story 1 (T004-T016) - 45 minutes
3. **STOP and VALIDATE**: Run ESLint, manual dark mode testing
4. Deploy/demo if ready (dark mode now functional)

**Result**: 45 critical violations resolved, dark mode restored, 96% compliance (73% → 96%)

### Incremental Delivery (Recommended)

1. Complete Setup (T001-T003) → Baseline established
2. Add User Story 1 (T004-T016) → Test independently → 45 violations resolved
3. Add User Story 2 (T017-T021) → Test independently → 47 violations resolved  
4. Add User Story 3 (T022-T031) → Test independently → 100% compliance
5. Polish (T032-T038) → Commit and PR

**Each story adds value without breaking previous work**

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup (T001-T003) together - 5 minutes
2. Split by user story:
   - Developer A: User Story 1 (T004-T016) - 45 min
   - Developer B: User Story 2 (T017-T021) - 15 min
   - Developer C: User Story 3 (T022-T031) - 10 min
3. Reconvene for Polish (T032-T038) - 15 min

**Total parallel time: ~1 hour vs. ~1.5 hours sequential**

---

## Summary

**Total Tasks**: 38 tasks across 6 phases
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 0 tasks (N/A)
- Phase 3 (User Story 1): 13 tasks (9 implementation + 4 validation)
- Phase 4 (User Story 2): 5 tasks (2 implementation + 3 validation)
- Phase 5 (User Story 3): 10 tasks (7 implementation + 3 validation)
- Phase 6 (Polish): 7 tasks

**Parallel Opportunities**:
- All user stories (P1, P2, P3) can execute in parallel (no dependencies)
- Within User Story 1: 9 color replacement tasks can run in parallel
- Within User Story 2: 2 JSDoc additions can run in parallel
- Total of 18 tasks marked [P] for parallel execution

**Test Strategy**: No test creation tasks (not requested in spec)
- Validation through ESLint rules (no-raw-primary-class, require-jsdoc)
- Manual dark mode testing
- Coverage enforcement validation
- Existing 533 tests must continue passing

**Suggested MVP Scope**: User Story 1 only (T004-T016)
- Fixes 45/47 critical violations (96%)
- Restores dark mode functionality
- Independently testable and deployable
- 45 minutes implementation time

**Full Feature Scope**: All three user stories (T004-T031)
- Fixes all 47 critical violations (100%)
- Achieves 100% constitutional compliance
- 1-2 hours implementation + 30 min validation
- Risk: LOW (isolated changes, established patterns)

**Constitutional Impact**:
- Before: 73% compliance (6/8 principles passing)
- After: 100% compliance (8/8 principles passing)
- Critical violations: 47 → 0

---

## Notes

- [P] tasks = different files or line ranges, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No new files created - only existing files modified
- All changes follow established patterns from PR #90
- Commit after completing each user story for incremental progress
- Manual testing required for dark mode validation (cannot be automated)
- Coverage baseline check (T022) critical before threshold configuration