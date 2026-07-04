import { MINUTE_IN_MS } from 'global-shared'

import type { DexieCacheTrimmerId } from './types'

export const DEXIE_CACHE_TRIMMER_PRIORITIES = {
  media: 10,
  messages: 20,
  'room-calls': 30,
  'known-users': 40,
  contacts: 50,
  'chat-rooms': 60
} as const satisfies Record<DexieCacheTrimmerId, number>

export const DEXIE_QUOTA_ERROR_NAMES = ['QuotaExceededError'] as const
export const DEXIE_QUOTA_ERROR_NAME_SET = new Set<string>(DEXIE_QUOTA_ERROR_NAMES)
export const DEXIE_SAFARI_STORAGE_ERROR_NAMES = ['UnknownError', 'BulkError'] as const
export const DEXIE_SAFARI_STORAGE_ERROR_NAME_SET = new Set<string>(DEXIE_SAFARI_STORAGE_ERROR_NAMES)
export const DEXIE_SAFARI_STORAGE_ERROR_MESSAGES = [
  'Unable to store record in object store',
  'Failed to delete record from object store'
] as const
export const DEXIE_CACHE_TRIM_EVENT_COOLDOWN_MS = 1 * MINUTE_IN_MS
