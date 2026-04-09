# Tasks: GitHub Repositories Explorer

**Input**: Design documents from `.documentation/specs/001-github-repos-explorer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/repositories-schema.ts, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the prebuild data sync pipeline and fetch the initial data snapshot

- [x] T001 Create prebuild data sync script at `scripts/sync-repos-data.mjs` following the pattern from `scripts/sync-projects-data.mjs` — fetch `repositories.json` from `https://raw.githubusercontent.com/markhazleton/github-stats-spark/refs/heads/main/data/users/markhazleton/repositories.json`, validate array structure, sanitize, and write to `apps/demo-app/public/data/repositories.json`
- [x] T002 Run `node scripts/sync-repos-data.mjs` to generate the initial data snapshot at `apps/demo-app/public/data/repositories.json`
- [x] T003 Add prebuild hook to `apps/demo-app/package.json` — add `"presync:repos": "node ../../scripts/sync-repos-data.mjs"` and integrate into the build pipeline alongside existing `sync-projects-data.mjs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Zod types, service layer, and route registration that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create Zod schemas and TypeScript types at `apps/demo-app/src/types/repos-api.ts` — define `RawRepositorySchema` (with nested `SummarySchema`, `CommitHistorySchema`, `AttentionMetricsSchema`, `TechStackSchema`, `ContributorSchema`, `ScreenshotSchema`), `RawRepositoriesResponseSchema` (array), `Repository` interface, `mapRawRepository()` mapping function, `REPOS_API_CONFIG` constant, and filter/sort type unions (`RepoSortField`, `RepoStatusFilter`) per contracts/repositories-schema.ts and data-model.md
- [x] T005 [P] Register the Repositories mini-app in `apps/demo-app/src/types/miniapp.ts` — add entry to `miniAppsData` array with `id: 'repos'`, `name: 'Repositories'`, `description: 'Explore Mark Hazleton GitHub repositories with search, filtering, and detailed analytics'`, `route: '/apps/repos'`, and an appropriate icon emoji
- [x] T006 Create data service at `apps/demo-app/src/services/repos.service.ts` — implement `getRepositories(): Promise<Repository[]>` with cache-first pattern (localStorage via `cache.service.ts`), fetch from `/data/repositories.json`, validate with Zod, map with `mapRawRepository()`, and export `clearReposCache()`. Follow the pattern from `projects.service.ts`
- [x] T007 Register lazy route in `apps/demo-app/src/App.tsx` — add `const ReposPage = lazy(() => import('./pages/apps/ReposPage'))` and add `<Route path="/apps/repos" element={<Suspense fallback={<PageLoadingSpinner message="Loading Repositories..." />}><ReposPage /></Suspense>} />` alongside other mini-app routes

**Checkpoint**: Foundation ready — data pipeline, types, service, and routing are in place

---

## Phase 3: User Story 1 — Browse All Repositories (Priority: P1) MVP

**Goal**: Display all 33 repositories as browsable cards sorted by composite score, with name, description, language, stars, forks, and rank

**Independent Test**: Load `/apps/repos` and verify all repository cards render with correct metadata, sorted by composite score descending

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `useRepos` hook at `apps/demo-app/src/hooks/useRepos.ts` — return `{ repositories, loading, error, refreshCache }` using `useState`, `useCallback`, `useEffect`. Fetch via `getRepositories()` on mount. Include `useMemo`-derived `sortedRepositories` sorted by `composite_score` descending as default. Follow the `useProjects` hook pattern
- [x] T009 [P] [US1] Create `RepoCard` component at `apps/demo-app/src/sections/RepoCard.tsx` — accept `RepoCardProps { repository: Repository; isExpanded: boolean; onToggle: () => void }`. Render collapsed card showing: name, description (fallback to `summary.text` if description is null), primary `language` with color dot, `stars`/`forks`/`watchers` counts with Lucide icons, `composite_score` rank badge. Use semantic design tokens (`bg-surface`, `border-border`, `text-text`). Visually distinguish archived repos with an "Archived" badge and reduced opacity
- [x] T010 [US1] Create `ReposPage` component at `apps/demo-app/src/pages/apps/ReposPage.tsx` — default export FC using `useRepos()` hook and `useSEO()`. Render loading spinner, error state with retry, and grid of `RepoCard` components (`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`). Pass `isExpanded={false}` and `onToggle` as no-op for Phase 3 (accordion added in US3)

**Checkpoint**: Navigating to `/apps/repos` displays all repository cards sorted by composite score. MVP is functional.

---

## Phase 4: User Story 2 — Filter and Sort Repositories (Priority: P2)

**Goal**: Add text search, language filter, status filter, and sort controls. Visitors can narrow down repositories instantly.

**Independent Test**: Type "spark" in search to see only matching repos. Select "Python" language filter. Change sort to "Most Stars". Verify empty state when no results match.

### Implementation for User Story 2

- [x] T011 [P] [US2] Create `RepoFilters` component at `apps/demo-app/src/sections/RepoFilters.tsx` — accept `RepoFiltersProps { searchQuery, onSearchChange, languageFilter, onLanguageChange, statusFilter, onStatusChange, sortBy, onSortChange, availableLanguages: string[], resultCount: number }`. Render: search input (with Lucide Search icon), language dropdown (populated from `availableLanguages`), status dropdown (All/Active/Stale/Archived), sort dropdown (Composite Score/Stars/Forks/Commits/Recent Activity/Age/Name), and result count display. Use `sanitizeInput()` for search. Use semantic tokens for all styling
- [x] T012 [US2] Enhance `useRepos` hook at `apps/demo-app/src/hooks/useRepos.ts` — add filter/sort state: `searchQuery` (string), `languageFilter` (string|null), `statusFilter` ('all'|'active'|'stale'|'archived'), `sortBy` (RepoSortField), `sortDirection` ('asc'|'desc'). Add `useMemo`-derived `filteredRepositories` applying: case-insensitive text search across `name`, `description`, `summary.text`; language filter on `language` field; status filter using `is_archived` and `days_since_last_push` (active <90d, stale >=90d). Add `useMemo`-derived `availableLanguages` from all repos. Export setters for each filter. Return expanded state
- [x] T013 [US2] Integrate `RepoFilters` into `ReposPage` at `apps/demo-app/src/pages/apps/ReposPage.tsx` — wire filter state from `useRepos` to `RepoFilters` props. Replace the direct `repositories` list with `filteredRepositories`. Add empty state message with "Clear filters" button when no results match

**Checkpoint**: Search, filter, and sort all work. Empty state displays correctly. Filtering is instant.

---

## Phase 5: User Story 3 — View Repository Detail (Priority: P3)

**Goal**: Clicking a card expands it inline (accordion) to show AI summary, commit history, activity metrics, language breakdown, attention scores, and external links. Only one card expanded at a time.

**Independent Test**: Click any repository card — it expands showing detail. Click another — first collapses, second expands. Verify all detail sections render for repos with full data and repos with missing optional fields.

### Implementation for User Story 3

- [x] T014 [P] [US3] Create `RepoDetail` component at `apps/demo-app/src/sections/RepoDetail.tsx` — accept `RepoDetailProps { repository: Repository }`. Render sections: (1) AI summary from `summary.text` with generation metadata, (2) Commit history: `commit_history.recent_90d`/`180d`/`365d` with activity patterns, (3) Language breakdown from `languages` object as horizontal bar or tag list, (4) Attention metrics: `attention_metrics.score`/`tier` with component breakdown (PR, security, staleness, dependencies), (5) Contributor stats from `contributor_stats` array, (6) External links: repository `url`, `homepage`, `pages_url`. Gracefully handle null `tech_stack`, `ai_summary`, `screenshot`. Use semantic tokens throughout
- [x] T015 [US3] Add accordion expand/collapse to `RepoCard` at `apps/demo-app/src/sections/RepoCard.tsx` — when `isExpanded` is true, render `<RepoDetail repository={repository} />` below the card header with slide-down transition. Add `aria-expanded={isExpanded}`, `aria-controls={`repo-detail-${repository.name}`}`, `role="button"`, `tabIndex={0}`, and keyboard handler (Enter/Space to toggle). Add `id={`repo-detail-${repository.name}`}` and `role="region"` on the detail panel
- [x] T016 [US3] Add accordion state management to `ReposPage` at `apps/demo-app/src/pages/apps/ReposPage.tsx` — add `expandedRepo: string | null` state. Pass `isExpanded={expandedRepo === repo.name}` and `onToggle={() => setExpandedRepo(prev => prev === repo.name ? null : repo.name)}` to each `RepoCard`. Reset `expandedRepo` to null when filters change

**Checkpoint**: Accordion works with single-open behavior, keyboard accessible, all detail sections render correctly with graceful null handling.

---

## Phase 6: User Story 4 — Portfolio Summary Statistics (Priority: P4)

**Goal**: Display aggregate stats (total repos, commits, stars, forks, language distribution) in a summary header above the repository listing.

**Independent Test**: Load page and verify totals match the sum of individual repo values. Verify language distribution shows correct counts.

### Implementation for User Story 4

- [x] T017 [P] [US4] Create `RepoSummary` component at `apps/demo-app/src/sections/RepoSummary.tsx` — accept `RepoSummaryProps { repositories: Repository[] }`. Compute and display via `useMemo`: total repos count, total commits (`sum of total_commits`), total stars, total forks, language distribution (top 5-8 languages with repo counts, rendered as colored tags or small bar chart), active/stale/archived counts. Use Card component from ui-components with semantic tokens. Responsive grid: `grid grid-cols-2 gap-4 md:grid-cols-4`
- [x] T018 [US4] Integrate `RepoSummary` into `ReposPage` at `apps/demo-app/src/pages/apps/ReposPage.tsx` — render `<RepoSummary repositories={repositories} />` above the filters section, passing the unfiltered full repository array so totals always reflect the complete portfolio

**Checkpoint**: Summary section shows accurate aggregate stats. Language distribution is visible. Layout is responsive.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, accessibility audit, responsive fine-tuning, and dark mode verification

- [x] T019 [P] Add JSDoc documentation to all exported components, hooks, and functions across: `repos-api.ts`, `repos.service.ts`, `useRepos.ts`, `ReposPage.tsx`, `RepoCard.tsx`, `RepoDetail.tsx`, `RepoFilters.tsx`, `RepoSummary.tsx` — include `@param`, `@returns`, and `@example` tags per constitution Principle V
- [x] T020 [P] Verify dark mode rendering for all new components — toggle theme and confirm all sections use CSS variable-based tokens (no hardcoded colors). Fix any raw Tailwind color violations flagged by `no-raw-primary-class` ESLint rule
- [x] T021 [P] Responsive design verification — test at 320px, 768px, 1024px, 1440px, 2560px widths. Ensure no horizontal scrolling, card grid adapts (1/2/3 columns), accordion detail is readable on mobile, filter controls stack properly on small screens
- [x] T022 Run ESLint, Prettier, and TypeScript type-check across all new files — `npm run lint`, `npx prettier --check`, `npm run type-check`. Fix any violations
- [x] T023 Run full build to verify integration — `npm run build` (includes prebuild data sync, Turborepo pipeline). Verify no build errors and `repositories.json` is included in dist output
- [x] T024 Validate against quickstart.md — follow the quickstart steps end-to-end to confirm the developer experience matches documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T002 (data snapshot must exist for service to work) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (types, service, route)
- **User Story 2 (Phase 4)**: Depends on US1 (T008 hook exists to enhance, T010 page exists to modify)
- **User Story 3 (Phase 5)**: Depends on US1 (T009 card exists to enhance, T010 page exists to modify)
- **User Story 4 (Phase 6)**: Depends on US1 (T008 hook provides data, T010 page exists to modify)
- **Polish (Phase 7)**: Depends on all user story phases being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **US2 (P2)**: Requires US1 hook and page to exist (enhances them)
- **US3 (P3)**: Requires US1 card and page to exist (enhances them)
- **US4 (P4)**: Requires US1 hook for data — independent of US2/US3
- **US2 and US3**: Can run in parallel after US1 (touch different files primarily)
- **US4**: Can run in parallel with US2 or US3

### Within Each User Story

- Components with [P] can be built in parallel (different files)
- Integration tasks (page wiring) must follow component creation
- Each story is independently verifiable at its checkpoint

### Parallel Opportunities

- T004 and T005 can run in parallel (different files)
- T008 and T009 can run in parallel (hook and card are different files)
- T011 and T014 can run in parallel (filters and detail are different files, different stories)
- T017 can run in parallel with US2 or US3 work (different component)
- T019, T020, T021 can all run in parallel (different concerns)

---

## Parallel Example: Phase 2

```text
# These can run simultaneously (different files):
Task T004: "Create Zod schemas at apps/demo-app/src/types/repos-api.ts"
Task T005: "Register mini-app in apps/demo-app/src/types/miniapp.ts"
```

## Parallel Example: User Story 1

```text
# These can run simultaneously (different files):
Task T008: "Create useRepos hook at apps/demo-app/src/hooks/useRepos.ts"
Task T009: "Create RepoCard component at apps/demo-app/src/sections/RepoCard.tsx"
```

## Parallel Example: After US1 Complete

```text
# US2 and US3 can proceed in parallel:
Task T011: "Create RepoFilters at apps/demo-app/src/sections/RepoFilters.tsx" (US2)
Task T014: "Create RepoDetail at apps/demo-app/src/sections/RepoDetail.tsx" (US3)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007)
3. Complete Phase 3: User Story 1 (T008-T010)
4. **STOP and VALIDATE**: Navigate to `/apps/repos`, verify all 33 repos display as cards
5. Deploy/demo if ready — this is a functional portfolio viewer

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready
2. Add US1 (Phase 3) → Browsable card listing → Deploy (MVP!)
3. Add US2 (Phase 4) → Search + filter + sort → Deploy
4. Add US3 (Phase 5) → Accordion detail view → Deploy
5. Add US4 (Phase 6) → Portfolio summary stats → Deploy
6. Phase 7 → Polish, docs, verification → Final deploy

### Parallel Team Strategy

With multiple developers after Phase 2:

1. Developer A: US1 (Phase 3) — must complete first
2. Then in parallel:
   - Developer A: US2 (Phase 4, filter/sort)
   - Developer B: US3 (Phase 5, detail/accordion)
   - Developer C: US4 (Phase 6, summary stats)
3. All hands: Phase 7 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable at its checkpoint
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- The prebuild script (`sync-repos-data.mjs`) follows the exact pattern from `sync-projects-data.mjs`
- All components must use semantic design tokens — no raw Tailwind colors
- All components must include ARIA attributes per constitution Principle IV
