# Research: GitHub Repositories Explorer

**Date**: 2026-04-09 | **Branch**: `001-github-repos-explorer`

## R1: Mini-App Integration Pattern

**Decision**: Follow the established mini-app pattern from ProjectsPage/ArticlesPage within demo-app.

**Rationale**: The demo-app already has 5 mini-apps (Projects, Articles, Jokes, Weather, AI Chat) each following a consistent architecture: Zod-typed API schema, service with cache fallback, React hook for state management, page component with lazy loading, and section components for UI pieces. Reusing this pattern ensures consistency and leverages existing infrastructure (cache service, error boundaries, loading states).

**Alternatives considered**:
- Separate app in `apps/github-repos-explorer/`: Rejected — would require duplicating Vite config, build pipeline, and deployment setup for what is functionally a single page. The monorepo already has the mini-app pattern for exactly this use case.
- External standalone site: Rejected — loses design system integration and monorepo benefits.

## R2: Build-Time Data Fetching Strategy

**Decision**: Create a prebuild script (`sync-repos-data.mjs`) that fetches `repositories.json` from the GitHub raw URL and snapshots it to `public/data/repositories.json`. The runtime service reads from this local snapshot with localStorage caching.

**Rationale**: Mirrors the existing `sync-projects-data.mjs` pattern. Build-time fetch avoids CORS issues, ensures data availability even if the source is temporarily down, and keeps page loads fast (no external fetch on every visit). The localStorage cache (via existing cache.service.ts) provides session-level freshness.

**Alternatives considered**:
- Runtime fetch directly from GitHub raw URL: Rejected — adds latency, CORS dependency, and failure risk on every page load.
- Bundled JSON import: Rejected — increases JS bundle size (~150KB JSON in the bundle). Static file in `/public/data/` is served separately and cached by the browser.

## R3: Client-Side Filtering and Search Approach

**Decision**: Implement filtering, search, and sorting entirely in the client using `useMemo` for derived/filtered arrays. No external search library needed for 33 items.

**Rationale**: With only ~33 repositories, client-side filtering is instantaneous. A simple case-insensitive substring match across name, description, and AI summary fields is sufficient. `useMemo` with dependency on filter state ensures efficient re-computation only when filters change.

**Alternatives considered**:
- Fuse.js or similar fuzzy search library: Rejected — overkill for 33 items with exact substring matching. Adds dependency weight without meaningful benefit.
- Server-side search: Rejected — no server, static site.

## R4: Accordion Detail Implementation

**Decision**: Use controlled React state (`expandedRepo: string | null`) to track which card is expanded. CSS transitions for smooth expand/collapse animation. ARIA attributes (`aria-expanded`, `aria-controls`, `role="region"`) for accessibility.

**Rationale**: A single state variable controlling which repo is expanded is the simplest correct approach for "only one expanded at a time" behavior. Aligns with WCAG accordion pattern and constitution accessibility requirements.

**Alternatives considered**:
- HTML `<details>/<summary>`: Rejected — cannot enforce single-open behavior natively, limited animation control.
- Third-party accordion library: Rejected — unnecessary dependency for a simple expand/collapse with one state variable.

## R5: Data Schema Validation

**Decision**: Define Zod schemas matching the repositories.json structure (schema v2.2.0). Validate at the service layer when parsing fetched data. Use partial/optional schemas for fields that may be null.

**Rationale**: Follows the established pattern in `projects-api.ts`, `rss-api.ts`, etc. Zod provides runtime validation with TypeScript type inference, catching schema drift early. Optional fields (ai_summary, tech_stack, homepage, screenshot) use `.nullable()` or `.optional()` to handle missing data gracefully.

**Alternatives considered**:
- No validation (trust the data): Rejected — constitution requires type safety; raw JSON from external source should be validated.
- Manual TypeScript interfaces without runtime validation: Rejected — loses the runtime safety that Zod provides, which is critical for external data.

## R6: Apps Hub Registration

**Decision**: Add a "Repositories" card to the AppsHubPage and a new route `/apps/repos` in App.tsx with React.lazy() loading.

**Rationale**: All existing mini-apps are registered this way. The AppsHubPage serves as the discovery entry point, and each mini-app gets its own lazy-loaded route for code splitting.

**Alternatives considered**:
- Separate top-level route outside `/apps/*`: Rejected — breaks the established navigation hierarchy.
