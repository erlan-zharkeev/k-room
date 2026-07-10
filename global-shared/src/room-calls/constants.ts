import type { RoomCallMediaKind, RoomCallStatus } from './types'

export const ROOM_CALL_ACTUALIZATION_LIMIT = 100

export const ROOM_CALL_LOAD_LIMIT_MAX = 50

export const ROOM_CALL_STUN_URLS = ['stun:stun.l.google.com:19302'] as const

export const ROOM_CALL_STATUS_VALUES = [
  'calling',
  'in-progress',
  'finished'
] as const satisfies readonly RoomCallStatus[]

export const ROOM_CALL_MEDIA_KIND_VALUES = ['audio', 'video', 'screen'] as const satisfies readonly RoomCallMediaKind[]

export const ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE = {
  handRaised: false
} as const
