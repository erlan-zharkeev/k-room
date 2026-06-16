export const MESSAGE_STATUS_VALUE = {
  SENDING: 'sending',
  UNDELIVERED: 'undelivered',
  DELIVERED: 'delivered',
  READ: 'read',
  NONE: 'none'
} as const
export const MESSAGE_STATUS = [
  MESSAGE_STATUS_VALUE.SENDING,
  MESSAGE_STATUS_VALUE.UNDELIVERED,
  MESSAGE_STATUS_VALUE.DELIVERED,
  MESSAGE_STATUS_VALUE.READ,
  MESSAGE_STATUS_VALUE.NONE
] as const
export const MESSAGE_BODY_MAX_LENGTH = 5_000
export const MESSAGE_ATTACHMENT_LIMIT = 8
export const MESSAGE_LOAD_LIMIT_MAX = 50
export const MESSAGE_REACTION_LIMIT_PER_USER = 3
export const MESSAGE_LINK_PROTOCOL = 'https:' as const
export const MESSAGE_LINK_CANDIDATE_PATTERN = /https:\/\/[^\s<>"']+/giu
export const MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN = /[),.;!?]+$/u
export const MESSAGE_LINK_PREVIEW_STATUS = {
  PENDING: 'pending',
  LOADED: 'loaded',
  FAILED: 'failed'
} as const
export const MESSAGE_REACTION_UPDATE_ACTION = {
  ADD: 'add',
  REMOVE: 'remove'
} as const
export const MESSAGE_LOAD_DIRECTION = {
  LATEST: 'latest',
  BEFORE: 'before',
  AFTER: 'after',
  AROUND: 'around'
} as const
