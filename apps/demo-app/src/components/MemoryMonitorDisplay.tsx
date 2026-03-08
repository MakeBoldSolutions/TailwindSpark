/**
 * Memory Monitor Display Component
 * Shows real-time memory usage and leak detection in development
 */

import React, { useEffect, useState } from 'react';
import { memoryMonitor } from '../utils/memoryMonitor';

/**
 * Memory metrics data structure.
 */
interface MemoryMetrics {
  /**
   * Current memory usage statistics.
   */
  current: {
    /**
     * Used JavaScript heap size in bytes.
     */
    usedJSHeapSize: number;
    /**
     * Total JavaScript heap size in bytes.
     */
    totalJSHeapSize: number;
    /**
     * JavaScript heap size limit in bytes.
     */
    jsHeapSizeLimit: number;
  };
  /**
   * Peak memory usage statistics.
   */
  peak: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  /**
   * Memory growth rate percentage.
   */
  growthRate: number;
  /**
   * List of potential memory leaks detected.
   */
  potentialLeaks: Array<{
    /**
     * Component or feature name.
     */
    name: string;
    /**
     * Timestamp when component mounted.
     */
    mountTime: number;
    /**
     * Timestamp when component unmounted (if applicable).
     */
    unmountTime?: number;
    /**
     * Memory usage at mount time in bytes.
     */
    memoryAtMount: number;
    /**
     * Memory usage at unmount time in bytes (if applicable).
     */
    memoryAtUnmount?: number;
  }>;
}

/**
 * Development-only memory monitor with leak detection.
 * 
 * Displays real-time memory usage, peak usage, growth rate, and potential
 * memory leaks. Only renders in development mode when memory API is available.
 * 
 * @returns Memory monitor display component
 * 
 * @example
 * ```tsx
 * <MemoryMonitorDisplay />
 * ```
 */
export const MemoryMonitorDisplay: React.FC = () => {
  const [metrics, setMetrics] = useState<MemoryMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = memoryMonitor.getMemoryMetrics();
      if (currentMetrics) {
        setMetrics(currentMetrics);
      } else {
        setIsSupported(false);
      }
    };

    // Initial check
    updateMetrics();

    // Update every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 bg-data-viz-3/10 text-data-viz-3 p-2 rounded text-xs">
        Memory monitoring not supported
      </div>
    );
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-brand text-white p-2 rounded text-xs hover:bg-brand-hover transition-colors"
        aria-label="Show memory monitor"
      >
        Memory
      </button>
    );
  }

  if (!metrics) {
    return (
      <div className="fixed bottom-4 right-4 bg-surface-alt text-text p-2 rounded text-xs">
        Loading memory data...
      </div>
    );
  }

  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getMemoryStatus = (): { color: string; status: string } => {
    const usagePercent = (metrics.current.usedJSHeapSize / metrics.current.jsHeapSizeLimit) * 100;
    
    if (usagePercent > 80) return { color: 'text-destructive', status: 'High' };
    if (usagePercent > 60) return { color: 'text-data-viz-3', status: 'Medium' };
    return { color: 'text-data-viz-2', status: 'Low' };
  };

  const { color, status } = getMemoryStatus();
  const usagePercent = (metrics.current.usedJSHeapSize / metrics.current.jsHeapSizeLimit) * 100;

  return (
    <div className="fixed bottom-4 right-4 bg-surface shadow-lg rounded-lg p-4 text-xs max-w-sm z-50 border border-border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-text">Memory Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-text-muted hover:text-text"
          aria-label="Hide memory monitor"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between">
            <span>Usage:</span>
            <span className={color}>{formatBytes(metrics.current.usedJSHeapSize)} ({status})</span>
          </div>
          <div className="w-full bg-surface-hover rounded-full h-1 mt-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                usagePercent > 80 ? 'bg-destructive' : 
                usagePercent > 60 ? 'bg-data-viz-3' : 'bg-data-viz-2'
              }`}
              data-width={Math.min(usagePercent, 100)}
              style={{
                width: `${Math.min(usagePercent, 100)}%`
              } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <span>Peak:</span>
          <span>{formatBytes(metrics.peak.usedJSHeapSize)}</span>
        </div>

        <div className="flex justify-between">
          <span>Limit:</span>
          <span>{formatBytes(metrics.current.jsHeapSizeLimit)}</span>
        </div>

        <div className="flex justify-between">
          <span>Growth Rate:</span>
          <span className={metrics.growthRate > 5 ? 'text-destructive' : 'text-text-muted'}>
            {metrics.growthRate.toFixed(1)}%
          </span>
        </div>

        {metrics.potentialLeaks.length > 0 && (
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-destructive font-medium">Potential Leaks:</span>
              <span className="text-destructive">{metrics.potentialLeaks.length}</span>
            </div>
            <div className="mt-1 max-h-20 overflow-y-auto">
              {metrics.potentialLeaks.slice(0, 3).map((leak, index) => (
                <div key={index} className="text-destructive text-xs">
                  {leak.name}
                </div>
              ))}
              {metrics.potentialLeaks.length > 3 && (
                <div className="text-destructive text-xs">
                  +{metrics.potentialLeaks.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t pt-2 flex space-x-2">
          <button
            onClick={() => memoryMonitor.clearData()}
            className="text-xs text-brand hover:text-brand-hover"
          >
            Clear Data
          </button>
          <button
            onClick={() => {
              console.warn(memoryMonitor.generateReport());
            }}
            className="text-xs text-brand hover:text-brand-hover"
          >
            Log Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryMonitorDisplay;