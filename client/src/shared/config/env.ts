export interface IClientEnv {
  appName: string
  serverPort: number
  clientPort: number
  host: string
  maxReconnectAttempts: number
  firebaseApiKey: string
  sentryDsnClient: string
  sentryEnvironment: string
  sentryRelease: string
  sentryEnabled: boolean
}

declare const CLIENT_ENV_DATA: IClientEnv

export const CLIENT_ENV: IClientEnv = CLIENT_ENV_DATA
