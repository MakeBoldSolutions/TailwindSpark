# Quickstart: GitHub Repositories Explorer

**Branch**: `001-github-repos-explorer`

## Prerequisites

- Node.js >= 18
- npm 11+
- TailwindSpark monorepo cloned and dependencies installed (`npm install`)

## Development

```bash
# Switch to feature branch
git checkout 001-github-repos-explorer

# Install dependencies (if not already done)
npm install

# Sync repository data (fetches repositories.json to public/data/)
node apps/demo-app/scripts/sync-repos-data.mjs

# Start dev server (all packages + demo-app)
npm run dev
```

Navigate to `http://localhost:5173/TailwindSpark/apps/repos` to see the explorer.

## Key Files

| Purpose | Path |
| ------- | ---- |
| Prebuild data sync | `apps/demo-app/scripts/sync-repos-data.mjs` |
| Snapshot data | `apps/demo-app/public/data/repositories.json` |
| Zod types | `apps/demo-app/src/types/repos-api.ts` |
| Data service | `apps/demo-app/src/services/repos.service.ts` |
| React hook | `apps/demo-app/src/hooks/useRepos.ts` |
| Page component | `apps/demo-app/src/pages/apps/ReposPage.tsx` |
| Card component | `apps/demo-app/src/sections/RepoCard.tsx` |
| Detail panel | `apps/demo-app/src/sections/RepoDetail.tsx` |
| Filter controls | `apps/demo-app/src/sections/RepoFilters.tsx` |
| Summary stats | `apps/demo-app/src/sections/RepoSummary.tsx` |
| Route registration | `apps/demo-app/src/App.tsx` (add `/apps/repos`) |

## Testing

```bash
# Run tests for the new components
npx vitest run --filter="Repo"

# Run with coverage
npx vitest run --coverage --filter="Repo"
```

## Build

```bash
# Full build (includes prebuild data sync)
npm run build

# Deploy build (demo-app only)
npm run build:deploy
```

## Data Source

- **Remote**: `https://raw.githubusercontent.com/markhazleton/github-stats-spark/refs/heads/main/data/users/markhazleton/repositories.json`
- **Local snapshot**: `apps/demo-app/public/data/repositories.json`
- **Schema version**: 2.2.0
- **Refresh**: Re-run `sync-repos-data.mjs` or rebuild to update

## Architecture Notes

This mini-app follows the same pattern as the existing Projects mini-app:

1. **Prebuild script** fetches external JSON and snapshots to `public/data/`
2. **Service layer** reads the local snapshot with localStorage caching
3. **Zod schemas** validate the raw JSON and infer TypeScript types
4. **Custom hook** manages state (data, loading, error) and exposes filter/sort logic
5. **Page component** composes the hook with section components
6. **Section components** handle individual UI concerns (cards, filters, summary)
7. **Route** is lazy-loaded via `React.lazy()` in App.tsx
