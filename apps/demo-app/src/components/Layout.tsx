import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { miniAppsData } from '../types/miniapp';
import type { ThemeId, ThemeMode, ThemeProfile } from '../types/theme';
import { BuildInfo } from './BuildInfo';
import { Logo } from './Logo';
import { SearchComponent } from './SearchComponent';
import { ThemeToggle } from './ThemeToggle';

/**
 * Main application layout properties.
 */
interface LayoutProps {
  /**
   * Child elements to render within the layout.
   */
  children: React.ReactNode;
  /** Current named theme identifier. */
  themeId: ThemeId;
  /** Current light or dark mode. */
  mode: ThemeMode;
  /** Available shipped theme profiles. */
  availableThemes: readonly ThemeProfile[];
  /** Function to change the named theme. */
  onThemeChange: (themeId: ThemeId) => void;
  /** Function to toggle between light and dark modes. */
  onModeToggle: () => void;
}

/**
 * Main application layout with navigation, header, and responsive menu.
 * 
 * Provides consistent page structure with sticky header, dropdownnavigation,
 * search functionality, and keyboard shortcuts support.
 * 
 * @param root0 - Component props
 * @param root0.children - Child elements to render within the layout
 * @param root0.themeId - Current named theme identifier
 * @param root0.mode - Current light or dark mode
 * @param root0.availableThemes - Available shipped theme profiles
 * @param root0.onThemeChange - Function to change the named theme
 * @param root0.onModeToggle - Function to toggle between light and dark modes
 * @returns Layout component with navigation and content
 * 
 * @example
 * ```tsx
 * <Layout
 *   themeId={themeId}
 *   mode={mode}
 *   availableThemes={availableThemes}
 *   onThemeChange={setTheme}
 *   onModeToggle={toggleTheme}
 * >
 *   <YourPageContent />
 * </Layout>
 * ```
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  themeId,
  mode,
  availableThemes,
  onThemeChange,
  onModeToggle,
}) => {
  const location = useLocation();
  const [isDemosOpen, setIsDemosOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const demosRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => setIsSearchOpen(true),
    onThemeToggle: onModeToggle,
    onEscape: () => {
      setIsSearchOpen(false);
      setIsDemosOpen(false);
      setIsAppsOpen(false);
      setIsMobileMenuOpen(false);
    },
  });

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/design-system', label: 'Components' },
    { path: '/animations', label: 'Animations' },
  ];

  const demoItems = [
    { path: '/dashboard', label: 'SaaS Dashboard' },
    { path: '/ecommerce', label: 'E-commerce Store' },
    { path: '/marketing', label: 'Marketing Landing' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (demosRef.current && !demosRef.current.contains(event.target as Node)) {
        setIsDemosOpen(false);
      }
      if (appsRef.current && !appsRef.current.contains(event.target as Node)) {
        setIsAppsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isDemoPage =
    demoItems.some(item => location.pathname === item.path) || location.pathname === '/demos';

  const isAppsPage =
    location.pathname === '/apps' || location.pathname.startsWith('/apps/');

  return (
    <div className="min-h-screen bg-surface transition-colors">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <Logo size="md" />
              </Link>

              {/* Navigation */}
              <nav className="hidden items-center gap-6 md:flex">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-muted hover:bg-surface-alt hover:text-text'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Apps Dropdown */}
                <div className="relative" ref={appsRef}>
                  <button
                    onClick={() => setIsAppsOpen(!isAppsOpen)}
                    aria-haspopup="true"
                    aria-expanded={isAppsOpen}
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isAppsPage
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-muted hover:bg-surface-alt hover:text-text'
                    }`}
                  >
                    Apps
                    <svg
                      className={`h-4 w-4 transition-transform ${isAppsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isAppsOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-surface py-2 shadow-lg" role="menu">
                      <Link
                        to="/apps"
                        className="block px-4 py-2 text-sm text-text transition-colors hover:bg-surface-alt"
                        role="menuitem"
                        onClick={() => setIsAppsOpen(false)}
                      >
                        <div className="font-medium">All Apps</div>
                        <div className="text-xs text-text-muted">Browse all mini-apps</div>
                      </Link>
                      <div className="my-2 border-t border-border"></div>
                      {miniAppsData.map(app => (
                        <Link
                          key={app.id}
                          to={app.route}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            location.pathname === app.route
                              ? 'bg-brand/10 text-brand'
                              : 'text-text hover:bg-surface-alt'
                          }`}
                          role="menuitem"
                          onClick={() => setIsAppsOpen(false)}
                        >
                          <span className="mr-2">{app.icon}</span>
                          {app.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Demos Dropdown */}
                <div className="relative" ref={demosRef}>
                  <button
                    onClick={() => setIsDemosOpen(!isDemosOpen)}
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isDemoPage
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-muted hover:bg-surface-alt hover:text-text'
                    }`}
                  >
                    Demos
                    <svg
                      className={`h-4 w-4 transition-transform ${isDemosOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDemosOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-surface py-2 shadow-lg">
                      <Link
                        to="/demos"
                        className="block px-4 py-2 text-sm text-text transition-colors hover:bg-surface-alt"
                        onClick={() => setIsDemosOpen(false)}
                      >
                        <div className="font-medium">All Demos Overview</div>
                        <div className="text-xs text-text-muted">
                          Compare all examples
                        </div>
                      </Link>
                      <div className="my-2 border-t border-border"></div>
                      {demoItems.map(demo => (
                        <Link
                          key={demo.path}
                          to={demo.path}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            location.pathname === demo.path
                              ? 'bg-brand/10 text-brand'
                              : 'text-text hover:bg-surface-alt'
                          }`}
                          onClick={() => setIsDemosOpen(false)}
                        >
                          {demo.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile menu button - only visible on small screens */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg bg-surface-alt p-2 transition-colors hover:bg-border md:hidden"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="rounded-lg bg-surface-alt p-2 transition-colors hover:bg-border"
                aria-label="Search"
              >
                🔍
              </button>
              <ThemeToggle
                themeId={themeId}
                mode={mode}
                themes={availableThemes}
                onThemeChange={onThemeChange}
                onModeToggle={onModeToggle}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border md:hidden">
            <div className="space-y-1 bg-surface px-4 pb-3 pt-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-brand/10 text-brand'
                      : 'text-text-muted hover:bg-surface-alt hover:text-text'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Apps Section */}
              <div className="pt-2">
                <div className="px-3 py-2 text-sm font-medium uppercase tracking-wider text-text-muted">
                  Apps
                </div>
                <Link
                  to="/apps"
                  className="block rounded-md px-3 py-2 text-base font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Apps
                </Link>
                {miniAppsData.map(app => (
                  <Link
                    key={app.id}
                    to={app.route}
                    className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      location.pathname === app.route
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-muted hover:bg-surface-alt hover:text-text'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-2">{app.icon}</span>
                    {app.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Demos Section */}
              <div className="pt-2">
                <div className="px-3 py-2 text-sm font-medium uppercase tracking-wider text-text-muted">
                  Demos
                </div>
                <Link
                  to="/demos"
                  className="block rounded-md px-3 py-2 text-base font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Demos Overview
                </Link>
                {demoItems.map(demo => (
                  <Link
                    key={demo.path}
                    to={demo.path}
                    className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      location.pathname === demo.path
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-muted hover:bg-surface-alt hover:text-text'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {demo.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content">{children}</main>

      {/* Search Component */}
      <SearchComponent isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-border bg-surface-alt py-12">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Logo size="lg" showText={false} />
            </div>
            <h3 className="text-4xl font-bold md:text-5xl">
              <span className="from-brand to-accent-700 bg-gradient-to-r bg-clip-text text-transparent">
                TailwindSpark
              </span>
            </h3>
          </div>
          <p className="mb-4 text-center text-sm text-muted">
            Built with React 19, TypeScript, and Tailwind CSS in a Turborepo monorepo.
          </p>

          {/* Build Information */}
          <div className="mb-4 flex justify-center">
            <BuildInfo className="text-center" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Links continue below */}
            <a
              href="https://github.com/MarkHazleton/TailwindSpark"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand dark:hover:text-brand text-sm text-muted transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://webspark.markhazleton.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand dark:hover:text-brand text-sm text-muted transition-colors"
            >
              WebSpark
            </a>
            <a
              href="https://markhazleton.com/articles.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand dark:hover:text-brand text-sm text-muted transition-colors"
            >
              Articles
            </a>
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand dark:hover:text-brand text-sm text-muted transition-colors"
            >
              Tailwind CSS
            </a>
            <a
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand dark:hover:text-brand text-sm text-muted transition-colors"
            >
              React
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
