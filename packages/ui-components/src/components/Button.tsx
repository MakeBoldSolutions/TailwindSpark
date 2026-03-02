import { clsx } from 'clsx';
import * as React from 'react';

/**
 * Button component properties.
 * 
 * Extends standard HTML button attributes with additional styling and loading state options.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-brand hover:bg-brand-hover focus:ring-brand text-white shadow-sm',
  secondary:
    'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 text-white shadow-sm',
  success: 'bg-success-600 hover:bg-success-700 focus:ring-success-500 text-white shadow-sm',
  warning: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 text-white shadow-sm',
  error: 'bg-error-600 hover:bg-error-700 focus:ring-error-500 text-white shadow-sm',
  ghost:
    'bg-transparent hover:bg-surface-alt focus:ring-brand text-text',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

/**
 * Accessible button component with multiple variants, sizes, and loading states.
 * 
 * Supports keyboard navigation, loading indicators, and icon placement.
 * Follows semantic design token patterns for consistent theming and dark mode support.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Call any existing onKeyDown handler first
      onKeyDown?.(event);
      
      // Handle Enter and Space keys for accessibility
      if ((event.key === 'Enter' || event.key === ' ') && onClick && !isDisabled) {
        event.preventDefault();
        // Trigger click event programmatically
        event.currentTarget.click();
      }
    };

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...(isDisabled && { 'aria-disabled': 'true' })}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
        )}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
