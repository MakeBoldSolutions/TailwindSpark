# Dependency Upgrade — npm packages to safest newest version

> **TL;DR for the Product Owner**
> *What*: Bring every npm dependency across the monorepo (`packages/*`, `apps/*`) up to its latest safe version, keeping all backbone gates (typecheck, tests, lint, build) green.
> *Why*: Requested to reduce drift and pick up upstream fixes/security patches before they accumulate.
> *Status*: In Progress — T001–T010 done (all dependencies bumped, TypeScript 7 attempted and reverted per its ratified fallback, all gates green locally, CI workflow updated). T011–T012 (open the PR, confirm CI, document breaking changes) remain for `bold.ship`.
> *Decision needed*: None. TypeScript stays on 6.0.3 (7.0.2 blocked by `typescript-eslint`'s peer dependency, follow-up filed); `npm` packageManager 11→12 deferred; CI now also gates on lint + type-check + a blocking audit step (new, in scope).

**Tier**: Feature
**Status**: In Progress

## Intent

Update all npm dependencies in the Turborepo workspace (`packages/*`, `apps/*`, plus root devDependencies) to their latest version, while keeping the repo in a shippable state throughout: `npm run build`, `npm run test`, `npm run lint`, and `npm run type-check` all pass after the upgrade, matching backbone principles 1 (TypeScript strict mode), 2 (test coverage), 6 (ESLint/Prettier zero errors), and 8 (CI/CD must pass).

**CI gap found and in scope for this feature**: `.github/workflows/deploy.yml` currently runs `npm ci`, `npm audit --audit-level moderate`, `npm test`, `npm run test:coverage`, and `npm run build` — but never `npm run lint` or `npm run type-check`. That means backbone principles 1 and 6, both marked `enforced`, aren't actually CI-enforced today. This feature adds both as blocking CI steps, since a dependency upgrade is exactly where a lint/type regression would otherwise slip through undetected.

Current state, cross-checked two ways (captured 2026-07-09):

- **`npm outdated --workspaces`** — reports drift only for what's actually resolved in `node_modules` vs. `latest`.
- **`npx npm-check-updates --workspaces --root -t latest`** — reports drift in each workspace's `package.json` **specifier** itself, regardless of what hoisting has already resolved. This is the more complete picture: it also surfaces packages `npm outdated` misses because a newer version is already installed via hoisting even though the workspace's own range is stale.

| Package | Furthest-behind range seen | Latest | Bump |
|---|---|---|---|
| **typescript** | 6.0.2 (design-tokens, ui-components) | 7.0.2 attempted, **reverted to 6.0.3** (see Resolved) | **major — fallback invoked** |
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

- [x] Every dependency listed above is bumped to `latest` in its workspace's `package.json`, except the `npm` packageManager pin (stays on latest 11.x, ratified defer) and `typescript` (stays on latest 6.x / 6.0.3, fallback invoked — see Resolved).
- [x] Workspace `package.json` ranges are reconciled — no workspace pins a floor older than root's for a shared dependency (closes the range-drift finding above). Verified via `npx npm-check-updates --workspaces --root`: only the deferred `npm` pin remains outstanding.
- [x] `npm install` completes clean with no `npm audit` regressions (stays at 0 vulnerabilities or better, across the full tree not just prod). Confirmed: 0 vulnerabilities, full tree.
- [x] `npm run build` succeeds at the repo root with no changes to tracked source (backbone principle 9). Confirmed clean, and idempotent on a second run.
- [x] `npm run test` (Vitest) passes across all workspaces with coverage at or above the existing baseline (backbone principle 2). 757/757 tests pass; coverage 65.38%/56.36%/55.16%/67.84% (stmts/branch/funcs/lines), well above the 40% floor.
- [x] `npm run lint` passes with zero errors across all workspaces (backbone principle 6). Clean on the final (6.0.3) dependency set.
- [x] Type-check passes in strict mode with no new `any`/type-coverage regressions (backbone principle 1). Verified on both TypeScript 7.0.2 (isolated spike) and the final 6.0.3 (post-fallback) — clean on both.
- [x] `.github/workflows/deploy.yml` runs `npm run lint` and `npm run type-check` as blocking steps, closing the gap where principles 1 and 6 were `enforced` in name but not CI-checked. The existing `npm audit --audit-level moderate` step also loses its `continue-on-error: true` (found during `bold.plan critic`/`analyze` — same gap, same principle 8 rationale), so it becomes a real CI gate too. Steps added; actual CI run confirmation is AC9/T011.
- [ ] CI (GitHub Actions) passes on the PR before merge, now including the new lint/type-check steps (backbone principle 8).
- [ ] Any breaking change surfaced by an upgrade (most notably TypeScript 7) is called out explicitly in the PR description, not silently absorbed.

## Open Questions

None remaining — see Resolved below.

### Resolved

- **CI checks outside `build`/`test`/`lint`**: none installed. Checked `package.json` across root, `demo-app`, and `ui-components` for Playwright/Chromatic/Cypress/Storybook — no hits. `TESTING.md`'s "Next Steps" (Playwright, axe-core testing) are aspirational, not present in the dependency tree. The complete gate set is `build`, `test`, `test:coverage`, `lint`, `type-check` — all covered by this spec's Acceptance Criteria.

- **TypeScript 6.x → 7.0.2 (major)**: Ratified adopt-now, attempted, **fallback invoked during `bold.build`**. `tsc --noEmit` itself passed cleanly on 7.0.2 across all three real workspaces, but `npm run lint` hard-failed: `typescript-eslint@8.63.0`'s own `peerDependencies` caps at `typescript: '>=4.8.4 <6.1.0'` — TS 7 isn't supported by any stable `typescript-eslint` release, only unreleased `8.63.1-alpha.x` prereleases. Not a quick fix (waiting on upstream, not something to patch around), so triggered the spec's pre-ratified fallback: reverted to `typescript@6.0.3` (the latest stable release under `typescript-eslint`'s cap) across all four workspaces. Build, test, lint, and type-check all pass clean on the revert. **Follow-up filed**: re-attempt TypeScript 7 once `typescript-eslint` ships a compatible stable release — track separately, same pattern as the deferred `npm` packageManager bump.
- **`npm` (packageManager pin) 11.17.0 → 12.0.0 (major)**: **Ratified — defer.** Keep `packageManager` pinned to the latest 11.x line in this pass; treat the 12.x adoption as separate, coordinated work.

## Affected Files

- Root `package.json` and `package-lock.json`
- `packages/*/package.json` (workspaces using the packages above)
- `apps/*/package.json` (workspaces using the packages above)
- `.github/workflows/deploy.yml` — add blocking `npm run lint` and `npm run type-check` steps

## Tasks

- [x] T001 [P] Bump devDependencies to latest in `package.json` (root) — eslint, tailwindcss, typescript-eslint, prettier, tsx, eslint-plugin-jsdoc, @axe-core/react, vitest, @vitest/coverage-v8, @vitest/ui bumped to latest; typescript attempted at 7.0.2, fallback invoked, final at `^6.0.3`; `packageManager` left pinned to latest 11.x (ratified defer) — resolves AC1, AC10 (npm defer clause)
- [x] T002 [P] Bump dependencies to latest in `packages/design-tokens/package.json` — tailwindcss bumped to latest; typescript same fallback as T001, final `^6.0.3` — resolves AC1
- [x] T003 [P] Bump dependencies to latest in `packages/ui-components/package.json` — @vitejs/plugin-react, @vitest/ui, autoprefixer, eslint, jsdom, lucide-react, postcss, tailwindcss, typescript-eslint, vite, vitest bumped to latest; typescript same fallback, final `^6.0.3`; range floors now match or exceed root's — resolves AC1, AC2
- [x] T004 [P] Bump dependencies to latest in `apps/demo-app/package.json` — @vitejs/plugin-react, autoprefixer, eslint, globals, lucide-react, postcss, react-router-dom, tailwindcss, typescript-eslint, vite bumped to latest; typescript same fallback, final `~6.0.3`; range floors now match or exceed root's — resolves AC1, AC2
- [x] T005 Run `npm install` at repo root to regenerate `package-lock.json`; confirm a clean install with `npm audit` at 0 vulnerabilities or better (depends on T001–T004) — resolves AC3. Confirmed: 0 vulnerabilities.
- [x] T006 Run `npm run build` at repo root; confirm zero diff to tracked source afterward, per backbone principle 9 (depends on T005) — resolves AC4. Confirmed, and idempotent on re-run.
- [x] T007 [P] Run `npm run test` (Vitest, all workspaces); confirm coverage stays at or above the existing baseline, per backbone principle 2 (depends on T005) — resolves AC5. 757/757 tests pass.
- [x] T008 [P] Run `npm run lint` (all workspaces); fix any zero-error violations surfaced by the bumps, per backbone principle 6 (depends on T005) — resolves AC6. Clean on the final (6.0.3) set — the TS 7.0.2 attempt hard-failed here first (see T009 note), which is what triggered the fallback.
- [x] T009 [P] Run `npm run type-check` (strict mode); fix any TypeScript 7 regressions, falling back to pinning `^6.0.x` in the T001–T004 files only if unfixable, per the ratified fallback (depends on T005) — resolves AC7. `tsc --noEmit` itself passed cleanly on 7.0.2, but `npm run lint` (T008) hard-failed: `typescript-eslint@8.63.0` declares `peerDependencies.typescript: '>=4.8.4 <6.1.0'`, no stable release supports TS 7. Fallback invoked per the ratified plan; clean on 6.0.3.
- [x] T010 Add blocking `npm run lint` and `npm run type-check` steps to `.github/workflows/deploy.yml`, and remove `continue-on-error: true` from its existing `npm audit` step (depends on T008, T009 passing locally first) — resolves AC8. Done.
- [ ] T011 Open the PR and confirm CI passes end to end, including the new lint/type-check steps (depends on T010) — resolves AC9
- [ ] T012 Document any breaking changes surfaced (most likely from the TypeScript 7 bump) explicitly in the PR description (depends on T009) — resolves AC10

**Excluded from this feature**: `npm` packageManager 11→12 — ratified defer, no task here; track as separate, coordinated work. **TypeScript 7.0.2** — attempted during T009, blocked by `typescript-eslint`'s peer dependency (`<6.1.0`), fallback invoked per the ratified plan; track re-attempt as separate follow-up once `typescript-eslint` ships stable TS 7 support.
