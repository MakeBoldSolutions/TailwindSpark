import { clsx } from 'clsx';
import * as React from 'react';

/**
 * Card component properties.
 * 
 * Configures the visual appearance and content layout of the card container.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const cardVariants = {
  default: 'bg-[var(--card-bg)] border border-[color:var(--card-border)]',
  bordered: 'bg-[var(--card-bg)] border border-[color:var(--card-border)] shadow-none',
  elevated: 'bg-[var(--card-bg)] border border-[color:var(--card-border)] shadow-card',
};

const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Versatile card container component for grouping related content.
 * 
 * Provides flexible styling variants, padding options, and optional header/footer sections.
 * Uses semantic design tokens for automatic dark mode support.
 * 
 * @example
 * ```tsx
 * <Card variant="bordered" padding="md">
 *   <CardHeader title="Card Title" subtitle="Subtitle" />
 *   <CardContent>Card content goes here</CardContent>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-panel transition-all duration-200',
          cardVariants[variant],
          padding !== 'none' && cardPadding[padding],
          className
        )}
        {...props}
      >
        {header && (
          <div className="border-border mb-4 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
            {header}
          </div>
        )}
        <div className={padding === 'none' ? cardPadding.md : ''}>{children}</div>
        {footer && (
          <div className="border-border mt-4 border-t pt-4 first:mt-0 first:border-t-0 first:pt-0">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card header component properties.
 * 
 * Defines optional title, subtitle, and custom header content.
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

/**
 * Card header section with optional title and subtitle.
 * 
 * Provides consistent typography and spacing for card headers.
 * Can contain custom content in addition to or instead of title/subtitle props.
 * 
 * @example
 * ```tsx
 * <CardHeader title="User Profile" subtitle="Manage your account settings" />
 * ```
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('space-y-1', className)} {...props}>
        {title && (
          <h3 className="text-text text-lg font-semibold">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-text-muted text-sm">{subtitle}</p>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card content component properties.
 * 
 * Standard HTML div attributes for card body content.
 */
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Main content area of a card.
 * 
 * Provides semantic structure and consistent text styling for card body content.
 * 
 * @example
 * ```tsx
 * <CardContent>
 *   <p>This is the main content of the card.</p>
 * </CardContent>
 * ```
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('text-text', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * Card footer component properties.
 * 
 * Standard HTML div attributes for card footer actions.
 */
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Footer section of a card, typically for actions and buttons.
 * 
 * Automatically arranges child elements in a horizontal flex layout with consistent spacing.
 * 
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="ghost">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </CardFooter>
 * ```
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('flex items-center gap-2', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
