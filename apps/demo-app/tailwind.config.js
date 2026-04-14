import baseConfig from '@tailwindspark/design-tokens/tailwind.config.js';

/**
 * Demo App Tailwind Config (v4)
 * Reuses centralized design tokens. Only app-specific overrides should be added here.
 */
export default {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: ['rounded-control', 'rounded-panel', 'shadow-card', 'shadow-modal', 'shadow-button'],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...(baseConfig.theme?.extend || {}),
      // App-only theme extensions belong here if a route needs additional semantic utilities.
    },
  },
};
