# Architecture Overview

TailwindSpark is built as a modern monorepo using cutting-edge web development practices and tools.

## Technology Stack

### Core Technologies

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.1** - Utility-first CSS with @theme directive
- **Vite** - Fast build tool and dev server

### Monorepo Tools

- **Turborepo** - High-performance build system
- **npm Workspaces** - Package management
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Vitest** - Testing framework

### Development Tools

- **GitHub Actions** - CI/CD pipeline
- **Dependabot** - Automated dependency updates
- **CodeQL** - Security analysis

## Project Structure

### Monorepo Layout

```
TailwindSpark/
├── apps/                    # Applications
│   └── demo-app/           # Main React application
├── packages/               # Shared packages
│   ├── design-tokens/      # Design system tokens
│   └── ui-components/      # Reusable components
├── docs/                   # Documentation
├── .documentation/         # SpecKit artifacts, audit reports, and AI session docs
├── .github/                # GitHub workflows and config
└── scripts/                # Build and maintenance automation
```

### Package Architecture

#### Design Tokens Package

- **Purpose**: Centralized design system with Tailwind CSS v4 @theme directive
- **Exports**: Colors, typography, spacing, breakpoints via CSS custom properties
- **Usage**: Imported by all other packages through theme.css
- **Architecture**: Uses @theme directive for design token definitions

#### UI Components Package

- **Purpose**: Reusable React components
- **Architecture**: Component-per-file with co-located tests
- **Exports**: Button, Card, Form, Modal components
- **Dependencies**: React, design tokens

#### Demo App

- **Purpose**: Showcase and testing application
- **Architecture**: Feature-based organization
- **Routes**: Home, Demos, Dashboard, E-commerce, Marketing
- **Features**: Theme switching, responsive design

## Build System

### Turborepo Configuration

The monorepo uses Turborepo for efficient task execution with caching:

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] },
    "lint": { "dependsOn": ["^build"] }
  }
}
```

### Build Order

1. **Design Tokens** - Built first (no dependencies)
2. **UI Components** - Built second (depends on design tokens)
3. **Demo App** - Built last (depends on both packages)

### Caching Strategy

- **Remote caching** on Vercel for CI/CD
- **Local caching** for development
- **Incremental builds** based on file changes

## Development Workflow

### Local Development

1. **Start development**: `npm run dev`
   - Starts all packages in watch mode
   - Hot reload for instant feedback
   - Parallel execution for speed

2. **Run tests**: `npm run test`
   - Unit tests with Vitest
   - Component tests with React Testing Library
   - Coverage reporting

3. **Code quality**: `npm run lint`
   - ESLint for code consistency
   - TypeScript for type safety
   - Prettier for formatting

### Git Workflow

1. **Feature branches** from main
2. **Pull request** with required checks
3. **Automated testing** and security scanning
4. **Merge** to main triggers deployment

## Deployment Pipeline

### GitHub Actions Workflow

```yaml
Trigger: Push to main
├── Install dependencies
├── Security audit
├── Build packages (parallel)
├── Run tests
├── Type checking
├── Deploy to GitHub Pages
└── Notify completion
```

### Build Artifacts

- **Static assets** optimized by Vite
- **Code splitting** for better performance
- **Tree shaking** to remove unused code
- **Asset optimization** (images, fonts, CSS)

## Design System Architecture

### Token Structure

```text
Design Tokens
├── Colors
│   ├── Primary palette
│   ├── Secondary palette
│   ├── Semantic colors
│   └── Neutral colors
├── Typography
│   ├── Font families
│   ├── Font sizes
│   └── Line heights
└── Spacing
    ├── Base scale (4px)
    ├── Component spacing
    └── Layout spacing
```

### Component Architecture

```text
Component Structure
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
├── Card/
├── Form/
└── Modal/
```

### Styling Strategy

- **Utility-first** with Tailwind CSS v4
- **@theme directive** for centralized design tokens
- **CSS custom properties** for semantic color system
- **Component variants** using class composition
- **Responsive design** with mobile-first approach
- **Dark mode** support with .dark class strategy

## Performance Considerations

### Bundle Optimization

- **Code splitting** at route level
- **Lazy loading** for heavy components
- **Tree shaking** for unused exports
- **Asset compression** in build

### Runtime Performance

- **React 19** concurrent features
- **Virtual scrolling** for large lists
- **Memoization** for expensive calculations
- **Image optimization** with WebP/AVIF

### Developer Experience

- **Fast refresh** in development
- **Type safety** with TypeScript
- **IntelliSense** in VS Code
- **Automated testing** and linting

## Security Architecture

### Static Analysis

- **CodeQL** for vulnerability detection
- **Dependency scanning** with npm audit
- **Secret scanning** in GitHub
- **SAST tools** in CI/CD

### Runtime Security

- **Content Security Policy** headers
- **HTTPS enforcement**
- **Dependency updates** with Dependabot
- **License compliance** checking

## Scalability Considerations

### Monorepo Benefits

- **Shared tooling** across packages
- **Atomic commits** across boundaries
- **Consistent dependencies** and versions
- **Simplified CI/CD** pipeline

### Future Expansion

- **Additional apps** can be added easily
- **Package extraction** for external use
- **Micro-frontend** architecture possible
- **Team scaling** with clear boundaries
