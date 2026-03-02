import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { Logo } from './Logo';

/**
 * Error boundary component properties.
 */
interface Props {
  /**
   * Child components to wrap with error boundary.
   */
  children: ReactNode;
  /**
   * Custom fallback UI to display on error.
   */
  fallback?: ReactNode;
}

/**
 * Error boundary component state.
 */
interface State {
  /**
   * Whether an error has been caught.
   */
  hasError: boolean;
  /**
   * The caught error object.
   */
  error?: Error;
}

/**
 * Error boundary component for catching and handling React errors.
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs errors, and displays a fallback UI instead of crashing the app.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  /**
   * Updates state when an error is caught.
   * 
   * @param error - The error that was thrown
   * @returns Updated state with error
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Logs error information for debugging and analytics.
   * 
   * @param error - The error that was thrown
   * @param errorInfo - Additional error information
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    // Log to analytics if available (simple implementation without type checking)
    try {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'exception', {
          description: error.toString(),
          fatal: true,
        });
      }
    } catch {
      // Ignore analytics errors
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-md px-4 text-center">
              <div className="mb-6">
                <Logo size="lg" className="mb-4 justify-center opacity-50" />
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <span className="text-2xl text-red-600 dark:text-red-400">⚠️</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Something went wrong
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                We're sorry, but something unexpected happened in TailwindSpark. Please try
                refreshing the page.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-brand hover:bg-brand-hover w-full rounded-lg px-4 py-2 text-white transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full rounded-lg bg-gray-200 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  Go to Homepage
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs dark:bg-gray-800">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
