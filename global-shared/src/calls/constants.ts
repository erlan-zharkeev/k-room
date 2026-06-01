export const CALL_PARTICIPANT_LIMIT = 5

export const CALL_STATUS = {
  CALLING: 'calling',
  IN_PROGRESS: 'in-progress',
  FINISHED: 'finished'
} as const

export const CALL_FLOW = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
  MISSED: 'missed',
  NOT_ANSWERED: 'not-answered'
} as const

export const CALL_MEDIA_KIND = {
  AUDIO: 'audio',
  VIDEO: 'video',
  SCREEN: 'screen'
} as const

export const CALL_SIGNAL_KIND = {
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate'
} as const

export const CALL_LEAVE_REASON = {
  DECLINED: 'declined',
  DISCONNECTED: 'disconnected',
  LEFT: 'left'
} as const
