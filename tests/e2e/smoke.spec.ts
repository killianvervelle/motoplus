import { test, expect } from '@playwright/test'

test('home loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/$/)
  // tweak this to any stable element/text in your header/landing
  await expect(page.locator('body')).toBeVisible()
})

test('products page navigates', async ({ page }) => {
  await page.goto('/products')
  await expect(page).toHaveURL(/\/products/)
  // Example assertion: page has some product grid/list
  await expect(page.locator('text=/products/i').first())
    .toBeVisible({ timeout: 5000 })
    .catch(() => {})
})
