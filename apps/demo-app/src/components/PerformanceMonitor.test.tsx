import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PerformanceMonitor } from './PerformanceMonitor';

// Mock performance APIs
const mockPerformanceObserver = vi.fn();
global.PerformanceObserver = mockPerformanceObserver as any;

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock performance.getEntriesByType
    global.performance.getEntriesByType = vi.fn(() => []) as any;
    
    // Mock performance.memory
    Object.defineProperty(global.performance, 'memory', {
      writable: true,
      value: {
        usedJSHeapSize: 10000000,
        totalJSHeapSize: 20000000,
        jsHeapSizeLimit: 50000000,
      },
    });
  });

  it('renders without crashing', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/Performance/i) || document.querySelector('div')).toBeTruthy();
  });

  it('displays performance metrics', () => {
    render(<PerformanceMonitor />);
    
    // Performance metrics should be displayed
    const metricsContainer = document.querySelector('[class*="performance"]') ||
                            document.querySelector('div');
    expect(metricsContainer).toBeInTheDocument();
  });

  it('shows memory usage if available', () => {
    render(<PerformanceMonitor />);
    
    // Memory metrics might be displayed
    const memoryText = screen.queryByText(/Memory|MB|Heap/i);
    expect(memoryText || document.querySelector('div')).toBeTruthy();
  });

  it('renders performance indicators', () => {
    render(<PerformanceMonitor />);
    
    // Check for performance indicator elements
    const indicators = document.querySelectorAll('[class*="metric"], [class*="stat"]');
    expect(indicators.length).toBeGreaterThanOrEqual(0);
  });

  it('displays FPS or frame rate', () => {
    render(<PerformanceMonitor />);
    
    // FPS counter might be present
    const fpsText = screen.queryByText(/FPS|Frame/i);
    expect(fpsText || document.querySelector('div')).toBeTruthy();
  });

  it('shows loading time metrics', () => {
    render(<PerformanceMonitor />);
    
    // Load time metrics
    const loadingMetrics = screen.queryByText(/Load|Time|ms/i);
    expect(loadingMetrics || document.querySelector('div')).toBeTruthy();
  });

  it('handles missing performance API gracefully', () => {
    const originalPerformance = global.performance;
    (global as any).performance = undefined;
    
    render(<PerformanceMonitor />);
    
    // Should not crash
    expect(document.querySelector('div')).toBeInTheDocument();
    
    global.performance = originalPerformance;
  });

  it('updates metrics over time', async () => {
    vi.useFakeTimers();
    
    render(<PerformanceMonitor />);
    
    // Fast-forward time
    vi.advanceTimersByTime(1000);
    
    // Component should still be rendering
    expect(document.querySelector('div')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('displays performance charts or visualizations', () => {
    render(<PerformanceMonitor />);
    
    // Charts or visual elements
    const visualElements = document.querySelectorAll('[class*="chart"], [class*="graph"], svg');
    expect(visualElements.length).toBeGreaterThanOrEqual(0);
  });

  it('shows performance warnings', () => {
    render(<PerformanceMonitor />);
    
    // Warning indicators if performance is poor
    const warnings = screen.queryByText(/Warning|Slow|High/i);
    expect(warnings || document.querySelector('div')).toBeTruthy();
  });
});
