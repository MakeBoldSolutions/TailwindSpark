# Dependency Upgrade — npm packages to safest newest version

> **TL;DR for the Product Owner**
> *What*: Bring every npm dependency across the monorepo (`packages/*`, `apps/*`) up to its latest safe version, keeping all backbone gates (typecheck, tests, lint, build) green.
> *Why*: Requested to reduce drift and pick up upstream fixes/security patches before they accumulate.
> *Status*: Clarified — no dependency changes made yet.
> *Decision needed*: None. All open questions ratified: TypeScript 6→7 (adopt now), `npm` packageManager 11→12 (defer), and CI now also gates on lint + type-check (new, in scope).

**Tier**: Feature
**Status**: Clarified

## Intent

Update all npm dependencies in the Turborepo workspace (`packages/*`, `apps/*`, plus root devDependencies) to their latest version, while keeping the repo in a shippable state throughout: `npm run build`, `npm run test`, `npm run lint`, and `npm run type-check` all pass after the upgrade, matching backbone principles 1 (TypeScript strict mode), 2 (test coverage), 6 (ESLint/Prettier zero errors), and 8 (CI/CD must pass).

**CI gap found and in scope for this feature**: `.github/workflows/deploy.yml` currently runs `npm ci`, `npm audit --audit-level moderate`, `npm test`, `npm run test:coverage`, and `npm run build` — but never `npm run lint` or `npm run type-check`. That means backbone principles 1 and 6, both marked `enforced`, aren't actually CI-enforced today. This feature adds both as blocking CI steps, since a dependency upgrade is exactly where a lint/type regression would otherwise slip through undetected.

Current state, cross-checked two ways (captured 2026-07-09):

- **`npm outdated --workspaces`** — reports drift only for what's actually resolved in `node_modules` vs. `latest`.
- **`npx npm-check-updates --workspaces --root -t latest`** — reports drift in each workspace's `package.json` **specifier** itself, regardless of what hoisting has already resolved. This is the more complete picture: it also surfaces packages `npm outdated` misses because a newer version is already installed via hoisting even though the workspace's own range is stale.

| Package | Furthest-behind range seen | Latest | Bump |
|---|---|---|---|
| **typescript** | 6.0.2 (design-tokens, ui-components) | 7.0.2 | **major** |
| **npm** (`packageManager` pin, root `package.json`) | 11.17.0 | 12.0.0 | **major — deferred** |
| eslint | 10.2.0 (ui-components, demo-app) | 10.6.0 | minor |
| tailwindcss | 4.1.18 (ui-components) | 4.3.2 | minor |
| typescript-eslint | 8.58.2 (ui-components, demo-app) | 8.63.0 | minor |
| vite | 8.0.14 (ui-components, demo-app) | 8.1.4 | minor |
| @vitest/ui | 4.1.3 (ui-components) | 4.1.10 | minor |
| jsdom | 29.0.2 (ui-components) | 29.1.1 | minor |
| lucide-react | 1.18.0 | 1.23.0 | minor |
| react-router-dom | 7.17.0 | 7.18.1 | minor |
| prettier | 3.8.4 (root) | 3.9.4 | minor |
| tsx | 4.22.4 (root) | 4.23.0 | minor |
| eslint-plugin-jsdoc | 63.0.7 (root) | 63.0.12 | patch |
| @axe-core/react | 4.11.3 (root) | 4.12.1 | minor |
| @vitejs/plugin-react | 6.0.2 | 6.0.3 | patch |
| autoprefixer | 10.5.0 | 10.5.2 | patch |
| postcss | 8.5.15 | 8.5.16 | patch |
| globals | 17.6.0 | 17.7.0 | patch |
| vitest / @vitest/coverage-v8 | 4.1.9 (root) | 4.1.10 | patch |

**Range-drift finding**: `packages/ui-components` and `apps/demo-app` pin noticeably older floors than root for several packages (eslint, tailwindcss, typescript-eslint, vite) — hoisting has been masking this because the installed version already satisfies both the stale workspace range and is close enough to root's. Reconciling these ranges so all workspaces move together is part of this work, not just bumping to `latest`.

`npm audit` (full tree, prod + dev, not just `--omit=dev`) reports **0 known vulnerabilities** at any severity — this is a freshness/consistency upgrade, not a security-incident response.

## Acceptance Criteria

- [ ] Every dependency listed above is bumped to `latest` in its workspace's `package.json`, except the `npm` packageManager pin which stays on the latest 11.x line per the ratified defer decision (see Resolved).
- [ ] Workspace `package.json` ranges are reconciled — no workspace pins a floor older than root's for a shared dependency (closes the range-drift finding above).
- [ ] `npm install` completes clean with no `npm audit` regressions (stays at 0 vulnerabilities or better, across the full tree not just prod).
- [ ] `npm run build` succeeds at the repo root with no changes to tracked source (backbone principle 9).
- [ ] `npm run test` (Vitest) passes across all workspaces with coverage at or above the existing baseline (backbone principle 2).
- [ ] `npm run lint` passes with zero errors across all workspaces (backbone principle 6).
- [ ] Type-check passes in strict mode with no new `any`/type-coverage regressions (backbone principle 1).
- [ ] `.github/workflows/deploy.yml` runs `npm run lint` and `npm run type-check` as blocking steps, closing the gap where principles 1 and 6 were `enforced` in name but not CI-checked.
- [ ] CI (GitHub Actions) passes on the PR before merge, now including the new lint/type-check steps (backbone principle 8).
- [ ] Any breaking change surfaced by an upgrade (most notably TypeScript 7) is called out explicitly in the PR description, not silently absorbed.

## Open Questions

None remaining — see Resolved below.

### Resolved

- **CI checks outside `build`/`test`/`lint`**: none installed. Checked `package.json` across root, `demo-app`, and `ui-components` for Playwright/Chromatic/Cypress/Storybook — no hits. `TESTING.md`'s "Next Steps" (Playwright, axe-core testing) are aspirational, not present in the dependency tree. The complete gate set is `build`, `test`, `test:coverage`, `lint`, `type-check` — all covered by this spec's Acceptance Criteria.

- **TypeScript 6.x → 7.0.2 (major)**: **Ratified — adopt now**, in this same pass. If strict-mode compilation breaks in a way that isn't a quick fix, fall back to pinning `^6.0.x` and file a follow-up rather than blocking the whole upgrade.
- **`npm` (packageManager pin) 11.17.0 → 12.0.0 (major)**: **Ratified — defer.** Keep `packageManager` pinned to the latest 11.x line in this pass; treat the 12.x adoption as separate, coordinated work.

## Affected Files

- Root `package.json` and `package-lock.json`
- `packages/*/package.json` (workspaces using the packages above)
- `apps/*/package.json` (workspaces using the packages above)
- `.github/workflows/deploy.yml` — add blocking `npm run lint` and `npm run type-check` steps

## Tasks

- [ ] T1: Bump minor/patch dependencies and reconcile workspace range drift; verify build/test/lint/type-check
- [ ] T2: Bump TypeScript to 7.0.2 (ratified: adopt now); fix any resulting strict-mode breakage
- [ ] T3: Add blocking `npm run lint` and `npm run type-check` steps to `.github/workflows/deploy.yml`
- [ ] T4: Run full CI-equivalent gate locally, update `bold-docs/system/guides/CHANGELOG.md`
- [ ] T5 (excluded from this feature): `npm` packageManager 11→12 — deferred, tracked separately
