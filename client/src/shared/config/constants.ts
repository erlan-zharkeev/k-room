import { IClientEnv } from './types'

export const LOCAL_STORAGE_KEY = {
  LogoutStatus: 'logout-status'
} as const

declare const CLIENT_ENV_DATA: IClientEnv

export const CLIENT_ENV: IClientEnv = CLIENT_ENV_DATA
