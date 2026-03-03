# Implementation Plan: ReactSparkPortfolio Migration

**Branch**: `003-reactspark-migration` | **Date**: March 2, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `.documentation/specs/003-reactspark-migration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.documentation/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate all features from ReactSparkPortfolio (Bootstrap 5 + React) to TailwindSpark with Tailwind CSS as a mini-app architecture. The system will provide 5 mini-apps (Projects showcase, Blog articles, Joke generator with AI, Weather forecast with maps, AI Chat with variants) organized under an Apps hub at `/apps` with dropdown navigation. All mini-apps will share global state (ThemeContext, SEOContext, service layer) while maintaining isolated feature boundaries. Primary technical approach involves replacing all Bootstrap components with Tailwind CSS utility classes, implementing React Router for `/apps/*` namespace routing, and establishing shared context providers for cross-app functionality.

## Technical Context

**Language/Version**: TypeScript 5.7+ (strict mode), React 19.2.4  
**Primary Dependencies**: 
- Tailwind CSS 4.x (already installed at 4.2.1, using @theme directive)
- React Router 7.1+ (client-side routing for `/apps/*`)
- Vite 7.3.1 (build tool with HMR and dev proxy)
- Zod 3.x (API response validation)
- SignalR Client 8.x (real-time chat)
- Leaflet 1.9+ (weather map visualization)
- React Markdown (chat message rendering)

**Storage**: 
- localStorage (theme preferences, saved jokes, user name, cached API responses)
- sessionStorage (version detection, temporary state)
- External APIs: Projects JSON, RSS XML, JokeAPI, OpenWeatherMap, PromptSpark Variants

**Testing**: Vitest 3.x with @testing-library/react, 80% minimum coverage required  
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), responsive across mobile/tablet/desktop  
**Project Type**: Web application (SPA with server-side static hosting)  
**Performance Goals**: 
- Lighthouse scores: Performance 90+, Accessibility 100, Best Practices 100, SEO 100
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Total bundle size < 500KB gzipped
- Individual mini-app chunks < 100KB

**Constraints**: 
- Page load < 200ms p95 (with caching)
- API response handling < 100ms p95 (excluding network)
- 60fps animations and interactions
- Offline-capable with service worker caching
- Mobile-first responsive design (320px min width)
- WCAG 2.1 AA accessibility compliance

**Scale/Scope**: 
- 5 mini-apps + Apps hub + core pages (Home, About, 404)
- ~15-20 React components total
- ~10 routes (5 mini-apps at `/apps/*`, 3 core pages, hub, 404)
- External API integrations: 4 APIs (Projects, RSS, JokeAPI, Weather)
- SignalR real-time: 1 chat hub connection
- Expected traffic: Portfolio site (100-1000 daily visitors)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Type Safety ✅ PASS
- All new mini-app components will use TypeScript strict mode (existing tsconfig.app.json has `strict: true`)
- All React components will define interfaces for props (e.g., `ProjectsPageProps`, `JokePageProps`)
- All mini-app components will use React.FC pattern
- Explicit return types for all exported functions
- No violations expected

### Principle II: Testing Standards ✅ PASS
- All new mini-app components will have co-located `.test.tsx` files
- 80% minimum coverage required (enforced by vitest.config.ts)
- Using @testing-library/react for component testing (already in use)
- Tests will be co-located with source files in `apps/demo-app/src/pages/apps/`
- No violations expected

### Principle III: Design System & Semantic Tokens ✅ PASS
- **This is the core requirement**: Replace Bootstrap with Tailwind semantic tokens
- Tailwind CSS 4.x already installed (4.2.1) with @theme directive active in packages/design-tokens/theme.css
- All new components will use `packages/design-tokens` semantic classes
- No raw Tailwind color classes (e.g., `bg-blue-600`) - use `bg-brand`, `bg-surface`, `text-text`
- Custom ESLint rule `no-raw-primary-class` will enforce compliance
- Dark mode using `.dark` class strategy with CSS variables (already established)
- No violations expected

### Principle IV: Accessibility Standards ✅ PASS
- All new mini-app UIs will meet WCAG AA standards
- ARIA attributes on Apps dropdown, modals, interactive elements
- Keyboard navigation for all features (Apps dropdown, chat, modals)
- Color contrast ratios meet WCAG AA (using semantic tokens ensures this)
- jsx-a11y ESLint rules already configured
- No violations expected

### Principle V: Documentation Standards ⚠️ AWARE (NOT BLOCKING)
- **Current Gap**: JSDoc coverage ~5% across codebase
- **Plan**: New mini-app components will have JSDoc for all exports
- Inline comments for complex migration logic (Bootstrap → Tailwind conversions)
- README updates to document mini-app architecture
- **Not blocking**: Constitution recognizes this as implementation gap, working to close it

### Principle VI: Code Quality & Formatting ✅ PASS
- All code will pass ESLint (including custom `no-raw-primary-class` rule)
- Prettier formatting with project configuration (.prettierrc)
- No console.log (using console.warn/error where needed)
- CI/CD blocks on ESLint violations
- No violations expected

### Principle VII: Monorepo Architecture ✅ PASS
- Code will reside in existing `apps/demo-app` workspace
- Shared design tokens from `packages/design-tokens`
- Shared UI components (if needed) from `packages/ui-components`
- Turborepo orchestration (existing turbo.json)
- npm workspaces (existing package.json)
- No violations expected

### Principle VIII: CI/CD & Automation ✅ PASS
- GitHub Actions already configured (.github/workflows/deploy.yml)
- Builds must pass before merging (existing)
- Security audits (existing .github/workflows/security.yml)
- Lighthouse CI (existing .github/workflows/lighthouse-ci.yml)
- Automated deployment to GitHub Pages (existing)
- No violations expected

### Additional Standards ✅ PASS

**Component Organization**:
- New mini-apps in `apps/demo-app/src/pages/apps/` (page components)
- Shared components in `apps/demo-app/src/components/` (e.g., AppsDropdown, MiniAppCard)
- Sections in `apps/demo-app/src/sections/` (e.g., ProjectCard, ArticleCard)
- PascalCase for components, camelCase for hooks

**Dark Mode Support**:
- All new UIs will support light/dark themes using existing `.dark` class strategy
- Color tokens have light/dark variants in theme.css

**Error Handling**:
- Page-level ErrorBoundary wraps mini-apps
- User-friendly error messages for API failures
- Analytics logging when available

### GATE EVALUATION: ✅ ALL GATES PASS

**Justification**: This migration aligns perfectly with constitution principles. The core requirement (Principle III: Replace Bootstrap with semantic Tailwind tokens) is exactly what the constitution mandates. The only noted gap (JSDoc coverage) is recognized in the constitution itself as an implementation gap being actively addressed, not a blocking violation.

**Proceed to Phase 0 Research**: APPROVED

## Project Structure

### Documentation (this feature)

```text
.documentation/specs/003-reactspark-migration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - Technology research and best practices
├── data-model.md        # Phase 1 output - Entity definitions and relationships
├── quickstart.md        # Phase 1 output - Developer onboarding guide
├── contracts/           # Phase 1 output - API contracts and TypeScript types
│   ├── projects-api.ts  # Projects JSON API types
│   ├── rss-api.ts       # RSS feed types
│   ├── joke-api.ts      # JokeAPI types
│   ├── weather-api.ts   # OpenWeatherMap API types
│   └── chat-api.ts      # PromptSpark & SignalR types
├── spec.md              # Feature specification (already created)
├── clarification-report.md  # Clarification session report (already created)
└── checklists/
    └── requirements.md  # Quality checklist (already created)
```

### Source Code (repository root)

```text
apps/demo-app/
├── src/
│   ├── App.tsx                 # Main application with Router setup
│   ├── main.tsx                # Application entry point
│   ├── components/             # Reusable UI components
│   │   ├── ErrorBoundary.tsx   # (existing) Error boundary wrapper
│   │   ├── Header.tsx          # (modify) Add Apps dropdown
│   │   ├── AppsDropdown.tsx    # (NEW) Apps navigation dropdown
│   │   ├── MiniAppCard.tsx     # (NEW) App card for hub page
│   │   ├── Modal.tsx           # (modify) For joke explainer & chat
│   │   └── ThemeToggle.tsx     # (existing) Theme switcher
│   ├── pages/                  # Route-specific page components
│   │   ├── HomePage.tsx        # (existing) Hero/landing page
│   │   ├── AboutPage.tsx       # (existing) About/profile page
│   │   ├── NotFoundPage.tsx    # (existing) 404 page
│   │   ├── AppsHubPage.tsx     # (NEW) Apps discovery hub at /apps
│   │   └── apps/               # (NEW) Mini-app pages
│   │       ├── ProjectsPage.tsx     # Projects showcase mini-app
│   │       ├── ArticlesPage.tsx     # Blog articles mini-app
│   │       ├── JokePage.tsx         # Joke generator mini-app
│   │       ├── WeatherPage.tsx      # Weather forecast mini-app
│   │       └── AIChatPage.tsx       # AI chat mini-app
│   ├── sections/               # Feature-specific sections
│   │   ├── HeroSection.tsx     # (existing) Hero content
│   │   ├── AboutSection.tsx    # (existing) About content
│   │   ├── ProjectCard.tsx     # (NEW) Individual project display
│   │   ├── ArticleCard.tsx     # (NEW) Individual article display
│   │   ├── JokeCard.tsx        # (NEW) Joke display component
│   │   ├── WeatherCard.tsx     # (NEW) Weather display component
│   │   ├── WeatherMap.tsx      # (NEW) Leaflet map component
│   │   ├── VariantCard.tsx     # (NEW) AI variant card
│   │   └── ChatInterface.tsx   # (NEW) Chat UI component
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTheme.ts         # (existing) Theme context hook
│   │   ├── useSEO.ts           # (existing) SEO context hook
│   │   ├── useProjects.ts      # (NEW) Projects API hook
│   │   ├── useArticles.ts      # (NEW) RSS feed hook
│   │   ├── useJokes.ts         # (NEW) JokeAPI hook
│   │   ├── useWeather.ts       # (NEW) Weather API hook
│   │   ├── useVariants.ts      # (NEW) PromptSpark variants hook
│   │   └── useSignalR.ts       # (NEW) SignalR connection hook
│   ├── services/               # API service layer (singleton pattern)
│   │   ├── cache.service.ts    # (modify) Cache manager with version invalidation
│   │   ├── projects.service.ts # (NEW) Projects API service
│   │   ├── rss.service.ts      # (NEW) RSS feed parser service
│   │   ├── joke.service.ts     # (NEW) JokeAPI service
│   │   ├── weather.service.ts  # (NEW) OpenWeatherMap service
│   │   ├── variants.service.ts # (NEW) PromptSpark variants service
│   │   └── chat.service.ts     # (NEW) SignalR chat hub service
│   ├── types/                  # TypeScript type definitions
│   │   ├── projects.ts         # (NEW) Project entity types
│   │   ├── articles.ts         # (NEW) Article entity types
│   │   ├── jokes.ts            # (NEW) Joke entity types
│   │   ├── weather.ts          # (NEW) Weather entity types
│   │   ├── variants.ts         # (NEW) Variant entity types
│   │   ├── chat.ts             # (NEW) Chat message types
│   │   └── miniapp.ts          # (NEW) MiniApp metadata types
│   ├── contexts/               # React context providers
│   │   ├── ThemeContext.tsx    # (existing) Theme state provider
│   │   └── SEOContext.tsx      # (existing) Meta tags provider
│   └── utils/                  # Utility functions
│       ├── validation.ts       # (NEW) Zod schemas for API validation
│       └── constants.ts        # (existing) App constants

packages/design-tokens/          # (existing) Shared design system
packages/ui-components/          # (existing) Shared UI library (if needed)
```

**Note**: All test files are co-located with their source files (e.g., `AppsDropdown.test.tsx` next to `AppsDropdown.tsx`), per Constitution Principle II.

**Structure Decision**: This is a web application (SPA) using the existing `apps/demo-app` monorepo workspace. We're leveraging the established monorepo structure with shared design tokens (`packages/design-tokens`) for semantic Tailwind classes. The mini-app architecture is implemented through:

1. **Page Organization**: New `pages/apps/` directory for mini-app pages, keeping them isolated as route components
2. **Component Reuse**: Shared components (e.g., AppsDropdown, MiniAppCard) in `components/` for cross-app UI elements
3. **Feature Sections**: Granular section components in `sections/` for composable mini-app features
4. **Service Layer**: Singleton services in `services/` shared across all mini-apps via global context (per FR-077)
5. **Type Safety**: Comprehensive TypeScript types in `types/` aligned with API contracts
6. **Custom Hooks**: React hooks in `hooks/` for state management and API integration
7. **Testing**: Co-located tests following Vitest conventions with `.test.tsx` suffix

## Complexity Tracking

**Status**: No constitution violations - this section is not applicable.

**Justification**: The Constitution Check evaluation shows all 8 core principles pass without violations. The only noted item (JSDoc coverage gap in Principle V) is explicitly recognized as an existing implementation gap in the constitution itself, not a violation introduced by this feature. Therefore, no complexity justifications are needed.

---

## Planning Phases Execution

### Phase 0: Outline & Research ✅ COMPLETE

**Objective**: Resolve all technical unknowns and document technology decisions with best practices

**Generated Artifacts**:
- ✅ [research.md](research.md) - 9 comprehensive technology decisions covering:
  - Tailwind CSS 4.1 with @theme directive and semantic tokens (constitution-aligned)
  - React Router 7.1+ with /apps/* namespace routing strategy
  - Zod 3.x for API validation (addresses constitution gap in runtime type safety)
  - SignalR Client 8.x with automatic reconnection and transport fallback
  - Leaflet 1.9+ for interactive weather maps
  - Singleton service layer pattern for shared caching across mini-apps
  - Bootstrap → Tailwind migration patterns (class mapping table with 50+ examples)
  - Version-based caching strategy with TTL invalidation
  - SEO Context for dynamic meta tag management
  - Migration risks and mitigation strategies
  - Performance benchmarks (Lighthouse 90+, FCP <1.5s, TTI <3.5s)
  - Testing strategy (80% coverage minimum, co-located tests)

**Key Decisions**:
1. **Tailwind Semantic Tokens**: Replace all Bootstrap with semantic design tokens (bg-brand, text-text, etc.)
2. **Mini-App Routing**: Use /apps/* namespace with lazy-loaded pages for code splitting
3. **State Management**: Global contexts (Theme, SEO, Services) + local useState + localStorage
4. **Caching Strategy**: Version-based invalidation (VITE_APP_VERSION in cache keys)
5. **API Validation**: Dual type safety (TypeScript compile-time + Zod runtime)
6. **Real-Time Chat**: SignalR with WebSocket → SSE → LongPolling transport fallback

**Resolved Clarifications**:
- All NEEDS CLARIFICATION items from Technical Context resolved with concrete technology choices
- All dependency best practices documented (React Router patterns, Zod schemas, SignalR hub setup)
- All integration patterns defined (Projects JSON, RSS XML parsing, JokeAPI, OpenWeatherMap, SignalR)

---

### Phase 1: Design & Contracts ✅ COMPLETE

**Objective**: Define data models, API contracts, and developer documentation

**Generated Artifacts**:

1. ✅ [data-model.md](data-model.md) - **8 entities** with comprehensive definitions:
   - **Project**: Portfolio showcase from projects.json API
   - **Article**: RSS feed items from reactspark.com/rss.xml
   - **Joke**: Discriminated union (single/twopart) from JokeAPI
   - **WeatherData**: OpenWeatherMap current weather with Leaflet map config
   - **AIVariant**: PromptSpark chat personas with temperature/system prompts
   - **ChatMessage**: SignalR real-time messages (user/assistant roles)
   - **MiniApp**: Apps hub metadata (name, description, route, icon)
   - **UserPreferences**: localStorage state (theme, saved jokes, user name)
   
   Each entity includes:
   - TypeScript interface definition
   - Zod schema for runtime validation
   - Relationships to other entities
   - State management strategy (global context / local / localStorage / transient)
   - Complete data flow diagram (fetch → validate → cache → render → interact)

2. ✅ [contracts/](contracts/) - **5 TypeScript API contract files**:
   - `projects-api.ts`: Project types, Zod schemas, filters, pagination, API config
   - `rss-api.ts`: Article types, RSS XML structures, parsing types, categories
   - `joke-api.ts`: Joke discriminated union (single/twopart), flags, helpers
   - `weather-api.ts`: WeatherData types, OpenWeatherMap response, coordinates validation, temperature/wind utilities, Leaflet map config
   - `chat-api.ts`: AIVariant types, ChatMessage types, SignalR configuration (hub URL, retry delays, hub methods), connection options, helper functions
   
   Each contract provides:
   - Complete TypeScript interfaces for all API entities
   - Zod schemas for runtime validation (matching TypeScript types)
   - Configuration constants (API URLs, cache keys, TTLs)
   - Utility functions and helper methods
   - TypeScript + Zod dual type safety (compile-time + runtime)

3. ✅ [quickstart.md](quickstart.md) - **Developer onboarding guide** with:
   - 5-minute quick start (clone → install → dev server)
   - Project structure overview (pages, components, sections, services, hooks, types)
   - Development workflow examples (create mini-app page, hook, service, tests)
   - Tailwind CSS migration patterns (semantic tokens, dark mode support)
   - Testing guidelines (run tests, coverage requirements, test checklist)
   - Common tasks (add API endpoint, add shared state, clear cache)
   - Troubleshooting guide (build errors, ESLint errors, runtime errors)
   - Links to all planning artifacts and external docs

4. ✅ **Agent context updated**: 
   - GitHub Copilot instructions updated with TypeScript 5.7+, React 19.2.4
   - AI agents now aware of current tech stack for this feature

**Key Deliverables**:
- All 8 entities have complete TypeScript interfaces + Zod schemas
- All 5 external APIs have comprehensive type contracts
- All API responses will be validated at runtime (Zod) before use
- All developers have step-by-step onboarding guide with code examples
- AI coding assistants have updated context for accurate suggestions

**Constitution Re-Check Post-Design**: ✅ ALL GATES STILL PASS
- Phase 1 artifacts align with all 8 constitution principles
- Zod schemas provide runtime type safety (addresses Principle I gap)
- All entities designed with accessibility in mind (WCAG AA via semantic tokens)
- Comprehensive documentation (quickstart.md) supports Principle V
- No new violations introduced

---

### Phase 2: Task Breakdown ⏳ NEXT STEP

**Status**: Ready to generate  
**Command**: User should run `/speckit.tasks` to generate tasks.md

**What This Will Produce**:
- Actionable development tasks with acceptance criteria
- Priority-ordered implementation sequence (P1, P2, P3)
- Dependency relationships between tasks
- Estimated complexity for each task
- Task grouping by feature area (Navigation, Apps Hub, Projects, Articles, Joke, Weather, AI Chat)

**Suggested Task Priorities**:
- **P1** (Must Have - Core Navigation):
  - Navigation structure with Apps dropdown
  - Apps hub page at /apps with mini-app cards
  - Projects mini-app (simplest, good starting point)
  - Articles mini-app (similar to Projects)
  
- **P2** (Should Have - Feature Mini-Apps):
  - Joke mini-app with AI explanations
  - Weather mini-app with Leaflet maps
  
- **P3** (Nice to Have - Advanced Features):
  - AI Chat mini-app with SignalR real-time streaming

**Ready for Implementation**: All planning artifacts complete. Development can begin once tasks.md is generated or user can proceed directly to implementation using planning artifacts as guide.

---

## Next Actions

**For Task Generation**:
```bash
# Generate detailed task breakdown
/speckit.tasks
```

**For Direct Implementation** (if skipping task generation):
1. Start with P1: Navigation structure + Apps dropdown
2. Create Apps hub page at /apps
3. Implement Projects mini-app first (simplest API integration)
4. Follow development workflow in quickstart.md

**Planning Complete**: All Phase 0 and Phase 1 artifacts ready for development. Constitution gates passed. No blockers.
