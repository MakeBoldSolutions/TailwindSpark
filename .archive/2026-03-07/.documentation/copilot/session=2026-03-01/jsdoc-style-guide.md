# JSDoc Style Guide for TailwindSpark

**Feature**: Constitution Compliance Remediation  
**Created**: 2026-03-01  
**Purpose**: Standardize JSDoc documentation patterns across all exports

## Overview

This guide establishes consistent JSDoc documentation patterns for TailwindSpark's TypeScript codebase. All exported components, functions, types, and interfaces must include comprehensive JSDoc comments to improve IDE IntelliSense, developer experience, and maintain constitutional compliance (Principle V).

## Core Requirements

### 1. All Exports Must Have JSDoc

Every exported item must have a JSDoc comment with minimum description:

```typescript
/**
 * Primary button component for user actions.
 */
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  // implementation
};
```

### 2. Function Parameters Must Be Documented

Use `@param` tags with types and descriptions:

```typescript
/**
 * Formats a user's full name from first and last name components.
 * 
 * @param firstName - The user's first name
 * @param lastName - The user's last name
 * @returns The formatted full name
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
```

### 3. Return Values Must Be Documented

Use `@returns` for all functions that return values:

```typescript
/**
 * Calculates the total price including tax.
 * 
 * @param basePrice - The base price before tax
 * @param taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns The total price including tax, rounded to 2 decimal places
 */
export function calculateTotal(basePrice: number, taxRate: number): number {
  return Math.round(basePrice * (1 + taxRate) * 100) / 100;
}
```

### 4. Component Props Must Be Documented

Document React component props with descriptions and optional/required indicators:

```typescript
/**
 * Button component properties.
 */
export interface ButtonProps {
  /**
   * Button content (text, icons, or other React elements).
   */
  children: React.ReactNode;
  
  /**
   * Visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /**
   * Size of the button.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Disables the button when true, preventing user interaction.
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Click event handler.
   */
  onClick?: () => void;
}
```

### 5. Complex Types and Interfaces

Document type aliases and interfaces with purpose and usage examples:

```typescript
/**
 * User profile data structure containing authentication and display information.
 * 
 * @example
 * ```typescript
 * const user: UserProfile = {
 *   id: 'usr_123',
 *   email: 'user@example.com',
 *   displayName: 'John Doe',
 *   role: 'admin'
 * };
 * ```
 */
export interface UserProfile {
  /**
   * Unique user identifier.
   */
  id: string;
  
  /**
   * User's email address used for authentication.
   */
  email: string;
  
  /**
   * Display name shown in the UI.
   */
  displayName: string;
  
  /**
   * User's role for authorization purposes.
   */
  role: 'admin' | 'user' | 'guest';
}
```

## React Component Patterns

### Functional Components

```typescript
/**
 * Card component for displaying content in a contained surface.
 * 
 * Provides consistent styling for card-based layouts with optional header,
 * content, and footer sections. Supports dark mode through semantic tokens.
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <h3>Card Title</h3>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('rounded-lg border bg-surface shadow-sm', className)} {...props}>
      {children}
    </div>
  );
};
```

### Custom Hooks

```typescript
/**
 * Hook for managing dark mode state and system preference synchronization.
 * 
 * Syncs with user's system dark mode preference and persists choice to localStorage.
 * Automatically applies `.dark` class to document root.
 * 
 * @returns Object containing current dark mode state and toggle function
 * 
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { isDark, toggle } = useDarkMode();
 *   return (
 *     <button onClick={toggle}>
 *       {isDark ? 'Light Mode' : 'Dark Mode'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useDarkMode(): { isDark: boolean; toggle: () => void } {
  // implementation
}
```

### Page Components

```typescript
/**
 * Dashboard overview page displaying key metrics and analytics.
 * 
 * Shows real-time statistics, recent activity, and quick action buttons.
 * Requires authentication; redirects to login if user is not authenticated.
 * 
 * @route /dashboard
 * @accessibility Keyboard navigable, ARIA landmarks for screen readers
 */
export const DashboardPage: React.FC = () => {
  // implementation
};
```

## Package-Level Documentation

### Module Exports (index.ts)

```typescript
/**
 * @module design-tokens
 * 
 * Central design token package providing semantic color, spacing, and typography
 * tokens for consistent theming across TailwindSpark applications.
 * 
 * All tokens follow Tailwind CSS 4.1 @theme directive patterns and support
 * automatic dark mode through CSS custom properties.
 * 
 * @example
 * ```typescript
 * import { colors, spacing } from '@tailwindspark/design-tokens';
 * ```
 */

export * from './tokens';
export * from './theme';
```

## ESLint JSDociRules Reference

Current ESLint configuration enforces:

- `jsdoc/require-jsdoc`: All exported functions, classes, components need JSDoc
- `jsdoc/require-description`: Every JSDoc must have a description
- `jsdoc/require-param`: Document all function parameters
- `jsdoc/require-param-description`: Each parameter needs a description
- `jsdoc/require-returns`: Document return values
- `jsdoc/require-returns-description`: Return values need descriptions
- `jsdoc/check-alignment`: Enforce consistent JSDoc formatting
- `jsdoc/check-indentation`: Proper indentation in JSDoc blocks
- `jsdoc/check-syntax`: Valid JSDoc syntax
- `jsdoc/check-tag-names`: Only use valid JSDoc tags

## Best Practices

### 1. Write for Your Audience

JSDoc serves multiple audiences:
- **IDE users**: Concise, scannable descriptions for IntelliSense
- **New developers**: Context and usage examples for onboarding
- **Documentation generators**: Structured information for automated docs

### 2. Describe "Why", Not "What"

Good JSDoc explains purpose and usage, not implementation details:

❌ **Bad** (describes implementation):
```typescript
/**
 * Loops through items and returns filtered array.
 */
export function filterActive(items: Item[]): Item[] {
  return items.filter(item => item.isActive);
}
```

✅ **Good** (describes purpose):
```typescript
/**
 * Returns only active items from the collection.
 * 
 * Filters out inactive, archived, or deleted items, useful for
 * displaying current inventory or available options to users.
 * 
 * @param items - Collection of items to filter
 * @returns Array containing only items with `isActive: true`
 */
export function filterActive(items: Item[]): Item[] {
  return items.filter(item => item.isActive);
}
```

### 3. Include Usage Examples for Complex APIs

```typescript
/**
 * Fetches paginated user data with optional filtering and sorting.
 * 
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page (default: 20, max: 100)
 * @param filters - Optional filters for user properties
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction
 * @returns Promise resolving to paginated user data
 * 
 * @example
 * ```typescript
 * // Fetch first page of active admins, sorted by name
 * const users = await fetchUsers(1, 20, { role: 'admin', isActive: true }, 'name', 'asc');
 * ```
 */
export async function fetchUsers(
  page: number,
  pageSize: number = 20,
  filters?: UserFilters,
  sortBy?: keyof User,
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<PaginatedResponse<User>> {
  // implementation
}
```

### 4. Document Side Effects and Mutations

```typescript
/**
 * Adds an item to the shopping cart and updates local storage.
 * 
 * Side effects:
 * - Mutates cart state
 * - Persists cart to localStorage
 * - Triggers cart analytics event
 * 
 * @param item - Item to add to cart
 * @throws {CartFullError} If cart has reached maximum capacity (100 items)
 */
export function addToCart(item: CartItem): void {
  // implementation
}
```

### 5. Mark Deprecated APIs

```typescript
/**
 * Legacy authentication function using session cookies.
 * 
 * @deprecated Use `authenticateWithToken()` instead. This function will be
 * removed in v2.0.0. Session-based auth is being replaced with JWT tokens.
 * 
 * @param username - User's login name
 * @param password - User's password
 */
export function authenticateWithSession(username: string, password: string): void {
  // implementation
}
```

## TypeScript-Specific Guidelines

### Don't Duplicate TypeScript Types in JSDoc

TypeScript already provides type information. Don't repeat it in JSDoc:

❌ **Bad** (duplicates TypeScript types):
```typescript
/**
 * @param {string} name - User's name
 * @param {number} age - User's age
 * @returns {UserProfile} - The created user profile
 */
export function createUser(name: string, age: number): UserProfile {
  // implementation
}
```

✅ **Good** (uses TypeScript types, JSDoc adds context):
```typescript
/**
 * Creates a new user profile with default settings.
 * 
 * @param name - User's full name (first and last)
 * @param age - User's age in years (must be 18+)
 * @returns Newly created user profile with default role 'user'
 */
export function createUser(name: string, age: number): UserProfile {
  // implementation
}
```

### Use `@default` for Optional Parameters

```typescript
/**
 * Button properties.
 */
export interface ButtonProps {
  /**
   * Button visual variant.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /**
   * Button size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}
```

## Validation

Run ESLint to validate JSDoc compliance:

```bash
# Check all files for JSDoc violations
npx eslint apps/ packages/ --ext .ts,.tsx

# Auto-fix formatting issues (alignment, indentation)
npx eslint apps/ packages/ --ext .ts,.tsx --fix
```

## Migration Checklist

When adding JSDoc to existing code:

- [ ] Add description to all exported components, functions, types
- [ ] Document all function parameters with `@param`
- [ ] Document return values with `@returns`
- [ ] Add `@default` tags for optional parameters
- [ ] Include `@example` for complex APIs
- [ ] Run ESLint to verify compliance
- [ ] Test IntelliSense in VS Code to confirm JSDoc appears

## Resources

- [JSDoc Official Documentation](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [eslint-plugin-jsdoc Rules](https://github.com/gajus/eslint-plugin-jsdoc)
- TailwindSpark Constitution Principle V: Documentation Standards
