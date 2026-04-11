# Changelog

All notable changes to TailwindSpark will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2026-04-11] Archive run

### Archived

- `.documentation/copilot/archive-2026-04-08.md` - Prior archive report retained only for historical traceability after newer archive and harvest runs.
- `.documentation/copilot/harvest-2026-04-08.md` - Superseded harvest report whose durable knowledge is already reflected in the living changelog and guide.
- `.documentation/copilot/session=2026-03-07/` - Older copilot session artifacts no longer needed in the active documentation surface.
- `.documentation/copilot/preharvest-doc-audit-2026-03-26.json` - Historical preharvest scan output no longer needed alongside current operational docs.
- `.documentation/specs/003-reactspark-migration/` - Completed ReactSpark migration spec set after reconciliation of the remaining closure tasks.
- `.documentation/specs/1-constitution-compliance/` - Completed constitution-remediation spec artifact removed from the active spec surface after harvest confirmed its durable outcomes were already preserved.

### Key decisions preserved

- The active documentation surface remains rooted in `.documentation/`, with the canonical changelog in `.documentation/guides/CHANGELOG.md` and the living orientation document in `.documentation/Guide.md`.
- Historical copilot process reports are traceability artifacts and belong in `.archive/`, not alongside current operational docs.
- The ReactSpark migration work is preserved as delivered application behavior and a harvested changelog entry rather than an active planning artifact.
- The constitution-remediation work remains represented by the 2026-03-01 changelog entry and the live constitution, so the stray active spec copy was archived.

## [Unreleased] - 2026-04-11

### Added

- **GitHub Repositories Explorer**: Added a new repositories mini-app that browses Mark Hazleton's public repositories with portfolio analytics
  - Registered a new demo app route for repository exploration inside the demo application
  - Added search, language filtering, status filtering, and multiple sort modes for repository discovery
  - Added accordion-style repository detail panels with AI summary, commit activity, language breakdown, attention metrics, contributor stats, and external links
  - Added aggregate portfolio summary metrics for repositories, commits, stars, forks, and language distribution

### Technical

- **Repository Data Sync Pipeline**: Added a prebuild repository sync flow that fetches and sanitizes repositories.json into the demo app public data bundle
- **Repository Analytics Types and Service**: Added schema validation, typed mapping, caching, and service-layer access for repository portfolio data
- **Accessibility and Responsive Behavior**: Completed keyboard-accessible expansion behavior and responsive layout support for the repositories experience

## [Unreleased] - 2026-04-08

### Changed

- **Development Framework Migration**: Migrated from SpecKit 1.4.3 to DevSpark 1.3.0
  - Created `.devspark/` directory structure with 24 stock commands, 6 templates, and 14 bash scripts
  - Migrated all agent and prompt shims from `speckit.*` to `devspark.*` (19 agents, 19 prompts)
  - Updated VS Code settings to use DevSpark commands and script paths
  - All framework references updated to DevSpark naming
- **Documentation Structure**: Reorganized documentation from `/docs/` to `.documentation/guides/`
  - Moved 6 documentation files (ARCHITECTURE, BRANDING, CHANGELOG, DEPLOYMENT, GETTING_STARTED, TESTING)
  - Updated all references in README.md and internal documentation
  - Aligned with DevSpark canonical documentation structure

### Technical

- Archived `SPECKIT_VERSION` to `.old` backup
- Created `.devspark/VERSION` stamp (v1.3.0, installed 2026-04-08)
- Updated `.gitignore` with DevSpark personal overrides pattern
- Migration method: copilot-quickstart from <https://github.com/markhazleton/devspark>

## [Unreleased] - 2026-03-01

### Added

- **Comprehensive JSDoc Documentation**: Added JSDoc comments to 88+ exports across ui-components, design-tokens, and demo-app for improved IntelliSense support
- **Test Infrastructure**: Created 27 test files with 369 test cases for pages, sections, and components
- **Coverage Thresholds**: Configured a temporary 40% enforced coverage baseline while future specs evaluate raising the floor
- **Data Visualization Colors**: Added 8 semantic color tokens for charts and graphs with light/dark mode support
- **ESLint JSDoc Plugin**: Integrated eslint-plugin-jsdoc for documentation quality enforcement
- **Testing Implementation Guide**: Comprehensive guide for writing tests with established patterns
- **JSDoc Style Guide**: Standardized documentation patterns across the codebase
- **Semantic Color Migration Guide**: Step-by-step guide for replacing raw Tailwind colors
- **Raw Color Violations Audit**: Detailed audit report identifying 794 violations across 51 files

### Enhanced

- **ESLint Rules**: Strengthened no-raw-primary-class rule to catch ALL raw color patterns (23 color names, all modifiers, all prefixes)
- **Test Coverage**: Increased from 40% to 60-70% with a documented path to raise the enforced baseline in future specs
- **Code Quality**: Standardized logging patterns with appropriate use of console methods
- **IntelliSense Support**: All components, pages, and sections now have helpful JSDoc
- **Design Token Organization**: Added module-level JSDoc to design tokens package

### Fixed

- **Console Logging**: Replaced inappropriate console.log usage with dev-only guards and eslint-disable comments
- **Dark Mode Compatibility**: Fixed 67 raw color violations in critical user-facing files (AnimationShowcase, AnalyticsPage, BuildInfo, SettingsPage)
- **JSDoc Coverage**: Reduced JSDoc violations from 151 to 63 (58% improvement)

### Documentation

- **Constitution Compliance Implementation Summary**: Complete report of progress across all 4 user stories
- **Pre-commit Hook Setup Guide**: Documentation for git hooks and quality gates
- **Testing Implementation Patterns**: Established patterns for Vitest + @testing-library/react

### Technical

- **Test Configuration**: Updated vitest.config.ts with v8 coverage provider and lcov reporter
- **npm Scripts**: Added `lint:colors` script for dedicated color violation checking
- **Package Scripts**: Maintained workspace-scoped linting across monorepo

## [2026-03-07]

### Added

- **ReactSpark Portfolio Migration**: Completed migration of the ReactSpark portfolio experience into the TailwindSpark demo app under the `/apps` route family
- **Mini-App Suite**: Added Projects, Articles, Joke, Weather, and AI Chat mini-app pages with shared navigation, app discovery, and route-aware SEO metadata
- **Service and Validation Layer**: Added typed service modules, Zod-backed validation, cache invalidation, sanitization utilities, and SignalR chat integration for the migrated app surfaces

### Changed

- **Navigation and Discovery**: Added the Apps hub, keyboard-accessible dropdown navigation, sticky header behavior, and active-state routing across the migrated experience
- **Quality Gates**: Completed accessibility, CSP, caching, and responsive hardening for the mini-app suite while retaining the temporary 40% migration-spec coverage baseline
- **Performance Delivery**: Split large dependencies into dedicated chunks and verified service worker support for the `/apps/*` routes

## [1.2.0] - 2025-09-07

### Added

- **Tailwind CSS v4.1**: Complete migration to Tailwind CSS v4 with @theme directive
- **Centralized Design Tokens**: New design token system using CSS custom properties
- **Enhanced Theme System**: Improved dark/light mode toggle with cross-browser compatibility
- **PostCSS v4 Configuration**: Updated PostCSS setup for Tailwind CSS v4 compatibility
- **Semantic Color System**: Abstracted color system using CSS variables for better maintainability

### Enhanced

- **Browser Compatibility**: Fixed theme toggle issues in Firefox and Edge browsers
- **Performance**: Optimized CSS compilation with new Tailwind v4 engine
- **Developer Experience**: Better design token organization and theme customization
- **Build Process**: Updated build pipeline for Tailwind CSS v4 requirements
- **Documentation**: Comprehensive migration guides and best practices

### Fixed

- **Theme Toggle**: Resolved navigation visibility issues across different browsers
- **CSS Import Order**: Fixed design token import ordering for proper CSS variable resolution
- **Build Compatibility**: Updated all PostCSS configurations for v4 compatibility

### Migration Notes

- Upgraded from Tailwind CSS v3.4 to v4.1.13
- Replaced traditional `tailwind.config.js` approach with `@theme` directive
- Centralized design tokens in `packages/design-tokens/theme.css`
- Updated PostCSS configuration to use `@tailwindcss/postcss` plugin
- Implemented semantic color system with CSS custom properties

## [1.1.0] - 2024-01-15

### Added

- **SEO Optimization**: Comprehensive meta tags, structured data, and social media optimization
- **Search Functionality**: Global search with keyboard shortcuts (Ctrl/Cmd + K)
- **Error Boundaries**: Better error handling and user experience
- **Service Worker**: Improved caching and offline capabilities
- **Keyboard Shortcuts**: Enhanced navigation with keyboard support
- **Loading Components**: Reusable loading spinners and states
- **Analytics Integration**: Google Analytics tracking for user behavior
- **Sitemap**: XML sitemap for better search engine indexing
- **Robots.txt**: Search engine crawling instructions
- **Social Media Images**: Open Graph and Twitter Card images

### Enhanced

- **Performance**: Service worker caching and optimized loading
- **Accessibility**: Better keyboard navigation and screen reader support
- **User Experience**: Search functionality and improved error handling
- **SEO**: Comprehensive meta tags and structured data
- **Mobile Experience**: Better responsive design and touch interactions

### Fixed

- **Linting Issues**: Resolved accessibility warnings
- **Build Process**: Improved deployment pipeline
- **TypeScript**: Better type safety across components

## [1.0.0] - 2024-01-01

### Added

- **Initial Release**: Complete Tailwind CSS showcase
- **Component Library**: Button, Form, Card, and Modal components
- **Design System**: Comprehensive design tokens and utilities
- **Animation Showcase**: Interactive animation demonstrations
- **SaaS Dashboard**: Full-featured business dashboard demo
- **E-commerce Demo**: Online store with product management
- **Marketing Demo**: Landing page with modern design patterns
- **Dark Mode**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **TypeScript**: Full type safety across all components
- **Monorepo Architecture**: Turborepo with shared packages
- **GitHub Pages Deployment**: Automated deployment pipeline

### Features

- **Interactive Components**: Live demonstrations of all UI components
- **Animation Gallery**: Transition effects and keyframe animations
- **Dashboard Analytics**: Charts, metrics, and data visualization
- **User Management**: Complete user directory and role management
- **Settings Configuration**: Application preferences and security
- **Form Validation**: Live examples with error states
- **Accessibility**: WCAG compliant components throughout
- **Performance**: Optimized builds and efficient rendering

## [Unreleased]

### Planned

- **Storybook Integration**: Component documentation and testing
- **Performance Monitoring**: Real-time performance metrics
- **A/B Testing**: User experience optimization
- **Internationalization**: Multi-language support
- **Advanced Animations**: More complex animation examples
- **Component Testing**: Unit and integration tests
- **Performance Audits**: Lighthouse optimization
- **Accessibility Audits**: WCAG compliance verification
