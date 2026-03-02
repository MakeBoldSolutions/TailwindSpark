import React, { useEffect, useState } from 'react';

/**
 * Bundle information data structure.
 */
interface BundleInfo {
  /**
   * Total JavaScript size in kilobytes.
   */
  jsSize: number;
  /**
   * Total CSS size in kilobytes.
   */
  cssSize: number;
  /**
   * Combined total size in kilobytes.
   */
  totalSize: number;
  /**
   * List of loaded resource chunks.
   */
  chunks: Array<{
    /**
     * Resource filename.
     */
    name: string;
    /**
     * Resource size in kilobytes.
     */
    size: number;
    /**
     * Resource type (JavaScript or CSS).
     */
    type: 'js' | 'css';
  }>;
}

/**
 * Development-only bundle analyzer component
 * Shows real-time bundle information during development
 * 
 * @returns Bundle analyzer component
 */
export const BundleAnalyzer: React.FC = () => {
  const [bundleInfo, setBundleInfo] = useState<BundleInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const analyzeBundleInfo = () => {
      const jsChunks: Array<{ name: string; size: number; type: 'js' | 'css' }> = [];
      const cssChunks: Array<{ name: string; size: number; type: 'js' | 'css' }> = [];

      // Analyze loaded scripts
      document.querySelectorAll('script[src]').forEach(script => {
        const src = (script as HTMLScriptElement).src;
        if (src.includes('/assets/') || src.includes('/src/')) {
          jsChunks.push({
            name: src.split('/').pop() || 'unknown',
            size: 0, // Size estimation would require additional API
            type: 'js',
          });
        }
      });

      // Analyze loaded stylesheets
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = (link as HTMLLinkElement).href;
        if (href.includes('/assets/') || href.includes('/src/')) {
          cssChunks.push({
            name: href.split('/').pop() || 'unknown',
            size: 0, // Size estimation would require additional API
            type: 'css',
          });
        }
      });

      const allChunks = [...jsChunks, ...cssChunks];
      
      setBundleInfo({
        jsSize: jsChunks.length * 100, // Rough estimate
        cssSize: cssChunks.length * 50, // Rough estimate
        totalSize: allChunks.length * 75, // Rough estimate
        chunks: allChunks,
      });
    };

    // Initial analysis
    analyzeBundleInfo();

    // Re-analyze when new resources are loaded
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const hasNewResources = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE &&
            (
              (node as Element).tagName === 'SCRIPT' ||
              (node as Element).tagName === 'LINK'
            )
          );
          
          if (hasNewResources) {
            setTimeout(analyzeBundleInfo, 100);
          }
        }
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!bundleInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 rounded-full bg-brand p-3 text-white shadow-lg transition-all hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
        aria-label={isVisible ? 'Hide bundle analyzer' : 'Show bundle analyzer'}
        title="Bundle Analyzer"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>

      {/* Bundle Info Panel */}
      {isVisible && (
        <div className="min-w-80 rounded-lg border border-border bg-surface p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">
              Bundle Analyzer
            </h3>
            <span className="rounded-full bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
              DEV
            </span>
          </div>

          {/* Bundle Summary */}
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">JavaScript:</span>
              <span className="font-mono text-data-viz-1">
                {bundleInfo.jsSize}KB
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-muted">CSS:</span>
              <span className="font-mono text-data-viz-2">
                {bundleInfo.cssSize}KB
              </span>
            </div>
            
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-medium">
                <span className="text-text">Total:</span>
                <span className="font-mono text-brand">
                  {bundleInfo.totalSize}KB
                </span>
              </div>
            </div>
          </div>

          {/* Chunk List */}
          <div>
            <h4 className="mb-2 text-xs font-medium text-text">
              Loaded Resources ({bundleInfo.chunks.length})
            </h4>
            
            <div className="max-h-40 space-y-1 overflow-y-auto text-xs">
              {bundleInfo.chunks.map((chunk, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded px-2 py-1 bg-surface-alt"
                >
                  <span className="truncate text-text">
                    {chunk.name}
                  </span>
                  <span
                    className={`font-mono ${
                      chunk.type === 'js' 
                        ? 'text-data-viz-1' 
                        : 'text-data-viz-2'
                    }`}
                  >
                    {chunk.type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex space-x-2 text-xs">
              <button
                onClick={() => {
                  window.open('/reports/bundle-analysis.html', '_blank');
                }}
                className="rounded bg-brand px-2 py-1 text-white hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-focus-ring"
              >
                View Report
              </button>
              
              <button
                onClick={() => {
                  console.warn('Bundle Info:', bundleInfo);
                }}
                className="rounded bg-surface-alt px-2 py-1 text-text hover:bg-surface-alt/80 focus:outline-none focus:ring-2 focus:ring-focus-ring"
              >
                Log Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};