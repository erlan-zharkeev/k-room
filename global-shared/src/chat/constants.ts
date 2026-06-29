import type { ChatKind, SupportChatStatus } from './types'

export const CHAT_KIND_VALUES = ['direct', 'favorites', 'group', 'support'] as const satisfies readonly ChatKind[]

export const SUPPORT_CHAT_STATUS_VALUES = ['closed', 'open'] as const satisfies readonly SupportChatStatus[]

export const USER_CHAT_ROOM_LIMIT = 100
export const PINNED_CHAT_ROOM_LIMIT = 10
export const CHAT_ROOM_NAME_MAX_LENGTH = 80
