# Implementation Quickstart: Critical Audit Compliance Fixes

**Feature**: 002-audit-criticals  
**Phase**: Phase 1 - Implementation Guide  
**Estimated Time**: 1-2 hours

## Overview

This guide provides step-by-step instructions for fixing all 47 critical constitutional violations across 5 files.

## Prerequisites

- [x] On `002-audit-criticals` branch
- [x] research.md created with complete mappings
- [x] All prerequisite reference guides exist:
  - `.documentation/copilot/session=2026-03-01/semantic-color-migration.md`
  - `.documentation/copilot/session=2026-03-01/jsdoc-style-guide.md`
  - `packages/design-tokens/theme.css`

## Step-by-Step Implementation

### Step 1: Verify Current State

**Validate starting point**:

```powershell
# Confirm branch
git branch --show-current
# Expected: 002-audit-criticals

# Baseline ESLint status
npm run lint
# Expected: Multiple violations for no-raw-primary-class and require-jsdoc

# Baseline test status
npm test
# Expected: 533 passing tests of 577 total (92.4% pass rate)
```

---

### Step 2: Fix BundleAnalyzer.tsx (43 violations)

**File**: `apps/demo-app/src/components/BundleAnalyzer.tsx`

#### 2.1 Toggle Button (Line 139)

**Find**:
```tsx
className="mb-2 rounded-full bg-purple-600 p-3 text-white shadow-lg transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
```

**Replace with**:
```tsx
className="mb-2 rounded-full bg-brand p-3 text-white shadow-lg transition-all hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
```

**Changes**: 3 violations fixed
- `bg-purple-600` → `bg-brand`
- `hover:bg-purple-700` → `hover:bg-brand-hover`
- `focus:ring-purple-500` → `focus:ring-focus-ring`

#### 2.2 Card Container (Line 160)

**Find**:
```tsx
<div className="min-w-80 rounded-lg border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
```

**Replace with**:
```tsx
<div className="min-w-80 rounded-lg border border-border bg-surface p-4 shadow-lg">
```

**Changes**: 3 violations fixed
- `bg-white` → `bg-surface`
- `dark:border-gray-700` removed (use single `border-border`)
- `dark:bg-gray-800` removed (semantic tokens handle dark mode)

#### 2.3 Heading Text (Line 162)

**Find**:
```tsx
<h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
```

**Replace with**:
```tsx
<h3 className="text-sm font-semibold text-text">
```

**Changes**: 2 violations fixed
- `text-gray-900` → `text-text`
- `dark:text-gray-100` removed

#### 2.4 Development Badge (Line 165)

**Find**:
```tsx
<span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
```

**Replace with**:
```tsx
<span className="rounded-full bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
```

**Changes**: 4 violations fixed
- `bg-purple-100` → `bg-brand/10` (brand color with 10% opacity)
- `text-purple-800` → `text-brand`
- `dark:bg-purple-900` removed
- `dark:text-purple-200` removed

#### 2.5 Labels and Values (Lines 173-189)

**JavaScript Label/Value (Lines 173-174)**:

Find:
```tsx
<span className="text-gray-600 dark:text-gray-400">JavaScript:</span>
<span className="font-mono text-blue-600 dark:text-blue-400">
```

Replace with:
```tsx
<span className="text-text-muted">JavaScript:</span>
<span className="font-mono text-data-viz-1">
```

Changes: 4 violations fixed

**CSS Label/Value (Lines 180-181)**:

Find:
```tsx
<span className="text-gray-600 dark:text-gray-400">CSS:</span>
<span className="font-mono text-green-600 dark:text-green-400">
```

Replace with:
```tsx
<span className="text-text-muted">CSS:</span>
<span className="font-mono text-data-viz-2">
```

Changes: 4 violations fixed

**Total Label/Value (Lines 188-189)**:

Find:
```tsx
<span className="text-gray-900 dark:text-gray-100">Total:</span>
<span className="font-mono text-purple-600 dark:text-purple-400">
```

Replace with:
```tsx
<span className="text-text">Total:</span>
<span className="font-mono text-brand">
```

Changes: 4 violations fixed

#### 2.6 Chunks Heading (Line 198)

**Find**:
```tsx
<h4 className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
```

**Replace with**:
```tsx
<h4 className="mb-2 text-xs font-medium text-text">
```

**Changes**: 2 violations fixed

**Verify**: After all BundleAnalyzer.tsx changes, ESLint should report 0 violations in this file (down from 43).

---

### Step 3: Fix EcommerceLayout.tsx (2 violations)

**File**: `apps/demo-app/src/components/EcommerceLayout.tsx`

**Context**: Navigation and footer backgrounds using raw gray colors.

#### Find the navigation/footer sections (Lines 124-175)

Look for classes like:
```tsx
className="bg-gray-50 ..."
className="hover:bg-gray-100 ..."
```

**Replace with**:
```tsx
className="bg-surface-alt ..."
className="hover:bg-surface-alt/80 ..."
```

**Pattern**: 
- All `bg-gray-50` → `bg-surface-alt`
- All `hover:bg-gray-100` → `hover:bg-surface-alt/80`

**Verify**: ESLint should report 0 violations in this file (down from 2).

---

### Step 4: Add JSDoc to App.tsx (Line 158)

**File**: `apps/demo-app/src/App.tsx`

**Location**: Above the main App component declaration (around line 158).

**Find**:
```typescript
  return (
    <ErrorBoundary>
      <Router basename={basename}>
```

Scroll up to find the component declaration (should be around line 158).

**Add JSDoc above component** (before any existing declaration):

```typescript
/**
 * Main application component providing routing, theme management, and layout.
 * 
 * Implements lazy-loaded routes with Suspense boundaries for code splitting,
 * dark mode toggle with localStorage persistence, and automatic basename
 * configuration for GitHub Pages deployment.
 * 
 * Features:
 * - Route-based code splitting with lazy loading
 * - Theme toggle (light/dark mode) with system preference detection
 * - Error boundary wrapper for graceful error handling
 * - Performance monitoring via PerformanceMonitor component
 * - Persistent theme preference in localStorage
 * 
 * @component
 * @returns {JSX.Element} The complete application with routing and theme support
 * 
 * @example
 * ```tsx
 * // App is the root component rendered in main.tsx
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 * ```
 */
const App: React.FC = () => {
  // existing implementation...
```

**Verify**: 1 violation fixed

---

### Step 5: Add JSDoc to App-clean.tsx (Line 3)

**File**: `apps/demo-app/src/App-clean.tsx`

**Location**: Above the function App() declaration (line 3).

**Find**:
```typescript
import React from 'react';

function App() {
```

**Add JSDoc**:
```typescript
import React from 'react';

/**
 * Clean minimal application component for basic theme demonstration.
 * 
 * Simplified version of App.tsx without routing, showcasing dark mode
 * toggle functionality with localStorage persistence and system preference
 * detection. Used for testing and demonstrating theme capabilities in
 * isolation.
 * 
 * Features:
 * - Dark mode toggle with state persistence
 * - System color scheme preference detection
 * - localStorage-based theme persistence
 * - Minimal UI for theme demonstration
 * 
 * @component
 * @returns {JSX.Element} Minimal app with theme toggle
 * 
 * @example
 * ```tsx
 * // Alternative minimal entry point
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <App />
 * );
 * ```
 */
function App() {
```

**Verify**: 1 violation fixed

---

### Step 6: Configure Coverage Thresholds

**File**: `vitest.config.ts`

#### 6.1 Check Current Coverage First

**CRITICAL**: Run coverage report BEFORE adding enforcement:

```powershell
npm test -- --coverage
```

Review the output summary:
```
Coverage summary
  Statements   : XX% (###/###)
  Branches     : XX% (###/###)
  Functions    : XX% (###/###)
  Lines        : XX% (###/###)
```

**Decision Point**:
- If ALL metrics ≥ 80% → Proceed with 80% thresholds
- If ANY metric < 80% → Set threshold to current level (round down to nearest 5%)

#### 6.2 Update vitest.config.ts

**Find the coverage section**:
```typescript
coverage: {
  reporter: ['text', 'json', 'html'],
  exclude: [
    // existing excludes...
  ],
},
```

**Replace with** (if coverage ≥ 80%):
```typescript
coverage: {
  reporter: ['text', 'json', 'html', 'lcov'],
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
  exclude: [
    'node_modules/',
    'dist/',
    '.turbo/',
    'coverage/',
    '**/*.config.{js,ts}',
    '**/*.d.ts',
  ],
},
```

**Alternative** (if coverage < 80%, example with 75%):
```typescript
coverage: {
  reporter: ['text', 'json', 'html', 'lcov'],
  thresholds: {
    statements: 75,  // Current coverage level
    branches: 75,
    functions: 75,
    lines: 75,
    // TODO: Increase to 80% constitutional requirement by 2026-03-15
  },
  exclude: [
    // same excludes...
  ],
},
```

**Changes**:
- Added `'lcov'` reporter (for CI/CD coverage tools)
- Added `thresholds` object with 80% minimums (or current level)

---

### Step 7: Validation

#### 7.1 ESLint Validation

```powershell
npm run lint
```

**Expected**: Zero errors
- All `no-raw-primary-class` violations resolved (45 → 0)
- All `require-jsdoc` violations resolved (2 → 0)

If violations remain:
- Review error messages for line numbers
- Cross-reference with research.md mapping table
- Verify exact token replacement

#### 7.2 Test Validation

```powershell
npm test
```

**Expected**: All 533 existing tests pass (no regressions)

If tests fail:
- Check for incorrect token replacements
- Verify no syntax errors introduced
- Review component logic unchanged

#### 7.3 Coverage Enforcement Validation

```powershell
npm test -- --coverage
```

**Expected Behavior**:
- If coverage meets thresholds → Exit code 0, success message
- If coverage below thresholds → Exit code 1, failure with details

**Manual threshold test** (if coverage ≥ 80% currently):
1. Temporarily lower threshold to 90% in vitest.config.ts
2. Run `npm test -- --coverage`
3. Verify build FAILS with threshold error message
4. Restore threshold to 80%
5. Run again to verify success

#### 7.4 Manual Dark Mode Testing

**Pages to test**:
1. Any page using BundleAnalyzer component (development mode)
2. E-commerce page (uses EcommerceLayout)

**Test procedure**:
1. Start dev server: `npm run dev`
2. Open each page in browser
3. Toggle dark mode using theme switcher
4. **Verify**:
   - All colors transition smoothly
   - No hard-coded dark/light colors remain
   - Text remains readable against backgrounds
   - Focus states visible and correct
   - Charts/data visualizations use correct colors

**Common issues**:
- If text is invisible → Wrong text-background pairing
- If colors don't change → Forgot to remove `dark:` prefix
- If focus ring missing → Verify focus-ring token applied

---

### Step 8: Commit Changes

```powershell
# Stage all changes
git add apps/demo-app/src/components/BundleAnalyzer.tsx
git add apps/demo-app/src/components/EcommerceLayout.tsx
git add apps/demo-app/src/App.tsx
git add apps/demo-app/src/App-clean.tsx
git add vitest.config.ts

# Commit with descriptive message
git commit -m "fix: Resolve 47 critical constitutional violations

- Replace 45 raw color classes with semantic design tokens
  - BundleAnalyzer.tsx: 43 violations fixed
  - EcommerceLayout.tsx: 2 violations fixed
- Add comprehensive JSDoc to main app components
  - App.tsx: Added component documentation
  - App-clean.tsx: Added component documentation
- Configure Vitest coverage thresholds (80% minimum)

Addresses:
- Constitution Principle III (Design System & Semantic Tokens)
- Constitution Principle V (Documentation Standards)
- Constitution Principle II (Testing Standards - enforcement)

Constitutional compliance: 73% → 100%
Critical violations: 47 → 0

Closes #[issue-number]
Refs: .documentation/specs/002-audit-criticals/spec.md"
```

---

## Troubleshooting

### Issue: ESLint still reports violations after token replacement

**Cause**: Incorrect token name or missed dark: variant

**Solution**:
1. Check exact error message for line number
2. Compare with research.md mapping table
3. Verify token exists in packages/design-tokens/theme.css
4. Ensure all `dark:` variants removed

### Issue: Dark mode colors look wrong

**Cause**: Using wrong semantic token for context

**Solution**:
1. Verify light-dark() function in theme.css for token
2. Check if using surface vs surface-alt correctly
3. Ensure text color contrasts with background
4. Review semantic color migration guide for context

### Issue: Coverage enforcement failing

**Cause**: Current coverage below 80% threshold

**Solution**:
1. Run `npm test -- --coverage` to see exact percentages
2. Either:
   - Add tests to reach 80% (separate feature)
   - Set threshold to current level with TODO comment
   - Document as known issue with remediation plan

### Issue: Tests failing after changes

**Cause**: Syntax error or property mismatch

**Solution**:
1. Check terminal output for specific error
2. Verify no typos in token replacements
3. Run `npm run lint` to catch syntax issues
4. Review git diff to ensure only intended changes made

---

## Success Checklist

- [ ] All 5 files modified correctly
- [ ] ESLint reports 0 errors
- [ ] All 533 passing tests continue to pass (92.4% pass rate maintained)
- [ ] Coverage enforcement configured
- [ ] Dark mode works correctly on tested pages
- [ ] IntelliSense shows JSDoc for App components
- [ ] Changes committed to branch
- [ ] Constitutional compliance: 100% (8/8 principles)
- [ ] Critical violations: 0

---

## Next Steps

After successful implementation:

1. **Generate tasks.md**: Run `/speckit.tasks` to create actionable task breakdown
2. **Create Pull Request**: 
   - Title: "Fix: Complete critical audit compliance (47 violations)"
   - Link to spec: .documentation/specs/002-audit-criticals/spec.md
   - Include before/after metrics
3. **Request Review**: Use `/speckit.pr-review` for constitution-aware review
4. **Merge to Main**: After approval, merge and delete feature branch
5. **Verify Compliance**: Schedule follow-up audit (2026-03-09) to confirm 0 violations

---

**Estimated Completion Time**: 1-2 hours  
**Risk Level**: Low (isolated changes, well-documented patterns)  
**Impact**: 100% constitutional compliance, 47 critical violations resolved
