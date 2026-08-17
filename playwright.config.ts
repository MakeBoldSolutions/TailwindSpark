import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173';
const webServerCommand =
  process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ??
  'npm run dev --workspace @tailwindspark/demo-app -- --host 127.0.0.1 --port 5173';

export default defineConfig({
  testDir: './apps/demo-app/e2e',
  outputDir: './apps/demo-app/test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'apps/demo-app/playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    serviceWorkers: 'block',
    trace: 'on-first-retry',
  },
  webServer:
    process.env.PLAYWRIGHT_BASE_URL && !process.env.PLAYWRIGHT_WEB_SERVER_COMMAND
      ? undefined
      : {
          command: webServerCommand,
          url: baseURL,
          reuseExistingServer: !process.env.CI && !process.env.PLAYWRIGHT_WEB_SERVER_COMMAND,
          timeout: 120_000,
        },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
