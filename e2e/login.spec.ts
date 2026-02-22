import { test, expect } from '@playwright/test';

test('TC-AUTH-01: Valid user login redirects to Dashboard', async ({ page }) => {
  // 1. Navigate directly to the root application URL (which is the login page)
  await page.goto('http://localhost:5173/');

  // 2. Interact with the UI elements using the exact placeholders
  await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  await page.getByPlaceholder('••••••••').fill('Admin!123');
  
  // 3. Click the sign in button
  await page.getByRole('button', { name: 'Sign In' }).click();

  // 4. Assert the expected outcome (waits for the simulated 1-second delay)
  await expect(page).toHaveURL(/.*dashboard/);
});