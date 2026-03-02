import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BuildInfo } from './BuildInfo';

// Set global build constants for tests using the same pattern as setup.ts
(
  globalThis as typeof globalThis & { __BUILD_DATE__: string; __BUILD_VERSION__: string }
).__BUILD_DATE__ = '2023-12-01T10:30:00.000Z';

(
  globalThis as typeof globalThis & { __BUILD_DATE__: string; __BUILD_VERSION__: string }
).__BUILD_VERSION__ = '1.2.3';

describe('BuildInfo', () => {
  beforeEach(() => {
    // Reset any potential date/time mocks
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-01T15:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering variants', () => {
    it('should render full variant by default', () => {
      render(<BuildInfo />);
      
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      expect(screen.getByText('•')).toBeInTheDocument();
      expect(screen.getByText(/Built/)).toBeInTheDocument();
    });

    it('should render full variant when explicitly specified', () => {
      render(<BuildInfo variant="full" />);
      
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      expect(screen.getByText('•')).toBeInTheDocument();
      expect(screen.getByText(/Built/)).toBeInTheDocument();
    });

    it('should render only version when variant is version-only', () => {
      render(<BuildInfo variant="version-only" />);
      
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      expect(screen.queryByText('•')).not.toBeInTheDocument();
      expect(screen.queryByText(/Built/)).not.toBeInTheDocument();
    });

    it('should render only date when variant is date-only', () => {
      render(<BuildInfo variant="date-only" />);
      
      expect(screen.queryByText('v1.2.3')).not.toBeInTheDocument();
      expect(screen.queryByText('•')).not.toBeInTheDocument();
      expect(screen.queryByText(/Built/)).not.toBeInTheDocument();
      
      // Should show formatted date
      const dateText = screen.getByText(/Dec 1, 2023/);
      expect(dateText).toBeInTheDocument();
    });
  });

  describe('Date formatting', () => {
    it('should format date correctly with all components', () => {
      render(<BuildInfo variant="date-only" />);
      
      // The formatDate function should format the ISO string properly
      const dateElement = screen.getByText(/Dec 1, 2023/);
      expect(dateElement).toBeInTheDocument();
      
      // Check that time is also included
      expect(dateElement.textContent).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle edge case dates correctly', () => {
      // Mock a different date to test edge cases
      (
        globalThis as typeof globalThis & { __BUILD_DATE__: string; __BUILD_VERSION__: string }
      ).__BUILD_DATE__ = '2023-01-01T00:00:00.000Z';
      
      render(<BuildInfo variant="date-only" />);
      
      // The date will be formatted based on the user's local timezone
      // So we just check that some date text is present
      const dateElement = screen.getByTitle(/Build version/);
      expect(dateElement).toBeInTheDocument();
      expect(dateElement.textContent).toMatch(/\d{4}/); // Should contain a year
    });

    it('should handle date with timezone information', () => {
      render(<BuildInfo variant="full" />);
      
      // The formatted date should include timezone info
      const container = screen.getByTitle(/Build version/);
      expect(container.title).toContain('built on');
      expect(container.title).toMatch(/\d{4}/); // Should contain a year
    });
  });

  describe('Styling and attributes', () => {
    it('should apply default classes', () => {
      render(<BuildInfo />);
      
      const container = screen.getByTitle(/Build version/);
      expect(container).toHaveClass('text-xs', 'text-muted');
    });

    it('should apply custom className', () => {
      render(<BuildInfo className="custom-class" />);
      
      const container = screen.getByTitle(/Build version/);
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass('text-xs', 'text-muted');
    });

    it('should have correct title attribute', () => {
      render(<BuildInfo />);
      
      const container = screen.getByTitle(/Build version/);
      expect(container).toHaveAttribute('title', expect.stringContaining('Build version 1.2.3'));
      expect(container).toHaveAttribute('title', expect.stringContaining('built on'));
      // Date format can vary by timezone, so just check that a date pattern is present
      expect(container.title).toMatch(/\d{4}/); // Should contain a year
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty className gracefully', () => {
      render(<BuildInfo className="" />);
      
      const container = screen.getByTitle(/Build version/);
      expect(container).toHaveClass('text-xs', 'text-muted');
    });

    it('should handle undefined className gracefully', () => {
      render(<BuildInfo className={undefined} />);
      
      const container = screen.getByTitle(/Build version/);
      expect(container).toHaveClass('text-xs', 'text-muted');
    });

    it('should handle invalid date gracefully', () => {
      // Test with an invalid date string to cover edge cases in formatDate
      (
        globalThis as typeof globalThis & { __BUILD_DATE__: string; __BUILD_VERSION__: string }
      ).__BUILD_DATE__ = 'invalid-date';
      
      // This should not crash, even with invalid date
      expect(() => {
        render(<BuildInfo />);
      }).not.toThrow();
    });

    it('should handle missing build constants', () => {
      // Temporarily unset build constants
      const buildGlobals = globalThis as typeof globalThis & { __BUILD_DATE__: string; __BUILD_VERSION__: string };
      const originalDate = buildGlobals.__BUILD_DATE__;
      const originalVersion = buildGlobals.__BUILD_VERSION__;
      
      buildGlobals.__BUILD_DATE__ = '';
      buildGlobals.__BUILD_VERSION__ = '';
      
      expect(() => {
        render(<BuildInfo />);
      }).not.toThrow();
      
      // Restore original values
      buildGlobals.__BUILD_DATE__ = originalDate;
      buildGlobals.__BUILD_VERSION__ = originalVersion;
    });
  });

  describe('Component structure', () => {
    it('should render as a div element', () => {
      render(<BuildInfo />);
      
      const container = screen.getByTitle(/Build version/);
      expect(container.tagName).toBe('DIV');
    });

    it('should contain version span with correct class in full variant', () => {
      render(<BuildInfo variant="full" />);
      
      const versionSpan = screen.getByText('v1.2.3');
      expect(versionSpan).toHaveClass('font-medium');
    });

    it('should contain separator span in full variant', () => {
      render(<BuildInfo variant="full" />);
      
      const separator = screen.getByText('•');
      expect(separator).toHaveClass('mx-2');
    });

    it('should render build text span in full variant', () => {
      render(<BuildInfo variant="full" />);
      
      const buildText = screen.getByText(/Built/);
      expect(buildText.tagName).toBe('SPAN');
    });
  });

  describe('Date formatting function coverage', () => {
    it('should format different date formats correctly', () => {
      // Test various ISO date formats to ensure formatDate handles them
      const testDates = [
        '2023-12-01T10:30:00.000Z',
        '2023-01-15T23:59:59.999Z',
        '2023-06-30T12:00:00.000Z',
      ];

      testDates.forEach((dateString) => {
        (
          globalThis as typeof globalThis & { __BUILD_DATE__: string; __BUILD_VERSION__: string }
        ).__BUILD_DATE__ = dateString;
        
        const { unmount } = render(<BuildInfo variant="date-only" />);
        
        // Should render without errors
        const dateElement = screen.getByTitle(/Build version/);
        expect(dateElement).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should include timezone information in formatted date', () => {
      render(<BuildInfo variant="full" />);
      
      const container = screen.getByTitle(/Build version/);
      // The title should contain the full formatted date with timezone
      expect(container.title).toMatch(/\w{3,4}$/); // Ends with timezone abbreviation
    });
  });
});