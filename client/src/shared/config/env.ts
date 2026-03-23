export interface IClientEnv {
  appName: string
  serverPort: number
  clientPort: number
  mailApp: string
  host: string
  maxReconnectAttempts: number
  firebaseApiKey: string
}

declare const CLIENT_ENV_DATA: IClientEnv

export const CLIENT_ENV: IClientEnv = CLIENT_ENV_DATA
