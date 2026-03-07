import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        // Temporary repo-wide baseline while broader legacy coverage is evaluated in future specs.
        statements: 40,
        branches: 40,
        functions: 40,
        lines: 40,
      },
      exclude: [
        'node_modules/',
        'dist/',
        '.turbo/',
        'coverage/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tailwindspark/ui-components': resolve(__dirname, './packages/ui-components/src'),
      '@tailwindspark/design-tokens': resolve(__dirname, './packages/design-tokens'),
    },
  },
});
