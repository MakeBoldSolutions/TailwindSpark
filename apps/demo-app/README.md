# TailwindSpark Demo App

The main React application for TailwindSpark. It combines the original component showcase pages with the ReactSpark migration work delivered as a mini-app suite under `/apps/*`.

## Features

- Interactive component showcases for design system, animations, dashboard, ecommerce, and marketing patterns
- ReactSpark mini-app suite for projects, articles, jokes, weather, and AI chat
- Shared dark mode, SEO metadata, and service-layer patterns across all routes
- Responsive layouts validated across mobile, tablet, and desktop breakpoints
- Service worker caching for core and mini-app routes

## Technology Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Tailwind CSS 4.1** - Utility-first CSS with @theme directive
- **Vite 7** - Fast build tool and dev server
- **React Router** - Client-side routing with `/apps/*` namespaces
- **Vitest** - Testing framework

## Development

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Setup

```bash
# From the monorepo root
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## Project Structure

```text
apps/demo-app/
├── src/
│   ├── components/     # Shared shell, navigation, and UI building blocks
│   ├── contexts/       # Theme and SEO providers shared by all routes
│   ├── hooks/          # Route and feature-specific data hooks
│   ├── pages/          # Core pages plus mini-app route entrypoints
│   │   └── apps/       # Mini-app pages mounted at /apps/*
│   ├── sections/       # Feature presentation components used by mini-apps
│   ├── services/       # Fetch, caching, and SignalR service layer
│   ├── types/          # TypeScript definitions and API contracts
│   └── assets/         # Static assets
├── public/             # Static files and service worker
└── dist/               # Build output
```

## Routing

The app uses React Router with the following routes:

- `/` - Home page with component showcase
- `/about` - About page with ReactSpark context and migration overview
- `/apps` - Mini-app hub page
- `/apps/projects` - Projects showcase mini-app
- `/apps/articles` - Articles reader mini-app
- `/apps/joke` - Joke generator mini-app
- `/apps/weather` - Weather forecast mini-app with map support
- `/apps/ai-chat` - AI chat mini-app with PromptSpark variants
- `/design-system` - Design system documentation
- `/animations` - Animation demonstrations
- `/demos` - All demo overview
- `/dashboard` - SaaS dashboard demo
- `/ecommerce` - E-commerce store demo
- `/marketing` - Marketing landing demo

Unknown `/apps/*` routes fall through to the shared not-found experience.

## Mini-App Architecture

The ReactSpark migration is organized as a small suite of focused route islands that share infrastructure without sharing page state.

### Shared Shell

- `Layout.tsx` provides the sticky header, skip link, theme toggle, and Apps navigation menu
- `ThemeContext` persists the user theme choice and applies the `.dark` class strategy
- `SEOContext` centralizes titles, canonical URLs, and social metadata per page

### Feature Boundaries

- `pages/apps/*` contains route entry components and route-level state orchestration
- `sections/*` contains presentation pieces such as `ProjectCard`, `ArticleCard`, `WeatherCard`, and `ChatInterface`
- `hooks/*` encapsulates loading, error, filtering, and mutation flows for each mini-app
- `services/*` owns API calls, local cache access, and SignalR connection behavior

### Mini-App Inventory

- Projects: cached project listing with fallback data and responsive pagination
- Articles: RSS-backed article feed with category filtering and normalized card rendering
- Joke: random joke generation plus saved, liked, and history state in localStorage
- Weather: city search, recent searches, normalized weather payloads, and Leaflet map display
- AI Chat: variant selection, SignalR-backed conversations, and markdown message rendering

## Data, Caching, and Offline Behavior

- Shared fetch defaults live in `src/services/fetchOptions.ts` for anonymous public requests
- Feature services use cache helpers in `src/services/cache.service.ts` with environment-based TTLs
- Hard refresh cache clearing is opt-in and only triggered by the explicit force-clear marker used by the app
- `public/sw.js` precaches the mini-app routes so `/apps`, `/apps/projects`, `/apps/articles`, `/apps/joke`, `/apps/weather`, and `/apps/ai-chat` are observable in browser cache storage

## Theme System

### Tailwind CSS v4 Integration

The app uses Tailwind CSS v4 with centralized design tokens:

```css
/* Design tokens defined in packages/design-tokens/theme.css */
@theme {
  --color-primary-500: #0ea5e9;
  --color-secondary-900: #1c1917;
  /* ... more tokens */
}

/* Semantic color system */
:root {
  --color-brand: var(--color-primary-600);
  --color-surface: #ffffff;
  --color-text: var(--color-secondary-900);
}

.dark {
  --color-surface: var(--color-secondary-900);
  --color-text: var(--color-secondary-100);
}
```

### Dark Mode

Dark mode is implemented using:

- CSS custom properties for theme colors
- `.dark` class toggle on the `<html>` element
- localStorage persistence for user preference
- System preference detection as fallback

### Component Styling

Components use a semantic color system:

```tsx
// Instead of hard-coded colors
className="text-gray-900 dark:text-gray-100"

// Use semantic classes
className="text-text"
```

## Testing

The app includes comprehensive testing:

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

Current validation for the ReactSpark migration includes:

- Vitest component and service coverage with a temporary 40% enforced floor for this spec
- ESLint with semantic-token and accessibility enforcement
- Axe-based accessibility smoke tests co-located with the app shell and affected mini-app page test suites
- Keyboard-only verification in light and dark themes
- Manual responsive checks for mobile and tablet mini-app flows

## Build and Deployment

### Development Build

```bash
npm run dev
# Serves at http://localhost:5173
```

### Production Build

```bash
npm run build
# Output in ../../dist/ for GitHub Pages deployment
```

The production build uses the GitHub Pages base path `/TailwindSpark/` and generates bundle analysis output in `reports/bundle-analysis.html`.

### Preview Build

```bash
npm run preview
# Preview production build locally
```

## Configuration

### Vite Configuration

The app uses Vite with the following key configurations:

- **Base URL**: Set to `/TailwindSpark/` for GitHub Pages
- **Build Output**: `../../dist/` for monorepo deployment
- **Plugins**: React, TypeScript support

### PostCSS Configuration

Tailwind CSS v4 PostCSS setup:

```js
export default {
  plugins: [
    ['@tailwindcss/postcss']
  ]
}
```

### ESLint Configuration

Strict ESLint rules for code quality:

- TypeScript strict mode
- React hooks rules
- Accessibility rules
- Import sorting

## Contributing

See the main [Contributing Guide](../../CONTRIBUTING.md) for development guidelines.

## License

This project is part of TailwindSpark and is licensed under the MIT License.
