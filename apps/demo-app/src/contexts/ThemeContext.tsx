import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme context type definition.
 */
interface ThemeContextType {
  /**
   * Current theme state (true for dark, false for light).
   */
  isDark: boolean;
  /**
   * Function to toggle between light and dark themes.
   */
  toggleTheme: () => void;
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
 * @returns Theme context with isDark state and toggleTheme function
 * @throws Error if used outside ThemeProvider
 * 
 * @example
 * ```tsx
 * const { isDark, toggleTheme } = useTheme();
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
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      
      // If user has explicitly set a theme, use that
      if (savedTheme === 'dark') return true;
      if (savedTheme === 'light') return false;
      
      // Only use system preference if no explicit choice was made
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};