import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import type { IClientEnv } from 'src/shared/config'

Object.assign(globalThis, {
  CLIENT_ENV_DATA: {
    isDev: false,
    isE2E: false,
    appName: 'K-Room',
    appVersion: 'test',
    supportEmail: '',
    socketBaseUrl: 'https://localhost:3000',
    apiPath: '/api',
    socketPath: '/app-socket',
    apiBaseUrl: '/api',
    serverPort: 3000,
    clientPort: 3001,
    appHost: 'https://localhost',
    apiHost: 'https://localhost',
    firebaseApiKey: '',
    sentryDsnClient: '',
    sentryEnvironment: 'test',
    sentryEnabled: false,
    themeBg: '#020202',
    themeAccent: '#418fde',
    themeText: 'rgb(177 177 177 / 58.7%)'
  } satisfies IClientEnv
})

afterEach(cleanup)
