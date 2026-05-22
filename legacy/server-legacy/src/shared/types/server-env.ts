export interface ServerEnv {
  appName: string
  appVersion: string
  isDev: boolean
  apiPath: string
  socketPath: string
  mongoHost: string
  domain: string
  serverPort: number
  clientPort: number
  serverUrl: string
  clientUrl: string
  accessTokenSecret: string
  emailConfirmSecret: string
  refreshTokenSecret: string
  resendApiKey: string
  adminUsername: string
  adminPassword: string
  sentryEnvironment: string
  sentryEnabled: boolean
  adminRootPath: string
  adminLoginPath: string
  adminLogoutPath: string
  adminCookie: string
}
