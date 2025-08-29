import { test, expect } from '@playwright/test'

test.describe('home loads', () => {
  test('loads cleanly, shows header, main content, and at least one product link', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

    const resp = await page.goto('/', {waitUntil: 'domcontentloaded'})
    expect(resp?.status()).toBeLessThan(400);
    
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible();

    await page.goto('/products', {waitUntil: 'domcontentloaded'})
    const productLink = page.locator('a[href*="/products/"], a[href*="/product/"]').first();
    await expect(productLink).toBeVisible();

    expect(consoleErrors).toEqual([]);
  })
})
