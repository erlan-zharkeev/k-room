import { defineConfig, devices } from '@playwright/test'

import { E2E_ENV, E2E_TIMEOUTS } from 'e2e/config'

const SERVER_COMMAND =
  'bash -lc \'export NVM_DIR="${NVM_DIR:-$HOME/.nvm}" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && pnpm --dir server run start\''
const CLIENT_COMMAND =
  'bash -lc \'export NVM_DIR="${NVM_DIR:-$HOME/.nvm}" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && pnpm --dir client run serve -- --strictPort --mode test\''

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: E2E_ENV.CI,
  retries: E2E_ENV.CI ? 2 : 0,
  workers: E2E_ENV.CI ? 1 : undefined,
  outputDir: './e2e/test-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: './e2e/playwright-report' }]],
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: E2E_ENV.PLAYWRIGHT_BASE_URL,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],
  webServer: [
    {
      command: SERVER_COMMAND,
      url: E2E_ENV.PLAYWRIGHT_SERVER_URL,
      timeout: E2E_TIMEOUTS.webServer,
      reuseExistingServer: E2E_ENV.IS_DEV,
      ignoreHTTPSErrors: true,
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      command: CLIENT_COMMAND,
      url: `${E2E_ENV.PLAYWRIGHT_BASE_URL}/login`,
      timeout: E2E_TIMEOUTS.webServer,
      reuseExistingServer: E2E_ENV.IS_DEV,
      ignoreHTTPSErrors: true,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
})
