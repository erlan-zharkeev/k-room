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

export const ROOM_CALL_RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}
