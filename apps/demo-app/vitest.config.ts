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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'src/test/', '**/*.d.ts', '**/*.config.*', '**/*.test.tsx', '**/*test.ts'],
      thresholds: {
        // TODO: Increase thresholds to 80% as coverage improves (current baseline from T022)
        // Current coverage: statements 53.64%, branches 48.99%, functions 44.98%, lines 54.43%
        // Target: 80% across all metrics per FR-03.1 (User Story 3)
        statements: 53.64,
        branches: 48.99,
        functions: 44.98,
        lines: 54.43,
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
