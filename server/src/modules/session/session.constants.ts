import { DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS, SECOND_IN_MS } from 'global-shared'

export const DEFAULT_COOKIE_MAX_AGE_MS = 30 * DAY_IN_MS
export const DEVICE_COOKIE_MAX_AGE_MS = 36_500 * DAY_IN_MS
export const TOKEN_EXPIRES_PATTERN = /^(\d+)([smhd])$/
export const TOKEN_EXPIRES_UNIT_TO_MS = {
  s: SECOND_IN_MS,
  m: MINUTE_IN_MS,
  h: HOUR_IN_MS,
  d: DAY_IN_MS
} as const

export const JWT_ACCESS_TOKEN_EXPIRES_IN = '15m'
export const REFRESH_TOKEN_EXPIRES_IN = '14d'
export const SESSION_COOKIE_NAMES = ['jwt', 'refresh-jwt', 'device-id'] as const
