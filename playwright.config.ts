import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Tells Playwright to only look in the e2e folder
  fullyParallel: true,
  reporter: 'html', // Generates a nice HTML report after testing
  use: {
    baseURL: 'http://localhost:5173', // Your Vite development server URL
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  // This tells Playwright to automatically start your Vite server before testing!
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});