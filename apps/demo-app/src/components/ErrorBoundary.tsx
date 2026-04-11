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
    // Log to console in development and test modes
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.error('Uncaught error:', error, errorInfo);
    }

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

  /**
   * Renders either the fallback UI or the children components.
   * 
   * @returns The fallback UI if error occurred, otherwise children
   */
  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-surface-alt">
            <div className="mx-auto max-w-md px-4 text-center">
              <div className="mb-6">
                <Logo size="lg" className="mb-4 justify-center opacity-50" />
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <span className="text-2xl text-destructive">⚠️</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-text">
                Something went wrong
              </h2>
              <p className="mb-6 text-text-muted">
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
                  onClick={() => window.location.assign('/')}
                  className="w-full rounded-lg bg-surface-hover px-4 py-2 text-text transition-colors hover:bg-surface-active"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={() => window.location.assign('/apps')}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-text transition-colors hover:bg-surface-alt"
                >
                  Go to Apps
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-text-muted">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-surface-alt p-4 text-xs">
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
