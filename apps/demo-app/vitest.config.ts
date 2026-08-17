/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['node_modules/', 'dist/', 'e2e/'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'e2e/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.tsx',
        '**/*test.ts',
      ],
      thresholds: {
        // Temporary completion gate for spec 003-reactspark-migration.
        // Re-evaluate and raise in a future spec once broader legacy areas gain test coverage.
        statements: 40,
        branches: 40,
        functions: 40,
        lines: 40,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tailwindspark/ui-components': resolve(__dirname, '../../packages/ui-components/src'),
      '@tailwindspark/design-tokens': resolve(__dirname, '../../packages/design-tokens'),
    },
  },
});
