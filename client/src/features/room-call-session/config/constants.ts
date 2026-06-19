import { ROOM_CALL_SESSION_I18N } from './i18n'
import type { RoomCallActivityKind } from './types'

export const ROOM_CALL_ACTIVITY_DOT_COLOR_BY_KIND = {
  active: 'var(--nmorph-success-color)',
  incoming: 'var(--nmorph-warn-color)',
  joinable: 'var(--nmorph-success-color)',
  outgoing: 'var(--nmorph-accent-color)'
} as const satisfies Record<RoomCallActivityKind, string>

export const ROOM_CALL_ACTIVITY_I18N_BY_KIND = {
  active: ROOM_CALL_SESSION_I18N.activeRoomCallActivity,
  incoming: ROOM_CALL_SESSION_I18N.incomingGroupRoomCall,
  joinable: ROOM_CALL_SESSION_I18N.joinableRoomCall,
  outgoing: ROOM_CALL_SESSION_I18N.outgoingRoomCall
} as const satisfies Record<RoomCallActivityKind, (typeof ROOM_CALL_SESSION_I18N)[keyof typeof ROOM_CALL_SESSION_I18N]>

export const ROOM_CALL_RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}

export const ROOM_CALL_TEMPORARY_QUICK_COMMAND_TTL_MS = 3_500
