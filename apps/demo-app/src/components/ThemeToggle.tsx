import { Moon, Sun } from 'lucide-react';
import React from 'react';

/**
 * Theme toggle button properties.
 */
interface ThemeToggleProps {
  /**
   * Current theme state (true for dark, false for light).
   */
  isDark: boolean;
  /**
   * Callback to toggle theme.
   */
  onToggle: () => void;
}

/**
 * Theme toggle button for switching between light and dark modes.
 * 
 * Displays sun/moon icon based on current theme with accessible label.
 * 
 * @param root0 - Component props
 * @param root0.isDark - Current theme state
 * @param root0.onToggle - Theme toggle callback
 * @returns Theme toggle button component
 *  
 * @example
 * ```tsx
 * <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
 * ```
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded-lg p-2 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="text-muted h-5 w-5" />
      ) : (
        <Moon className="text-muted h-5 w-5" />
      )}
    </button>
  );
};
