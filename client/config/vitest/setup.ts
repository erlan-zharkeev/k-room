import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import type { IClientEnv } from 'src/shared/config'

const testClientEnv: IClientEnv = {
  appName: 'K-Room',
  serverPort: 3000,
  clientPort: 3001,
  appHost: 'https://localhost',
  apiHost: 'https://localhost',
  maxReconnectAttempts: 3,
  firebaseApiKey: '',
  sentryDsnClient: '',
  sentryEnvironment: 'test',
  sentryRelease: 'test',
  sentryEnabled: false
}

Object.assign(globalThis, {
  CLIENT_ENV_DATA: testClientEnv
})

afterEach(() => {
  cleanup()
})
