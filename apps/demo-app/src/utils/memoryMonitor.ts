/**
 * Memory Monitoring Utilities
 * Provides memory leak detection and monitoring for development environment
 */

// Extend Performance interface to include memory
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Global window interface extension
declare global {
  interface Window {
    memoryMonitor?: {
      getReport: () => void;
      getMetrics: () => void;
      clearData: () => void;
      stop: () => void;
      start: (interval?: number) => void;
    };
  }
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ComponentMemoryEntry {
  name: string;
  mountTime: number;
  unmountTime?: number;
  memoryAtMount: number;
  memoryAtUnmount?: number;
}

interface MemoryMetrics {
  current: MemoryInfo;
  peak: MemoryInfo;
  growthRate: number;
  potentialLeaks: ComponentMemoryEntry[];
}

class MemoryMonitor {
  private componentRegistry = new Map<string, ComponentMemoryEntry>();
  private memoryHistory: MemoryInfo[] = [];
  private maxHistorySize = 100;
  private peakMemory: MemoryInfo = { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 };
  private monitoringInterval: ReturnType<typeof setInterval> | null = null;
  private isMonitoring = false;

  constructor() {
    this.bindMethods();
  }

  private bindMethods() {
    this.trackComponentMount = this.trackComponentMount.bind(this);
    this.trackComponentUnmount = this.trackComponentUnmount.bind(this);
    this.getMemoryMetrics = this.getMemoryMetrics.bind(this);
  }

  /**
   * Get current memory information from browser API
   * @returns Current memory info or null if not available
   */
  private getCurrentMemory(): MemoryInfo | null {
    const performanceWithMemory = performance as PerformanceWithMemory;
    if (performanceWithMemory.memory) {
      const memory = performanceWithMemory.memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  /**
   * Start continuous memory monitoring
   * @param intervalMs - Monitoring interval in milliseconds (default: 5000)
   */
  startMonitoring(intervalMs: number = 5000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      const memory = this.getCurrentMemory();
      if (memory) {
        this.recordMemorySnapshot(memory);
      }
    }, intervalMs);
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
  }

  /**
   * Record memory snapshot and update peak memory
   * @param memory - Memory information to record
   */
  private recordMemorySnapshot(memory: MemoryInfo): void {
    this.memoryHistory.push(memory);

    // Keep history within limits
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory.shift();
    }

    // Update peak memory
    if (memory.usedJSHeapSize > this.peakMemory.usedJSHeapSize) {
      this.peakMemory = { ...memory };
    }
  }

  /**
   * Track component mounting
   * @param componentName - Name of the component being mounted
   */
  trackComponentMount(componentName: string): void {
    const memory = this.getCurrentMemory();
    if (!memory) return;

    const entry: ComponentMemoryEntry = {
      name: componentName,
      mountTime: performance.now(),
      memoryAtMount: memory.usedJSHeapSize,
    };

    this.componentRegistry.set(`${componentName}-${entry.mountTime}`, entry);
  }

  /**
   * Track component unmounting
   * @param componentName - Name of the component being unmounted
   */
  trackComponentUnmount(componentName: string): void {
    const memory = this.getCurrentMemory();
    if (!memory) return;

    // Find the most recent mount entry for this component
    const entries = Array.from(this.componentRegistry.entries())
      .filter(([_key, entry]) => entry.name === componentName && !entry.unmountTime)
      .sort(([, a], [, b]) => b.mountTime - a.mountTime);

    if (entries.length > 0) {
      const [key, entry] = entries[0];
      entry.unmountTime = performance.now();
      entry.memoryAtUnmount = memory.usedJSHeapSize;
      this.componentRegistry.set(key, entry);
    }
  }

  /**
   * Calculate memory growth rate
   * @returns Memory growth rate as a percentage
   */
  private calculateGrowthRate(): number {
    if (this.memoryHistory.length < 2) return 0;

    const recent = this.memoryHistory.slice(-10);
    const first = recent[0];
    const last = recent[recent.length - 1];

    if (first.usedJSHeapSize === 0) return 0;

    return ((last.usedJSHeapSize - first.usedJSHeapSize) / first.usedJSHeapSize) * 100;
  }

  /**
   * Detect potential memory leaks
   * @returns Array of component memory entries with potential leaks
   */
  private detectPotentialLeaks(): ComponentMemoryEntry[] {
    const leaks: ComponentMemoryEntry[] = [];
    const memoryGrowthThreshold = 5 * 1024 * 1024; // 5MB growth threshold

    this.componentRegistry.forEach(entry => {
      if (entry.unmountTime && entry.memoryAtUnmount) {
        const memoryGrowth = entry.memoryAtUnmount - entry.memoryAtMount;

        // Check for significant memory growth during component lifecycle
        if (memoryGrowth > memoryGrowthThreshold) {
          leaks.push(entry);
        }
      }
    });

    // Also check for components that haven't unmounted after a long time
    const staleThreshold = 300000; // 5 minutes
    const now = performance.now();

    this.componentRegistry.forEach(entry => {
      if (!entry.unmountTime && now - entry.mountTime > staleThreshold) {
        leaks.push(entry);
      }
    });

    return leaks;
  }

  /**
   * Get comprehensive memory metrics
   * @returns Complete memory metrics or null if not available
   */
  getMemoryMetrics(): MemoryMetrics | null {
    const current = this.getCurrentMemory();
    if (!current) return null;

    return {
      current,
      peak: this.peakMemory,
      growthRate: this.calculateGrowthRate(),
      potentialLeaks: this.detectPotentialLeaks(),
    };
  }

  /**
   * Format memory size for display
   * @param bytes - Memory size in bytes
   * @returns Formatted memory size string with units
   */
  formatMemorySize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Generate memory report
   * @returns Formatted memory report string
   */
  generateReport(): string {
    const metrics = this.getMemoryMetrics();
    if (!metrics) {
      return 'Memory monitoring not supported in this browser';
    }

    const report = [
      '=== Memory Monitor Report ===',
      `Current Usage: ${this.formatMemorySize(metrics.current.usedJSHeapSize)}`,
      `Peak Usage: ${this.formatMemorySize(metrics.peak.usedJSHeapSize)}`,
      `Heap Limit: ${this.formatMemorySize(metrics.current.jsHeapSizeLimit)}`,
      `Growth Rate: ${metrics.growthRate.toFixed(2)}%`,
      '',
      `Potential Leaks Found: ${metrics.potentialLeaks.length}`,
    ];

    if (metrics.potentialLeaks.length > 0) {
      report.push('', 'Leak Details:');
      metrics.potentialLeaks.forEach(leak => {
        const duration = leak.unmountTime
          ? (leak.unmountTime - leak.mountTime).toFixed(0)
          : 'Still mounted';
        const memoryChange = leak.memoryAtUnmount
          ? this.formatMemorySize(leak.memoryAtUnmount - leak.memoryAtMount)
          : 'Unknown';

        report.push(`- ${leak.name}: Duration ${duration}ms, Memory Change: ${memoryChange}`);
      });
    }

    return report.join('\n');
  }

  /**
   * Clear monitoring data
   */
  clearData(): void {
    this.componentRegistry.clear();
    this.memoryHistory = [];
    this.peakMemory = { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 };
  }
}

/**
 * Global memory monitor instance
 */
export const memoryMonitor = new MemoryMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  memoryMonitor.startMonitoring();

  // Add console commands for debugging
  window.memoryMonitor = {
    getReport: () => {
      console.warn(memoryMonitor.generateReport());
    },
    getMetrics: () => {
      console.warn(memoryMonitor.getMemoryMetrics());
    },
    clearData: () => memoryMonitor.clearData(),
    stop: () => memoryMonitor.stopMonitoring(),
    start: (interval?: number) => memoryMonitor.startMonitoring(interval),
  };
}

export default memoryMonitor;
