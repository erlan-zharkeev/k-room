import { defineConfig, devices } from '@playwright/test'

import { E2E_ENV, E2E_TIMEOUTS } from 'e2e/config'

const SERVER_COMMAND =
  'bash -lc \'export NVM_DIR="${NVM_DIR:-$HOME/.nvm}" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && export SERVER_E2E="true" APP_HOST="https://localhost" API_HOST="https://localhost" CLIENT_PORT="43111" SERVER_PORT="43117" && pnpm --dir server run start\''
const CLIENT_COMMAND =
  'bash -lc \'export NVM_DIR="${NVM_DIR:-$HOME/.nvm}" && . "$NVM_DIR/nvm.sh" && nvm use >/dev/null && export APP_HOST="https://localhost" API_HOST="https://localhost" CLIENT_PORT="43111" SERVER_PORT="43117" && pnpm --dir client exec vite --host --strictPort --mode test\''
const WINDOWS_SERVER_COMMAND =
  "powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \"$env:SERVER_E2E='true'; $env:APP_HOST='https://localhost'; $env:API_HOST='https://localhost'; $env:CLIENT_PORT='43111'; $env:SERVER_PORT='43117'; pnpm.cmd --dir server run start\""
const WINDOWS_CLIENT_COMMAND =
  "powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \"$env:APP_HOST='https://localhost'; $env:API_HOST='https://localhost'; $env:CLIENT_PORT='43111'; $env:SERVER_PORT='43117'; pnpm.cmd --dir client exec vite --host --strictPort --mode test\""
const TEST_SERVER_COMMAND = process.platform === 'win32' ? WINDOWS_SERVER_COMMAND : SERVER_COMMAND
const TEST_CLIENT_COMMAND = process.platform === 'win32' ? WINDOWS_CLIENT_COMMAND : CLIENT_COMMAND

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
      command: TEST_SERVER_COMMAND,
      url: E2E_ENV.PLAYWRIGHT_SERVER_URL,
      timeout: E2E_TIMEOUTS.webServer,
      reuseExistingServer: false,
      ignoreHTTPSErrors: true,
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      command: TEST_CLIENT_COMMAND,
      url: `${E2E_ENV.PLAYWRIGHT_BASE_URL}/login`,
      timeout: E2E_TIMEOUTS.webServer,
      reuseExistingServer: false,
      ignoreHTTPSErrors: true,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
})
