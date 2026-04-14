import { Moon, Sun } from 'lucide-react';
import React from 'react';
import type { ThemeId, ThemeMode, ThemeProfile } from '../types/theme';

/**
 * Theme toggle button properties.
 */
interface ThemeToggleProps {
  /** Current theme identifier. */
  themeId: ThemeId;
  /** Current light or dark mode. */
  mode: ThemeMode;
  /** Available theme options. */
  themes: readonly ThemeProfile[];
  /** Callback for changing the active named theme. */
  onThemeChange: (themeId: ThemeId) => void;
  /** Callback to toggle the active light or dark mode. */
  onModeToggle: () => void;
}

/**
 * Theme control for switching both the named theme and the active mode.
 *
 * @param root0 - Component props
 * @param root0.themeId - Current named theme identifier
 * @param root0.mode - Current light or dark mode
 * @param root0.themes - Available theme options
 * @param root0.onThemeChange - Theme change callback
 * @param root0.onModeToggle - Theme mode toggle callback
 * @returns Theme selector and mode toggle controls
 * 
 * @example
 * ```tsx
 * <ThemeToggle
 *   themeId={themeId}
 *   mode={mode}
 *   themes={themes}
 *   onThemeChange={setTheme}
 *   onModeToggle={toggleTheme}
 * />
 * ```
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  themeId,
  mode,
  themes,
  onThemeChange,
  onModeToggle,
}) => {
  const selectId = React.useId();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-alt/80 p-1.5 shadow-sm backdrop-blur-sm">
      <label htmlFor={selectId} className="sr-only">
        Select theme
      </label>
      <select
        id={selectId}
        value={themeId}
        onChange={event => onThemeChange(event.target.value as ThemeId)}
        className="min-w-32 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/30"
        aria-label="Select theme"
      >
        {themes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>

      <button
        onClick={onModeToggle}
        className="rounded-lg bg-surface p-2 transition-colors hover:bg-border"
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        type="button"
      >
        {mode === 'dark' ? (
          <Sun className="h-5 w-5 text-text-muted" />
        ) : (
          <Moon className="h-5 w-5 text-text-muted" />
        )}
      </button>
    </div>
  );
};
