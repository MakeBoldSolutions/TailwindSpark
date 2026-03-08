# Research: ReactSparkPortfolio Migration

**Feature**: ReactSparkPortfolio Migration to TailwindSpark  
**Date**: March 2, 2026  
**Purpose**: Document technology decisions, best practices, and migration patterns for Bootstrap → Tailwind CSS conversion in mini-app architecture

---

## Technology Stack Decisions

### 1. Tailwind CSS 3.4+ Design Tokens

**Decision**: Use Tailwind CSS 4.1's `@theme` directive with semantic tokens from `packages/design-tokens`

**Rationale**:
- **Modern Approach**: Tailwind 4.1's `@theme` directive provides first-class support for design tokens, eliminating need for CSS custom properties workarounds
- **Constitution Compliance**: Principle III mandates semantic tokens over raw utilities (e.g., `bg-brand` not `bg-blue-600`)
- **Dark Mode**: `.dark` class strategy with CSS variables enables runtime theme switching without full page reloads
- **Type Safety**: Design tokens package provides TypeScript types for IntelliSense support

**Alternatives Considered**:
- ❌ **Tailwind plugins for tokens**: More complex, requires additional build configuration
- ❌ **CSS-in-JS solutions (styled-components, emotion)**: Conflicts with Tailwind utility-first approach, adds bundle size
- ❌ **Raw Tailwind utilities**: Violates constitution, breaks dark mode consistency

**Best Practices**:
```tsx
// ✅ CORRECT: Use semantic tokens
<button className="bg-brand text-white hover:bg-brand-hover">
  Click me
</button>

// ❌ WRONG: Raw Tailwind colors (ESLint will block)
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Click me
</button>
```

**References**:
- [Tailwind CSS 4.1 @theme directive](https://tailwindcss.com/docs/theme)
- Project constitution Principle III
- `packages/design-tokens/theme.css` for available tokens

---

### 2. React Router 7.1+ for Mini-App Routing

**Decision**: Use React Router 7.1+ with nested `/apps/*` routes and lazy loading

**Rationale**:
- **Namespace Isolation**: `/apps/*` provides clear separation between content pages and applications
- **Code Splitting**: React Router's `lazy()` enables automatic code splitting per mini-app (FR-101, FR-013)
- **Performance**: Individual mini-app chunks < 100KB (performance goal)
- **SEO**: Client-side routing with proper meta tag updates per route (FR-078-081)

**Route Structure**:
```tsx
// Top-level routes
/ → HomePage (Hero/CTA)
/about → AboutPage (Profile)
/apps → AppsHubPage (Discovery hub)
/apps/projects → ProjectsPage (Mini-app 1)
/apps/articles → ArticlesPage (Mini-app 2)
/apps/joke → JokePage (Mini-app 3)
/apps/weather → WeatherPage (Mini-app 4)
/apps/ai-chat → AIChatPage (Mini-app 5)
* → NotFoundPage (404)
```

**Alternatives Considered**:
- ❌ **Root-level routes** (`/projects`, `/articles`): Less scalable, no clear grouping, harder to maintain navigation
- ❌ **Hash-based routing**: Poor SEO, awkward URLs, conflicts with deployment
- ❌ **Next.js file-based routing**: Over-engineering for SPA, requires SSR infrastructure

**Best Practices**:
```tsx
// Lazy load mini-app pages for code splitting
const ProjectsPage = lazy(() => import('./pages/apps/ProjectsPage'));
const ArticlesPage = lazy(() => import('./pages/apps/ArticlesPage'));

// Wrap with Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/apps/projects" element={<ProjectsPage />} />
  </Routes>
</Suspense>
```

**References**:
- [React Router 7.1 documentation](https://reactrouter.com/)
- FR-006, FR-011, FR-013 (routing requirements)
- Spec clarification session Q&A (URL structure decision)

---

### 3. Zod for API Response Validation

**Decision**: Use Zod 3.x schemas to validate all external API responses

**Rationale**:
- **Runtime Safety**: TypeScript provides compile-time types, but APIs can return unexpected data
- **Constitution Gap**: Principle V notes lack of input validation library - Zod addresses this
- **Type Inference**: Zod schemas generate TypeScript types automatically
- **Error Handling**: Provides detailed validation errors for debugging API issues
- **Client-Side Validation**: Catches malformed data before it reaches components

**Validation Strategy**:
```tsx
// Define Zod schema
const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.string().url(),
  project_url: z.string().url(),
  status: z.enum(['Active', 'Completed', 'Archived']),
});

// Infer TypeScript type
type Project = z.infer<typeof ProjectSchema>;

// Validate API response
const response = await fetch('/api/projects.json');
const data = await response.json();
const projects = z.array(ProjectSchema).parse(data); // Throws on invalid data
```

**Alternatives Considered**:
- ❌ **Yup**: Less TypeScript-friendly, no type inference
- ❌ **Manual validation**: Error-prone, verbose, no type safety
- ❌ **No validation**: Risky - API changes break UI silently

**Best Practices**:
- Validate at service layer before returning to components
- Use `.safeParse()` for non-critical validations (returns `Result` type)
- Use `.parse()` for critical validations (throws on error)
- Log validation failures to help debug API issues
- Define schemas in `types/` directory, share across services and tests

**References**:
- [Zod documentation](https://zod.dev/)
- FR-072 (API validation requirement)
- Constitution Recommended Improvements #3

---

### 4. SignalR Client 8.x for Real-Time Chat

**Decision**: Use @microsoft/signalr 8.x for bidirectional real-time communication in AI Chat mini-app

**Rationale**:
- **Requirement**: FR-062 mandates SignalR connection to PromptSpark chat hub
- **Transport Fallback**: Automatically selects best transport (WebSocket → SSE → LongPolling) based on network conditions
- **Reconnection**: Built-in automatic reconnection with exponential backoff (FR-068)
- **Message Streaming**: Supports streaming responses with typing indicators (FR-064)
- **TypeScript Support**: Full TypeScript definitions included

**Connection Strategy**:
```tsx
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('/chat-hub', {
    transport: signalR.HttpTransportType.WebSockets | 
               signalR.HttpTransportType.ServerSentEvents |
               signalR.HttpTransportType.LongPolling,
  })
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (retryContext) => {
      // Exponential backoff: 0s, 2s, 10s, 30s, null (give up)
      const delays = [0, 2000, 10000, 30000];
      return delays[retryContext.previousRetryCount] ?? null;
    },
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

// Handle connection lifecycle
connection.onreconnecting(() => setStatus('reconnecting'));
connection.onreconnected(() => setStatus('connected'));
connection.onclose(() => setStatus('disconnected'));

await connection.start();
```

**Alternatives Considered**:
- ❌ **Socket.IO**: No server-side infrastructure, PromptSpark uses SignalR
- ❌ **Native WebSocket API**: Lacks transport fallback, reconnection logic, hub abstraction
- ❌ **Polling**: Poor UX, high latency, inefficient for real-time chat

**Best Practices**:
- Store connection in React context for global access
- Implement connection status indicator (disconnected, connecting, connected, reconnecting)
- Clean up listeners in `useEffect` cleanup function
- Sanitize all incoming and outgoing messages to prevent XSS
- Handle message streaming with typing indicators for better UX

**References**:
- [SignalR JavaScript Client](https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- FR-062 to FR-070 (chat requirements)
- User Story 5 acceptance scenarios

---

### 5. Leaflet 1.9+ for Interactive Maps

**Decision**: Use Leaflet 1.9+ with React-Leaflet wrapper for weather map visualization

**Rationale**:
- **Requirement**: FR-050 mandates interactive map for weather locations
- **Lightweight**: ~40KB gzipped vs 200KB+ for Google Maps
- **Free**: No API keys, no usage limits, no vendor lock-in
- **Customizable**: Full control over markers, popups, tile layers
- **Mobile-Friendly**: Touch gestures, responsive design built-in

**React Integration**:
```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

<MapContainer center={[lat, lon]} zoom={10} style={{ height: '400px' }}>
  <TileLayer
    attribution='&copy; OpenStreetMap contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[lat, lon]}>
    <Popup>
      {cityName}<br />
      {temperature}°F, {weatherDescription}
    </Popup>
  </Marker>
</MapContainer>
```

**Alternatives Considered**:
- ❌ **Google Maps**: Requires API key, usage costs, complex setup
- ❌ **Mapbox**: Requires API key, limited free tier
- ❌ **Static map image**: Not interactive, poor UX

**Best Practices**:
- Load Leaflet CSS in component to avoid global CSS pollution
- Fix default marker icon path issue (Webpack/Vite doesn't bundle icons correctly):
  ```tsx
  import L from 'leaflet';
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
  ```
- Use `react-leaflet` hooks (`useMap`, `useMapEvents`) for advanced interactions
- Lazy load map component to reduce initial bundle size

**References**:
- [Leaflet documentation](https://leafletjs.com/)
- [React-Leaflet](https://react-leaflet.js.org/)
- FR-050 (map requirement)
- User Story 4 acceptance scenarios

---

### 6. Singleton Service Layer Pattern

**Decision**: Implement singleton pattern for all API services, shared across mini-apps via global context

**Rationale**:
- **Requirement**: FR-071, FR-077 mandate shared service layer across mini-apps
- **Cache Efficiency**: Single cache instance prevents duplicate API calls across mini-apps
- **State Consistency**: Shared cache ensures Projects mini-app and About page show same recent articles
- **Memory Efficiency**: One service instance vs multiple instances per mini-app
- **Constitution Compliance**: Supports shared global state (clarification session Q&A)

**Implementation Pattern**:
```tsx
// services/projects.service.ts
class ProjectsService {
  private static instance: ProjectsService;
  private cache = new Map<string, { data: any; timestamp: number }>();

  private constructor() {} // Private constructor prevents direct instantiation

  public static getInstance(): ProjectsService {
    if (!ProjectsService.instance) {
      ProjectsService.instance = new ProjectsService();
    }
    return ProjectsService.instance;
  }

  async getProjects(): Promise<Project[]> {
    // Cache logic, API calls, validation
  }
}

export const projectsService = ProjectsService.getInstance();
```

**Service Context Provider**:
```tsx
// contexts/ServicesContext.tsx
const ServicesContext = createContext({
  projectsService,
  articlesService,
  jokeService,
  weatherService,
  chatService,
});

// Access in components
const { projectsService } = useContext(ServicesContext);
```

**Alternatives Considered**:
- ❌ **Per-component instances**: Duplicate caches, inconsistent state
- ❌ **React Query / SWR**: Over-engineering, adds dependencies, complicates cache invalidation
- ❌ **Redux**: Too complex for this use case, violates YAGNI principle

**Best Practices**:
- Use singleton for stateful services (cache, connection pools)
- Use plain functions for stateless utilities
- Expose service instances through React context for testability
- Mock services in tests by replacing context provider

**References**:
- FR-071, FR-077 (singleton service requirements)
- Spec clarification Q5 (shared global state)
- Constitution Principle VII (monorepo architecture)

---

###7. Bootstrap → Tailwind Migration Patterns

**Decision**: Systematic replacement of Bootstrap 5 classes with Tailwind semantic tokens

**Rationale**:
- **Core Requirement**: FR-001 mandates Tailwind CSS for all styling (replacing Bootstrap 5)
- **Constitution Mandate**: Principle III requires semantic tokens over raw utilities
- **Design Consistency**: Maintains visual parity while adopting utility-first approach
- **Dark Mode**: Bootstrap doesn't have built-in dark mode - Tailwind tokens enable this

**Common Migration Patterns**:

| Bootstrap 5 | Tailwind (Semantic Tokens) | Notes |
|-------------|---------------------------|-------|
| `container` | `max-w-7xl mx-auto px-4` | Responsive container |
| `row` | `flex flex-wrap -mx-4` | Grid row |
| `col-md-6` | `w-full md:w-1/2 px-4` | Responsive column |
| `btn btn-primary` | `bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-hover` | Primary button |
| `btn btn-outline-secondary` | `border border-muted bg-transparent text-text hover:bg-surface-hover` | Outline button |
| `card` | `bg-surface border border-border rounded-lg shadow-sm` | Card container |
| `card-body` | `p-6` | Card padding |
| `text-primary` | `text-brand` | Primary text color |
| `text-muted` | `text-muted` | Muted text |
| `bg-light` | `bg-surface` | Light background |
| `bg-dark` | `bg-surface dark:bg-surface` | Dark background (theme-aware) |
| `navbar` | `bg-surface border-b border-border sticky top-0 z-50` | Navigation bar |
| `dropdown` | Custom component with headlessui/react | Complex interactive |
| `badge badge-info` | `inline-flex px-2 py-1 text-xs rounded-full bg-info text-white` | Badge |
| `alert alert-danger` | `bg-destructive/10 border border-destructive text-destructive p-4 rounded-md` | Alert message |
| `text-center` | `text-center` | Typography utilities (same) |
| `mt-3` | `mt-3` | Spacing utilities (mostly same) |
| `d-flex justify-content-between` | `flex justify-between items-center` | Flexbox |
| `shadow-sm` | `shadow-sm` | Shadows (same) |

**Component-Specific Patterns**:

```tsx
// Bootstrap 5 Navigation (BEFORE)
<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
  <div className="container">
    <a className="navbar-brand" href="/">Portfolio</a>
    <ul className="navbar-nav ms-auto">
      <li className="nav-item"><a className="nav-link" href="/about">About</a></li>
    </ul>
  </div>
</nav>

// Tailwind CSS with semantic tokens (AFTER)
<nav className="bg-surface border-b border-border sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <Link to="/" className="text-xl font-bold text-brand">Portfolio</Link>
      <ul className="flex space-x-6">
        <li><Link to="/about" className="text-text hover:text-brand">About</Link></li>
      </ul>
    </div>
  </div>
</nav>
```

```tsx
// Bootstrap 5 Card (BEFORE)
<div className="card shadow-sm">
  <img src={image} className="card-img-top" alt={title} />
  <div className="card-body">
    <h5 className="card-title">{title}</h5>
    <p className="card-text text-muted">{description}</p>
    <a href={url} className="btn btn-primary">View Project</a>
  </div>
</div>

// Tailwind CSS with semantic tokens (AFTER)
<div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
  <img src={image} className="w-full h-48 object-cover" alt={title} />
  <div className="p-6">
    <h5 className="text-xl font-semibold text-text mb-2">{title}</h5>
    <p className="text-muted mb-4">{description}</p>
    <a href={url} className="inline-block bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-hover">
      View Project
    </a>
  </div>
</div>
```

**Responsive Design**:
```tsx
// Bootstrap 5 Grid (BEFORE)
<div className="row">
  <div className="col-12 col-md-6 col-lg-4">Content</div>
  <div className="col-12 col-md-6 col-lg-4">Content</div>
  <div className="col-12 col-md-6 col-lg-4">Content</div>
</div>

// Tailwind CSS Grid (AFTER)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Content</div>
  <div>Content</div>
  <div>Content</div>
</div>
```

**Best Practices**:
- ✅ Always use semantic tokens from `packages/design-tokens/theme.css`
- ✅ Test both light and dark modes after migration
- ✅ Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- ✅ Leverage Tailwind's utility classes for spacing, typography, borders
- ✅ Use `cn()` utility for conditional classes
- ❌ Never use raw color values (ESLint will block)
- ❌ Don't mix Bootstrap and Tailwind classes in same component

**References**:
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
- Constitution Principle III (Design System & Semantic Tokens)
- `packages/design-tokens/theme.css` for available tokens
- `eslint-rules/no-raw-primary-class.js` for enforcement

---

### 8. Caching Strategy with Version-Based Invalidation

**Decision**: Implement localStorage caching with version-based invalidation and environment-specific TTLs

**Rationale**:
- **Requirements**: FR-018 (version-based cache invalidation), FR-073 (app_version changes), FR-074 (TTL by environment)
- **Performance**: Reduces API calls by 80%+ after initial load
- **Offline Support**: Cached data available when APIs are unavailable
- **Version Safety**: Ensures stale data is cleared on app updates

**Cache Implementation**:
```tsx
// services/cache.service.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

class CacheService {
  private readonly APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
  private readonly TTL = import.meta.env.DEV ? 5 * 60 * 1000 : 60 * 60 * 1000; // 5min dev, 1hr prod

  get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);

      // Version check - invalidate if app version changed
      if (entry.version !== this.APP_VERSION) {
        this.delete(key);
        return null;
      }

      // TTL check
      const age = Date.now() - entry.timestamp;
      if (age > this.TTL) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  set<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version: this.APP_VERSION,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      // Handle quota exceeded gracefully
      console.warn('Cache write failed (quota exceeded?):', error);
    }
  }

  delete(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    // Preserve theme, user preferences
    const theme = localStorage.getItem('theme');
    const userName = localStorage.getItem('chat_user_name');
    localStorage.clear();
    if (theme) localStorage.setItem('theme', theme);
    if (userName) localStorage.setItem('chat_user_name', userName);
  }
}

export const cacheService = new CacheService();
```

**Service Integration**:
```tsx
// services/projects.service.ts
async getProjects(): Promise<Project[]> {
  const cacheKey = 'projects_v1';

  // Try cache first
  const cached = cacheService.get<Project[]>(cacheKey);
  if (cached) return cached;

  // Fetch from API
  const response = await fetch('https://markhazleton.com/projects.json');
  const data = await response.json();
  
  // Validate with Zod
  const projects = z.array(ProjectSchema).parse(data);

  // Cache valid data
  cacheService.set(cacheKey, projects);
  
  return projects;
}
```

**Alternatives Considered**:
- ❌ **sessionStorage**: Cleared on tab close, not suitable for persistent caching
- ❌ **IndexedDB**: Over-engineering for simple JSON caching, complex API
- ❌ **No caching**: Poor performance, unnecessary API load, offline unavailable

**Best Practices**:
- Include version in cache key for granular control (e.g., `projects_v1`)
- Handle localStorage quota exceeded errors gracefully
- Clear only API caches on version change, preserve user preferences (theme, name)
- Use shorter TTL in development for faster iteration
- Log cache hits/misses for debugging
- Provide manual "Refresh Cache" button for users

**References**:
- FR-018, FR-073, FR-074 (caching requirements)
- User Story 1 acceptance scenario #6 (refresh cache)
- Edge cases: localStorage full or disabled

---

### 9. SEO & Meta Tag Management with React Context

**Decision**: Use React Context + hooks for dynamic meta tag updates per route

**Rationale**:
- **Requirements**: FR-078 to FR-084 mandate per-route meta tags, OG tags, sitemap, robots.txt
- **SPA Limitation**: React Router doesn't update `<head>` tags by default
- **Shared State**: SEOContext provides global access across all mini-apps
- **Type Safety**: TypeScript interfaces for meta tag props

**SEO Context Implementation**:
```tsx
// contexts/SEOContext.tsx
interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

const SEOContext = createContext<{
  metadata: SEOMetadata;
  setMetadata: (meta: Partial<SEOMetadata>) => void;
}>({ metadata: defaultMetadata, setMetadata: () => {} });

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metadata, setMetadataState] = useState<SEOMetadata>(defaultMetadata);

  const setMetadata = useCallback((meta: Partial<SEOMetadata>) => {
    setMetadataState((prev) => ({ ...prev, ...meta }));
  }, []);

  // Update document head when metadata changes
  useEffect(() => {
    document.title = metadata.title;
    
    const updateMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateMetaTag('description', metadata.description);
    if (metadata.keywords) updateMetaTag('keywords', metadata.keywords);
    
    // OG tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateOGTag('og:title', metadata.title);
    updateOGTag('og:description', metadata.description);
    if (metadata.ogImage) updateOGTag('og:image', metadata.ogImage);
    if (metadata.ogType) updateOGTag('og:type', metadata.ogType);

    // Canonical URL
    if (metadata.canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = metadata.canonicalUrl;
    }
  }, [metadata]);

  return (
    <SEOContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = () => useContext(SEOContext);
```

**Usage in Mini-App Pages**:
```tsx
// pages/apps/ProjectsPage.tsx
const ProjectsPage: React.FC = () => {
  const { setMetadata } = useSEO();

  useEffect(() => {
    setMetadata({
      title: 'Projects - Mark Hazleton Portfolio',
      description: 'Explore my portfolio of web development projects using React, TypeScript, and modern frameworks.',
      keywords: 'projects, portfolio, react, typescript, web development',
      ogImage: 'https://markhazleton.github.io/TailwindSpark/og-projects.svg',
      canonicalUrl: 'https://markhazleton.github.io/TailwindSpark/apps/projects',
    });
  }, [setMetadata]);

  return <div>...</div>;
};
```

**Sitemap Generation** (FR-082):
```tsx
// scripts/generate-sitemap.ts (pre-build script)
const routes = [
  { path: '/', priority: 1.0, changefreq: 'monthly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/apps', priority: 0.9, changefreq: 'monthly' },
  { path: '/apps/projects', priority: 0.9, changefreq: 'weekly' },
  { path: '/apps/articles', priority: 0.9, changefreq: 'weekly' },
  { path: '/apps/joke', priority: 0.6, changefreq: 'monthly' },
  { path: '/apps/weather', priority: 0.6, changefreq: 'monthly' },
  { path: '/apps/ai-chat', priority: 0.7, changefreq: 'monthly' },
];

const baseUrl = 'https://markhazleton.github.io/TailwindSpark';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
```

**robots.txt** (FR-083):
```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://markhazleton.github.io/TailwindSpark/sitemap.xml
```

**Alternatives Considered**:
- ❌ **react-helmet**: Outdated, not maintained, React 18 compatibility issues
- ❌ **react-helmet-async**: Adds dependency, more complex than needed
- ❌ **Manual DOM manipulation per page**: Not DRY, error-prone, no shared state

**Best Practices**:
- Set metadata in `useEffect` with dependency on `setMetadata`
- Use `useCallback` for `setMetadata` to prevent infinite loops
- Include all required OG tags for social sharing (title, description, image, type)
- Test social sharing with Facebook Debugger and Twitter Card Validator
- Generate sitemap pre-build (npm script), don't serve dynamically

**References**:
- FR-078 to FR-084 (SEO requirements)
- [Open Graph Protocol](https://ogp.me/)
- [Google Search sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

---

## Migration Risks & Mitigation

### Risk 1: Bootstrap Component Parity

**Risk**: Missing Bootstrap component behaviors (dropdowns, modals, tooltips) when migrating to Tailwind

**Impact**: Medium - Interactive components may lose functionality

**Mitigation**:
- Use headlessui/react for complex components (AppsDropdown, Modal)
- Test all interactive components thoroughly after migration
- Reference Bootstrap source code for behavior parity
- Document any intentional behavior changes

---

### Risk 2: Dark Mode Visual Consistency

**Risk**: Colors don't match between light/dark themes after Bootstrap → Tailwind migration

**Impact**: High - Poor UX, brand inconsistency

**Mitigation**:
- Use only semantic tokens from design system
- Test every page in both themes before committing
- Validate WCAG AA contrast ratios in both themes
- Screenshot comparison tests (Playwright)

---

### Risk 3: External API Availability

**Risk**: APIs (projects.json, RSS, JokeAPI, Weather) fail or change schema

**Impact**: High - Mini-apps break without data

**Mitigation**:
- Implement Zod validation to catch schema changes early
- Fallback to local cached data (projects.json, rss.xml)
- Display user-friendly error messages
- Monitor API health in production (analytics)
- Cache aggressively to reduce dependency

---

### Risk 4: SignalR Connection Reliability

**Risk**: SignalR connection drops frequently, reconnection fails

**Impact**: Medium - Chat feature becomes unusable

**Mitigation**:
- Implement automatic reconnection with exponential backoff
- Support multiple transports (WebSocket, SSE, LongPolling)
- Display connection status prominently
- Queue messages during reconnection, send when connected
- Test on various network conditions (slow 3G, offline→online)

---

### Risk 5: Bundle Size Exceeding Targets

**Risk**: Total bundle > 500KB, mini-app chunks > 100KB

**Impact**: Medium - Poor performance on slow networks

**Mitigation**:
- Lazy load all mini-app pages with React.lazy()
- Code split by route (automatic with React Router)
- Tree-shake unused dependencies
- Analyze bundle with Vite rollup plugin
- Monitor bundle size in CI (fail if exceeds threshold)
- Consider Leaflet alternative if map adds too much size

---

## Performance Benchmarks

Based on research of similar React + Tailwind applications:

| Metric | Target | Typical Range |
|--------|--------|---------------|
| **Lighthouse Performance** | 90+ | 85-95 for SPAs |
| **Lighthouse Accessibility** | 100 | 95-100 with proper ARIA |
| **Lighthouse Best Practices** | 100 | 95-100 with HTTPS, CSP |
| **Lighthouse SEO** | 100 | 90-100 with sitemap, meta tags |
| **First Contentful Paint** | < 1.5s | 1.0-2.0s for SPAs |
| **Time to Interactive** | < 3.5s | 2.5-4.0s for SPAs |
| **Total Bundle Size** | < 500KB gzipped | 300-600KB typical |
| **Mini-App Chunk Size** | < 100KB gzipped | 50-150KB typical |

**Optimization Strategies**:
- Inline critical CSS for above-the-fold content
- Preload fonts and critical assets
- Use font-display: swap for web fonts
- Compress images (WebP, lazy loading)
- Enable Vite build optimizations (minify, tree-shake)
- Use CDN for external dependencies (if beneficial)

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

**Coverage Target**: Temporary 40% minimum for this spec (statements, branches, functions, lines), to be re-evaluated and raised in a future spec

**Test Files**:
- `*.test.tsx` for components (co-located)
- `*.test.ts` for services, hooks, utilities

**Focus Areas**:
- Component rendering with different props
- User interactions (click, type, keyboard navigation)
- API response handling (success, error, loading states)
- Service layer cache logic
- Zod validation schemas

**Example Test**:
```tsx
// pages/apps/ProjectsPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsPage } from './ProjectsPage';
import { projectsService } from '../../services/projects.service';

// Mock service
vi.mock('../../services/projects.service');

describe('ProjectsPage', () => {
  it('loads and displays projects', async () => {
    const mockProjects = [
      { id: 1, name: 'Project A', description: 'Test', ... },
      { id: 2, name: 'Project B', description: 'Test', ... },
    ];
    
    vi.mocked(projectsService.getProjects).mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });

  it('filters projects by search term', async () => {
    // Test search functionality
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(projectsService.getProjects).mockRejectedValue(new Error('API failed'));
    
    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText(/error loading projects/i)).toBeInTheDocument();
    });
  });
});
```

---

### Integration Tests

**Focus**: End-to-end user flows across mini-apps

**Test Scenarios**:
- Navigate from Apps hub → Projects → back → Articles
- Search projects, sort, paginate, maintain state
- Like joke → save → view saved jokes → delete
- Search weather → view map → recent searches
- Select AI variant → open chat → send message → streaming response

**Tools**: Playwright (if available) or Cypress

---

### Accessibility Tests

**Tools**: Jest-axe, manual keyboard testing, screen reader testing

**Requirements**:
- Zero axe violations in all pages
- Full keyboard navigation without mouse
- Proper focus management in modals and dropdowns
- ARIA labels on all interactive elements
- Color contrast ratios meet WCAG AA

**Example Test**:
```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<ProjectsPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

### Performance Tests

**Metrics**:
- Bundle size (Vite build analysis)
- Lighthouse CI scores (GitHub Actions)
- Load time on 3G network (Playwright network throttling)

**Thresholds** (fail CI if exceeded):
- Total bundle > 500KB gzipped
- Lighthouse Performance < 90
- Lighthouse Accessibility < 100

---

## Dependencies & Versions

**Core Dependencies**:
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.1.0",
  "typescript": "^5.7.0"
}
```

**Styling**:
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

**Validation & Data**:
```json
{
  "zod": "^3.23.0"
}
```

**Real-Time & Maps**:
```json
{
  "@microsoft/signalr": "^8.0.0",
  "leaflet": "^1.9.0",
  "react-leaflet": "^4.2.0"
}
```

**Markdown Rendering**:
```json
{
  "react-markdown": "^9.0.0"
}
```

**Build Tools**:
```json
{
  "vite": "^7.3.1",
  "@vitejs/plugin-react": "^4.3.0"
}
```

**Testing**:
```json
{
  "vitest": "^3.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/user-event": "^14.5.0",
  "jsdom": "^25.0.0"
}
```

---

## Deployment Configuration

**Vite Proxy (Development FR-076)**:
```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api/projects': 'https://markhazleton.com',
      '/api/rss': 'https://reactspark.com',
    },
  },
});
```

**Azure Functions Proxy (Production FR-075)**:
```json
// function.json for CORS proxy
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"],
      "route": "projects"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

**GitHub Pages Deployment**:
- Build command: `npm run build`
- Output directory: `apps/demo-app/dist`
- Base path: `/TailwindSpark/`
- 404 fallback: Copy `index.html` to `404.html` for SPA routing

---

## Summary

This research document establishes the technical foundation for migrating ReactSparkPortfolio to TailwindSpark with a mini-application architecture. Key decisions:

1. **Tailwind CSS 4.1 @theme** directive with semantic tokens (constitution compliant)
2. **React Router 7.1** with `/apps/*` namespace and lazy loading
3. **Zod** for API validation (addresses constitution gap)
4. **SignalR 8.x** for real-time chat with automatic reconnection
5. **Leaflet 1.9** for lightweight interactive maps
6. **Singleton service layer** shared across mini-apps via context
7. **Bootstrap → Tailwind patterns** using semantic tokens only
8. **Version-based caching** with environment-specific TTLs
9. **SEO Context** for dynamic meta tags per route

All decisions align with the TailwindSpark constitution and project requirements. No unresolved "NEEDS CLARIFICATION" items remain.

**Next Phase**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md).
