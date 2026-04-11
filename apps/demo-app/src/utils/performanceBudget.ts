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
