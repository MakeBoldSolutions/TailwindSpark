import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

// Icons
const IconDashboard = () => <span>📊</span>;
const IconUsers = () => <span>👥</span>;
const IconAnalytics = () => <span>📈</span>;
const IconSettings = () => <span>⚙️</span>;
const IconBell = () => <span>🔔</span>;
const IconSearch = () => <span>🔍</span>;
const IconMenu = () => <span>☰</span>;

/**
 * Dashboard layout component properties.
 */
interface DashboardLayoutProps {
  /**
   * Child elements to render within the dashboard layout.
   */
  children: React.ReactNode;
  /**
   * Title displayed in the page header.
   */
  pageTitle: string;
  /**
   * Optional description displayed under the page title.
   */
  pageDescription?: string;
  /**
   * Optional header action buttons or controls.
   */
  headerActions?: React.ReactNode;
}

/**
 * SaaS-style dashboard layout with sidebar navigation and page header.
 * 
 * Features collapsible sidebar, responsive mobile menu, and user profile section.
 * Ideal for admin panels and business applications.
 * 
 * @param root0 - Component props
 * @param root0.children - Child elements to render within the dashboard layout
 * @param root0.pageTitle - Title displayed in the page header
 * @param root0.pageDescription - Optional description displayed under the page title
 * @param root0.headerActions - Optional header action buttons or controls
 * @returns Dashboard layout component
 * 
 * @example
 * ```tsx
 * <DashboardLayout pageTitle="Analytics" pageDescription="Track your metrics">
 *   <AnalyticsContent />
 * </DashboardLayout>
 * ```
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle,
  pageDescription,
  headerActions,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { icon: <IconDashboard />, label: 'Dashboard', href: '/dashboard' },
    { icon: <IconAnalytics />, label: 'Analytics', href: '/analytics' },
    { icon: <IconUsers />, label: 'Users', href: '/users' },
    { icon: <IconSettings />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border bg-white dark:bg-gray-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 border-b border p-6">
          <Logo size="sm" showText={false} />
          <div>
            <h1 className="font-bold text-text">TailwindSpark</h1>
            <p className="text-xs text-muted">Dashboard Demo</p>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'bg-brand/10 dark:bg-brand/20 text-brand'
                      : 'text-muted hover:bg-surface-alt hover:text-text'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Back to Main App */}
          <div className="mt-8 border-t border pt-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-all duration-200 hover:bg-surface-alt hover:text-text"
            >
              <span className="text-lg">🏠</span>
              Back to Main App
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border p-4">
          <div className="flex items-center gap-3">
            <div className="from-brand to-accent-700 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-medium text-white">
              MH
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">
                Mark Hazleton
              </p>
              <p className="text-xs text-muted">WebSpark Creator</p>
            </div>
          </div>
          <div className="mt-2 border-t border pt-2">
            <a
              href="https://webspark.markhazleton.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-hover text-xs"
            >
              WebSpark Portfolio →
            </a>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border bg-surface-alt">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg bg-surface-alt p-2 transition-colors hover:bg-border lg:hidden"
                aria-label="Toggle sidebar"
                title="Toggle sidebar"
              >
                <IconMenu />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-text">{pageTitle}</h1>
                {pageDescription && (
                  <p className="mt-1 text-sm text-muted">{pageDescription}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Custom header actions */}
              {headerActions}

              {/* Search */}
              <div className="hidden max-w-md items-center gap-2 rounded-lg bg-surface-alt px-3 py-2 md:flex">
                <IconSearch />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 border-none bg-transparent text-sm text-text placeholder-muted outline-none"
                />
              </div>

              {/* Notifications */}
              <button
                className="relative rounded-lg bg-surface-alt p-2 transition-colors hover:bg-border"
                aria-label="View notifications"
                title="View notifications"
              >
                <IconBell />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-2">
                <div className="from-brand to-accent-700 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-medium text-white">
                  JD
                </div>
                <span className="hidden text-sm font-medium text-text md:block">
                  John Doe
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
};
