import { IClientEnv } from '../types/client-env'

export const LOCAL_STORAGE_KEY = {
  LogoutStatus: 'logout-status'
} as const

export const ROOM_MESSAGES_PAGE_LIMIT = 30

declare const CLIENT_ENV_DATA: IClientEnv

export const CLIENT_ENV = CLIENT_ENV_DATA
