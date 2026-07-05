export const MB_IN_BYTES = 1_024 * 1_024
export const MINUTE_IN_SEC = 60
export const HOUR_IN_SEC = 60 * MINUTE_IN_SEC
export const DAY_IN_SEC = 24 * HOUR_IN_SEC
export const SECOND_IN_MS = 1_000
export const MINUTE_IN_MS = MINUTE_IN_SEC * SECOND_IN_MS
export const HOUR_IN_MS = HOUR_IN_SEC * SECOND_IN_MS
export const DAY_IN_MS = DAY_IN_SEC * SECOND_IN_MS
export const WEEK_IN_MS = 7 * DAY_IN_MS
export const ROOM_PARTICIPANT_LIMIT = 5
export const CLIENT_VERSION_HEADER = 'x-k-room-client-version'
export const NATIVE_AUTH_CLIENT_HEADER = 'x-k-room-native-client'
export const NATIVE_AUTH_ACCESS_TOKEN_HEADER = 'x-k-room-native-access-token'
export const NATIVE_AUTH_REFRESH_TOKEN_HEADER = 'x-k-room-native-refresh-token'
export const NATIVE_AUTH_DEVICE_ID_HEADER = 'x-k-room-native-device-id'

export const firebaseProviders = ['google', 'facebook'] as const

export const providers = [...firebaseProviders, 'app'] as const
