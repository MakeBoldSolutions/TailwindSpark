import type { Plugin } from 'vite';

interface PerformanceBudget {
  maxBundleSize: number; // KB
  maxChunkSize: number; // KB
  maxAssetSize: number; // KB
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxBundleSize: 1000, // 1MB total
  maxChunkSize: 500, // 500KB per chunk
  maxAssetSize: 100, // 100KB per asset
};

/**
 * Vite plugin for enforcing performance budgets
 * Provides warnings when bundle sizes exceed defined thresholds
 * @param budget - Optional partial performance budget configuration
 * @returns Vite plugin instance for performance budget enforcement
 */
export function performanceBudgetPlugin(budget: Partial<PerformanceBudget> = {}): Plugin {
  const config = { ...DEFAULT_BUDGET, ...budget };

  return {
    name: 'performance-budget',
    generateBundle(_options, bundle) {
      const chunks: Array<{ name: string; size: number; type: 'chunk' | 'asset' }> = [];
      let totalSize = 0;

      // Analyze bundle contents
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type === 'chunk') {
          const size = Buffer.byteLength(output.code, 'utf8') / 1024; // KB
          chunks.push({ name: fileName, size, type: 'chunk' });
          totalSize += size;

          // Check individual chunk size
          if (size > config.maxChunkSize) {
            this.warn(
              `⚠️  Performance Budget: Chunk "${fileName}" (${size.toFixed(2)}KB) exceeds limit (${config.maxChunkSize}KB)`
            );
          }
        } else if (output.type === 'asset') {
          const size = Buffer.byteLength(output.source, 'utf8') / 1024; // KB
          chunks.push({ name: fileName, size, type: 'asset' });
          totalSize += size;

          // Check individual asset size
          if (size > config.maxAssetSize) {
            this.warn(
              `⚠️  Performance Budget: Asset "${fileName}" (${size.toFixed(2)}KB) exceeds limit (${config.maxAssetSize}KB)`
            );
          }
        }
      }

      // Check total bundle size
      if (totalSize > config.maxBundleSize) {
        this.warn(
          `⚠️  Performance Budget: Total bundle size (${totalSize.toFixed(2)}KB) exceeds limit (${config.maxBundleSize}KB)`
        );
      }

      // Log bundle analysis in development
      if (process.env.NODE_ENV !== 'production') {
        // Use warn to comply with ESLint rules but make it informational
        console.warn('📊 Bundle Analysis Summary:');
        console.warn(`Total Size: ${totalSize.toFixed(2)}KB (Budget: ${config.maxBundleSize}KB)`);

        const sortedChunks = chunks.sort((a, b) => b.size - a.size);
        sortedChunks.slice(0, 5).forEach(chunk => {
          const status =
            chunk.size > (chunk.type === 'chunk' ? config.maxChunkSize : config.maxAssetSize)
              ? '⚠️'
              : '✅';
          console.warn(`${status} ${chunk.name}: ${chunk.size.toFixed(2)}KB`);
        });
      }
    },
  };
}

/**
 * Runtime performance budget checker
 * Monitors actual performance metrics against budgets
 */
export class RuntimePerformanceBudget {
  private static instance: RuntimePerformanceBudget;
  private budgets = {
    lcp: 2500, // Largest Contentful Paint (ms)
    fcp: 1800, // First Contentful Paint (ms)
    cls: 0.1, // Cumulative Layout Shift
    ttfb: 800, // Time to First Byte (ms)
    fid: 100, // First Input Delay (ms)
  };

  /**
   * Get the singleton instance of RuntimePerformanceBudget
   * @returns The RuntimePerformanceBudget instance
   */
  static getInstance(): RuntimePerformanceBudget {
    if (!RuntimePerformanceBudget.instance) {
      RuntimePerformanceBudget.instance = new RuntimePerformanceBudget();
    }
    return RuntimePerformanceBudget.instance;
  }

  /**
   * Update performance budgets with new values
   * @param newBudgets - Partial budget configuration to merge with existing budgets
   */
  updateBudgets(newBudgets: Partial<typeof this.budgets>): void {
    this.budgets = { ...this.budgets, ...newBudgets };
  }

  /**
   * Check if a metric is within budget
   * @param name - Name of the performance metric to check
   * @param value - Current value of the metric
   * @returns True if within budget, false otherwise
   */
  checkMetric(name: keyof typeof this.budgets, value: number): boolean {
    const budget = this.budgets[name];
    const isWithinBudget = value <= budget;

    if (!isWithinBudget && process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️  Performance Budget Exceeded: ${name.toUpperCase()} = ${value.toFixed(2)} (Budget: ${budget})`
      );
    }

    return isWithinBudget;
  }

  /**
   * Get current performance budgets
   * @returns Copy of current budget configuration
   */
  getBudgets(): typeof this.budgets {
    return { ...this.budgets };
  }
}
