# Dependency Refresh — August 2026 npm package audit

> **TL;DR for the Product Owner**
> _What_: Refresh npm dependencies across the monorepo to the latest versions that can be validated safely, resolving current audit findings.
> _Why_: A fresh `npm audit` reports seven high-severity vulnerability groups and `ncu` reports package drift since the previous dependency upgrade.
> _Status_: Complete.
> _Decision needed_: None. Node support is raised to 26 so npm 12 and jsdom 30 can be adopted; linting is migrated to Oxlint so TypeScript 7 can also be adopted.

**Tier**: Feature
**Status**: Complete

## Intent

Bring the workspace dependency set back to a current, shippable state while intentionally raising the repo's Node support floor to keep current npm and jsdom releases in range. Update packages reported by `npx npm-check-updates --workspaces --root -t latest`, migrate linting from ESLint to Oxlint so TypeScript 7 is no longer blocked by `typescript-eslint`, regenerate the lockfile, and verify the enforced backbone gates: audit, build, tests/coverage, lint, type-check, formatting, and build idempotence.

## Audit Snapshot

Captured 2026-08-17:

- `npm audit --audit-level moderate` reports seven high-severity vulnerability groups: `brace-expansion`, `fast-uri`, `nanoid`, `postcss`, `react-router` via `react-router-dom`, and `undici`.
- `npm outdated --workspaces --long` reports current safe drift in app/package dependencies including `@microsoft/signalr`, `@vitejs/plugin-react`, `eslint`, `lucide-react`, `postcss`, `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `typescript-eslint`, and `vite`.
- `npx npm-check-updates --workspaces --root -t latest` additionally reports root specifier drift including `@axe-core/react`, `eslint-plugin-jsdoc`, `jest-axe`, `jsdom`, `prettier`, `turbo`, and `web-vitals`.
- `typescript-eslint@8.67.0` declares `peerDependencies.typescript: >=4.8.4 <6.1.0`; this refresh removes that dependency and adopts Oxlint plus `oxlint-tsgolint` instead.
- `npm@12.0.2` and `jsdom@30.0.1` declare `engines.node: ^22.22.2 || ^24.15.0 || >=26.0.0`; this refresh raises the repo engine and CI workflows to Node 26 so both can be adopted.

## Acceptance Criteria

- [x] All package specifier drift from `ncu --workspaces --root -t latest` is applied across root, `packages/*`, and `apps/*`.
- [x] TypeScript is upgraded to `7.0.2`; npm packageManager is upgraded to `npm@12.0.2` and the repo/CI Node target is raised to Node 26.
- [x] `package-lock.json` is regenerated from a root `npm install`.
- [x] `npm audit --audit-level moderate` passes with zero moderate-or-higher vulnerabilities.
- [x] `npm run lint` passes with Oxlint and zero errors.
- [x] `npm run type-check` passes.
- [x] `npm run test:coverage` passes and remains above the 40% backbone coverage floor.
- [x] `npm run build` passes and a second build produces no additional tracked-source diff.
- [x] Changed parseable files pass targeted Prettier verification. Repo-wide `npm run format:check` remains a pre-existing gap because it scans broad legacy files and previously scanned `.archive/`; this feature adds `.archive` to `.prettierignore`.
- [x] `ncu --workspaces --root -t latest` reports all dependencies match latest package versions.

## Affected Files

- `package.json`
- `package-lock.json`
- `.oxlintrc.json`
- `.prettierignore`
- `.github/workflows/deploy.yml`
- `.github/workflows/deploy-optimized.yml`
- `.github/workflows/release.yml`
- `.github/workflows/security.yml`
- `bold-docs/backbone.md`
- `bold-docs/system/coding-standards.md`
- `packages/design-tokens/package.json`
- `packages/ui-components/package.json`
- `packages/ui-components/vite.config.ts`
- `apps/demo-app/package.json`
- `apps/demo-app/vite.config.ts`
- `apps/demo-app/src/components/EcommerceLayout.tsx`
- `apps/demo-app/src/components/ProductGrid.tsx`
- `apps/demo-app/src/components/QuickViewModal.tsx`
- `apps/demo-app/src/components/SearchComponent.tsx`
- `apps/demo-app/src/pages/MarketingPage.tsx`
- `bold-docs/features/0002-dependency-refresh/spec.md`

## Tasks

- [x] T001 [P] Apply safe `ncu` updates to root `package.json`, including TypeScript 7. `packageManager` is upgraded to `npm@12.0.2` and Node support is raised to `>=26.0.0`.
- [x] T002 [P] Apply safe `ncu` updates to `packages/design-tokens/package.json`, including TypeScript 7.
- [x] T003 [P] Apply safe `ncu` updates to `packages/ui-components/package.json`, including TypeScript 7.
- [x] T004 [P] Apply safe `ncu` updates to `apps/demo-app/package.json`, including TypeScript 7.
- [x] T005 Regenerate `package-lock.json` with `npm install` and confirm audit clears. `npm audit --audit-level moderate` reports 0 vulnerabilities.
- [x] T006 Run lint and type-check gates; fix dependency-related breakages only. Both pass after replacing ESLint with Oxlint, loading the custom semantic-token rule as an Oxlint JS plugin, and replacing Vite config `__dirname` path resolution with `import.meta.url` based paths.
- [x] T007 Run coverage and build gates; fix dependency-related breakages only. Coverage passed: ui-components 154/154 tests, demo-app 757/757 tests, aggregate demo-app coverage 65.38% statements / 56.49% branches / 55.16% functions / 67.84% lines; production build passed after flattening the Vite React plugin typing for TypeScript 7.
- [x] T008 Confirm build idempotence and formatting. A second `npm run build` passed from cache with no additional tracked-source diff; targeted Prettier check passed for changed parseable files. Full `npm run format:check` is a pre-existing repo-wide gap, not resolved by this dependency refresh.
- [x] T009 Update this spec with final status, deferred items, and verification results.

## Verification Results

- `npx -p node@26 -p npm@12 npm install` completed cleanly after the safe dependency set was applied.
- `npx -p node@26 -p npm@12 npm ci` completed cleanly against the regenerated lockfile.
- `npx -p node@26 -p npm@12 npm audit --audit-level moderate` passes with 0 vulnerabilities.
- `npx -p node@26 -p npm@12 -p npm-check-updates -c "ncu --workspaces --root -t latest"` reports all dependencies match latest package versions.
- `npx -p node@26 -p npm@12 npm run lint` passes with Oxlint: ui-components reports 0 warnings/errors; demo-app reports 0 errors with legacy warnings.
- `npx -p node@26 -p npm@12 npm run type-check` passes.
- `npx -p node@26 -p npm@12 npm run test:coverage -- --force` passes: ui-components 154/154 tests, demo-app 757/757 tests; demo-app aggregate coverage is 65.38% statements / 56.49% branches / 55.16% functions / 67.84% lines.
- `npx -p node@26 -p npm@12 npm run build -- --force` passes; a second build also passes without introducing additional tracked-source diff.
- Targeted Prettier check passes for changed parseable files. Full `npm run format:check` remains a repo-wide legacy formatting gap and is not clean in this branch.
- Bold Feature-tier gates are recorded in `gates/analyze.md`, `gates/critic.md`, and `checklists/requirements.md`; no blocker findings.

## Waivers

None. Oxlint replaces ESLint as the lint engine for this repo; `.oxlintrc.json` documents the rule exclusions needed to preserve the existing gate while avoiding known migration false positives.
