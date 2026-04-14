import React from 'react';

/**
 * Logo component properties.
 */
interface LogoProps {
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Logo size variant.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether to show brand text alongside logo.
   * @default true
   */
  showText?: boolean;
  /**
   * Whether to show only text without logo.
   * @default false
   */
  textOnly?: boolean;
}

/**
 * TailwindSpark logo component with multiple size variants.
 * 
 * Displays the TailwindSpark logo with optional brand text.
 * Supports various sizes and text-only mode.
 * 
 * @param root0 - Component props
 * @param root0.className - Additional CSS classes
 * @param root0.size - Logo size (sm, md, lg, xl)
 * @param root0.showText - Whether to show brand text
 * @param root0.textOnly - Whether to show only text
 * @returns Logo component
 * 
 * @example
 * ```tsx
 * <Logo size="lg" showText={true} />
 * ```
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textOnly = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // Use BASE_URL for proper public asset path resolution
  const logoSrc = `${import.meta.env.BASE_URL}TailwindSpark.png`;

  if (textOnly) {
    return (
      <span
        className={`bg-gradient-to-r bg-clip-text font-bold text-transparent ${textSizes[size]} ${className}`}
        style={{
          fontFamily: 'var(--font-display)',
          backgroundImage: 'linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))',
        }}
      >
        TailwindSpark
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* TailwindSpark Brand Logo */}
      <img
        src={logoSrc}
        alt="TailwindSpark Logo"
        className={`${sizeClasses[size]} object-contain`}
        loading="lazy"
      />

      {/* Logo Text */}
      {showText && (
        <span
          className={`bg-gradient-to-r bg-clip-text font-bold text-transparent ${textSizes[size]}`}
          style={{
            fontFamily: 'var(--font-display)',
            backgroundImage: 'linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))',
          }}
        >
          TailwindSpark
        </span>
      )}
    </div>
  );
};

export default Logo;
