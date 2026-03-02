import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

// Mock the Logo component
vi.mock('./Logo', () => ({
  Logo: ({ size, className }: { size: string; className: string }) => (
    <div data-testid="logo" data-size={size} className={className}>
      Logo Component
    </div>
  )
}));

// Component that throws an error
const ThrowError = ({ shouldThrow = false, message = 'Test error' }: { shouldThrow?: boolean; message?: string }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

// Mock console.error to track error logging
const originalConsoleError = console.error;
const mockConsoleError = vi.fn();

// Mock window.location methods
const mockReload = vi.fn();
const mockLocationAssign = vi.fn();

// Mock gtag function
const mockGtag = vi.fn();

describe('ErrorBoundary', () => {
  beforeEach(() => {
    console.error = mockConsoleError;
    
    // Mock window.location only if window exists
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'location', {
        value: {
          reload: mockReload,
          href: '/',
          assign: mockLocationAssign,
        },
        writable: true,
      });

      // Mock gtag
      Object.defineProperty(window, 'gtag', {
        value: mockGtag,
        writable: true,
      });
    }

    // Reset environment
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    console.error = originalConsoleError;
    mockConsoleError.mockClear();
    mockReload.mockClear();
    mockLocationAssign.mockClear();
    mockGtag.mockClear();
    vi.clearAllMocks();
  });

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test children content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test children content')).toBeInTheDocument();
    });

    it('should render multiple children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });

    it('should not render error UI when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
      expect(screen.queryByText('Refresh Page')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch errors and render default error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('We\'re sorry, but something unexpected happened in TailwindSpark. Please try refreshing the page.')).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>;
      
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should log error to console when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Test error message" />
        </ErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Uncaught error:',
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should log error to gtag analytics when available', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Analytics test error" />
        </ErrorBoundary>
      );

      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Error: Analytics test error',
        fatal: true,
      });
    });

    it('should handle analytics errors gracefully', () => {
      // Mock gtag to throw an error
      window.gtag = vi.fn(() => {
        throw new Error('Analytics error');
      });

      expect(() => {
        render(
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );
      }).not.toThrow();

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle missing gtag gracefully', () => {
      // Store original gtag and temporarily set to undefined
      const originalGtag = (window as typeof window & { gtag?: unknown }).gtag;
      (window as typeof window & { gtag?: unknown }).gtag = undefined;

      expect(() => {
        render(
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );
      }).not.toThrow();

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Restore original gtag
      (window as typeof window & { gtag?: unknown }).gtag = originalGtag;
    });
  });

  describe('Default Error UI Components', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    it('should render Logo component with correct props', () => {
      const logo = screen.getByTestId('logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('data-size', 'lg');
      expect(logo).toHaveClass('mb-4', 'justify-center', 'opacity-50');
    });

    it('should render error icon', () => {
      const errorIcon = screen.getByText('⚠️');
      expect(errorIcon).toBeInTheDocument();
      expect(errorIcon.parentElement).toHaveClass('bg-destructive/10');
    });

    it('should render error title', () => {
      const title = screen.getByText('Something went wrong');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
      expect(title).toHaveClass('mb-2', 'text-xl', 'font-semibold');
    });

    it('should render error message', () => {
      const message = screen.getByText(/We're sorry, but something unexpected happened/);
      expect(message).toBeInTheDocument();
      expect(message.tagName).toBe('P');
    });

    it('should render refresh button', () => {
      const refreshButton = screen.getByText('Refresh Page');
      expect(refreshButton).toBeInTheDocument();
      expect(refreshButton.tagName).toBe('BUTTON');
      expect(refreshButton).toHaveClass('bg-brand', 'hover:bg-brand-hover');
    });

    it('should render homepage button', () => {
      const homeButton = screen.getByText('Go to Homepage');
      expect(homeButton).toBeInTheDocument();
      expect(homeButton.tagName).toBe('BUTTON');
      expect(homeButton).toHaveClass('bg-surface-hover');
    });

    it('should have proper CSS classes for layout', () => {
      const container = document.querySelector('.flex.min-h-screen.items-center.justify-center');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('bg-surface-alt');
    });
  });

  describe('Button Interactions', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    it('should call window.location.reload when refresh button is clicked', () => {
      const refreshButton = screen.getByText('Refresh Page');
      refreshButton.click();

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('should navigate to homepage when homepage button is clicked', () => {
      const homeButton = screen.getByText('Go to Homepage');
      homeButton.click();

      expect(window.location.href).toBe('/');
    });
  });

  describe('Development Mode Error Details', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should render error details in development mode', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Development error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
      expect(screen.getByText('Error: Development error')).toBeInTheDocument();
    });

    it('should render error details in a details/summary element', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Detail test error" />
        </ErrorBoundary>
      );

      const summary = screen.getByText('Error Details (Development)');
      expect(summary.tagName).toBe('SUMMARY');
      expect(summary).toHaveClass('cursor-pointer', 'text-sm');

      const details = summary.parentElement;
      expect(details?.tagName).toBe('DETAILS');
      expect(details).toHaveClass('mt-4', 'text-left');
    });

    it('should render error in a preformatted block', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Pre format test" />
        </ErrorBoundary>
      );

      const preElement = screen.getByText('Error: Pre format test');
      expect(preElement.tagName).toBe('PRE');
      expect(preElement).toHaveClass('mt-2', 'overflow-auto', 'rounded', 'bg-surface-alt', 'p-4', 'text-xs');
    });
  });

  describe('Production Mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should not render error details in production mode', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Production error" />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();
      expect(screen.queryByText('Error: Production error')).not.toBeInTheDocument();
    });

    it('should still render main error UI in production', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Refresh Page')).toBeInTheDocument();
      expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
    });
  });

  describe('Static Methods', () => {
    it('should return correct state from getDerivedStateFromError', () => {
      const testError = new Error('Test static method error');
      const result = ErrorBoundary.getDerivedStateFromError(testError);

      expect(result).toEqual({
        hasError: true,
        error: testError,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle error with no message', () => {
      const ErrorWithNoMessage = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary>
          <ErrorWithNoMessage />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle error with complex error object', () => {
      const ComplexError = () => {
        const error = new Error('Complex error');
        error.stack = 'Complex stack trace\nLine 1\nLine 2';
        throw error;
      };

      render(
        <ErrorBoundary>
          <ComplexError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should handle non-browser environments gracefully', () => {
      // Test that the component works when window.gtag doesn't exist
      const originalGtag = (window as typeof window & { gtag?: unknown }).gtag;
      (window as typeof window & { gtag?: unknown }).gtag = undefined;

      expect(() => {
        render(
          <ErrorBoundary>
            <ThrowError shouldThrow={true} message="Server-side error" />
          </ErrorBoundary>
        );
      }).not.toThrow();

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Restore
      (window as typeof window & { gtag?: unknown }).gtag = originalGtag;
    });

    it('should handle custom fallback with props', () => {
      const CustomFallback = ({ message }: { message: string }) => (
        <div>Custom: {message}</div>
      );

      render(
        <ErrorBoundary fallback={<CustomFallback message="Test message" />}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom: Test message')).toBeInTheDocument();
    });

    it('should maintain error state after multiple renders', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Rerender with different children - should still show error UI
      rerender(
        <ErrorBoundary>
          <div>Different children</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Different children')).not.toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should work with nested components', () => {
      const NestedComponent = () => (
        <div>
          <span>Nested content</span>
          <ThrowError shouldThrow={true} />
        </div>
      );

      render(
        <ErrorBoundary>
          <NestedComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Nested content')).not.toBeInTheDocument();
    });

    it('should work with multiple error boundaries', () => {
      render(
        <div>
          <ErrorBoundary>
            <div>Working content 1</div>
          </ErrorBoundary>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </div>
      );

      expect(screen.getByText('Working content 1')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});