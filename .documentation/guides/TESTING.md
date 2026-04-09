# Testing Guide

## Overview

TailwindSpark uses Vitest as the primary testing framework with React Testing Library for component testing. This guide covers testing strategies, best practices, and common patterns.

## Testing Framework

### Technologies Used

- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for Node.js
- **@testing-library/jest-dom** - Custom matchers

### Configuration

Tests are configured at both the root level and package level:

- Root: `vitest.config.ts` - Shared configuration
- Packages: Each package has its own `vitest.config.ts`

## Running Tests

### Command Reference

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run with coverage
npm run test:coverage

# Run tests for specific package
cd packages/ui-components
npm run test
```

### Test Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── Card/
│       ├── Card.tsx
│       └── Card.test.tsx
└── test/
    └── setup.ts
```

## Component Testing

### Basic Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
```

### Testing Patterns

#### Testing Props

```typescript
it('renders with different variants', () => {
  const { rerender } = render(<Button variant="primary">Primary</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();

  rerender(<Button variant="secondary">Secondary</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

#### Testing User Interactions

```typescript
it('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Testing Disabled States

```typescript
it('does not call onClick when disabled', () => {
  const handleClick = vi.fn();
  render(<Button disabled onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).not.toHaveBeenCalled();
});
```

## Testing Best Practices

### What to Test

**✅ Do Test:**

- Component renders without crashing
- Props are handled correctly
- User interactions work as expected
- Accessibility attributes are present
- Error boundaries catch errors
- Custom hooks behave correctly

**❌ Don't Test:**

- Implementation details (internal state)
- Third-party library functionality
- Styling specifics (use visual regression instead)
- Network requests (mock them)

### Query Priorities

Use React Testing Library queries in this order:

1. **Accessible queries** (getByRole, getByLabelText)
2. **Semantic queries** (getByAltText, getByTitle)
3. **Test ID queries** (getByTestId) - last resort

```typescript
// ✅ Good - accessible query
screen.getByRole('button', { name: 'Submit' });

// ❌ Avoid - implementation detail
screen.getByClassName('btn-primary');
```

### Mocking Guidelines

#### Mock External Dependencies

```typescript
// Mock external APIs
vi.mock('../services/api', () => ({
  fetchUser: vi.fn(),
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));
```

#### Mock Browser APIs

```typescript
// Already configured in setup files
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
});
```

## Advanced Testing

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Testing Context Providers

```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeProvider';
import { Button } from './Button';

const renderWithTheme = (ui: React.ReactElement, theme = 'light') => {
  return render(
    <ThemeProvider initialTheme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Button with Theme', () => {
  it('applies dark theme classes', () => {
    renderWithTheme(<Button>Dark Button</Button>, 'dark');
    expect(screen.getByRole('button')).toHaveClass('dark:bg-gray-800');
  });
});
```

### Testing Async Components

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { AsyncComponent } from './AsyncComponent';

describe('AsyncComponent', () => {
  it('loads data successfully', async () => {
    render(<AsyncComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
  });
});
```

## Test Organization

### File Naming

- Test files: `Component.test.tsx`
- Test utilities: `test-utils.ts`
- Setup files: `setup.ts`

### Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  // Happy path tests
  describe('when rendered normally', () => {
    it('displays correct content', () => {
      // Test implementation
    });
  });

  // Error cases
  describe('when props are invalid', () => {
    it('throws appropriate error', () => {
      // Error test
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it('handles empty data', () => {
      // Edge case test
    });
  });
});
```

## Coverage Guidelines

### Target Coverage

- **Statements**: 40%+ temporary baseline
- **Branches**: 40%+ temporary baseline
- **Functions**: 40%+ temporary baseline
- **Lines**: 40%+ temporary baseline

This repository is currently using a temporary 40% enforced floor while broader legacy coverage is evaluated and raised in future specs.

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.config.{js,ts}', '**/*.d.ts'],
    },
  },
});
```

## Troubleshooting

### Common Issues

**Tests fail with module resolution errors**

- Check `vitest.config.ts` alias configuration
- Ensure packages are built before testing

**Mock functions not working**

- Import `vi` from 'vitest'
- Use `vi.fn()` instead of `jest.fn()`

**DOM queries failing**

- Check if component renders correctly
- Use `screen.debug()` to see rendered output

**Async tests timing out**

- Increase timeout in test configuration
- Check if promises are properly awaited

### Debugging Tests

```typescript
import { screen } from '@testing-library/react';

it('debug test', () => {
  render(<Component />);

  // See rendered output
  screen.debug();

  // Log specific element
  console.log(screen.getByRole('button'));
});
```

## Integration with CI/CD

Tests are automatically run in the CI/CD pipeline:

```yaml
# .github/workflows/deploy.yml
- name: Run tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Next Steps

- Add visual regression testing with Playwright
- Implement accessibility testing with axe-core
- Set up performance testing for critical components
- Create test data factories for complex objects
