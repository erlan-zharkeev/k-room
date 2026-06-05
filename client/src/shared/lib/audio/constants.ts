export const APP_SOUND_KIND = {
  BUSY: 'busy',
  CALLING: 'calling',
  CONNECTION: 'connection',
  MESSAGE: 'message',
  ROOM_CALL_RING: 'room-call-ring'
} as const

export const APP_SOUND_SRC_BY_KIND = {
  [APP_SOUND_KIND.BUSY]: '/sounds/busy.mp3',
  [APP_SOUND_KIND.CALLING]: '/sounds/calling.mp3',
  [APP_SOUND_KIND.CONNECTION]: '/sounds/connection.mp3',
  [APP_SOUND_KIND.MESSAGE]: '/sounds/income-message.mp3',
  [APP_SOUND_KIND.ROOM_CALL_RING]: '/sounds/ring.mp3'
} as const
