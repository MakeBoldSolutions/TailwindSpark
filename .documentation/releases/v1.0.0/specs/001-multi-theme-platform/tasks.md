---

description: "Task list for implementing the multi-theme design system platform"
---

# Tasks: Multi-Theme Design System Platform

**Input**: Design documents from `/.documentation/specs/001-multi-theme-platform/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/theme-platform-contract.md, quickstart.md

**Tests**: Include regression and parity tests because the implementation plan and repository constitution require validation for persistence, shared components, and cross-theme behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Current Status

- **Lifecycle**: Implementation is complete and the spec is ready for PR creation.
- **Completed tasks**: 35 of 35.
- **Remaining tasks**: 0 of 35.
- **Validated so far**: Focused demo-app theme tests including invalid preference fallback coverage, app-shell route smoke coverage, broader route and mini-app parity coverage, focused ui-components primitive tests including theme-matrix coverage, focused route parity tests for analytics, demos, ecommerce, marketing, settings, and users, package-level lint/type-check for changed workspaces, focused showcase/chat parity tests, repeated passing production builds, and post-deploy cache/version verification with stale-asset recovery validation against a service-worker-controlled `/TailwindSpark/` dist session.
- **Open task IDs**: None.
- **Primary remaining themes of work**: None.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the shared theme domain model and package-level contract scaffolding used by all later work.

- [X] T001 Create shared theme domain types and persistence keys in `apps/demo-app/src/types/theme.ts` and `apps/demo-app/src/utils/themeStorage.ts`
- [X] T002 [P] Add token-contract helpers and fallback metadata scaffolding in `packages/design-tokens/tokens/theme-contract.ts` and `packages/design-tokens/tokens/index.ts`
- [X] T003 [P] Align theme-related package exports in `packages/design-tokens/index.js` and `packages/design-tokens/index.d.ts`
- [X] T004 [P] Add JSDoc for foundational theme domain and token contract exports in `apps/demo-app/src/types/theme.ts`, `apps/demo-app/src/utils/themeStorage.ts`, `packages/design-tokens/tokens/theme-contract.ts`, `packages/design-tokens/tokens/index.ts`, `packages/design-tokens/index.js`, and `packages/design-tokens/index.d.ts`
- [X] T005 Inventory route-level and theme-sensitive rollout surfaces in `apps/demo-app/src/pages/AboutPage.tsx`, `apps/demo-app/src/pages/AnalyticsPage.tsx`, `apps/demo-app/src/pages/AppsHubPage.tsx`, `apps/demo-app/src/pages/DashboardPage.tsx`, `apps/demo-app/src/pages/DemosPage.tsx`, `apps/demo-app/src/pages/DesignSystemPage.tsx`, `apps/demo-app/src/pages/EcommercePage.tsx`, `apps/demo-app/src/pages/HomePage.tsx`, `apps/demo-app/src/pages/MarketingPage.tsx`, `apps/demo-app/src/pages/SettingsPage.tsx`, `apps/demo-app/src/pages/UsersPage.tsx`, and `.documentation/specs/001-multi-theme-platform/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the token, Tailwind, and runtime foundations that every user story depends on.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T006 Refactor layered reference, semantic, component, and theme override tokens with light/dark support in `packages/design-tokens/theme.css`
- [X] T007 Update CSS-variable-driven Tailwind mappings in `packages/design-tokens/tailwind.config.js` and `apps/demo-app/tailwind.config.js`
- [X] T008 [P] Add theme token completeness and fallback validation logic in `packages/design-tokens/tokens/theme-contract.ts` and `packages/design-tokens/theme.css`
- [X] T009 Build named theme-and-mode runtime helpers plus legacy preference migration in `apps/demo-app/src/contexts/ThemeContext.tsx`, `apps/demo-app/src/utils/themeBoot.ts`, and `apps/demo-app/src/utils/themeStorage.ts`
- [X] T010 Add first-paint theme bootstrap wiring and bootstrap failure handling in `apps/demo-app/index.html` and `apps/demo-app/src/main.tsx`
- [X] T011 Add service-worker cache versioning, stale asset recovery, and rollout verification hooks in `apps/demo-app/public/sw.js` and `apps/demo-app/src/main.tsx`

**Checkpoint**: Foundation ready. Named theme state, token layers, and Tailwind integration are available for story work.

---

## Phase 3: User Story 1 - Switch visual systems without losing functionality (Priority: P1) 🎯 MVP

**Goal**: Let visitors switch among available themes and modes, persist the choice, and keep existing content-driven experiences functionally unchanged.

**Independent Test**: Start the demo app, switch between available themes and light/dark modes from the UI, reload the page, and confirm project, article, weather, joke, repository, and prompt/chat flows remain available and behaviorally unchanged.

### Tests for User Story 1

- [X] T012 [P] [US1] Update theme and mode persistence plus legacy preference migration coverage in `apps/demo-app/src/contexts/ThemeContext.test.tsx` and `apps/demo-app/src/components/ThemeToggle.test.tsx`
- [X] T013 [P] [US1] Add app-level theme-and-mode switching and route-matrix smoke coverage in `apps/demo-app/src/App.test.tsx`, `apps/demo-app/src/components/Layout.test.tsx`, `apps/demo-app/src/pages/HomePage.test.tsx`, `apps/demo-app/src/pages/DashboardPage.test.tsx`, and `apps/demo-app/src/pages/SettingsPage.test.tsx`

### Implementation for User Story 1

- [X] T014 [US1] Replace boolean dark-mode state with named theme-and-mode state in `apps/demo-app/src/contexts/ThemeContext.tsx` and `apps/demo-app/src/App.tsx`
- [X] T015 [US1] Update theme selector UI and keyboard toggle integration for theme and mode changes in `apps/demo-app/src/components/ThemeToggle.tsx` and `apps/demo-app/src/components/Layout.tsx`
- [X] T016 [P] [US1] Apply theme-aware root styles and transition tokens in `apps/demo-app/src/index.css` and `apps/demo-app/src/components/Layout.tsx`
- [X] T017 [US1] Verify theme propagation across API-backed and content-driven routes in `apps/demo-app/src/pages/apps/ProjectsPage.tsx`, `apps/demo-app/src/pages/apps/ArticlesPage.tsx`, `apps/demo-app/src/pages/apps/AIChatPage.tsx`, `apps/demo-app/src/pages/apps/WeatherPage.tsx`, `apps/demo-app/src/pages/apps/JokePage.tsx`, and `apps/demo-app/src/pages/apps/ReposPage.tsx`
- [X] T018 [US1] Verify route-level page theme propagation across `apps/demo-app/src/pages/AboutPage.tsx`, `apps/demo-app/src/pages/AnalyticsPage.tsx`, `apps/demo-app/src/pages/AppsHubPage.tsx`, `apps/demo-app/src/pages/DashboardPage.tsx`, `apps/demo-app/src/pages/DemosPage.tsx`, `apps/demo-app/src/pages/DesignSystemPage.tsx`, `apps/demo-app/src/pages/EcommercePage.tsx`, `apps/demo-app/src/pages/HomePage.tsx`, `apps/demo-app/src/pages/MarketingPage.tsx`, `apps/demo-app/src/pages/SettingsPage.tsx`, and `apps/demo-app/src/pages/UsersPage.tsx`

**Checkpoint**: User Story 1 should be fully functional and independently testable with persisted theme switching across core app flows.

---

## Phase 4: User Story 2 - Add a new theme without rewriting screens (Priority: P2)

**Goal**: Make new named themes additive by defining them in one place with safe fallbacks, light/dark variants, and shared component compatibility.

**Independent Test**: Define a new theme profile with light and dark variants using the documented contract, activate it, and confirm the app renders without component duplication or structural rewrites.

### Tests for User Story 2

- [X] T019 [P] [US2] Add theme addition, mode fallback, invalid-theme, and migrated-preference coverage in `apps/demo-app/src/contexts/ThemeContext.test.tsx` and `packages/ui-components/src/components/Button.test.tsx`

### Implementation for User Story 2

- [X] T020 [US2] Register material, minimal, and brutalist theme profiles with light/dark variants and fallback metadata in `apps/demo-app/src/types/theme.ts` and `apps/demo-app/src/utils/themeRegistry.ts`
- [X] T021 [US2] Extend named theme blocks, light/dark variants, and baseline fallbacks in `packages/design-tokens/theme.css`
- [X] T022 [US2] Refactor button and card recipes to consume component tokens in `packages/ui-components/src/components/Button.tsx` and `packages/ui-components/src/components/Card.tsx`
- [X] T023 [P] [US2] Refactor form and modal recipes to consume component tokens in `packages/ui-components/src/components/Form.tsx` and `packages/ui-components/src/components/Modal.tsx`
- [X] T024 [US2] Add JSDoc for registry and shared theme export surfaces in `apps/demo-app/src/utils/themeRegistry.ts`, `apps/demo-app/src/contexts/ThemeContext.tsx`, `packages/ui-components/src/index.ts`, `packages/design-tokens/index.js`, and `packages/design-tokens/index.d.ts`

**Checkpoint**: User Story 2 should allow new theme definition and activation without duplicated components or screen rewrites.

---

## Phase 5: User Story 3 - Express distinct design languages consistently (Priority: P3)

**Goal**: Ensure each shipped theme delivers clearly different typography, spacing, shape, motion, and depth in both light and dark modes while preserving usability and information hierarchy.

**Independent Test**: Compare the same shared components and demo-app surfaces under material, minimal, and brutalist themes in both light and dark modes and confirm the visual language changes materially while accessibility and interaction continuity remain intact.

### Tests for User Story 3

- [X] T025 [P] [US3] Add theme-and-mode matrix coverage for shared primitives in `packages/ui-components/src/components/Button.test.tsx`, `packages/ui-components/src/components/Card.test.tsx`, `packages/ui-components/src/components/Form.test.tsx`, and `packages/ui-components/src/components/Modal.test.tsx`
- [X] T026 [P] [US3] Add surface parity and route-level smoke coverage in `apps/demo-app/src/sections/ButtonShowcase.test.tsx`, `apps/demo-app/src/sections/CardShowcase.test.tsx`, `apps/demo-app/src/sections/ChatInterface.test.tsx`, `apps/demo-app/src/pages/AboutPage.test.tsx`, `apps/demo-app/src/pages/AnalyticsPage.test.tsx`, `apps/demo-app/src/pages/AppsHubPage.test.tsx`, `apps/demo-app/src/pages/DashboardPage.test.tsx`, `apps/demo-app/src/pages/DemosPage.test.tsx`, `apps/demo-app/src/pages/DesignSystemPage.test.tsx`, `apps/demo-app/src/pages/EcommercePage.test.tsx`, `apps/demo-app/src/pages/HomePage.test.tsx`, `apps/demo-app/src/pages/MarketingPage.test.tsx`, `apps/demo-app/src/pages/SettingsPage.test.tsx`, and `apps/demo-app/src/pages/UsersPage.test.tsx`

### Implementation for User Story 3

- [X] T027 [US3] Apply typography, spacing, radius, elevation, and motion tokens across showcase surfaces in `apps/demo-app/src/sections/ButtonShowcase.tsx`, `apps/demo-app/src/sections/CardShowcase.tsx`, `apps/demo-app/src/sections/FormShowcase.tsx`, and `apps/demo-app/src/sections/ModalShowcase.tsx`
- [X] T028 [US3] Update navigation and branded layout surfaces to consume semantic surface recipes in `apps/demo-app/src/components/Layout.tsx`, `apps/demo-app/src/components/Logo.tsx`, and `apps/demo-app/src/components/SearchComponent.tsx`
- [X] T029 [US3] Align content-driven mini-app cards with theme-specific typography and density tokens in `apps/demo-app/src/sections/ArticleCard.tsx`, `apps/demo-app/src/sections/ProjectCard.tsx`, `apps/demo-app/src/sections/RepoCard.tsx`, and `apps/demo-app/src/sections/WeatherCard.tsx`
- [X] T030 [US3] Tune theme-aware motion, contrast, and light/dark parity for prompt/chat and design-system surfaces in `apps/demo-app/src/sections/ChatInterface.tsx`, `apps/demo-app/src/pages/DashboardPage.tsx`, and `apps/demo-app/src/pages/DesignSystemPage.tsx`
- [X] T031 [US3] Sweep remaining route-level pages for semantic surface parity in `apps/demo-app/src/pages/AboutPage.tsx`, `apps/demo-app/src/pages/AnalyticsPage.tsx`, `apps/demo-app/src/pages/AppsHubPage.tsx`, `apps/demo-app/src/pages/DemosPage.tsx`, `apps/demo-app/src/pages/EcommercePage.tsx`, `apps/demo-app/src/pages/HomePage.tsx`, `apps/demo-app/src/pages/MarketingPage.tsx`, `apps/demo-app/src/pages/SettingsPage.tsx`, and `apps/demo-app/src/pages/UsersPage.tsx`

**Checkpoint**: All shipped themes should now be visually distinct, accessible, and consistent across shared primitives and application surfaces.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation, validation, and cleanup across all user stories.

- [X] T032 [P] Add add-theme guidance plus required light/dark variant and rollout recovery notes in `packages/design-tokens/theme.css`, `apps/demo-app/public/sw.js`, and `.documentation/specs/001-multi-theme-platform/quickstart.md`
- [X] T033 Add required JSDoc for modified shared component exports in `packages/ui-components/src/components/Button.tsx`, `packages/ui-components/src/components/Card.tsx`, `packages/ui-components/src/components/Form.tsx`, and `packages/ui-components/src/components/Modal.tsx`
- [X] T034 Run repository validation commands referenced by `package.json`, `apps/demo-app/package.json`, and `packages/ui-components/package.json`
- [X] T035 Perform post-deploy cache/version and stale-asset recovery verification using `apps/demo-app/public/sw.js` and `.documentation/specs/001-multi-theme-platform/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies. Start immediately.
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3: User Story 1**: Depends on Phase 2. Delivers the MVP with migrated preferences and cache-safe runtime behavior.
- **Phase 4: User Story 2**: Depends on Phase 2 and should follow User Story 1 once named theme switching is stable.
- **Phase 5: User Story 3**: Depends on Phases 2 through 4 because it builds on the shipped theme set and shared component recipes.
- **Phase 6: Polish**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories after foundational work completes, but it must deliver named theme switching, migrated legacy preferences, and light/dark mode support.
- **User Story 2 (P2)**: Depends on the named theme runtime from User Story 1 but remains independently testable once theme registration, light/dark variants, and fallbacks are in place.
- **User Story 3 (P3)**: Depends on User Stories 1 and 2 because distinct visual systems require both runtime switching with mode support and fully tokenized shared components.

### Within Each User Story

- Story-specific tests should be updated before or alongside implementation and used as regression checks during the story.
- Runtime or registry changes precede component migrations.
- Shared component recipe updates precede app-surface parity work.
- Each story must satisfy its independent test before moving to the next priority.

## Parallel Opportunities

- **Setup**: T002, T003, and T004 can run in parallel after T001.
- **Foundational**: T008 can run in parallel with T009 after T006 begins; T010 follows the runtime work in T009; T011 follows startup integration because rollout verification depends on the bootstrap path.
- **User Story 1**: T012 and T013 can run in parallel; T016 can run in parallel with T017 after T014 starts.
- **User Story 2**: T019 can run in parallel with T020; T023 can run in parallel with T022.
- **User Story 3**: T025 and T026 can run in parallel; T028 and T029 can run in parallel after T027 establishes the shared visual language.
- **Polish**: T032 and T033 can run in parallel before T034 and T035.

---

## Parallel Example: User Story 1

```text
Task: "T012 [US1] Update theme and mode persistence plus legacy preference migration coverage in apps/demo-app/src/contexts/ThemeContext.test.tsx and apps/demo-app/src/components/ThemeToggle.test.tsx"
Task: "T013 [US1] Add app-level theme-and-mode switching and route-matrix smoke coverage in apps/demo-app/src/App.test.tsx, apps/demo-app/src/components/Layout.test.tsx, apps/demo-app/src/pages/HomePage.test.tsx, apps/demo-app/src/pages/DashboardPage.test.tsx, and apps/demo-app/src/pages/SettingsPage.test.tsx"

Task: "T016 [US1] Apply theme-aware root styles and transition tokens in apps/demo-app/src/index.css and apps/demo-app/src/components/Layout.tsx"
Task: "T017 [US1] Verify theme propagation across API-backed and content-driven routes in apps/demo-app/src/pages/apps/ProjectsPage.tsx, apps/demo-app/src/pages/apps/ArticlesPage.tsx, apps/demo-app/src/pages/apps/AIChatPage.tsx, apps/demo-app/src/pages/apps/WeatherPage.tsx, apps/demo-app/src/pages/apps/JokePage.tsx, and apps/demo-app/src/pages/apps/ReposPage.tsx"
```

---

## Parallel Example: User Story 2

```text
Task: "T022 [US2] Refactor button and card recipes to consume component tokens in packages/ui-components/src/components/Button.tsx and packages/ui-components/src/components/Card.tsx"
Task: "T023 [US2] Refactor form and modal recipes to consume component tokens in packages/ui-components/src/components/Form.tsx and packages/ui-components/src/components/Modal.tsx"
```

---

## Parallel Example: User Story 3

```text
Task: "T025 [US3] Add theme-and-mode matrix coverage for shared primitives in packages/ui-components/src/components/Button.test.tsx, packages/ui-components/src/components/Card.test.tsx, packages/ui-components/src/components/Form.test.tsx, and packages/ui-components/src/components/Modal.test.tsx"
Task: "T026 [US3] Add surface parity and route-level smoke coverage in apps/demo-app/src/sections/ButtonShowcase.test.tsx, apps/demo-app/src/sections/CardShowcase.test.tsx, apps/demo-app/src/sections/ChatInterface.test.tsx, apps/demo-app/src/pages/AboutPage.test.tsx, apps/demo-app/src/pages/AnalyticsPage.test.tsx, apps/demo-app/src/pages/AppsHubPage.test.tsx, apps/demo-app/src/pages/DashboardPage.test.tsx, apps/demo-app/src/pages/DemosPage.test.tsx, apps/demo-app/src/pages/DesignSystemPage.test.tsx, apps/demo-app/src/pages/EcommercePage.test.tsx, apps/demo-app/src/pages/HomePage.test.tsx, apps/demo-app/src/pages/MarketingPage.test.tsx, apps/demo-app/src/pages/SettingsPage.test.tsx, and apps/demo-app/src/pages/UsersPage.test.tsx"

Task: "T028 [US3] Update navigation and branded layout surfaces to consume semantic surface recipes in apps/demo-app/src/components/Layout.tsx, apps/demo-app/src/components/Logo.tsx, and apps/demo-app/src/components/SearchComponent.tsx"
Task: "T029 [US3] Align content-driven mini-app cards with theme-specific typography and density tokens in apps/demo-app/src/sections/ArticleCard.tsx, apps/demo-app/src/sections/ProjectCard.tsx, apps/demo-app/src/sections/RepoCard.tsx, and apps/demo-app/src/sections/WeatherCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate theme switching, legacy preference migration, cache-safe rollout behavior, and core route stability before expanding scope.

### Incremental Delivery

1. Deliver the named-theme runtime and persistence flow.
2. Add new-theme extensibility and component token recipes.
3. Add distinct visual-language coverage across shared and app-owned surfaces.
4. Finish with documentation, rollout verification, and full repository validation.

### Parallel Team Strategy

1. One contributor owns the token/runtime foundation in `packages/design-tokens` and `apps/demo-app/src/contexts`.
2. A second contributor can migrate shared UI recipes in `packages/ui-components/src/components` once the token contract stabilizes.
3. A third contributor can update app-surface parity work in `apps/demo-app/src/components`, `apps/demo-app/src/sections`, and `apps/demo-app/src/pages` after User Story 1 is stable.

---

## Notes

- Total tasks: 35
- User Story task counts: US1 = 7, US2 = 6, US3 = 7
- Setup and foundational tasks: 11
- Polish tasks: 4
- Suggested MVP scope: Complete through Phase 3 (User Story 1), including light/dark mode support for each shipped theme
- All tasks use the required checklist format with task IDs, optional parallel markers, story labels where required, and exact file paths.