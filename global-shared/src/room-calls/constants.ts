export const ROOM_CALL_PARTICIPANT_LIMIT = 5

export const ROOM_CALL_ACTUALIZATION_LIMIT = 100

export const ROOM_CALL_STATUS = {
  CALLING: 'calling',
  IN_PROGRESS: 'in-progress',
  FINISHED: 'finished'
} as const

export const ROOM_CALL_MEDIA_KIND = {
  AUDIO: 'audio',
  VIDEO: 'video',
  SCREEN: 'screen'
} as const

export const ROOM_CALL_SIGNAL_KIND = {
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate'
} as const

export const ROOM_CALL_LEAVE_REASON = {
  DECLINED: 'declined',
  DISCONNECTED: 'disconnected',
  LEFT: 'left'
} as const
