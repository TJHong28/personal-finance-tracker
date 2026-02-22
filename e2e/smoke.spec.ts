import { test, expect } from '@playwright/test';

test('TC-AUTH-01: Verify App Loads and checks title', async ({ page }) => {
  // 1. Go to the homepage
  await page.goto('/');

  // 2. Check if the page loaded successfully by looking at the title or a specific element.
  await expect(page.locator('h1')).toHaveText('Welcome Back');
});