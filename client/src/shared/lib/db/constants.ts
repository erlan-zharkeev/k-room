import { MINUTE_IN_MS } from 'global-shared'

export const DEXIE_CACHE_TRIMMER_IDS = {
  MEDIA: 'media',
  MESSAGES: 'messages',
  ROOM_CALLS: 'room-calls',
  KNOWN_USERS: 'known-users',
  CONTACTS: 'contacts',
  CHAT_ROOMS: 'chat-rooms'
} as const

export const DEXIE_CACHE_TRIMMER_PRIORITIES = {
  MEDIA: 10,
  MESSAGES: 20,
  ROOM_CALLS: 30,
  KNOWN_USERS: 40,
  CONTACTS: 50,
  CHAT_ROOMS: 60
} as const

export const DEXIE_QUOTA_ERROR_NAMES = ['QuotaExceededError'] as const
export const DEXIE_QUOTA_ERROR_NAME_SET = new Set<string>(DEXIE_QUOTA_ERROR_NAMES)
export const DEXIE_CACHE_TRIM_EVENT_COOLDOWN_MS = 1 * MINUTE_IN_MS
