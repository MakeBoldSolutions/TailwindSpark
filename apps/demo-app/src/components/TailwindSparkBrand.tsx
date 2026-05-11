import React from 'react';
import { Logo } from './Logo';

/**
 * TailwindSpark brand component properties.
 */
interface TailwindSparkBrandProps {
  /**
   * Visual variant of the brand display.
   * @default 'card'
   */
  variant?: 'hero' | 'footer' | 'card' | 'inline';
  /**
   * Additional CSS classes to apply.
   */
  className?: string;
  /**
   * Whether to show the description text.
   * @default true
   */
  showDescription?: boolean;
  /**
   * Whether to position logo and title together (hero variant only).
   * @default false
   */
  logoTitleTogether?: boolean;
}

/**
 * TailwindSpark brand display component with multiple layout variants.
 * 
 * Provides consistent branding across different contexts with configurable
 * layouts for hero sections, footers, cards, and inline usage.
 * 
 * @param root0 - Component props
 * @param root0.variant - Visual variant of the brand display
 * @param root0.className - Additional CSS classes to apply
 * @param root0.showDescription - Whether to show the description text
 * @param root0.logoTitleTogether - Whether to position logo and title together (hero variant only)
 * @returns Brand display component
 * 
 * @example
 * ```tsx
 * <TailwindSparkBrand variant="hero" logoTitleTogether={true} />
 * <TailwindSparkBrand variant="inline" showDescription={false} />
 * ```
 */
export const TailwindSparkBrand: React.FC<TailwindSparkBrandProps> = ({
  variant = 'card',
  className = '',
  showDescription = true,
  logoTitleTogether = false,
}) => {
  const variants = {
    hero: {
      containerClass: 'text-center py-12',
      logoSize: 'xl' as const,
      titleClass: logoTitleTogether
        ? 'text-4xl md:text-5xl font-bold'
        : 'text-4xl md:text-5xl font-bold mt-6 mb-4',
      descriptionClass: 'text-xl text-muted max-w-3xl mx-auto',
    },
    footer: {
      containerClass: 'text-center py-8',
      logoSize: 'lg' as const,
      titleClass: 'text-2xl font-bold mt-4 mb-2',
      descriptionClass: 'text-sm text-muted',
    },
    card: {
      containerClass: 'text-center p-6',
      logoSize: 'lg' as const,
      titleClass: 'text-xl font-bold mt-4 mb-2',
      descriptionClass: 'text-sm text-muted',
    },
    inline: {
      containerClass: 'flex items-center gap-3',
      logoSize: 'md' as const,
      titleClass: 'text-lg font-bold',
      descriptionClass: 'text-sm text-muted',
    },
  };

  const config = variants[variant];

  if (variant === 'inline') {
    return (
      <div className={`${config.containerClass} ${className}`}>
        <Logo size={config.logoSize} showText={false} />
        <div>
          <h3 className={config.titleClass}>
            {/* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */}
            <span className="from-primary-600 to-accent-700 bg-gradient-to-r bg-clip-text text-transparent">
              TailwindSpark
            </span>
          </h3>
          {showDescription && (
            <p className={config.descriptionClass}>Interactive Tailwind CSS Showcase</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${config.containerClass} ${className}`}>
      {variant === 'hero' && logoTitleTogether ? (
        <div className="mb-4 flex items-center justify-center gap-4">
          <Logo size={config.logoSize} showText={false} />
          <h3 className={config.titleClass}>
            {/* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */}
            <span className="from-primary-600 to-accent-700 bg-gradient-to-r bg-clip-text text-transparent">
              TailwindSpark
            </span>
          </h3>
        </div>
      ) : (
        <>
          <Logo size={config.logoSize} showText={false} />
          <h3 className={config.titleClass}>
            {/* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */}
            <span className="from-primary-600 to-accent-700 bg-gradient-to-r bg-clip-text text-transparent">
              TailwindSpark
            </span>
          </h3>
        </>
      )}
      {showDescription && (
        <div className={config.descriptionClass}>
          {variant === 'hero' ? (
            <p>
              A comprehensive React TypeScript showcase of Tailwind CSS components, animations, and
              design systems. Part of the{' '}
              <a
                href="https://web.makeboldspark.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-hover font-semibold"
              >
                WebSpark Portfolio
              </a>{' '}
              by{' '}
              <a
                href="https://markhazleton.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-hover font-semibold"
              >
                Mark Hazleton
              </a>
              .
            </p>
          ) : (
            <p>Interactive Tailwind CSS Showcase</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TailwindSparkBrand;
