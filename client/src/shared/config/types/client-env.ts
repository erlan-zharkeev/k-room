export interface IClientEnv {
  isDev: boolean
  isE2E: boolean
  appName: string
  appVersion: string
  supportEmail: string
  socketBaseUrl: string
  apiBaseUrl: string
  serverPort: number
  clientPort: number
  appHost: string
  apiHost: string
  maxReconnectAttempts: number
  firebaseApiKey: string
  sentryDsnClient: string
  sentryEnvironment: string
  sentryRelease: string
  sentryEnabled: boolean
}
