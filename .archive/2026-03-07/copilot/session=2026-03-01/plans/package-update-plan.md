# Package Update Plan - March 2026

**Date**: March 1, 2026  
**Repository**: TailwindSpark  
**Status**: Ready for Implementation

## Executive Summary

Analysis of `npm-check-updates` reveals **30 package updates** across the monorepo:
- **5 MAJOR updates** (potential breaking changes)
- **8 minor updates** (new features, backward compatible)
- **7 patch updates** (bug fixes)

**Risk Level**: MODERATE - ESLint v10 migration requires configuration changes

---

## Update Breakdown by Package

### Root Workspace (`package.json`)

| Package | Current | Target | Type | Risk |
|---------|---------|--------|------|------|
| @tailwindcss/postcss | ^4.1.18 | ^4.2.1 | Minor | LOW |
| ajv | ^8.17.1 | ^8.18.0 | Minor | LOW |
| **eslint** | **^9.39.2** | **^10.0.2** | **MAJOR** | **MEDIUM** |
| **jsdom** | **^27.4.0** | **^28.1.0** | **MAJOR** | **LOW** |
| npm | 11.9.0 | 11.11.0 | Patch | LOW |
| rimraf | ^6.1.2 | ^6.1.3 | Patch | LOW |
| tailwindcss | ^4.1.18 | ^4.2.1 | Minor | LOW |
| typescript-eslint | ^8.55.0 | ^8.56.1 | Minor | LOW |

### Demo App (`apps/demo-app/package.json`)

| Package | Current | Target | Type | Risk |
|---------|---------|--------|------|------|
| **@eslint/js** | **^9.39.2** | **^10.0.1** | **MAJOR** | **MEDIUM** |
| @types/react | ^19.2.13 | ^19.2.14 | Patch | LOW |
| autoprefixer | ^10.4.24 | ^10.4.27 | Patch | LOW |
| **eslint** | **^9.39.2** | **^10.0.2** | **MAJOR** | **MEDIUM** |
| eslint-plugin-react-refresh | ^0.5.0 | ^0.5.2 | Patch | LOW |
| **globals** | **^16.5.0** | **^17.4.0** | **MAJOR** | **LOW** |
| lucide-react | ^0.563.0 | ^0.575.0 | Minor | LOW |
| react-router-dom | ^7.13.0 | ^7.13.1 | Patch | LOW |
| **rollup-plugin-visualizer** | **^6.0.5** | **^7.0.0** | **MAJOR** | **LOW** |
| tailwindcss | ^4.1.18 | ^4.2.1 | Minor | LOW |
| typescript-eslint | ^8.55.0 | ^8.56.1 | Minor | LOW |

### Design Tokens (`packages/design-tokens/package.json`)

| Package | Current | Target | Type | Risk |
|---------|---------|--------|------|------|
| tailwindcss | ^4.1.18 | ^4.2.1 | Minor | LOW |

### UI Components (`packages/ui-components/package.json`)

| Package | Current | Target | Type | Risk |
|---------|---------|--------|------|------|
| @types/react | ^19.2.13 | ^19.2.14 | Patch | LOW |
| autoprefixer | ^10.4.24 | ^10.4.27 | Patch | LOW |
| **eslint** | **^9.39.2** | **^10.0.2** | **MAJOR** | **MEDIUM** |
| eslint-plugin-react-refresh | ^0.5.0 | ^0.5.2 | Patch | LOW |
| lucide-react | ^0.563.0 | ^0.575.0 | Minor | LOW |
| tailwindcss | ^4.1.18 | ^4.2.1 | Minor | LOW |
| typescript-eslint | ^8.55.0 | ^8.56.1 | Minor | LOW |

---

## Critical Breaking Changes Analysis

### 🔴 ESLint v9 → v10 (MAJOR)

**Impact**: HIGH - Affects all packages  
**Breaking Changes**:
- New flat config is now the only supported format
- Some rules deprecated/renamed
- Plugin compatibility changes
- Potential configuration syntax updates

**Migration Required**:
- Review ESLint v10 migration guide
- Update `eslint.config.js` files across all packages
- Test all linting rules
- Verify plugin compatibility (especially react-refresh, typescript-eslint)

**Files Affected**:
- `eslint.config.js` (root)
- `apps/demo-app/eslint.config.js`
- `packages/design-tokens/eslint.config.js`
- `packages/ui-components/eslint.config.js`
- `eslint-rules/no-raw-primary-class.js`

### 🟡 jsdom v27 → v28 (MAJOR)

**Impact**: LOW - Only affects testing  
**Scope**: Testing environment (vitest)  
**Breaking Changes**: Internal DOM implementation updates  
**Risk**: Minimal - mostly internal changes, unlikely to affect tests

### 🟡 globals v16 → v17 (MAJOR)

**Impact**: LOW - ESLint configuration dependency  
**Scope**: ESLint global variable definitions  
**Risk**: Low - coordinate with ESLint v10 update

### 🟡 rollup-plugin-visualizer v6 → v7 (MAJOR)

**Impact**: LOW - Development/build tool  
**Scope**: Bundle analysis reporting  
**Risk**: Minimal - non-production dependency

---

## Phased Implementation Plan

### Phase 1: Low-Risk Updates (Patches & Compatible Minors)
**Timeline**: Day 1  
**Risk**: LOW  
**Testing**: Standard CI/CD checks

**Updates**:
- npm: 11.9.0 → 11.11.0
- rimraf: ^6.1.2 → ^6.1.3
- @types/react: ^19.2.13 → ^19.2.14
- autoprefixer: ^10.4.24 → ^10.4.27
- eslint-plugin-react-refresh: ^0.5.0 → ^0.5.2
- react-router-dom: ^7.13.0 → ^7.13.1
- ajv: ^8.17.1 → ^8.18.0

**Commands**:
```bash
# Root
ncu -u npm rimraf ajv
npm install

# Demo App
cd apps/demo-app
ncu -u @types/react autoprefixer eslint-plugin-react-refresh react-router-dom
npm install
cd ../..

# UI Components
cd packages/ui-components
ncu -u @types/react autoprefixer eslint-plugin-react-refresh
npm install
cd ../..
```

**Verification**:
```bash
npm run lint
npm run test
npm run build
```

---

### Phase 2: Tailwind CSS & Related Updates
**Timeline**: Day 1-2  
**Risk**: LOW  
**Testing**: Visual regression, component tests

**Updates**:
- @tailwindcss/postcss: ^4.1.18 → ^4.2.1
- tailwindcss: ^4.1.18 → ^4.2.1 (all packages)
- lucide-react: ^0.563.0 → ^0.575.0

**Commands**:
```bash
# Update all Tailwind packages across monorepo
ncu -u tailwindcss @tailwindcss/postcss
cd apps/demo-app && ncu -u tailwindcss lucide-react && cd ../..
cd packages/design-tokens && ncu -u tailwindcss && cd ../..
cd packages/ui-components && ncu -u tailwindcss lucide-react && cd ../..

# Install dependencies
npm install
```

**Verification**:
```bash
npm run build
npm run dev  # Manual testing of UI components
npm test
```

**Review Checklist**:
- [ ] All Tailwind CSS classes rendering correctly
- [ ] Dark mode functionality intact
- [ ] Theme tokens applied properly
- [ ] No console warnings about deprecated features
- [ ] Icon rendering (lucide-react) working
- [ ] Performance tests pass

---

### Phase 3: TypeScript ESLint Update
**Timeline**: Day 2  
**Risk**: LOW-MEDIUM  
**Testing**: Linting, type checking

**Updates**:
- typescript-eslint: ^8.55.0 → ^8.56.1 (root, demo-app, ui-components)

**Commands**:
```bash
# Update across monorepo
ncu -u typescript-eslint
cd apps/demo-app && ncu -u typescript-eslint && cd ../..
cd packages/ui-components && ncu -u typescript-eslint && cd ../..

npm install
```

**Verification**:
```bash
npm run lint
npm run type-check  # If available
npx tsc --noEmit  # Type checking without emit
```

**Review Checklist**:
- [ ] No new linting errors
- [ ] TypeScript compilation successful
- [ ] No new type errors
- [ ] Custom ESLint rules still working (`eslint-rules/no-raw-primary-class.js`)

---

### Phase 4: ESLint v10 Migration (HIGH PRIORITY)
**Timeline**: Day 2-3  
**Risk**: MEDIUM  
**Testing**: Comprehensive linting, CI/CD validation

**Updates**:
- eslint: ^9.39.2 → ^10.0.2 (root, demo-app, ui-components)
- @eslint/js: ^9.39.2 → ^10.0.1 (demo-app)
- globals: ^16.5.0 → ^17.4.0 (demo-app)

**Pre-Migration Steps**:
1. **Review ESLint v10 changelog**:
   - Visit https://eslint.org/blog/
   - Check migration guide
   - Review breaking changes

2. **Backup current configuration**:
   ```bash
   cp eslint.config.js eslint.config.js.backup
   cp apps/demo-app/eslint.config.js apps/demo-app/eslint.config.js.backup
   cp packages/design-tokens/eslint.config.js packages/design-tokens/eslint.config.js.backup
   cp packages/ui-components/eslint.config.js packages/ui-components/eslint.config.js.backup
   ```

3. **Document current lint status**:
   ```bash
   npm run lint > lint-before.txt
   ```

**Migration Steps**:
```bash
# Update ESLint packages
ncu -u eslint
cd apps/demo-app && ncu -u eslint @eslint/js globals && cd ../..
cd packages/ui-components && ncu -u eslint && cd ../..

npm install
```

**Configuration Updates Required**:

Review each `eslint.config.js` file for:
- Deprecated rule names
- Plugin API changes
- Global variable definitions (coordinate with globals v17)
- Custom rules compatibility (`no-raw-primary-class.js`)

**Verification Plan**:
```bash
# Test linting across all packages
npm run lint

# Individual package testing
cd apps/demo-app && npm run lint && cd ../..
cd packages/design-tokens && npm run lint && cd ../..
cd packages/ui-components && npm run lint && cd ../..

# Compare with pre-migration status
npm run lint > lint-after.txt
# Review differences
```

**Rollback Plan**:
```bash
# If issues found, restore backups
cp eslint.config.js.backup eslint.config.js
cp apps/demo-app/eslint.config.js.backup apps/demo-app/eslint.config.js
cp packages/design-tokens/eslint.config.js.backup packages/design-tokens/eslint.config.js
cp packages/ui-components/eslint.config.js.backup packages/ui-components/eslint.config.js

# Restore package versions
git checkout package.json apps/demo-app/package.json packages/ui-components/package.json
npm install
```

**Migration Checklist**:
- [ ] ESLint v10 changelog reviewed
- [ ] Configuration backups created
- [ ] All packages updated
- [ ] Configuration files updated
- [ ] No new linting errors (or documented/fixed)
- [ ] Custom ESLint rule working
- [ ] CI/CD pipeline passing
- [ ] VSCode ESLint extension working

---

### Phase 5: Remaining Major Updates
**Timeline**: Day 3  
**Risk**: LOW  
**Testing**: Standard CI/CD checks

**Updates**:
- jsdom: ^27.4.0 → ^28.1.0
- rollup-plugin-visualizer: ^6.0.5 → ^7.0.0

**Commands**:
```bash
# Root
ncu -u jsdom

# Demo App
cd apps/demo-app
ncu -u rollup-plugin-visualizer
cd ../..

npm install
```

**Verification**:
```bash
npm test  # Verify jsdom changes don't break tests
npm run build  # Verify visualizer still works
```

---

## Complete Update Commands (All at Once)

**⚠️ USE ONLY IF CONFIDENT - Applies all updates simultaneously**

```bash
# Root workspace
ncu -u

# Demo app
cd apps/demo-app
ncu -u
cd ../..

# Design tokens
cd packages/design-tokens
ncu -u
cd ../..

# UI components
cd packages/ui-components
ncu -u
cd ../..

# Install all dependencies
npm install

# Run comprehensive tests
npm run lint
npm run test
npm run build
```

---

## Testing Strategy

### Automated Tests
```bash
# Linting
npm run lint

# Unit/Integration tests
npm run test

# Build verification
npm run build

# Type checking
npx tsc --noEmit -p apps/demo-app/tsconfig.json
npx tsc --noEmit -p packages/ui-components/tsconfig.json
```

### Manual Testing Checklist
- [ ] Dev server starts without errors: `npm run dev`
- [ ] All pages load correctly
- [ ] Theme switcher works (light/dark modes)
- [ ] Navigation functional
- [ ] Search functionality works
- [ ] Responsive design intact
- [ ] No console errors or warnings
- [ ] Bundle size acceptable (check with visualizer)

### Performance Testing
```bash
# Run Lighthouse CI
npm run lighthouse  # If configured

# Manual checks
# - First Contentful Paint
# - Time to Interactive
# - Bundle size comparison
```

---

## Risk Mitigation

### Branch Strategy
```bash
# Create update branch
git checkout -b feature/package-updates-march-2026
git push -u origin feature/package-updates-march-2026
```

### Commit Strategy
Commit after each phase for easy rollback:
```bash
# After Phase 1
git add -A
git commit -m "chore: update low-risk patch and minor dependencies"

# After Phase 2
git add -A
git commit -m "chore: update Tailwind CSS to v4.2.1 and lucide-react"

# After Phase 3
git add -A
git commit -m "chore: update typescript-eslint to v8.56.1"

# After Phase 4
git add -A
git commit -m "feat: migrate to ESLint v10 with updated configuration"

# After Phase 5
git add -A
git commit -m "chore: update jsdom and rollup-plugin-visualizer"
```

### Rollback Procedures
```bash
# Rollback specific phase
git revert <commit-hash>

# Complete rollback
git reset --hard origin/main
npm install
```

---

## Post-Update Validation

### Documentation Updates
- [ ] Update CHANGELOG.md with dependency changes
- [ ] Update README.md if new features available
- [ ] Document any breaking changes
- [ ] Update package.json scripts if needed

### CI/CD Verification
- [ ] GitHub Actions workflows pass
- [ ] Lighthouse CI scores acceptable
- [ ] No new security vulnerabilities: `npm audit`
- [ ] Bundle size within limits

### Dependency Health Check
```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages after update
ncu

# Verify dependency tree
npm ls --depth=0
```

---

## Success Criteria

✅ **Complete when:**
1. All 30 packages updated to target versions
2. All automated tests passing
3. Manual testing checklist completed
4. No new ESLint errors
5. Build succeeds without warnings
6. Dev server runs without errors
7. Production build optimized
8. Documentation updated
9. Changes committed and pushed

---

## Timeline Summary

| Phase | Duration | Risk | Can Run Parallel |
|-------|----------|------|------------------|
| Phase 1: Low-Risk Updates | 2 hours | LOW | ✅ Yes |
| Phase 2: Tailwind Updates | 2-4 hours | LOW | ✅ Yes |
| Phase 3: TypeScript ESLint | 1-2 hours | LOW | ⚠️ After Phase 1 |
| Phase 4: ESLint v10 | 4-8 hours | MEDIUM | ❌ After Phase 3 |
| Phase 5: Remaining Majors | 1-2 hours | LOW | ✅ Yes (with Phase 1-2) |

**Total Estimated Time**: 1-2 days (including testing and validation)

---

## Recommendations

### Immediate Action (Recommended Approach)
1. **Start with Phased Approach** - Less risky, easier to debug
2. **Begin with Phases 1-3** - Can be done in parallel, low risk
3. **Dedicate focused time to Phase 4** - ESLint v10 requires attention
4. **Complete with Phase 5** - Quick finalization

### Alternative Approach (For Experienced Teams)
If you're confident and have good test coverage:
- Update all at once using complete update commands
- Run full test suite
- Address any issues that arise

### Skip If:
- Active development on main features
- Near a release deadline
- Insufficient time for proper testing
- Team capacity limited

---

## Additional Resources

- [ESLint v10 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [Tailwind CSS v4 Changelog](https://tailwindcss.com/blog)
- [TypeScript ESLint Releases](https://github.com/typescript-eslint/typescript-eslint/releases)
- [npm-check-updates Documentation](https://github.com/raineorshine/npm-check-updates)

---

## Notes

- All version numbers verified as of March 1, 2026
- Risk assessments based on package scope and breaking changes
- Timeline assumes single developer, adjust for team
- ESLint v10 is the primary concern - allocate appropriate time
- Consider dependency security advisories during update
