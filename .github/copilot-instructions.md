# GitHub Copilot Instructions for TailwindSpark

## Project Overview

TailwindSpark is a comprehensive React TypeScript monorepo demonstrating modern web development with Tailwind CSS. It serves as both an educational resource and a production-ready template for building scalable web applications with utility-first CSS principles.

**Key Technologies:**

- React 18+ with TypeScript
- Tailwind CSS 4.1 with @theme directive and design tokens
- Vite for build tooling
- Turborepo for monorepo management
- ESLint + Prettier for code quality

## Code Style & Conventions

### TypeScript Guidelines

- Use strict TypeScript configuration
- Prefer interface over type for object definitions
- Use explicit return types for functions
- Implement proper error boundaries with typed error states
- Use const assertions for literal types

```typescript
// Preferred interface definition
interface ComponentProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

// Explicit return type
const createComponent = (props: ComponentProps): JSX.Element => {
  // implementation
};
```

### React Component Guidelines

- Use functional components with hooks
- Implement proper prop validation with TypeScript interfaces
- Use React.memo for performance optimization when appropriate
- Follow the component structure: imports → types → component → export

```typescript
import React from 'react';
import { cn } from '../utils/classNames';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Tailwind CSS Guidelines

- Use the custom design system defined in `packages/design-tokens` with @theme directive
- Prefer semantic color names from CSS custom properties over arbitrary values
- Use responsive design patterns with mobile-first approach
- Implement dark mode support using .dark class strategy with CSS variables
- Use the `cn()` utility function for conditional classes

```typescript
// Good: Using design tokens and conditional classes
const cardClasses = cn(
  'rounded-lg border bg-surface text-text shadow-sm',
  'transition-colors duration-200',
  'hover:shadow-md',
  {
    'border-destructive': variant === 'destructive',
    'border-brand': variant === 'primary',
  }
);

// Avoid: Hard-coded colors when semantic tokens exist
const badClasses = 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
// Use: bg-surface text-text instead
```

## File Organization

### Directory Structure

```
apps/demo-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route-specific page components
│   ├── sections/      # Feature-specific sections
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   └── assets/        # Static assets
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ButtonShowcase.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useAnalytics.ts`)
- **Types**: PascalCase interfaces (e.g., `ProductData`)
- **Files**: kebab-case for pages, PascalCase for components
- **CSS Classes**: Use Tailwind utilities, avoid custom CSS

## Component Development Guidelines

### Accessibility Requirements

- Include proper ARIA attributes
- Ensure keyboard navigation support
- Maintain color contrast ratios (WCAG AA)
- Provide alternative text for images
- Use semantic HTML elements

```typescript
// Accessible button with ARIA support
<button
  aria-label={ariaLabel}
  aria-pressed={isPressed}
  aria-disabled={disabled}
  className={buttonClasses}
  onKeyDown={handleKeyDown}
>
  {children}
</button>
```

### Performance Considerations

- Use React.memo for expensive components
- Implement lazy loading for route components
- Optimize images with appropriate formats and sizes
- Use the service worker for caching strategies

```typescript
// Lazy loading for route components
const LazyDashboardPage = lazy(() => import('../pages/DashboardPage'));

// Memoized component for performance
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // component implementation
});
```

### Error Handling

- Implement error boundaries for component isolation
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Use loading states for async operations

```typescript
// Error boundary implementation
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Monorepo Guidelines

### Package Dependencies

- Keep dependencies in the appropriate package scope
- Use workspace references for internal packages
- Prefer peerDependencies for shared libraries
- Document breaking changes in CHANGELOG.md

### Build & Development

- Use Turborepo for efficient task execution
- Implement proper caching strategies
- Test components in isolation
- Use Storybook for component documentation (when available)

### Code Sharing

- Extract common utilities to shared packages
- Use the design tokens package for consistent theming
- Share TypeScript types through the ui-components package
- Maintain backward compatibility in shared packages

## SEO & Meta Guidelines

### Meta Tags Implementation

- Include comprehensive meta tags for social sharing
- Implement structured data (JSON-LD)
- Use proper Open Graph and Twitter Card tags
- Ensure proper canonical URLs

```typescript
// SEO meta tags structure
const seoTags = {
  title: 'Page Title - TailwindSpark',
  description: 'Comprehensive description for search engines',
  keywords: 'tailwind, react, typescript, demo',
  ogImage: '/og-image.svg',
  canonicalUrl: 'https://markhazleton.github.io/TailwindSpark/',
};
```

## Testing Guidelines

### Component Testing

- Test component rendering with different props
- Verify accessibility features
- Test user interactions (clicks, keyboard navigation)
- Ensure responsive behavior

### Integration Testing

- Test page routing and navigation
- Verify form submissions and validation
- Test theme switching functionality
- Ensure search functionality works correctly

## Documentation Standards

### Code Comments

- Document complex business logic
- Explain non-obvious design decisions
- Include usage examples for reusable components
- Document breaking changes and migration paths

### README Updates

- Keep component documentation current
- Update feature lists when adding new functionality
- Include setup instructions for new developers
- Document deployment procedures

### Agent-Generated Documentation

- **Always** place agent-generated documents in `/.documentation/copilot/session={YYYY-MM-DD}/` folders
- Use the current date in YYYY-MM-DD format for session folders (e.g., `/.documentation/copilot/session=2025-09-07/`)
- Organize documents by type within session folders:
  - `plans/` - Architectural and implementation plans
  - `analysis/` - Code analysis and audit reports
  - `documentation/` - Generated technical documentation
  - `specifications/` - Feature and API specifications
- Use descriptive filenames with timestamps when multiple documents of the same type are created
- Include a session summary file (`session-summary.md`) in each session folder
- Move any existing agent-generated documents from the root or other locations to the appropriate `/.documentation/copilot/` structure

## Security Considerations

- Sanitize user inputs in search and forms
- Use proper CSP headers for deployed applications
- Implement secure authentication patterns (when applicable)
- Avoid exposing sensitive configuration in client code

## Performance Monitoring

- Implement Core Web Vitals tracking
- Monitor bundle sizes and optimize imports
- Use React DevTools Profiler for performance analysis
- Implement proper caching strategies for assets

---

**Remember**: This project demonstrates best practices for modern web development. Every component and feature should serve as an educational example while maintaining production-quality standards.
