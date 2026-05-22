export interface ClientEnv {
  apiPath: string
  apiBaseUrl: string
  socketPath: string
  isDev: boolean
  isE2E: boolean
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
