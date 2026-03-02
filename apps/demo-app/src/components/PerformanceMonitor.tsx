import React, { useEffect, useState } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Performance metrics data structure.
 */
interface PerformanceMetrics {
  /**
   * Cumulative Layout Shift score.
   */
  cls: number | null;
  /**
   * First Contentful Paint time in milliseconds.
   */
  fcp: number | null;
  /**
   * Largest Contentful Paint time in milliseconds.
   */
  lcp: number | null;
  /**
   * Time to First Byte in milliseconds.
   */
  ttfb: number | null;
  /**
   * Current memory usage in megabytes (if available).
   */
  memoryUsage?: number;
  /**
   * Estimated bundle size.
   */
  bundleSize?: string;
}

/**
 * Development-only component for monitoring real-time performance metrics
 * Displays Core Web Vitals, memory usage, and rendering statistics
 * 
 * @returns Performance monitor component with metrics display
 */
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    fcp: null,
    lcp: null,
    ttfb: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Set up Web Vitals monitoring
    const updateMetric = (metric: Metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric.value,
      }));
    };

    onCLS(updateMetric);
    onFCP(updateMetric);
    onLCP(updateMetric);
    onTTFB(updateMetric);

    // Monitor memory usage (if available)
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }).memory;
        
        if (memory) {
          setMetrics(prev => ({
            ...prev,
            memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
          }));
        }
      }
    };

    // Update memory usage every 5 seconds
    const memoryInterval = setInterval(updateMemoryUsage, 5000);
    updateMemoryUsage(); // Initial call

    // Estimate bundle size from loaded scripts
    const estimateBundleSize = () => {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        const src = (script as HTMLScriptElement).src;
        if (src.includes('/assets/')) {
          // This is a rough estimate - in a real app you'd track actual transfer sizes
          totalSize += 100; // Rough estimate in KB
        }
      });

      setMetrics(prev => ({
        ...prev,
        bundleSize: `~${totalSize}KB`,
      }));
    };

    estimateBundleSize();

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getMetricStatus = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'text-gray-500';
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMetric = (value: number | null, unit: string = 'ms') => {
    if (value === null) return 'Pending...';
    return `${value.toFixed(2)}${unit}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={isVisible ? 'Hide performance monitor' : 'Show performance monitor'}
        title="Performance Monitor"
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

      {/* Performance Panel */}
      {isVisible && (
        <div className="min-w-80 rounded-lg border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Performance Monitor
            </h3>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
              DEV
            </span>
          </div>

          <div className="space-y-2 text-sm">
            {/* Core Web Vitals */}
            <div className="border-b border-gray-200 pb-2 dark:border-gray-600">
              <h4 className="mb-1 font-medium text-gray-700 dark:text-gray-300">
                Core Web Vitals
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">LCP:</span>
                  <span className={`ml-1 font-mono ${getMetricStatus(metrics.lcp, { good: 2500, poor: 4000 })}`}>
                    {formatMetric(metrics.lcp)}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400">FCP:</span>
                  <span className={`ml-1 font-mono ${getMetricStatus(metrics.fcp, { good: 1800, poor: 3000 })}`}>
                    {formatMetric(metrics.fcp)}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400">CLS:</span>
                  <span className={`ml-1 font-mono ${getMetricStatus(metrics.cls, { good: 0.1, poor: 0.25 })}`}>
                    {formatMetric(metrics.cls, '')}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
                  <span className={`ml-1 font-mono ${getMetricStatus(metrics.ttfb, { good: 800, poor: 1800 })}`}>
                    {formatMetric(metrics.ttfb)}
                  </span>
                </div>
              </div>
            </div>

            {/* Runtime Metrics */}
            <div>
              <h4 className="mb-1 font-medium text-gray-700 dark:text-gray-300">
                Runtime
              </h4>
              
              <div className="space-y-1">
                {metrics.memoryUsage && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                    <span className="ml-1 font-mono text-purple-600 dark:text-purple-400">
                      {metrics.memoryUsage}MB
                    </span>
                  </div>
                )}
                
                {metrics.bundleSize && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Bundle:</span>
                    <span className="ml-1 font-mono text-orange-600 dark:text-orange-400">
                      {metrics.bundleSize}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thresholds Legend */}
          <div className="mt-3 border-t border-gray-200 pt-2 dark:border-gray-600">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">Good</span>
              <span className="text-yellow-600">Needs Improvement</span>
              <span className="text-red-600">Poor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};