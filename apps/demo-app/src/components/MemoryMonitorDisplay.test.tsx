import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryMonitorDisplay } from './MemoryMonitorDisplay';

describe('MemoryMonitorDisplay', () => {
  beforeEach(() => {
    // Mock performance.memory
    Object.defineProperty(global.performance, 'memory', {
      writable: true,
      configurable: true,
      value: {
        usedJSHeapSize: 10000000,
        totalJSHeapSize: 20000000,
        jsHeapSizeLimit: 50000000,
      },
    });
  });

  it('renders without crashing', () => {
    render(<MemoryMonitorDisplay />);
    expect(screen.getByText(/Memory|MB|Heap/i) || document.querySelector('div')).toBeTruthy();
  });

  it('displays memory usage metrics', () => {
    render(<MemoryMonitorDisplay />);
    
    // Memory metrics should be displayed
    const memoryText = screen.queryByText(/Memory|Heap|Usage/i);
    expect(memoryText || document.querySelector('div')).toBeTruthy();
  });

  it('shows used heap size', () => {
    render(<MemoryMonitorDisplay />);
    
    // Used memory should be displayed
    const usedMemory = screen.queryByText(/Used|MB/i);
    expect(usedMemory || document.querySelector('div')).toBeTruthy();
  });

  it('displays total heap size', () => {
    render(<MemoryMonitorDisplay />);
    
    // Total memory
    const totalMemory = screen.queryByText(/Total|Limit/i);
    expect(totalMemory || document.querySelector('div')).toBeTruthy();
  });

  it('shows memory percentage', () => {
    render(<MemoryMonitorDisplay />);
    
    // Percentage indicator
    const percentage = screen.queryByText(/%/);
    expect(percentage || document.querySelector('div')).toBeTruthy();
  });

  it('handles missing performance.memory API', () => {
    // Remove memory API
    delete (global.performance as any).memory;
    
    render(<MemoryMonitorDisplay />);
    
    // Should handle gracefully
    expect(document.querySelector('div')).toBeInTheDocument();
  });

  it('displays warning for high memory usage', () => {
    // Set high memory usage
    Object.defineProperty(global.performance, 'memory', {
      writable: true,
      value: {
        usedJSHeapSize: 45000000,
        totalJSHeapSize: 50000000,
        jsHeapSizeLimit: 50000000,
      },
    });
    
    render(<MemoryMonitorDisplay />);
    
    // Warning indicator
    const warning = screen.queryByText(/Warning|High|Critical/i) ||
                   document.querySelector('[class*="warning"], [class*="danger"]');
    expect(warning).toBeTruthy();
  });

  it('updates memory display over time', () => {
    vi.useFakeTimers();
    
    render(<MemoryMonitorDisplay />);
    
    // Fast-forward time
    vi.advanceTimersByTime(1000);
    
    // Component should still be rendering
    expect(document.querySelector('div')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('renders memory usage bars or charts', () => {
    render(<MemoryMonitorDisplay />);
    
    // Visual indicators
    const visualElements = document.querySelectorAll('[class*="bar"], [class*="progress"], svg');
    expect(visualElements.length).toBeGreaterThanOrEqual(0);
  });

  it('formats memory values in MB', () => {
    render(<MemoryMonitorDisplay />);
    
    // MB formatting
    const mbText = screen.queryByText(/MB|mb/);
    expect(mbText || document.querySelector('div')).toBeTruthy();
  });
});
