import { APP_LANGUAGE } from 'global-shared'

export const CLIENT_LANGUAGE = navigator.language.toLowerCase().startsWith(APP_LANGUAGE.Ru)
  ? APP_LANGUAGE.Ru
  : APP_LANGUAGE.En

export const CLIENT_ENV = __CLIENT_ENV_DATA__

export const LOCAL_STORAGE_KEY = {
  LogoutStatus: 'logout-status'
} as const

export const ROOM_MESSAGES_PAGE_LIMIT = 30
