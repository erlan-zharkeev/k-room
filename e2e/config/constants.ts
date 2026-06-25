const NODE_ENV = process.env.NODE_ENV ?? 'development'
const PLAYWRIGHT_API_URL = 'https://localhost:43117/api'
const PLAYWRIGHT_MONGO_URL = process.env.MONGO_HOST ?? 'mongodb://localhost:27017/k-room-db'

export const E2E_ENV = {
  NODE_ENV,
  IS_DEV: NODE_ENV === 'development',
  PLAYWRIGHT_API_URL,
  PLAYWRIGHT_BASE_URL: 'https://localhost:43111',
  PLAYWRIGHT_MONGO_URL,
  PLAYWRIGHT_SERVER_URL: `${PLAYWRIGHT_API_URL}/users/me`,
  PLAYWRIGHT_MONGO_HOST: '127.0.0.1',
  PLAYWRIGHT_MONGO_PORT: 27017,
  CI: Boolean(process.env.CI)
} as const

export const E2E_TIMEOUTS = {
  mongoConnection: 3_000,
  webServer: 120_000
} as const
