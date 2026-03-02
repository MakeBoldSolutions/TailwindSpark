# Testing Implementation Guide

**Feature**: Constitution Compliance Remediation  
**Created**: 2026-03-01  
**Purpose**: Comprehensive guide for achieving 80%+ test coverage with Vitest and React Testing Library

## Overview

This guide provides systematic instructions for writing tests to achieve constitutional compliance (Principle II: Testing Standards). Current coverage is 24%; target is 80%+ across all metrics (statements, branches, functions, lines).

## Testing Philosophy

### Test What Matters

Focus on:
- ✅ **User interactions**: Clicking, typing, keyboard navigation
- ✅ **Visual rendering**: Components render correctly
- ✅ **Accessibility**: ARIA attributes, keyboard support, screen reader compatibility
- ✅ **State management**: Component state updates correctly
- ✅ **Error handling**: Error boundaries, validation, edge cases

Avoid testing:
- ❌ Implementation details (internal state that users don't see)
- ❌ Third-party library internals
- ❌ Trivial getters/setters
- ❌ Static constants

### Testing Standards (Constitution Principle II)

**Requirements**:
- Minimum 80% coverage for statements, branches, functions, lines (CRITICAL)
- Co-located test files (`*.test.tsx` next to source files) (CRITICAL)
- Use Vitest + @testing-library/react (HIGH)
- Coverage reports generated in CI/CD (HIGH)

## Technology Stack

### Core Testing Tools

- **Vitest**: Fast test runner with Vite integration
- **@testing-library/react**: User-centric component testing
- **@testing-library/user-event**: Realistic user interaction simulation
- **@testing-library/jest-dom**: Extended matchers for DOM assertions

### Configuration

Test configuration is in:
- `vitest.config.ts` (workspace root) - Global config
- `apps/demo-app/vitest.config.ts` - App-specific config
- `vitest.setup.ts` - Global test setup

## Test File Structure

### Co-Located Test Files

Place test files next to source files:

```
src/components/
├── Button.tsx
├── Button.test.tsx    ← Co-located with Button.tsx
├── Card.tsx
└── Card.test.tsx      ← Co-located with Card.tsx
```

### Standard Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly with default props', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<ComponentName onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(<ComponentName />);
    
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});
```

## Testing Patterns by Component Type

### 1. UI Components (packages/ui-components)

Focus on rendering variants and user interactions.

#### Button Component Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-brand');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('prevents clicks when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Keyboard</Button>);

    await user.tab(); // Focus button
    expect(screen.getByRole('button')).toHaveFocus();

    await user.keyboard('{Enter}'); // Activate with Enter
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 2. Page Components (apps/demo-app/src/pages)

Focus on layout structure, section rendering, and navigation.

#### DashboardPage Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders main heading', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/dashboard/i);
  });

  it('displays all dashboard widgets', () => {
    renderWithRouter(<DashboardPage />);

    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/active sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/revenue/i)).toBeInTheDocument();
  });

  it('renders chart components', () => {
    renderWithRouter(<DashboardPage />);

    // Check for chart containers or canvas elements
    expect(screen.getByTestId('user-growth-chart')).toBeInTheDocument();
    expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
  });

  it('has accessible navigation landmarks', () => {
    renderWithRouter(<DashboardPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithRouter(<DashboardPage />);

    expect(screen.getByRole('button', { name: /create new/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });
});
```

### 3. Section Components (apps/demo-app/src/sections)

Focus on showcase functionality and interactive demos.

#### FormShowcase Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormShowcase } from './FormShowcase';

describe('FormShowcase', () => {
  it('renders all form input types', () => {
    render(<FormShowcase />);

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /select/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(<FormShowcase />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Expect validation errors to appear
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('accepts valid input', async () => {
    const user = userEvent.setup();

    render(<FormShowcase />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();

    render(<FormShowcase />);

    // Fill out form
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Hello world');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Expect success message or form reset
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

### 4. Layout Components

Focus on structural rendering and child content.

#### Layout Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders header, main content, and footer', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
  });

  it('renders children in main area', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('includes navigation', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

### 5. Modal Components

Focus on open/close behavior, accessibility, and keyboard interactions.

#### Modal Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when clicking close button', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal open={true} onClose={handleClose}>
        <div>Content</div>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal open={true} onClose={handleClose}>
        <div>Content</div>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalled();
  });

  it('traps focus within modal', async () => {
    const user = userEvent.setup();

    render(
      <Modal open={true} onClose={vi.fn()}>
        <button>First</button>
        <button>Second</button>
      </Modal>
    );

    const firstButton = screen.getByRole('button', { name: /first/i });
    const secondButton = screen.getByRole('button', { name: /second/i });

    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(secondButton).toHaveFocus();

    await user.tab(); // Should cycle back to first
    expect(firstButton).toHaveFocus();
  });
});
```

## Coverage Configuration

### vitest.config.ts Updates

Add coverage thresholds to prevent regressions:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/vite-env.d.ts',
        'src/main.tsx', // Entry point, hard to test
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

## Running Tests

### Development Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run tests for specific file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --grep "Button"

# Update snapshots
npm test -- -u
```

### Coverage Reports

After running tests with `--coverage`:

- **Terminal**: Summary in console
- **HTML Report**: Open `coverage/index.html` in browser for detailed view
- **LCOV**: Used by code coverage badges and CI/CD

### CI/CD Integration

Update `.github/workflows/deploy.yml`:

```yaml
- name: Run tests with coverage
  run: npm test -- --coverage

- name: Upload coverage report
  uses: actions/upload-artifact@v3
  with:
    name: coverage-report
    path: coverage/
```

## Best Practices

### 1. Use Semantic Queries

Prefer queries that reflect how users interact:

✅ **Good** (user-centric):
```typescript
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email address')
screen.getByText(/welcome/i)
```

❌ **Bad** (implementation detail):
```typescript
screen.getByClassName('btn-primary')
screen.getByTestId('submit-button') // Use sparingly
```

### 2. Test Accessibility

Every component test should verify accessibility:

```typescript
it('has accessible name', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});

it('supports keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<Button onClick={vi.fn()}>Tab Here</Button>);
  
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();
});

it('has proper ARIA attributes', () => {
  render(<Modal open={true} onClose={vi.fn()}>Content</Modal>);
  
  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
});
```

### 3. Test User Flows, Not Implementation

❌ **Bad** (testing implementation):
```typescript
it('sets state to true when clicked', () => {
  // Testing internal state
});
```

✅ **Good** (testing behavior):
```typescript
it('shows success message after submitting valid form', async () => {
  // Testing what the user sees
});
```

### 4. Mock External Dependencies

```typescript
import { vi } from 'vitest';

// Mock API calls
vi.mock('../api/users', () => ({
  fetchUsers: vi.fn(() => Promise.resolve([{ id: 1, name: 'Test User' }])),
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
```

### 5. Clean Up After Tests

```typescript
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup(); // Automatically called by @testing-library/react
  vi.clearAllMocks(); // Clear mock call history
});
```

## Common Testing Patterns

### Testing Dark Mode

```typescript
it('applies correct styles in dark mode', () => {
  document.documentElement.classList.add('dark');
  
  render(<Card>Content</Card>);
  
  const card = screen.getByText('Content').parentElement;
  expect(card).toHaveClass('bg-surface'); // Semantic token, adapts to dark
  
  document.documentElement.classList.remove('dark');
});
```

### Testing Forms with Validation

```typescript
it('shows validation errors for invalid input', async () => {
  const user = userEvent.setup();
  
  render(<SignupForm />);
  
  const emailInput = screen.getByLabelText(/email/i);
  await user.type(emailInput, 'invalid-email');
  await user.tab(); // Blur field to trigger validation
  
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

### Testing Async Data Loading

```typescript
import { waitFor } from '@testing-library/react';

it('displays data after loading', async () => {
  render(<UserList />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
});
```

## Migration Checklist

For each untested component:

- [ ] Create co-located `.test.tsx` file
- [ ] Add rendering test with default props
- [ ] Test all component variants (if applicable)
- [ ] Test user interactions (clicks, typing, etc.)
- [ ] Test keyboard navigation
- [ ] Test ARIA attributes and accessibility
- [ ] Test error states and edge cases
- [ ] Run coverage report to verify 80%+ coverage
- [ ] Update tasks.md to mark task as complete

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Testing Library Queries Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- TailwindSpark Constitution Principle II: Testing Standards
