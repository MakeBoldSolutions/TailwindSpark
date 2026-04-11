# Implementation Plan: GitHub Repositories Explorer

**Branch**: `001-github-repos-explorer` | **Date**: 2026-04-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `.documentation/specs/001-github-repos-explorer/spec.md`

## Summary

Build a GitHub Repositories Explorer as a new mini-app page within the existing demo-app, following the established mini-app pattern (like Projects, Articles, Weather). The explorer displays Mark Hazleton's 33 public repositories from `repositories.json` data (fetched at build time), with text search, language/status filtering, sorting, inline accordion detail expansion, and aggregate portfolio statistics. Uses existing ui-components and design-tokens packages.

## Technical Context

**Language/Version**: TypeScript 6.0.2 (strict mode), React 19.2.4
**Primary Dependencies**: React Router DOM 7.14.0, Zod 4.3.6, clsx 2.1.1, Lucide React 1.7.0, @tailwindspark/ui-components, @tailwindspark/design-tokens
**Storage**: Build-time JSON snapshot in `/public/data/repositories.json` + localStorage cache for runtime
**Testing**: Vitest 4.1.4 with @testing-library/react 16.3.2, jest-axe 10.0.0
**Target Platform**: Web (ES2020+), GitHub Pages deployment at `/TailwindSpark/`
**Project Type**: Mini-app page within existing demo-app (follows Projects/Articles/Weather pattern)
**Performance Goals**: Page load under 3 seconds, instant client-side filtering (<100ms)
**Constraints**: Static data (~33 repos, ~150KB JSON), no runtime API calls, responsive 320-2560px
**Scale/Scope**: Single page with accordion detail, ~33 repository cards, 5 filter/sort dimensions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle                            | Status | Notes                                                                                           |
| ------------------------------------ | ------ | ----------------------------------------------------------------------------------------------- |
| I. Type Safety                       | PASS   | TypeScript strict mode, Zod schema validation for JSON data, typed props for all components     |
| II. Testing Standards                | PASS   | Co-located .test.tsx files, 40% minimum coverage, @testing-library/react                        |
| III. Design System & Semantic Tokens | PASS   | All components use design-tokens package, no raw Tailwind colors                                |
| IV. Accessibility Standards          | PASS   | ARIA attributes on accordion (aria-expanded, aria-controls), keyboard navigation, semantic HTML |
| V. Documentation Standards           | PASS   | JSDoc on all exported components, hooks, and utility functions                                  |
| VI. Code Quality & Formatting        | PASS   | ESLint + Prettier, custom no-raw-primary-class rule                                             |
| VII. Monorepo Architecture           | PASS   | Mini-app within apps/demo-app, uses workspace packages                                          |
| VIII. CI/CD & Automation             | PASS   | Prebuild data sync script, Turborepo pipeline, existing GitHub Actions                          |

No violations. All gates pass.

## Project Structure

### Documentation (this feature)

```text
.documentation/specs/001-github-repos-explorer/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── repositories-schema.ts
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 output (created by /devspark.tasks)
```

### Source Code (repository root)

```text
apps/demo-app/
├── scripts/
│   └── sync-repos-data.mjs          # NEW: Prebuild data sync (mirrors sync-projects-data.mjs)
├── public/
│   └── data/
│       └── repositories.json        # NEW: Build-time snapshot of repo data
└── src/
    ├── types/
    │   └── repos-api.ts             # NEW: Zod schemas + TypeScript types
    ├── services/
    │   └── repos.service.ts         # NEW: Data fetching with cache
    ├── hooks/
    │   └── useRepos.ts              # NEW: React hook for repo data + filtering
    ├── pages/
    │   └── apps/
    │       └── ReposPage.tsx         # NEW: Main page component
    ├── sections/
    │   ├── RepoCard.tsx             # NEW: Repository card (collapsed + expanded)
    │   ├── RepoDetail.tsx           # NEW: Expanded detail panel content
    │   ├── RepoFilters.tsx          # NEW: Search + filter + sort controls
    │   └── RepoSummary.tsx          # NEW: Aggregate portfolio statistics
    └── App.tsx                      # MODIFIED: Add route /apps/repos
```

**Structure Decision**: Follow the established mini-app pattern within demo-app. Each mini-app has its own types, service, hook, page, and section components. This mirrors the Projects mini-app (`ProjectsPage`, `ProjectCard`, `useProjects`, `projects.service.ts`, `projects-api.ts`).

## Complexity Tracking

No constitution violations to justify. All patterns align with existing conventions.
