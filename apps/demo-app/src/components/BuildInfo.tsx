import React from 'react';

/**
 * Build information component properties.
 */
interface BuildInfoProps {
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Display variant.
   * @default 'full'
   */
  variant?: 'full' | 'version-only' | 'date-only';
}

/**
 * Displays build version and date information.
 * 
 * Shows application build metadata with configurable display variants.
 * Useful for footer or debug information.
 * 
 * @param root0 - Component props
 * @param root0.className - Additional CSS classes
 * @param root0.variant - Display variant (full, version-only, or date-only)
 * @returns Build info display component
 * 
 * @example
 * ```tsx
 * <BuildInfo variant="full" />
 * ```
 */
export const BuildInfo: React.FC<BuildInfoProps> = ({ className = '', variant = 'full' }) => {
  const buildDate = __BUILD_DATE__;
  const buildVersion = __BUILD_VERSION__;

  // Format the date for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const renderContent = () => {
    switch (variant) {
      case 'version-only':
        return `v${buildVersion}`;
      case 'date-only':
        return formatDate(buildDate);
      case 'full':
      default:
        return (
          <>
            <span className="font-medium">v{buildVersion}</span>
            <span className="mx-2">•</span>
            <span>Built {formatDate(buildDate)}</span>
          </>
        );
    }
  };

  return (
    <div
      className={`text-xs text-muted ${className}`}
      title={`Build version ${buildVersion}, built on ${formatDate(buildDate)}`}
    >
      {renderContent()}
    </div>
  );
};

export default BuildInfo;
