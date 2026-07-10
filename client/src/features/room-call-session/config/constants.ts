import { ROOM_CALL_STUN_URLS } from 'global-shared'

import { ROOM_CALL_SESSION_I18N } from './i18n'
import type { RoomCallActivityKind, RoomCallConnectionQuality } from './types'

export const ROOM_CALL_ACTIVITY_DOT_COLOR_BY_KIND = {
  active: 'var(--nmorph-success-text-color)',
  incoming: 'var(--nmorph-warn-text-color)',
  joinable: 'var(--nmorph-success-text-color)',
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
      urls: [...ROOM_CALL_STUN_URLS]
    }
  ]
}

export const ROOM_CALL_CONNECTION_QUALITY_CHECK_INTERVAL_MS = 2_000
export const ROOM_CALL_HANDLED_SIGNAL_ID_LIMIT = 1_000
export const ROOM_CALL_PEER_CONNECTION_TIMEOUT_MS = 15_000
export const ROOM_CALL_PEER_DISCONNECTED_TIMEOUT_MS = 5_000
export const ROOM_CALL_PEER_OPERATION_TIMEOUT_MS = 5_000
export const ROOM_CALL_SIGNAL_ACK_TIMEOUT_MS = 8_000
export const ROOM_CALL_SIGNAL_SEND_ATTEMPTS = 3
export const ROOM_CALL_CONNECTION_QUALITY_THRESHOLDS = {
  poor: {
    jitter: 0.08,
    packetLossRatio: 0.1,
    roundTripTime: 0.8
  },
  unstable: {
    jitter: 0.035,
    packetLossRatio: 0.03,
    roundTripTime: 0.35
  }
} as const satisfies Record<
  Exclude<RoomCallConnectionQuality, 'good' | 'reconnecting'>,
  Record<'jitter' | 'packetLossRatio' | 'roundTripTime', number>
>
export const ROOM_CALL_TEMPORARY_QUICK_COMMAND_TTL_MS = 3_500
