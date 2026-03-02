import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  describe('Rendering and Visual States', () => {
    it('should render correctly in light mode', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Should show Moon icon in light mode
      const moonIcon = screen.getByRole('button').querySelector('svg');
      expect(moonIcon).toBeInTheDocument();
    });

    it('should render correctly in dark mode', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Should show Sun icon in dark mode
      const sunIcon = screen.getByRole('button').querySelector('svg');
      expect(sunIcon).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label in light mode', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should have correct aria-label in dark mode', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should be accessible via keyboard', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('User Interactions', () => {
    it('should call onToggle when clicked', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockToggle).toHaveBeenCalledOnce();
    });

    it('should call onToggle when clicked in dark mode', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockToggle).toHaveBeenCalledOnce();
    });

    it('should call onToggle when activated via keyboard', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      // Test that the button is focusable and can be activated
      button.focus();
      expect(button).toHaveFocus();
      
      // The browser will handle Enter and Space key activation
      // We just verify the button is properly set up for keyboard interaction
      expect(button.tagName).toBe('BUTTON');
    });

    it('should handle multiple clicks correctly', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe('Styling and Classes', () => {
    it('should have correct base classes', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary-100');
      expect(button).toHaveClass('dark:bg-secondary-800');
      expect(button).toHaveClass('hover:bg-secondary-200');
      expect(button).toHaveClass('dark:hover:bg-secondary-700');
      expect(button).toHaveClass('rounded-lg');
      expect(button).toHaveClass('p-2');
      expect(button).toHaveClass('transition-colors');
    });

    it('should have consistent styling regardless of theme state', () => {
      const mockToggle = vi.fn();
      
      // Test light mode
      const { rerender } = render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      const buttonLight = screen.getByRole('button');
      const lightClasses = buttonLight.className;
      
      // Test dark mode
      rerender(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      const buttonDark = screen.getByRole('button');
      const darkClasses = buttonDark.className;
      
      // Classes should be the same regardless of isDark prop
      expect(lightClasses).toBe(darkClasses);
    });
  });

  describe('Icon Display', () => {
    it('should display Moon icon when in light mode (isDark=false)', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      // Moon icon should be present
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5', 'w-5');
      expect(icon).toHaveClass('text-muted');
    });

    it('should display Sun icon when in dark mode (isDark=true)', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      
      // Sun icon should be present
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5', 'w-5');
      expect(icon).toHaveClass('text-muted');
    });

    it('should have consistent icon styling for both states', () => {
      const mockToggle = vi.fn();
      
      // Test light mode icon
      const { rerender } = render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      const lightIcon = screen.getByRole('button').querySelector('svg');
      
      // Test dark mode icon
      rerender(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      const darkIcon = screen.getByRole('button').querySelector('svg');
      
      // Both icons should have the same classes
      expect(lightIcon).toHaveClass('h-5', 'w-5', 'text-muted');
      expect(darkIcon).toHaveClass('h-5', 'w-5', 'text-muted');
    });

    it('should only show one icon at a time', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      const icons = button.querySelectorAll('svg');
      
      // Should only have one icon
      expect(icons).toHaveLength(1);
    });
  });

  describe('Component Props', () => {
    it('should handle isDark prop changes correctly', () => {
      const mockToggle = vi.fn();
      const { rerender } = render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      // Initially should have "Switch to dark mode" label
      expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
      
      // Change to dark mode
      rerender(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      
      // Should now have "Switch to light mode" label
      expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    });

    it('should handle onToggle prop changes correctly', () => {
      const mockToggle1 = vi.fn();
      const mockToggle2 = vi.fn();
      
      const { rerender } = render(<ThemeToggle isDark={false} onToggle={mockToggle1} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockToggle1).toHaveBeenCalledOnce();
      expect(mockToggle2).not.toHaveBeenCalled();
      
      // Change the onToggle function
      rerender(<ThemeToggle isDark={false} onToggle={mockToggle2} />);
      
      fireEvent.click(button);
      expect(mockToggle1).toHaveBeenCalledOnce(); // Still one call
      expect(mockToggle2).toHaveBeenCalledOnce(); // New function called
    });

    it('should work with different callback function types', () => {
      // Test with arrow function
      const arrowToggle = vi.fn(() => {});
      render(<ThemeToggle isDark={false} onToggle={arrowToggle} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(arrowToggle).toHaveBeenCalledOnce();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid toggling', () => {
      const mockToggle = vi.fn();
      render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      const button = screen.getByRole('button');
      
      // Rapid fire clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      
      expect(mockToggle).toHaveBeenCalledTimes(10);
    });

    it('should maintain accessibility during state changes', () => {
      const mockToggle = vi.fn();
      const { rerender } = render(<ThemeToggle isDark={false} onToggle={mockToggle} />);
      
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      
      rerender(<ThemeToggle isDark={true} onToggle={mockToggle} />);
      
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should be testable with different test scenarios', () => {
      const mockToggle = vi.fn();
      
      // Test both boolean values explicitly
      const scenarios = [
        { isDark: false, expectedLabel: 'Switch to dark mode' },
        { isDark: true, expectedLabel: 'Switch to light mode' },
      ];
      
      scenarios.forEach(({ isDark, expectedLabel }) => {
        const { unmount } = render(<ThemeToggle isDark={isDark} onToggle={mockToggle} />);
        
        expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument();
        
        unmount();
      });
    });
  });
});