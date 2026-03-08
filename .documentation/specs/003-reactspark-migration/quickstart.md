# Developer Quickstart: ReactSparkPortfolio Migration

**Feature**: ReactSparkPortfolio Migration to TailwindSpark  
**Branch**: `003-reactspark-migration`  
**Date**: March 2, 2026  
**Skill Level**: Intermediate React + TypeScript developers

---

## 🎯 What You're Building

You'll be migrating 5 **mini-applications** from ReactSparkPortfolio (Bootstrap 5) to TailwindSpark (Tailwind CSS semantic tokens), organized under a unified Apps hub with dropdown navigation at `/apps`.

**Mini-Applications**:
1. **Projects** (`/apps/projects`) - Portfolio showcase with search, filter, pagination
2. **Articles** (`/apps/articles`) - RSS feed blog with category filtering
3. **Joke Generator** (`/apps/joke`) - Random programming jokes with AI explanations
4. **Weather Forecast** (`/apps/weather`) - City weather with interactive Leaflet maps
5. **AI Chat** (`/apps/ai-chat`) - Real-time chat with AI variants via SignalR

---

## ⚡ Quick Start (< 5 minutes)

### Prerequisites

- **Node.js**: 20+ (check: `node --version`)
- **npm**: 10+ (check: `npm --version`)
- **Git**: Any recent version
- **Code Editor**: VS Code recommended (ESLint + Prettier extensions)

### 1. Clone & Setup

```bash
# Clone the repository (if not already done)
git clone https://github.com/markhazleton/TailwindSpark.git
cd TailwindSpark

# Checkout the feature branch
git checkout 003-reactspark-migration

# Install dependencies (monorepo - installs all workspaces)
npm install

# Verify build works
npm run build

# Start development server
npm run dev
```

**Expected Output**:
```
  VITE v7.3.1  ready in 1420 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 2. Verify Setup

1. **Open browser**: http://localhost:5173/
2. **Check homepage**: Should see TailwindSpark hero page
3. **Check navigation**: Home, About, Apps dropdown should be visible
4. **Click Apps dropdown**: Should see all 5 mini-app links
5. **Navigate to `/apps`**: Should see Apps hub with grid of app cards

If all above works, setup is complete! ✅

---

## 📁 Project Structure Overview

```
TailwindSpark/
├── apps/
│   └── demo-app/                # Main application workspace
│       ├── src/
│       │   ├── pages/
│       │   │   ├── HomePage.tsx              # Landing page (/)
│       │   │   ├── AboutPage.tsx             # About page (/about)
│       │   │   ├── AppsHubPage.tsx           # NEW: Apps hub (/apps)
│       │   │   └── apps/                     # NEW: Mini-app pages
│       │   │       ├── ProjectsPage.tsx      # /apps/projects
│       │   │       ├── ArticlesPage.tsx      # /apps/articles
│       │   │       ├── JokePage.tsx          # /apps/joke
│       │   │       ├── WeatherPage.tsx       # /apps/weather
│       │   │       └── AIChatPage.tsx        # /apps/ai-chat
│       │   ├── components/                   # Reusable UI components
│       │   │   ├── Header.tsx                # Navigation header
│       │   │   ├── AppsDropdown.tsx          # NEW: Apps dropdown menu
│       │   │   └── MiniAppCard.tsx           # NEW: App card for hub
│       │   ├── sections/                     # Feature-specific sections
│       │   ├── services/                     # API service layer (singleton)
│       │   ├── hooks/                        # Custom React hooks
│       │   ├── types/                        # TypeScript type definitions
│       │   └── contexts/                     # React contexts (Theme, SEO)
│       └── tests/                            # Co-located test files
├── packages/
│   ├── design-tokens/           # Semantic Tailwind tokens (CRITICAL)
│   │   └── theme.css            # @theme directive definitions
│   └── ui-components/           # Shared UI library
└── .documentation/
    └── specs/003-reactspark-migration/
        ├── spec.md              # Feature specification
        ├── plan.md              # This implementation plan
        ├── research.md          # Technology decisions
        ├── data-model.md        # Entity definitions
        ├── contracts/           # TypeScript API contracts
        └── quickstart.md        # This file
```

---

## 🏗️ Development Workflow

### Creating a New Mini-App Component

**Example**: Creating the Projects mini-app page

#### 1. Create the Page Component

```tsx
// apps/demo-app/src/pages/apps/ProjectsPage.tsx
import React, { useEffect } from 'react';
import { useSEO } from '../../hooks/useSEO';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from '../../sections/ProjectCard';

export const ProjectsPage: React.FC = () => {
  const { setMetadata } = useSEO();
  const { projects, loading, error } = useProjects();

  useEffect(() => {
    setMetadata({
      title: 'Projects - Mark Hazleton Portfolio',
      description: 'Explore my portfolio of web development projects.',
      canonicalUrl: 'https://markhazleton.github.io/TailwindSpark/apps/projects',
    });
  }, [setMetadata]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-destructive p-8">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
```

**Key Points**:
- ✅ Use semantic Tailwind tokens (`text-text`, `text-destructive`, not `text-gray-900`)
- ✅ Update SEO metadata with `useSEO` hook
- ✅ Use custom hook (`useProjects`) for data fetching
- ✅ Handle loading and error states
- ✅ Use grid layout (responsive breakpoints)

#### 2. Create the Custom Hook

```tsx
// apps/demo-app/src/hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { projectsService } from '../services/projects.service';
import type { Project } from '../types/projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await projectsService.getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
```

**Key Points**:
- ✅ Use singleton service instance (shared cache across mini-apps)
- ✅ Proper error handling with typed errors
- ✅ Loading states for better UX

#### 3. Create the Service Layer

```tsx
// apps/demo-app/src/services/projects.service.ts
import { z } from 'zod';
import { cacheService } from './cache.service';
import { ProjectSchema, ProjectsResponseSchema, PROJECTS_API_CONFIG } from '../types/projects';
import type { Project } from '../types/projects';

class ProjectsService {
  private static instance: ProjectsService;

  private constructor() {}

  public static getInstance(): ProjectsService {
    if (!ProjectsService.instance) {
      ProjectsService.instance = new ProjectsService();
    }
    return ProjectsService.instance;
  }

  async getProjects(): Promise<Project[]> {
    const cacheKey = PROJECTS_API_CONFIG.CACHE_KEY;

    // Try cache first
    const cached = cacheService.get<Project[]>(cacheKey);
    if (cached) {
      console.log('Projects loaded from cache');
      return cached;
    }

    // Fetch from API
    const url = import.meta.env.DEV
      ? PROJECTS_API_CONFIG.DEV_URL
      : PROJECTS_API_CONFIG.PROD_URL;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      
      // Validate with Zod
      const projects = ProjectsResponseSchema.parse(data);

      // Cache valid data
      cacheService.set(cacheKey, projects);
      
      return projects;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      
      // Try fallback
      return this.getFallbackProjects();
    }
  }

  private async getFallbackProjects(): Promise<Project[]> {
    try {
      const response = await fetch(PROJECTS_API_CONFIG.FALLBACK_URL);
      const data = await response.json();
      return ProjectsResponseSchema.parse(data);
    } catch {
      return []; // Return empty array if all fails
    }
  }
}

export const projectsService = ProjectsService.getInstance();
```

**Key Points**:
- ✅ Singleton pattern for shared cache
- ✅ Zod validation for runtime type safety
- ✅ Cache-first strategy for performance
- ✅ Fallback to local data if API fails
- ✅ Environment-aware URLs (dev proxy, prod direct)

#### 4. Create Type Definitions

```tsx
// apps/demo-app/src/types/projects.ts
// Copy from contracts/projects-api.ts (already generated)
export type { Project, ProjectStatus } from '../../../.documentation/specs/003-reactspark-migration/contracts/projects-api';
export { ProjectSchema, ProjectsResponseSchema } from '../../../.documentation/specs/003-reactspark-migration/contracts/projects-api';
```

#### 5. Add Route to Router

```tsx
// apps/demo-app/src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const ProjectsPage = lazy(() => import('./pages/apps/ProjectsPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/apps" element={<AppsHubPage />} />
        <Route path="/apps/projects" element={<ProjectsPage />} />
        {/* ... other routes ... */}
      </Routes>
    </Suspense>
  );
}
```

**Key Points**:
- ✅ Lazy load mini-app pages for code splitting
- ✅ Suspense fallback for loading states
- ✅ Routes under `/apps` namespace

#### 6. Write Tests

```tsx
// apps/demo-app/src/pages/apps/ProjectsPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ProjectsPage } from './ProjectsPage';
import { projectsService } from '../../services/projects.service';

vi.mock('../../services/projects.service');

describe('ProjectsPage', () => {
  it('loads and displays projects', async () => {
    const mockProjects = [
      { id: 1, name: 'Test Project', description: 'Test', image_url: 'http://test.com/img.jpg', project_url: 'http://test.com', status: 'Active' },
    ];

    vi.mocked(projectsService.getProjects).mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    vi.mocked(projectsService.getProjects).mockRejectedValue(new Error('API Failed'));

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

**Key Points**:
- ✅ Co-located tests (`.test.tsx` suffix)
- ✅ Mock service layer, not fetch()
- ✅ Test loading, success, and error states
- ✅ Use @testing-library/react patterns

---

## 🎨 Tailwind CSS Migration Patterns

### ❌ NEVER Use Raw Colors

```tsx
// ❌ WRONG: Raw Tailwind utilities (ESLint will block this)
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Click Me
</button>

// ✅ CORRECT: Semantic tokens from design system
<button className="bg-brand text-white hover:bg-brand-hover">
  Click Me
</button>
```

### Available Semantic Tokens

Defined in `packages/design-tokens/theme.css`:

**Colors**:
- `brand` - Primary brand color
- `brand-hover` - Brand color on hover
- `surface` - Card/container backgrounds
- `surface-hover` - Surface on hover
- `text` - Primary text color
- `muted` - Muted/secondary text
- `border` - Border color
- `success` - Success states
- `warning` - Warning states
- `destructive` - Error/danger states
- `info` - Informational states

**Usage**:
```tsx
// Text colors
<h1 className="text-brand">Title</h1>
<p className="text-text">Body text</p>
<span className="text-muted">Secondary text</span>

// Backgrounds
<div className="bg-surface border border-border">Card content</div>
<button className="bg-brand text-white">Primary button</button>
<button className="bg-transparent border border-border text-text">Outline button</button>

// States
<div className="text-success">Success message</div>
<div className="text-destructive">Error message</div>
```

### Dark Mode Support

All semantic tokens automatically adapt to dark mode via `.dark` class:

```tsx
// This will automatically use correct colors in both themes
<div className="bg-surface text-text border border-border">
  Content that works in light and dark modes
</div>
```

**Testing Dark Mode**:
```tsx
// Toggle theme in browser console
document.documentElement.classList.toggle('dark');
```

---

## 🧪 Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific app
npm test --workspace=apps/demo-app

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# View coverage report
open apps/demo-app/coverage/index.html
```

### Coverage Requirements

**Temporary Spec Gate**: 40% minimum coverage for spec 003-reactspark-migration. Re-evaluate and raise in a future spec.

```json
// vitest.config.ts (already configured)
{
  "test": {
    "coverage": {
      "provider": "v8",
      "reporter": ["text", "json", "html"],
      "lines": 40,
      "branches": 40,
      "functions": 40,
      "statements": 40
    }
  }
}
```

### Test Checklist

For each mini-app page:
- ✅ Renders without errors
- ✅ Displays loading state
- ✅ Fetches and displays data
- ✅ Handles API errors gracefully
- ✅ Updates SEO metadata
- ✅ Responds to user interactions (search, filter, sort)
- ✅ Accessible (no axe violations)
- ✅ Works with keyboard navigation

---

## 🔧 Common Tasks

### Add a New API Endpoint

1. **Define types** in `contracts/[api-name].ts`:
```tsx
export interface MyEntity {
  id: number;
  name: string;
}

export const MyEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
});
```

2. **Create service** in `services/[api-name].service.ts`:
```tsx
class MyService {
  private static instance: MyService;
  // ... singleton pattern ...
  
  async getData(): Promise<MyEntity[]> {
    // Cache → Fetch → Validate → Return
  }
}
export const myService = MyService.getInstance();
```

3. **Create hook** in `hooks/use[ApiName].ts`:
```tsx
export function useMyData() {
  const [data, setData] = useState<MyEntity[]>([]);
  // ... useEffect with service call ...
  return { data, loading, error };
}
```

4. **Use in component**:
```tsx
const { data, loading, error } = useMyData();
```

### Add Shared State

1. **Create context** in `contexts/MyContext.tsx`:
```tsx
const MyContext = createContext<MyContextType>(defaultValue);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);
  return <MyContext.Provider value={{ state, setState }}>{children}</MyContext.Provider>;
};

export const useMy = () => useContext(MyContext);
```

2. **Wrap app** in `main.tsx`:
```tsx
<MyProvider>
  <App />
</MyProvider>
```

3. **Use in components**:
```tsx
const { state, setState } = useMy();
```

### Clear Cache (For Testing)

```tsx
// Browser console
localStorage.clear();
location.reload();

// Or use "Refresh Cache" button in Projects mini-app
```

---

## 🐛 Troubleshooting

### Build Errors

**Error**: `Cannot find module '@/components/Header'`
- **Fix**: Check import paths are relative (`../../components/Header`) or configured in tsconfig paths

**Error**: `Type 'string' is not assignable to type 'ProjectStatus'`
- **Fix**: Validate API response with Zod schema before using

**Error**: `Module not found: Can't resolve 'leaflet/dist/leaflet.css'`
- **Fix**: Install leaflet: `npm install leaflet react-leaflet`

### ESLint Errors

**Error**: `No raw Tailwind color classes allowed (no-raw-primary-class)`
- **Fix**: Replace `bg-blue-600` with `bg-brand` (see semantic tokens above)

**Error**: `React Hook useEffect has a missing dependency`
- **Fix**: Add missing dependency to useEffect deps array or wrap in useCallback

### Runtime Errors

**Error**: API returns 404
- **Fix**: Check `VITE_APP_VERSION` in `.env` and clear cache

**Error**: Theme not persisting
- **Fix**: Check localStorage not disabled/full

**Error**: SignalR not connecting
- **Fix**: Check network tab for WebSocket connection, verify hub URL

---

## 📚 Additional Resources

### Documentation

- **Feature Spec**: [spec.md](spec.md) - Complete requirements
- **Implementation Plan**: [plan.md](plan.md) - Architecture decisions
- **Research**: [research.md](research.md) - Technology choices and patterns
- **Data Model**: [data-model.md](data-model.md) - Entity definitions and flows
- **Contracts**: [contracts/](contracts/) - TypeScript API contracts

### External Docs

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)
- [React Router](https://reactrouter.com/)
- [SignalR JavaScript Client](https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- [Leaflet](https://leafletjs.com/)

### Project Constitution

**CRITICAL**: Read [.documentation/memory/constitution.md](../../../../memory/constitution.md) for:
- 8 core development principles (mandatory)
- Code quality standards
- Testing requirements
- Accessibility standards
- Design system rules

---

## ✅ Ready to Code!

You now have everything you need to implement the ReactSparkPortfolio migration:

1. ✅ **Environment**: Dev server running at `localhost:5173`
2. ✅ **Structure**: Understand mini-app architecture and file organization
3. ✅ **Patterns**: Know how to create pages, hooks, services, tests
4. ✅ **Styling**: Use semantic Tailwind tokens (never raw colors)
5. ✅ **Resources**: Have docs, contracts, and examples

**Next Steps**:
1. Pick a mini-app to implement (suggest starting with **Projects** - simplest)
2. Follow the development workflow above
3. Write tests as you go (meet the temporary 40% floor for this spec and raise it in future specs)
4. Test in both light and dark themes
5. Run ESLint and Prettier before committing

**Need Help?**
- Check existing components in `apps/demo-app/src/components/`
- Review research.md for migration patterns
- Consult data-model.md for entity relationships
- Read contracts/ for API type definitions

Happy coding! 🚀
