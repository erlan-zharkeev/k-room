import { ROOM_CALL_SESSION_I18N } from './i18n'

export const ROOM_CALL_ACTIVITY_KIND = {
  ACTIVE: 'active',
  INCOMING: 'incoming',
  JOINABLE: 'joinable',
  OUTGOING: 'outgoing'
} as const

export const ROOM_CALL_ACTIVITY_DOT_COLOR_BY_KIND = {
  [ROOM_CALL_ACTIVITY_KIND.ACTIVE]: 'var(--nmorph-success-color)',
  [ROOM_CALL_ACTIVITY_KIND.INCOMING]: 'var(--nmorph-warn-color)',
  [ROOM_CALL_ACTIVITY_KIND.JOINABLE]: 'var(--nmorph-success-color)',
  [ROOM_CALL_ACTIVITY_KIND.OUTGOING]: 'var(--nmorph-accent-color)'
} as const

export const ROOM_CALL_ACTIVITY_I18N_BY_KIND = {
  [ROOM_CALL_ACTIVITY_KIND.ACTIVE]: ROOM_CALL_SESSION_I18N.activeRoomCallActivity,
  [ROOM_CALL_ACTIVITY_KIND.INCOMING]: ROOM_CALL_SESSION_I18N.incomingGroupRoomCall,
  [ROOM_CALL_ACTIVITY_KIND.JOINABLE]: ROOM_CALL_SESSION_I18N.joinableRoomCall,
  [ROOM_CALL_ACTIVITY_KIND.OUTGOING]: ROOM_CALL_SESSION_I18N.outgoingRoomCall
} as const

export const ROOM_CALL_RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}

export const ROOM_CALL_TEMPORARY_QUICK_COMMAND_TTL_MS = 3_500
