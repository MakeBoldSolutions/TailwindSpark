# Semantic Color Migration Guide

**Feature**: Constitution Compliance Remediation  
**Created**: 2026-03-01  
**Purpose**: Systematic guide for replacing raw Tailwind color classes with semantic design tokens

## Overview

This guide provides step-by-step instructions for migrating from raw Tailwind color classes (`bg-blue-500`, `text-gray-900`, etc.) to semantic design tokens (`bg-brand`, `text-text`, etc.) to achieve constitutional compliance and restore dark mode functionality.

## Why Semantic Tokens?

### Problems with Raw Colors

❌ **Raw Tailwind colors break dark mode**:
```tsx
// This looks good in light mode but broken in dark mode
<div className="bg-blue-500 text-white">
  <p className="text-gray-900">Content</p>  {/* Gray-900 is nearly black! */}
</div>
```

❌ **No centralized theming**:
- Changing brand color requires find-replace across 100+ files
- Inconsistent color usage (blue-500 vs blue-600 vs primary-600)
- No single source of truth for color decisions

❌ **Hinders maintainability**:
- Hard to understand intent (`bg-blue-600` → Is this brand? Interactive? Decorative?)
- Difficult to enforce design system consistency
- Violates Constitution Principle III (MANDATORY)

### Benefits of Semantic Tokens

✅ **Dark mode just works**:
```tsx
// Automatically adapts to light/dark mode
<div className="bg-brand text-brand-fg">
  <p className="text-text">Content</p>  {/* Readable in both modes */}
</div>
```

✅ **Centralized theming**:
- Change brand color once in `theme.css` → Applies everywhere
- Consistent usage across entire codebase
- Single source of truth

✅ **Self-documenting code**:
- `bg-brand` clearly indicates brand-colored element
- `bg-surface` indicates a surface/card background
- `text-muted` indicates secondary text

## Available Semantic Tokens

### Color Categories

#### Brand & Interactive

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|---------|-----------|
| `brand` | Primary brand color for CTAs, links | `primary-600` | `primary-600` |
| `brand-hover` | Hover state for brand elements | `primary-700` | `primary-700` |
| `brand-fg` | Foreground text on brand background | `#ffffff` | `#ffffff` |

**Usage**: Buttons, CTAs, active navigation, links, selected states

#### Surfaces & Backgrounds

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|---------|-----------|
| `surface` | Primary surface (cards, modals, etc.) | `#ffffff` | `secondary-900` |
| `surface-alt` | Alternate surface (hover states, striped rows) | `secondary-50` | `secondary-800` |
| `surface-inverse` | Inverse surface for contrast | `secondary-900` | `secondary-50` |

**Usage**: Card backgrounds, modal backgrounds, page sections

#### Text & Foreground

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|---------|-----------|
| `text` | Primary text color | `secondary-900` | `secondary-100` |
| `text-inverse` | Inverse text for dark backgrounds | `secondary-100` | `secondary-900` |
| `text-muted` | Secondary/muted text | `secondary-600` | `secondary-400` |

**Usage**: Body text, headings, labels, descriptions

#### Borders & Dividers

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|---------|-----------|
| `border` | Default border color | `secondary-200` | `secondary-700` |
| `border-strong` | Emphasized borders | `secondary-400` | `secondary-500` |

**Usage**: Card borders, input borders, dividers, table borders

#### Status Colors

| Token | Purpose | Use Case |
|-------|---------|----------|
| `success` | Success states | Success messages, checkmarks, completed states |
| `success-600` | Standard success background | Success buttons |
| `warning` | Warning states | Warning alerts, cautionary indicators |
| `warning-600` | Standard warning background | Warning buttons |
| `error` | Error states | Error messages, validation failures |
| `destructive` | Destructive actions | Delete buttons, remove actions |
| `error-600` | Standard error background | Error/destructive buttons |

#### Data Visualization (NEW)

| Token | Purpose | Chart Color |
|-------|---------|-------------|
| `data-viz-1` | Primary data series | Blue |
| `data-viz-2` | Secondary series | Green |
| `data-viz-3` | Tertiary series | Purple |
| `data-viz-4` | Quaternary series | Pink |
| `data-viz-5` | Accent series | Orange |
| `data-viz-6` | Supporting series | Cyan |
| `data-viz-7` | Highlight series | Yellow |
| `data-viz-8` | Emphasis series | Rose |

**Usage**: Chart segments, graph bars, data point colors, legend items

## Migration Patterns

### Common Replacements

#### Background Colors

| Raw Class | Semantic Replacement | Context |
|-----------|---------------------|---------|
| `bg-blue-500`, `bg-blue-600` | `bg-brand` | Primary brand elements |
| `bg-blue-700` | `bg-brand-hover` | Hover states on brand elements |
| `bg-white` | `bg-surface` | Cards, modals, page backgrounds |
| `bg-gray-50`, `bg-gray-100` | `bg-surface-alt` | Alternate rows, hover states |
| `bg-gray-900` | `bg-surface-inverse` | Dark backgrounds (footer, headers) |
| `bg-green-500`, `bg-green-600` | `bg-success-600` | Success buttons, indicators |
| `bg-yellow-500`, `bg-yellow-600` | `bg-warning-600` | Warning buttons, alerts |
| `bg-red-500`, `bg-red-600` | `bg-error-600` or `bg-destructive` | Error/delete buttons |

#### Text Colors

| Raw Class | Semantic Replacement | Context |
|-----------|---------------------|---------|
| `text-gray-900`, `text-black` | `text-text` | Primary body text |
| `text-gray-600`, `text-gray-500` | `text-muted` | Secondary text, descriptions |
| `text-white` | `text-brand-fg` or `text-text-inverse` | Text on dark backgrounds |
| `text-blue-600` | `text-brand` | Brand-colored text, links |
| `text-green-600` | `text-success` | Success messages |
| `text-red-600` | `text-error` or `text-destructive` | Error messages, warnings |

#### Border Colors

| Raw Class | Semantic Replacement | Context |
|-----------|---------------------|---------|
| `border-gray-200`, `border-gray-300` | `border` | Card borders, input borders |
| `border-gray-400` | `border-strong` | Emphasized borders |
| `border-blue-500` | `border-brand` | Focus states, selected items |

#### Chart/Data Visualization Colors

| Raw Class | Semantic Replacement | Context |
|-----------|---------------------|---------|
| `bg-blue-500` | `bg-data-viz-1` | Primary chart segment |
| `bg-green-500` | `bg-data-viz-2` | Secondary chart segment |
| `bg-purple-500` | `bg-data-viz-3` | Tertiary chart segment |
| `bg-pink-500` | `bg-data-viz-4` | Additional chart segment |
| `bg-orange-500` | `bg-data-viz-5` | Accent chart segment |
| `bg-cyan-500` | `bg-data-viz-6` | Supporting chart segment |
| `bg-yellow-500` | `bg-data-viz-7` | Highlight segment |
| `bg-rose-500` | `bg-data-viz-8` | Emphasis segment |

### Dark Mode Variants

When you see dark mode overrides, semantic tokens replace both:

❌ **Before** (manual dark mode):
```tsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  Content
</div>
```

✅ **After** (automatic dark mode):
```tsx
<div className="bg-surface text-text">
  Content
</div>
```

The semantic tokens automatically handle light/dark switching via CSS variables!

## Step-by-Step Migration Process

### Step 1: Identify Raw Color Usage

Run ESLint to find all violations:

```bash
npx eslint apps/ packages/ --ext .ts,.tsx
```

Current violations include:
- `AnimationShowcase.tsx` - 13 violations
- `AnalyticsPage.tsx` - 37+ violations
- `MarketingPage.tsx` - Needs audit

### Step 2: Categorize Color Intent

For each raw color, ask:

1. **Is this a brand/interactive element?** → Use `brand` tokens
2. **Is this a surface/background?** → Use `surface` tokens
3. **Is this text?** → Use `text` tokens
4. **Is this a border?** → Use `border` tokens
5. **Is this a status indicator?** → Use `success`/`warning`/`error` tokens
6. **Is this chart/data visualization?** → Use `data-viz-*` tokens

### Step 3: Replace with Semantic Token

#### Example 1: Button Migration

❌ **Before**:
```tsx
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Click Me
</button>
```

✅ **After**:
```tsx
<button className="bg-brand text-brand-fg hover:bg-brand-hover">
  Click Me
</button>
```

#### Example 2: Card Migration

❌ **Before**:
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <h3 className="text-gray-900 dark:text-white">Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

✅ **After**:
```tsx
<div className="bg-surface border border">
  <h3 className="text-text">Title</h3>
  <p className="text-muted">Description</p>
</div>
```

#### Example 3: Chart Migration

❌ **Before**:
```tsx
const chartData = [
  { name: 'Series 1', value: 100, color: '#3b82f6' }, // blue-500
  { name: 'Series 2', value: 80, color: '#10b981' },  // green-500
  { name: 'Series 3', value: 60, color: '#8b5cf6' },  // purple-500
];
```

✅ **After**:
```tsx
// Use semantic data-viz tokens
<div className="bg-data-viz-1">Series 1</div>
<div className="bg-data-viz-2">Series 2</div>
<div className="bg-data-viz-3">Series 3</div>
```

### Step 4: Test Dark Mode

After migration:

1. Run the app in light mode → Verify visuals match original
2. Toggle to dark mode → Verify everything is readable and styled correctly
3. Check color contrast with browser DevTools
4. Verify charts/graphs render properly in both modes

### Step 5: Run ESLint Validation

```bash
# Should report zero violations
npx eslint apps/ packages/ --ext .ts,.tsx
```

## File-Specific Migration Guides

### AnimationShowcase.tsx (13 violations)

**Lines 46, 128-129** - Blue/green colors in animations:
```tsx
// Before: bg-blue-500, bg-green-500
// After: bg-brand, bg-success-600
```

**Lines 141, 155** - Purple/red accent colors:
```tsx
// Before: bg-purple-500, bg-red-500
// After: bg-data-viz-3, bg-error-600
```

**Lines 188-189, 211, 296** - Gray backgrounds and hovers:
```tsx
// Before: bg-gray-400, hover:bg-gray-500
// After: bg-surface-alt, hover:bg-border-strong
```

### AnalyticsPage.tsx (37+ violations)

**Lines 100-105** - Traffic source chart colors:
```tsx
// Before: Multiple blue/green/purple shades
// After: data-viz-1 through data-viz-6
```

**Line 23** - Trend indicator colors:
``` tsx
// Before: text-green-600 (up) / text-red-600 (down)
// After: text-success (up) / text-error (down)
```

**Lines 160, 164** - Chart legend colors:
```tsx
// Before: bg-blue-500, bg-green-500
// After: bg-data-viz-1, bg-data-viz-2
```

**Lines 187, 190** - Bar chart colors with hover:
```tsx
// Before: bg-blue-600 hover:bg-blue-700
// After: bg-brand hover:bg-brand-hover
```

**Lines 153, 155** - Surface/background colors:
```tsx
// Before: bg-white dark:bg-gray-800
// After: bg-surface
```

## Validation Checklist

After migrating a file:

- [ ] No raw color classes remain (run ESLint)
- [ ] All elements use semantic tokens
- [ ] Dark mode toggle works correctly
- [ ] Visual appearance matches original in light mode
- [ ] Dark mode is readable and well-contrasted
- [ ] Charts/graphs use data-viz tokens consistently
- [ ] No manual `dark:` classes (automatic via tokens)
- [ ] Code is more maintainable and self-documenting

## ESLint Rule Reference

The `no-raw-primary-class` ESLint rule enforces semantic token usage.

**Detects**: `bg-{color}-{number}`, `text-{color}-{number}`, `border-{color}-{number}`, etc.

**Configuration**: `eslint-rules/no-raw-primary-class.js`

**Status**: **ERROR** level (blocks PR merge)

## Resources

- Design Tokens: `packages/design-tokens/theme.css`
- Constitution Principle III: `.documentation/memory/constitution.md`
- ESLint Rule: `eslint-rules/no-raw-primary-class.js`
- Quickstart Guide: `.documentation/specs/1-constitution-compliance/quickstart.md`
