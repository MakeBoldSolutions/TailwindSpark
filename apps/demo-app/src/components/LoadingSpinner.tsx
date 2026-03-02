import React from 'react';
import { Logo } from './Logo';

/**
 * Loading spinner component properties.
 */
interface LoadingSpinnerProps {
  /**
   * Spinner size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Spinner color theme.
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'white';
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Whether to show logo with spinner.
   * @default false
   */
  withLogo?: boolean;
  /**
   * Loading message to display.
   * @default 'Loading...'
   */
  message?: string;
}

/**
 * Loading spinner with optional logo and message.
 * 
 * Displays an animated spinner with configurable size, color, and optional
 * branding logo and loading message.
 * 
 * @param root0 - Component props
 * @param root0.size - Spinner size (sm, md, lg)
 * @param root0.color - Color theme (primary, secondary, white)
 * @param root0.className - Additional CSS classes
 * @param root0.withLogo - Whether to include logo
 * @param root0.message - Loading message text
 * @returns Loading spinner component
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="lg" withLogo message="Loading content..." />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  withLogo = false,
  message = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-brand',
    secondary: 'text-secondary-600',
    white: 'text-white',
  };

  if (withLogo) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        <div className="relative">
          <Logo size={size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'} showText={false} />
          <div className="bg-brand/20 absolute inset-0 animate-pulse rounded-full"></div>
        </div>
        {message && (
          <p className="animate-pulse text-sm text-muted">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg fill="none" viewBox="0 0 24 24" className="h-full w-full">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

/**
 * Full page loading component for route-level lazy loading
 */
export const PageLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Loading page...' 
}) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" withLogo={true} message={message} />
    </div>
  );
};
