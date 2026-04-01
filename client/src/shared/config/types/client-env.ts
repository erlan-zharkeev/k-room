export interface IClientEnv {
  isDev: boolean
  isE2E: boolean
  apiBaseUrl: string
  appName: string
  appVersion: string
  supportEmail: string
  socketBaseUrl: string
  serverPort: number
  clientPort: number
  appHost: string
  apiHost: string
  firebaseApiKey: string
  sentryDsnClient: string
  sentryEnvironment: string
  sentryEnabled: boolean
  themeBg: string
  themeAccent: string
  themeText: string
}
