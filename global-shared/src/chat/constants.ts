import type { ChatKind } from './types'

export const CHAT_KIND_VALUES = ['direct', 'group'] as const satisfies readonly ChatKind[]

export const USER_CHAT_ROOM_LIMIT = 100
export const PINNED_CHAT_ROOM_LIMIT = 10
export const CHAT_ROOM_NAME_MAX_LENGTH = 80
