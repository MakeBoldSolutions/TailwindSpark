import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const colors = {
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
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
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
};

const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
};

const semanticColors = {
  brand: {
    DEFAULT: 'var(--color-brand)',
    hover: 'var(--color-brand-hover)',
    fg: 'var(--color-brand-fg)',
  },
  muted: 'var(--color-text-muted)',
  destructive: 'var(--color-error-600)',
  surface: {
    DEFAULT: 'var(--color-surface)',
    alt: 'var(--color-surface-alt)',
    hover: 'var(--color-surface-hover)',
    inverse: 'var(--color-surface-inverse)',
  },
  text: {
    DEFAULT: 'var(--color-text)',
    inverse: 'var(--color-text-inverse)',
    muted: 'var(--color-text-muted)',
  },
  border: {
    DEFAULT: 'var(--color-border)',
    strong: 'var(--color-border-strong)',
  },
  'focus-ring': 'var(--color-focus-ring)',
};

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}',
    '../../apps/*/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...colors,
        ...semanticColors,
        'brand-hover': 'var(--color-brand-hover)',
        'surface-alt': 'var(--color-surface-alt)',
        'surface-hover': 'var(--color-surface-hover)',
        'text-muted': 'var(--color-text-muted)',
        'border-strong': 'var(--color-border-strong)',
      },
      spacing,
      borderRadius,
      boxShadow: shadows,
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      borderRadius: {
        control: 'var(--theme-radius-control)',
        panel: 'var(--theme-radius-panel)',
      },
      boxShadow: {
        ...shadows,
        card: 'var(--theme-shadow-card)',
        modal: 'var(--theme-shadow-modal)',
        button: 'var(--theme-shadow-button)',
      },
      animation: {
        'fade-in': 'fadeIn var(--theme-motion-duration) var(--theme-ease)',
        'slide-up': 'slideUp var(--theme-motion-duration) var(--theme-ease)',
        'slide-down': 'slideDown var(--theme-motion-duration) var(--theme-ease)',
        'scale-in': 'scaleIn var(--theme-motion-duration-fast) var(--theme-ease)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  // aspect-ratio plugin removed (now core in Tailwind v4)
  plugins: [typography, forms],
};

export default config;
