const NODE_ENV = process.env.NODE_ENV ?? 'development'

export const E2E_ENV = {
  NODE_ENV,
  IS_DEV: NODE_ENV === 'development',
  PLAYWRIGHT_BASE_URL: 'https://localhost:3001',
  PLAYWRIGHT_SERVER_URL: 'https://localhost:3000/api/users/me',
  PLAYWRIGHT_MONGO_HOST: '127.0.0.1',
  PLAYWRIGHT_MONGO_PORT: 27017,
  CI: Boolean(process.env.CI)
} as const

export const E2E_TIMEOUTS = {
  mongoConnection: 3_000,
  webServer: 120_000
} as const
