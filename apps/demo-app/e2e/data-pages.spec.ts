import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.describe('data-backed mini apps', () => {
  test('renders the projects inventory page without the error boundary', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/apps/projects');

    await expect(
      page.getByRole('heading', { name: 'Initiatives, systems, and platforms' })
    ).toBeVisible();
    await expect(page.getByText('Something went wrong')).toHaveCount(0);
    await expect(page.getByText(/Showing \d+ of \d+ projects?/)).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('renders the repositories page without the error boundary', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/apps/repos');

    await expect(page.getByRole('heading', { name: 'GitHub Repositories' })).toBeVisible();
    await expect(page.getByText('Something went wrong')).toHaveCount(0);
    await expect(page.getByText(/Showing \d+ of \d+ repositor(?:y|ies)/)).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
