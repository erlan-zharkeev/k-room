export interface IClientEnv {
  appName: string
  appVersion: string
  supportEmail: string
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
