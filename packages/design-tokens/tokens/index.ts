/**
 * Semantic color palette for TailwindSpark design system.
 * 
 * Provides categorized color scales (50-950) for primary, secondary, success, warning, and error states,
 * plus data visualization colors with light/dark mode variants for charts and graphs.
 * All colors are designed for WCAG AA accessibility compliance.
 */
export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  secondary: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  // Data Visualization Colors for Charts and Graphs
  dataViz: {
    1: { light: '#2563eb', dark: '#3b82f6' }, // Blue - Primary series
    2: { light: '#059669', dark: '#10b981' }, // Green - Secondary
    3: { light: '#7c3aed', dark: '#a78bfa' }, // Purple - Tertiary
    4: { light: '#db2777', dark: '#f472b6' }, // Pink - Quaternary
    5: { light: '#ea580c', dark: '#fb923c' }, // Orange - Accent
    6: { light: '#0891b2', dark: '#22d3ee' }, // Cyan - Supporting
    7: { light: '#ca8a04', dark: '#facc15' }, // Yellow - Highlight
    8: { light: '#e11d48', dark: '#fb7185' }, // Rose - Emphasis
  },
} as const;

/**
 * Spacing scale for consistent layout and component spacing.
 * 
 * Provides a harmonious spacing system from extra-small (0.5rem) to 3xl (4rem).
 * Use for margin, padding, and gap utilities to maintain visual rhythm.
 */
export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

/**
 * Border radius tokens for rounded corners.
 * 
 * Provides a range from sharp (none) to fully rounded (full/9999px).
 * Use for consistent component styling across buttons, cards, inputs, and other UI elements.
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

/**
 * Box shadow tokens for elevation and depth.
 * 
 * Provides a range from subtle (sm) to dramatic (2xl) shadows with opacity values.
 * Use for creating visual hierarchy and elevated UI components like cards and modals.
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
} as const;

export * from './theme-contract';

