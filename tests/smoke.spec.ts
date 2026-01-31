import { test, expect } from '@playwright/test';

test('Verify App Title', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle(/MyFinance/); 
});

