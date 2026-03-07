# Quick Start Guide: Constitution Compliance Remediation

**Feature**: Constitution Compliance Remediation  
**Phase**: 1 - Implementation Guidance  
**Date**: 2026-03-01

## Overview

This guide provides step-by-step instructions for implementing the constitution compliance remediation across four priority areas. Follow the sequence to systematically address all 86 violations identified in the 2026-03-01 audit.

## Prerequisites

- Git branch `1-constitution-compliance` checked out
- Node.js and npm installed (matching package.json engines)
- VS Code with ESLint and Prettier extensions enabled
- Familiarity with React, TypeScript, Tailwind CSS, and Vitest

## Priority 1: Design System & Semantic Token Compliance

**Goal**: Replace 50+ raw Tailwind color classes with semantic design tokens  
**Estimated Time**: 8-12 hours  
**Success Criteria**: ESLint `no-raw-primary-class` reports zero violations

### Step 1.1: Create Data Visualization Color Palette

**File**: `packages/design-tokens/theme.css`

Add data visualization tokens to the `@theme` directive:

```css
/* Add after existing color tokens */
@theme {
  /* Existing tokens... */
  
  /* Data Visualization Colors - Chart/Graph Segments */
  --color-data-viz-1: light-dark(#2563eb, #3b82f6);  /* Blue - Primary series */
  --color-data-viz-2: light-dark(#059669, #10b981);  /* Green - Secondary */
  --color-data-viz-3: light-dark(#7c3aed, #a78bfa);  /* Purple - Tertiary */
  --color-data-viz-4: light-dark(#db2777, #f472b6);  /* Pink - Quaternary */
  --color-data-viz-5: light-dark(#ea580c, #fb923c);  /* Orange - Accent */
  --color-data-viz-6: light-dark(#0891b2, #22d3ee);  /* Cyan - Supporting */
  --color-data-viz-7: light-dark(#ca8a04, #facc15);  /* Yellow - Highlight */
  --color-data-viz-8: light-dark(#e11d48, #fb7185);  /* Rose - Emphasis */
}
```

**Validation**:
```bash
# Verify theme.css compiles correctly
cd packages/design-tokens
npm run build  # Or equivalent build command
```

### Step 1.2: Update Type Definitions

**File**: `packages/design-tokens/index.d.ts`

Add TypeScript definitions for new colors:

```typescript
export interface ColorTokens {
  brand: string;
  surface: string;
  text: string;
  success: string;
  warning: string;
  error: string;
  destructive: string;
  border: string;
  muted: string;
  // Add data viz tokens
  'data-viz-1': string;
  'data-viz-2': string;
  'data-viz-3': string;
  'data-viz-4': string;
  'data-viz-5': string;
  'data-viz-6': string;
  'data-viz-7': string;
  'data-viz-8': string;
}
```

### Step 1.3: Fix AnimationShowcase.tsx (13 violations)

**File**: `apps/demo-app/src/sections/AnimationShowcase.tsx`

**Migration Pattern**:

| Current (Raw) | Replacement (Semantic) | Context |
|--------------|------------------------|---------|
| `bg-blue-500` | `bg-brand` | Primary interactive elements |
| `bg-green-500` | `bg-success` | Success indicators |
| `bg-purple-500` | `bg-brand` or `bg-data-viz-3` | Accent elements |
| `bg-red-500` | `bg-error` | Error/destructive actions |
| `bg-gray-400` | `bg-surface` or `bg-muted` | Neutral backgrounds |
| `hover:bg-blue-600` | `hover:bg-brand-hover` | Interactive hover states |

**Example Fix** (line 46):
```tsx
// BEFORE
<div className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-green-500">

// AFTER
<div className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-success">
```

**Dark Mode Simplification**:
```tsx
// BEFORE
<div className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100">

// AFTER (semantic token handles dark mode automatically)
<div className="bg-surface text-text">
```

**Validation**:
1. Run dev server: `npm run dev`
2. Navigate to Animation page
3. Toggle dark mode - verify colors adapt correctly
4. Run ESLint: `npx eslint apps/demo-app/src/sections/AnimationShowcase.tsx`

### Step 1.4: Fix AnalyticsPage.tsx (37+ violations)

**File**: `apps/demo-app/src/pages/AnalyticsPage.tsx`

**Chart Color Replacements**:
```tsx
// BEFORE - Traffic source colors (lines 100-105)
const trafficSources = [
  { name: 'Direct', value: 45, color: 'bg-blue-500' },
  { name: 'Search', value: 30, color: 'bg-green-500' },
  { name: 'Social', value: 15, color: 'bg-pink-500' },
  { name: 'Referral', value: 10, color: 'bg-purple-500' }
];

// AFTER - Using semantic data viz tokens
const trafficSources = [
  { name: 'Direct', value: 45, color: 'bg-data-viz-1' },
  { name: 'Search', value: 30, color: 'bg-data-viz-2' },
  { name: 'Social', value: 15, color: 'bg-data-viz-4' },
  { name: 'Referral', value: 10, color: 'bg-data-viz-3' }
];
```

**Trend Indicators**:
```tsx
// BEFORE (line 23)
<span className={trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>

// AFTER
<span className={trend === 'up' ? 'text-success' : 'text-error'}>
```

**Surface/Background Colors**:
```tsx
// BEFORE (lines 153-155)
<div className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">

// AFTER
<div className="border-border bg-surface">
```

**Validation**:
1. Visually inspect all charts in both light and dark modes
2. Verify color contrast meets WCAG AA (should be maintained by token design)
3. Run ESLint to confirm zero violations

### Step 1.5: Audit and Fix Remaining Files

**Suspected Files** (based on audit):
- `apps/demo-app/src/pages/MarketingPage.tsx` (553 lines, likely has violations)
- Any other files flagged by strengthened ESLint rule

**Process**:
1. Run ESLint across all files: `npx eslint apps/ packages/ --ext .ts,.tsx`
2. For each violation file, apply migration patterns from Steps 1.3-1.4
3. Test dark mode toggle after each file fix
4. Commit changes per logical grouping (e.g., "fix: replace raw colors in MarketingPage")

### Step 1.6: Strengthen ESLint Rule (if needed)

**File**: `eslint-rules/no-raw-primary-class.js`

**Investigation**:
1. Review current rule implementation
2. Test against known violations: `npx eslint apps/demo-app/src/sections/AnimationShowcase.tsx`
3. If violations aren't caught, extend regex patterns:

```javascript
// Example pattern extension (adjust based on actual implementation)
const rawColorPattern = /\b(bg|text|border|ring|outline)-((gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950))\b/;

// Also check for dark mode variants
const darkModePattern = /dark:(bg|text|border|ring|outline)-((gray|...)-(...))\b/;
```

4. Add to pre-commit hooks (if not already present)

### Step 1.7: Create Migration Guide Document

**File**: `.documentation/copilot/session=2026-03-01/semantic-color-migration.md`

Create a reference document with:
- Common migration patterns (reference table from Step 1.3)
- Decision tree for choosing semantic tokens
- Before/after code examples
- Dark mode handling guidelines
- Link to packages/design-tokens/theme.css for token reference

---

## Priority 2: Code Documentation (JSDoc)

**Goal**: Add comprehensive JSDoc to 70+ exports  
**Estimated Time**: 20-28 hours  
**Success Criteria**: 100% JSDoc coverage for all exports

### Step 2.1: Install ESLint JSDoc Plugin

```bash
npm install --save-dev eslint-plugin-jsdoc --workspace-root
```

### Step 2.2: Configure ESLint JSDoc Rules

**File**: `eslint.config.js` (or appropriate config file)

Add plugin and rules:

```javascript
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  // ... existing config
  {
    plugins: {
      jsdoc
    },
    rules: {
      'jsdoc/require-jsdoc': ['error', {
        require: {
          FunctionDeclaration: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false, // Only for exported arrow functions
          FunctionExpression: false
        },
        contexts: [
          'ExportNamedDeclaration > FunctionDeclaration',
          'ExportNamedDeclaration > VariableDeclaration',
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration'
        ]
      }],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error'
    }
  }
];
```

**Validation**:
```bash
npx eslint apps/demo-app/src/components/Button.tsx
# Should report missing JSDoc errors
```

### Step 2.3: Document packages/ui-components (CRITICAL)

#### Button Component

**File**: `packages/ui-components/src/components/Button.tsx`

```typescript
/**
 * Button component props for configuring button appearance and behavior
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /** 
   * Size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /** 
   * Whether the button is in a loading state, disabling interaction and showing a spinner
   * @default false
   */
  loading?: boolean;
}

/**
 * Versatile button component with multiple variants, sizes, and states
 * 
 * Supports all standard HTML button attributes and provides semantic styling
 * through the design system. Automatically handles disabled and loading states
 * with appropriate visual feedback and accessibility attributes.
 * 
 * @param props - Button configuration props
 * @returns Rendered button element
 * 
 * @example
 * ```tsx
 * // Primary CTA button
 * <Button variant="primary" size="lg" onClick={handleSubmit}>
 *   Submit Form
 * </Button>
 * 
 * // Secondary action with loading state
 * <Button variant="secondary" loading={isLoading}>
 *   Save Draft
 * </Button>
 * 
 * // Outline button for less prominent actions
 * <Button variant="outline" size="sm">
 *   Cancel
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props 
}) => {
  // Implementation...
};
```

#### Card Components

**File**: `packages/ui-components/src/components/Card.tsx`

```typescript
/**
 * Card component props for container configuration
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the card
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'filled';
}

/**
 * Container component for grouping related content with consistent spacing and styling
 * 
 * Provides a flexible card layout with optional header, content, and footer sections.
 * Supports semantic design tokens for theming and dark mode compatibility.
 * 
 * @param props - Card configuration props
 * @returns Rendered card container
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <h3>Card Title</h3>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card body content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({ variant = 'default', children, className, ...props }) => {
  // Implementation...
};

/**
 * Header section for Card component, typically containing title and optional actions
 */
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  // Implementation...
};

// Similar JSDoc for CardContent and CardFooter...
```

#### Form Components

**File**: `packages/ui-components/src/components/Form.tsx`

Document all 5 exported components (Input, Textarea, Select, Checkbox, Radio) following the same pattern.

**Template**:
```typescript
/**
 * [Component] props for [purpose]
 */
export interface [Component]Props extends React.[HTMLElement]Attributes<HTML[Element]Element> {
  /** Description with @default if applicable */
  prop?: type;
}

/**
 * [Brief description of component - one line]
 * 
 * [Detailed description including usage context, validation, accessibility]
 * 
 * @param props - [Component] configuration props
 * @returns Rendered [element type] element
 * 
 * @example
 * ```tsx
 * <[Component] ... />
 * ```
 */
export const [Component]: React.FC<[Component]Props> = ({ ... }) => { ... };
```

#### Modal Components

**File**: `packages/ui-components/src/components/Modal.tsx`

Document Modal, ModalHeader, ModalContent, ModalFooter with emphasis on accessibility features (focus trap, keyboard navigation, ARIA attributes).

**Example**:
```typescript
/**
 * Accessible modal dialog component with focus management and keyboard navigation
 * 
 * Implements WCAG AA modal dialog pattern with:
 * - Focus trap when open (Escape to close)
 * - Backdrop click to dismiss
 * - Proper ARIA attributes for screen readers
 * - Scroll lock on body when active
 * 
 * @param props - Modal configuration props
 * @returns Rendered modal portal
 * 
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <ModalHeader>Confirm Action</ModalHeader>
 *   <ModalContent>Are you sure?</ModalContent>
 *   <ModalFooter>
 *     <Button onClick={handleConfirm}>Confirm</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
```

#### Module-Level Docs

**File**: `packages/ui-components/src/index.ts`

```typescript
/**
 * @fileoverview UI Components Library
 * 
 * Accessible, themeable React components built with Tailwind CSS semantic design tokens.
 * All components support light/dark modes and meet WCAG AA accessibility standards.
 * 
 * @example
 * ```tsx
 * import { Button, Card, Modal } from '@tailwindspark/ui-components';
 * 
 * function MyApp() {
 *   return (
 *     <Card>
 *       <Button variant="primary">Click me</Button>
 *     </Card>
 *   );
 * }
 * ```
 * 
 * @module @tailwindspark/ui-components
 */

export * from './components/Button';
export * from './components/Card';
// ... etc
```

### Step 2.4: Document packages/design-tokens

**File**: `packages/design-tokens/tokens/index.ts`

```typescript
/**
 * Semantic color palette for the TailwindSpark design system
 * 
 * Colors use semantic naming conventions representing purpose rather than appearance.
 * Each token has light and dark mode variants defined in theme.css using CSS custom properties.
 * 
 * @example
 * ```tsx
 * // Use semantic class names in components
 * <div className="bg-surface text-text border-border">
 *   <button className="bg-brand text-white">Action</button>
 * </div>
 * ```
 */
export const colors = {
  brand: 'Brand color for primary CTAs and interactive elements',
  success: 'Success states and positive indicators',
  warning: 'Warning states and caution indicators',
  error: 'Error states and destructive actions',
  // ... etc
};

/**
 * Spacing scale based on rem units for consistent layout rhythm
 * 
 * Follows Tailwind CSS default spacing scale (0.25rem increments).
 * 
 * @example
 * ```tsx
 * <div className="p-4 m-2 gap-6">...</div>
 * ```
 */
export const spacing = {
  // ... token definitions
};

// Similar JSDoc for borderRadius, shadows, etc.
```

**Files**: `packages/design-tokens/index.js` and `index.d.ts`

Add module-level JSDoc similar to ui-components/index.ts pattern.

### Step 2.5: Document apps/demo-app Components

Follow the same JSDoc pattern for:
- All components in `apps/demo-app/src/components/` (12 files)
- All pages in `apps/demo-app/src/pages/` (11 files)
- All sections in `apps/demo-app/src/sections/` (5 files)

## Utility Function Example

**File**: `apps/demo-app/src/utils/memoryMonitor.ts`

```typescript
/**
 * Memory monitoring utility for tracking application memory usage and detecting leaks
 * 
 * Provides real-time memory metrics collection with configurable sampling intervals
 * and automatic leak detection thresholds.
 * 
 * @returns Memory monitor singleton instance
 * 
 * @example
 * ```typescript
 * const monitor = createMemoryMonitor();
 * monitor.start();
 * 
 * // Later...
 * const metrics = monitor.getMemoryMetrics();
 * console.info('Heap used:', metrics.heapUsed);
 * ```
 */
export function createMemoryMonitor() { ... }
```

### Step 2.6: Validation

After documenting each package/directory:

```bash
# Check for JSDoc compliance
npx eslint packages/ui-components/src --fix

# Verify IntelliSense in VS Code
# 1. Open a .tsx file
# 2. Import a documented component
# 3. Hover over component name → should see JSDoc
# 4. Type component name and trigger autocomplete → should see prop descriptions
```

### Step 2.7: Create JSDoc Style Guide

**File**: `.documentation/copilot/session=2026-03-01/jsdoc-style-guide.md`

Create reference document with:
- TSDoc standard conventions used in this project
- Examples for components, interfaces, functions, modules
- When to use @example blocks
- How to document complex types
- Link to a11y-utils.ts as exemplar

---

## Priority 3: Test Coverage Requirements

**Goal**: Increase coverage from 24% to 80%+  
**Estimated Time**: 25-35 hours  
**Success Criteria**: Vitest coverage thresholds pass, all critical paths tested

### Step 3.1: Configure Coverage Thresholds

**File**: `vitest.config.ts`

Update configuration:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';   
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      
      // Constitution-required 80% thresholds
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
      
      // Exclude non-source files from coverage
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/test/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/node_modules/**',
        '**/*.d.ts'
      ],
      
      // Fail build if thresholds not met
      thresholdAutoUpdate: false
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

**Validation**:
```bash
# Run tests with coverage (should initially fail due to low coverage)
npm test -- --coverage

# Expected output: Threshold errors for statements, branches, functions, lines
```

### Step 3.2: Test Pages (11 files - CRITICAL)

#### HomePage.tsx Test Template

**File**: `apps/demo-app/src/pages/HomePage.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders the landing page without crashing', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays the main headline', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Adjust text based on actual content
    expect(screen.getByText(/TailwindSpark/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('includes accessible landmarks', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main/i })).toBeInTheDocument();
  });
});
```

**Apply Similar Pattern To**:
- DashboardPage.test.tsx
- AnalyticsPage.test.tsx (test chart rendering, data display)
- MarketingPage.test.tsx (test major sections render)
- EcommercePage.test.tsx (test product grid, filters)
- SettingsPage.test.tsx (test settings form elements)
- Others: DemosPage, DesignSystemPage, UsersPage, AnimationPage, SettingsPage_new

#### Complex Page Testing - AnalyticsPage.tsx

**File**: `apps/demo-app/src/pages/AnalyticsPage.test.tsx`

```typescript
describe('AnalyticsPage', () => {
  it('renders all dashboard widgets', () => {
    render(<AnalyticsPage />);
    
    // Verify key metrics cards
    expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversion/i)).toBeInTheDocument();
  });

  it('displays charts with data', () => {
    render(<AnalyticsPage />);
    
    // Look for chart containers or data elements
    const charts = screen.getAllByRole('img', { hidden: true }); // Charts often use role=img
    expect(charts.length).toBeGreaterThan(0);
  });

  it('shows traffic source breakdown', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText(/Direct/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Social/i)).toBeInTheDocument();
  });

  it('uses semantic color tokens for data visualization', () => {
    const { container } = render(<AnalyticsPage />);
    
    // Verify no raw Tailwind color classes
    const rawColors = container.querySelectorAll('[class*="bg-blue-"], [class*="bg-green-"]');
    expect(rawColors.length).toBe(0);
  });
});
```

### Step 3.3: Test Sections (5 files - CRITICAL)

#### FormShowcase.tsx Test (Complex Interactions)

**File**: `apps/demo-app/src/sections/FormShowcase.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormShowcase } from './FormShowcase';

describe('FormShowcase', () => {
  it('renders all form input types', () => {
    render(<FormShowcase />);
    
    expect(screen.getByLabelText(/text input/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/textarea/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select/i)).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    const user = userEvent.setup();
    render(<FormShowcase />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur validation
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('handles checkbox toggles', async () => {
    const user = userEvent.setup();
    render(<FormShowcase />);
    
    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    expect(checkbox).not.toBeChecked();
    
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<FormShowcase />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    firstInput.focus();
    
    await user.keyboard('{Tab}');
    const secondElement = document.activeElement;
    expect(secondElement).not.toBe(firstInput);
  });
});
```

#### ModalShowcase.tsx Test (Accessibility Focus)

**File**: `apps/demo-app/src/sections/ModalShowcase.test.tsx`

```typescript
describe('ModalShowcase', () => {
  it('renders modal trigger buttons', () => {
    render(<ModalShowcase />);
    expect(screen.getByRole('button', { name: /open modal/i })).toBeInTheDocument();
  });

  it('opens modal on button click', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    const trigger = screen.getByRole('button', { name: /open modal/i });
    await user.click(trigger);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes modal on Escape key', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    const trigger = screen.getByRole('button', { name: /open modal/i });
    await user.click(trigger);
    
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    const trigger = screen.getByRole('button', { name: /open modal/i });
    await user.click(trigger);
    
    const modal = screen.getByRole('dialog');
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  it('has proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    const trigger = screen.getByRole('button', { name: /open modal/i });
    await user.click(trigger);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby');
  });
});
```

**Apply Similar Patterns**:
- AnimationShowcase.test.tsx (test animation examples render)
- ButtonShowcase.test.tsx (test button variants)
- CardShowcase.test.tsx (test card layouts)

### Step 3.4: Test Components (12 files - MEDIUM)

Use existing tests as templates:
- `ErrorBoundary.test.tsx` - Error handling patterns
- `packages/ui-components` tests - Component testing patterns

**Example: SearchComponent.test.tsx**

```typescript
describe('SearchComponent', () => {
  it('renders search input', () => {
    render(<SearchComponent />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('filters results on input', async () => {
    const user = userEvent.setup();
    const mockData = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' }
    ];
    
    render(<SearchComponent data={mockData} />);
    
    const searchbox = screen.getByRole('searchbox');
    await user.type(searchbox, 'apple');
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('clears search with clear button', async () => {
    const user = userEvent.setup();
    render(<SearchComponent />);
    
    const searchbox = screen.getByRole('searchbox');
    await user.type(searchbox, 'test query');
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);
    
    expect(searchbox).toHaveValue('');
  });
});
```

### Step 3.5: Run Coverage and Iterate

```bash
# Run all tests with coverage report
npm test -- --coverage

# Check HTML report for detailed coverage
# Open coverage/index.html in browser

# Identify files below 80%:
# - Add more test cases for uncovered branches
# - Test edge cases and error paths
# - Ensure async operations are awaited

# Iterate until all thresholds pass
```

### Step 3.6: Integrate with CI/CD

**File**: `.github/workflows/deploy.yml` or create `.github/workflows/test.yml`

Add or update test job:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm test -- --coverage
      
      - name: Upload coverage reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: coverage-report
          path: coverage/
      
      - name: Comment PR with coverage
        if: github.event_name == 'pull_request'
        uses: davelosert/vitest-coverage-report-action@v2
```

**Validation**: Create a test PR to verify CI fails if coverage drops below 80%

---

## Priority 4: Code Quality Standards

**Goal**: Fix 3 console.log violations  
**Estimated Time**: 30 minutes  
**Success Criteria**: Zero console.log usage in production code

### Step 4.1: Fix memoryMonitor.ts (2 violations)

**File**: `apps/demo-app/src/utils/memoryMonitor.ts`

**Line 333 and 338**:

```typescript
// BEFORE
console.log(memoryMonitor.generateReport());
console.log(memoryMonitor.getMemoryMetrics());

// AFTER - Conditional debug logging
if (import.meta.env.DEV) {
  console.info('[MemoryMonitor] Report:', memoryMonitor.generateReport());
  console.info('[MemoryMonitor] Metrics:', memoryMonitor.getMemoryMetrics());
}
```

### Step 4.2: Fix MemoryMonitorDisplay.tsx (1 violation)

**File**: `apps/demo-app/src/components/MemoryMonitorDisplay.tsx`

**Line 192**:

```typescript
// BEFORE
console.log(memoryMonitor.generateReport());

// AFTER - Use appropriate log level
if (import.meta.env.DEV) {
  console.info('[MemoryMonitorDisplay]', memoryMonitor.generateReport());
}
```

### Step 4.3: Configure ESLint No-Console Rule

**File**: `eslint.config.js`

Add or update rule:

```javascript
export default [
  // ... existing config
  {
    rules: {
      'no-console': ['warn', { 
        allow: ['info', 'warn', 'error', 'debug'] 
      }]
    }
  }
];
```

**Validation**:
```bash
# Should show warnings for any console.log, allow console.info/warn/error
npx eslint apps/demo-app/src/utils/memoryMonitor.ts
npx eslint apps/demo-app/src/components/MemoryMonitorDisplay.tsx
```

### Step 4.4: Verify Production Build

```bash
# Build for production
npm run build

# Verify debug logs are stripped (check bundle)
# Logs inside `if (import.meta.env.DEV)` should be removed by Vite

# Optional: Analyze bundle to confirm
npm run build -- --minify
```

---

## Final Validation & PR Preparation

### Pre-Merge Checklist

```bash
# 1. Run all linters
npm run lint

# 2. Run all formatters
npm run format

# 3. Run full test suite with coverage
npm test -- --coverage

# 4. Build for production
npm run build

# 5. Verify ESLint rules pass
npx eslint apps/ packages/ --ext .ts,.tsx --max-warnings 0

# 6. Manual testing
npm run dev
# - Toggle dark mode on all pages
# - Verify colors are consistent
# - Check IntelliSense shows JSDoc
# - Confirm coverage reports in coverage/index.html
```

### Create Pull Request

```bash
git add .
git commit -m "feat: achieve constitution compliance (95%+ score)

- Replace 50+ raw Tailwind colors with semantic design tokens
- Add comprehensive JSDoc to 70+ exports (100% coverage)
- Increase test coverage from 24% to 80%+ (28 new test files)
- Fix console.log violations, configure proper logging
- Add coverage thresholds to vitest.config.ts
- Strengthen ESLint rules for ongoing compliance

Closes #[issue-number]
Resolves 86 violations from 2026-03-01 site audit"

git push origin 1-constitution-compliance
```

### PR Description Template

```markdown
## Constitution Compliance Remediation

Addresses all critical findings from the 2026-03-01 site audit, improving project compliance from **42% to 95%+**.

### Changes

#### ✅ Priority 1: Design System Compliance (P1)
- [x] Created data visualization semantic color palette (8 tokens)
- [x] Replaced 50+ raw Tailwind color classes across codebase
- [x] Fixed AnimationShowcase.tsx (13 violations)
- [x] Fixed AnalyticsPage.tsx (37+ violations)
- [x] Strengthened ESLint `no-raw-primary-class` rule
- [x] Verified dark mode functionality across all pages

#### ✅ Priority 2: Code Documentation (P2)
- [x] Added comprehensive JSDoc to packages/ui-components (12+ exports)
- [x] Added JSDoc to packages/design-tokens (6 token categories)
- [x] Added JSDoc to 40+ demo app components/pages/sections
- [x] Configured eslint-plugin-jsdoc for enforcement
- [x] Created JSDoc style guide for consistency

#### ✅ Priority 3: Test Coverage (P3)
- [x] Configured Vitest coverage thresholds (80% minimum)
- [x] Added tests for 11 page components (0% → 100%)
- [x] Added tests for 5 section components (0% → 100%)
- [x] Added tests for 12 additional components
- [x] Integrated coverage reporting into CI/CD
- [x] Total coverage: **24% → 82%**

#### ✅ Priority 4: Code Quality (P4)
- [x] Replaced 3 console.log with conditional debug logging
- [x] Configured ESLint no-console rule
- [x] Verified production builds strip debug statements

### Metrics

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| **Constitution Compliance** | 42% | 95% | +53% |
| **Design System Violations** | 50+ | 0 | ✅ |
| **JSDoc Coverage** | ~5% | 100% | +95% |
| **Test Coverage** | 24% | 82% | +58% |
| **Console.log Violations** | 3 | 0 | ✅ |

### Testing

- [x] All ESLint rules pass with zero violations
- [x] All Prettier checks pass
- [x] Full test suite passes (Vitest)
- [x] Coverage thresholds met (80%+ all metrics)
- [x] Manual dark mode testing on all pages
- [x] Production build successful

### Screenshots

[Optional: Add before/after screenshots of dark mode, coverage reports]

### Related

- Audit Report: `.documentation/copilot/audit/2026-03-01_results.md`
- Spec: `.documentation/specs/1-constitution-compliance/spec.md`
- Plan: `.documentation/specs/1-constitution-compliance/plan.md`
```

---

## Troubleshooting

### Issue: ESLint still reports raw color violations after fixes

**Solution**:
1. Clear ESLint cache: `rm -rf node_modules/.cache/eslint`
2. Restart VS Code
3. Run `npx eslint --fix` on affected files
4. Verify semantic tokens are imported in components

### Issue: Coverage thresholds failing despite many tests

**Solution**:
1. Open `coverage/index.html` to identify uncovered files/lines
2. Check for:
   - Untested error paths
   - Uncovered conditional branches
   - Async operations not awaited in tests
3. Add targeted tests for uncovered areas
4. Exclude non-source files from coverage (config, test utils)

### Issue: JSDoc not appearing in IntelliSense

**Solution**:
1. Restart TypeScript language server: CMD+Shift+P → "TypeScript: Restart TS Server"
2. Verify JSDoc is above the export, not inside function
3. Check for JSDoc syntax errors (missing closing */)
4. Ensure component/function is exported

### Issue: Tests failing in CI but passing locally

**Solution**:
1. Check Node.js version matches between local and CI
2. Run `npm ci` instead of `npm install` to match lockfile exactly
3. Verify timezone-dependent tests use fixed dates
4. Check for race conditions in async tests (use `waitFor`)

---

## Success Criteria Validation

After completing all priorities, verify:

- [ ] `npx eslint apps/ packages/` reports zero violations
- [ ] `npm test -- --coverage` passes with 80%+ all metrics
- [ ] Dark mode toggle works on all pages without visual breaks
- [ ] IntelliSense shows JSDoc for all exports when hovering in IDE
- [ ] Production build completes without errors
- [ ] No `console.log` statements in production bundle
- [ ] Site audit (if re-run) shows 95%+ compliance score

## Estimated Timeline

| Priority | Task | Hours | Cumulative |
|----------|------|-------|------------|
| **P1** | Design tokens + color fixes | 8-12 | 8-12h |
| **P2** | JSDoc documentation | 20-28 | 28-40h |
| **P3** | Test coverage | 25-35 | 53-75h |
| **P4** | Code quality fixes | 0.5 | 53.5-75.5h |
| | **TOTAL** | **53.5-75.5h** | ~1.5-2 sprints |

**Parallelization Opportunities**:
- P1 and P4 can be done concurrently (different files)
- P2 (JSDoc) can be done in parallel with P3 (tests) by different developers
- P2 packages can be split: one developer does ui-components, another does design-tokens

**Single Developer Estimated**: 2 weeks (assuming 40h/week, 75% efficiency = ~30h productive time/week)  
**Team of 2 Estimated**: 1 week (with task parallelization)
