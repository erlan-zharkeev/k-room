export const MB_IN_BYTES = 1024 * 1024
export const MINUTE_IN_SEC = 60
export const HOUR_IN_SEC = 60 * MINUTE_IN_SEC
export const DAY_IN_SEC = 24 * HOUR_IN_SEC
export const SECOND_IN_MS = 1000
export const MINUTE_IN_MS = MINUTE_IN_SEC * SECOND_IN_MS
export const HOUR_IN_MS = HOUR_IN_SEC * SECOND_IN_MS
export const DAY_IN_MS = DAY_IN_SEC * SECOND_IN_MS
export const WEEK_IN_MS = 7 * DAY_IN_MS

export const firebaseProviders = ['google', 'facebook'] as const

export const providers = [...firebaseProviders, 'app'] as const
