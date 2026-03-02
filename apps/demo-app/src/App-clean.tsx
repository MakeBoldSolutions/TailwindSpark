import React from 'react';

/**
 * Clean minimal application component for basic theme demonstration.
 * 
 * Simplified version of App.tsx without routing, showcasing dark mode
 * toggle functionality with localStorage persistence and system preference
 * detection. Used for testing and demonstrating theme capabilities in
 * isolation.
 * 
 * Features:
 * - Dark mode toggle with state persistence
 * - System color scheme preference detection
 * - localStorage-based theme persistence
 * - Minimal UI for theme demonstration
 * 
 * @component
 * @returns {JSX.Element} Minimal app with theme toggle
 * 
 * @example
 * ```tsx
 * // Alternative minimal entry point
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <App />
 * );
 * ```
 */
function App() {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-white transition-colors dark:bg-secondary-900">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white dark:border-secondary-700 dark:bg-secondary-900">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand to-brand-hover"></div>
              <div>
                <h1 className="font-bold text-secondary-900 dark:text-secondary-100">Tailwind Demo</h1>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  React + TypeScript + Tailwind CSS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="rounded-lg bg-secondary-100 p-2 transition-colors hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-secondary-900 dark:text-secondary-100">
              Welcome to Tailwind Demo
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-secondary-600 dark:text-secondary-400">
              A modern React application showcasing Tailwind CSS components with TypeScript. Click
              the theme toggle to switch between light and dark mode.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-secondary-200 bg-white p-6 shadow-md dark:border-secondary-700 dark:bg-secondary-800">
              <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Component Library
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Reusable UI components built with Tailwind CSS and TypeScript.
              </p>
            </div>

            <div className="rounded-lg border border-secondary-200 bg-white p-6 shadow-md dark:border-secondary-700 dark:bg-secondary-800">
              <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Dark Mode
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Automatic dark mode support with system preference detection.
              </p>
            </div>

            <div className="rounded-lg border border-secondary-200 bg-white p-6 shadow-md dark:border-secondary-700 dark:bg-secondary-800">
              <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Monorepo Setup
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Organized with Turborepo for efficient development workflow.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex gap-4">
              {/* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */}
              <button className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-primary-700 hover:shadow-xl">
                Primary Button
              </button>
              <button className="rounded-lg border border-secondary-300 bg-white px-6 py-3 font-medium text-secondary-900 shadow-lg transition-colors hover:bg-secondary-50 hover:shadow-xl dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700">
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-secondary-50 py-12 dark:border-secondary-700 dark:bg-secondary-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-brand to-brand-hover"></div>
              <span className="font-semibold text-secondary-900 dark:text-secondary-100">Tailwind Demo</span>
            </div>
            <p className="mb-4 text-secondary-600 dark:text-secondary-400">
              Built with React, TypeScript, and Tailwind CSS in a Turborepo monorepo.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/MarkHazleton/TailwindSpark"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-600 transition-colors hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400" // eslint-disable-line no-raw-primary-class/no-raw-primary-class
              >
                GitHub
              </a>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-600 transition-colors hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400" // eslint-disable-line no-raw-primary-class/no-raw-primary-class
              >
                Tailwind CSS
              </a>
              <a
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-600 transition-colors hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400" // eslint-disable-line no-raw-primary-class/no-raw-primary-class
              >
                React
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
