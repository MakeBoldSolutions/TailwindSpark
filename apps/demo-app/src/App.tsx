import { Suspense, lazy, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { BundleAnalyzer } from './components/BundleAnalyzer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { PageLoadingSpinner } from './components/LoadingSpinner';
import { MemoryMonitorDisplay } from './components/MemoryMonitorDisplay';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { SEOProvider } from './contexts/SEOContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { cdnOptimizer } from './utils/cdnOptimizer';
import { ResourcePriorityManager, setupCdnPreconnections } from './utils/resourceHints';

// Lazy load page components for better performance
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const AnimationPage = lazy(() => import('./pages/AnimationPage').then(m => ({ default: m.AnimationPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DemosPage = lazy(() => import('./pages/DemosPage').then(m => ({ default: m.DemosPage })));
const DesignSystemShowcase = lazy(() => import('./pages/DesignSystemPage').then(m => ({ default: m.DesignSystemShowcase })));
const EcommercePage = lazy(() => import('./pages/EcommercePage'));
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const MarketingPage = lazy(() => import('./pages/MarketingPage').then(m => ({ default: m.MarketingPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const UsersPage = lazy(() => import('./pages/UsersPage').then(m => ({ default: m.UsersPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

// Lazy load mini-app pages
const AppsHubPage = lazy(() => import('./pages/AppsHubPage'));
const ProjectsPage = lazy(() => import('./pages/apps/ProjectsPage'));
const ArticlesPage = lazy(() => import('./pages/apps/ArticlesPage'));
const JokePage = lazy(() => import('./pages/apps/JokePage'));
const WeatherPage = lazy(() => import('./pages/apps/WeatherPage'));
const AIChatPage = lazy(() => import('./pages/apps/AIChatPage'));
const ReposPage = lazy(() => import('./pages/apps/ReposPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppContent() {
  const { isDark, toggleTheme } = useTheme();

  // Setup resource optimization
  useEffect(() => {
    // Setup CDN preconnections for external resources
    setupCdnPreconnections();

    // Initialize CDN optimization for production
    if (process.env.NODE_ENV === 'production') {
      cdnOptimizer.init();
    }

    const resourceManager = ResourcePriorityManager.getInstance();
    // Prefetch likely future pages
    resourceManager.prefetchFuture([
      '/demos',
      '/design-system',
      '/animations',
    ]);
  }, []);

  const basename = import.meta.env.BASE_URL === '/'
    ? ''
    : import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <ErrorBoundary>
      <Router basename={basename}>
        <Routes>
          <Route 
            path="/dashboard" 
            element={
              <Suspense fallback={<PageLoadingSpinner message="Loading Dashboard..." />}>
                <DashboardPage />
              </Suspense>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <Suspense fallback={<PageLoadingSpinner message="Loading Analytics..." />}>
                <AnalyticsPage />
              </Suspense>
            } 
          />
          <Route 
            path="/users" 
            element={
              <Suspense fallback={<PageLoadingSpinner message="Loading Users..." />}>
                <UsersPage />
              </Suspense>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Suspense fallback={<PageLoadingSpinner message="Loading Settings..." />}>
                <SettingsPage />
              </Suspense>
            } 
          />
          <Route 
            path="/ecommerce" 
            element={
              <Suspense fallback={<PageLoadingSpinner message="Loading E-commerce..." />}>
                <EcommercePage />
              </Suspense>
            } 
          />
          <Route 
            path="/marketing" 
            element={
              <Suspense fallback={<PageLoadingSpinner message="Loading Marketing..." />}>
                <MarketingPage />
              </Suspense>
            } 
          />
          <Route
            path="*"
            element={
              <Layout isDark={isDark} toggleTheme={toggleTheme}>
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Home..." />}>
                        <HomePage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/demos" 
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Demos..." />}>
                        <DemosPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/design-system" 
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Design System..." />}>
                        <DesignSystemShowcase />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/animations" 
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Animations..." />}>
                        <AnimationPage />
                      </Suspense>
                    } 
                  />
                  <Route
                    path="/about"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading About..." />}>
                        <AboutPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/apps"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Apps..." />}>
                        <AppsHubPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/apps/projects"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Projects..." />}>
                        <ProjectsPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/apps/articles"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Articles..." />}>
                        <ArticlesPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/apps/joke"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Joke..." />}>
                        <JokePage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/apps/weather"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Weather..." />}>
                        <WeatherPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/apps/ai-chat"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading AI Chat..." />}>
                        <AIChatPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/apps/repos"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading Repositories..." />}>
                        <ReposPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<PageLoadingSpinner message="Loading..." />}>
                        <NotFoundPage />
                      </Suspense>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
        <PerformanceMonitor />
        <BundleAnalyzer />
        <MemoryMonitorDisplay />
      </Router>
    </ErrorBoundary>
  );
}

/**
 * Main application component providing routing, theme management, and layout.
 * 
 * Implements lazy-loaded routes with Suspense boundaries for code splitting,
 * dark mode toggle with localStorage persistence, and automatic basename
 * configuration for GitHub Pages deployment.
 * 
 * Features:
 * - Route-based code splitting with lazy loading
 * - Theme toggle (light/dark mode) with system preference detection
 * - Error boundary wrapper for graceful error handling
 * - Performance monitoring via PerformanceMonitor component
 * - Persistent theme preference in localStorage
 * 
 * @returns The complete application with routing and theme support
 * 
 * @example
 * ```tsx
 * // App is the root component rendered in main.tsx
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 * ```
 */
function App() {
  return (
    <ThemeProvider>
      <SEOProvider>
        <AppContent />
      </SEOProvider>
    </ThemeProvider>
  );
}

export default App;
