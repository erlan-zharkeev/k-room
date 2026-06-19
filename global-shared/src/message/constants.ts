import type { MessageStatus } from './types'

export const MESSAGE_STATUS_VALUES = [
  'sending',
  'undelivered',
  'delivered',
  'read',
  'none'
] as const satisfies readonly MessageStatus[]
export const MESSAGE_BODY_MAX_LENGTH = 5_000
export const MESSAGE_ATTACHMENT_LIMIT = 8
export const MESSAGE_LOAD_LIMIT_MAX = 50
export const MESSAGE_REACTION_LIMIT_PER_USER = 3
export const MESSAGE_LINK_PROTOCOL = 'https:' as const
export const MESSAGE_LINK_CANDIDATE_PATTERN = /https:\/\/[^\s<>"']+/giu
export const MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN = /[),.;!?]+$/u
