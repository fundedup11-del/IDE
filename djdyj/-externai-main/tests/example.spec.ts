import { test, expect } from '@playwright/test';

test.describe('Examples page', () => {
  test('loads examples index and finds Examples heading', async ({ page }) => {
    await page.goto('/examples');
    await expect(page).toHaveTitle(/Examples|externai/i);
    const heading = await page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
