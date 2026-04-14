import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeId, ThemeMode, ThemePreference, ThemeProfile } from '../types/theme';
import { readThemeFromDocument, applyThemeToDocument } from '../utils/themeBoot';
import { getThemeProfile, getThemeProfiles } from '../utils/themeRegistry';
import {
  createThemePreference,
  resolveInitialThemePreference,
  writeThemePreference,
} from '../utils/themeStorage';

/**
 * Theme context type definition.
 */
interface ThemeContextType {
  /** Current named theme identifier. */
  themeId: ThemeId;
  /** Current light or dark mode. */
  mode: ThemeMode;
  /** Current theme state (true for dark, false for light). */
  isDark: boolean;
  /** Current persisted theme preference object. */
  preference: ThemePreference;
  /** Active theme profile metadata. */
  theme: ThemeProfile;
  /** Available shipped theme profiles. */
  availableThemes: readonly ThemeProfile[];
  /** Function to toggle between light and dark themes. */
  toggleTheme: () => void;
  /** Function to switch the named theme while preserving mode where possible. */
  setTheme: (themeId: ThemeId) => void;
  /** Function to set the current theme mode explicitly. */
  setMode: (mode: ThemeMode) => void;
}

/**
 * Theme context for managing application-wide theme state.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook to access theme context.
 * 
 * Provides access to current theme state and toggle function.
 * Must be used within a ThemeProvider.
 * 
 * @returns Theme context with named theme state and runtime helpers
 * @throws Error if used outside ThemeProvider
 * 
 * @example
 * ```tsx
 * const { themeId, mode, setTheme, toggleTheme } = useTheme();
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme provider component properties.
 */
interface ThemeProviderProps {
  /**
   * Child components to wrap with theme context.
   */
  children: React.ReactNode;
}

/**
 * Theme provider component.
 * 
 * Provides theme context to child components with persistence via localStorage
 * and automatic system preference detection.
 * 
 * @param root0 - Component props
 * @param root0.children - Child components to wrap
 * @returns Theme provider component
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const availableThemes = getThemeProfiles();
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window !== 'undefined') {
      return resolveInitialThemePreference();
    }

    if (typeof document !== 'undefined' && document.documentElement.dataset.theme) {
      return readThemeFromDocument(document);
    }

    return createThemePreference();
  });

  useEffect(() => {
    const appliedPreference = applyThemeToDocument(preference);
    writeThemePreference(appliedPreference);
  }, [preference]);

  const toggleTheme = () => {
    setPreference(currentPreference =>
      createThemePreference({
        ...currentPreference,
        mode: currentPreference.mode === 'dark' ? 'light' : 'dark',
        source: 'stored',
      })
    );
  };

  const setTheme = (themeId: ThemeId) => {
    setPreference(currentPreference => {
      const themeProfile = getThemeProfile(themeId);
      const nextMode = themeProfile.supportedModes.includes(currentPreference.mode)
        ? currentPreference.mode
        : themeProfile.defaultMode;

      return createThemePreference({
        ...currentPreference,
        themeId,
        mode: nextMode,
        source: 'stored',
      });
    });
  };

  const setMode = (mode: ThemeMode) => {
    setPreference(currentPreference =>
      createThemePreference({
        ...currentPreference,
        mode,
        source: 'stored',
      })
    );
  };

  const isDark = preference.mode === 'dark';
  const theme = getThemeProfile(preference.themeId);

  return (
    <ThemeContext.Provider
      value={{
        themeId: preference.themeId,
        mode: preference.mode,
        isDark,
        preference,
        theme,
        availableThemes,
        toggleTheme,
        setTheme,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};