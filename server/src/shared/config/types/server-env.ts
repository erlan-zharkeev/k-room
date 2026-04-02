export interface IServerEnv {
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
  sentryEnvironment: string
  sentryEnabled: boolean
}
