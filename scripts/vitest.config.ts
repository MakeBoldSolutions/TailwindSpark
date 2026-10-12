import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['scripts/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['scripts/snapshot-download.ts'],
      reporter: ['text'],
      thresholds: { statements: 40, branches: 40, functions: 40, lines: 40 },
    },
  },
});
