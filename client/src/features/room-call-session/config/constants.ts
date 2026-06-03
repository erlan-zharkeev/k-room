import { ROOM_CALL_SESSION_I18N } from './i18n'

export const ROOM_CALL_MEDIA_BUTTONS_ACTION = {
  JOIN: 'join',
  START: 'start'
} as const

export const ROOM_CALL_MEDIA_BUTTONS_DEFAULT_PROPS = {
  action: ROOM_CALL_MEDIA_BUTTONS_ACTION.START
} as const

export const ROOM_CALL_AUDIO_BUTTON_TITLE_BY_ACTION = {
  [ROOM_CALL_MEDIA_BUTTONS_ACTION.JOIN]: ROOM_CALL_SESSION_I18N.joinAudioRoomCall,
  [ROOM_CALL_MEDIA_BUTTONS_ACTION.START]: ROOM_CALL_SESSION_I18N.startAudioRoomCall
} as const

export const ROOM_CALL_VIDEO_BUTTON_TITLE_BY_ACTION = {
  [ROOM_CALL_MEDIA_BUTTONS_ACTION.JOIN]: ROOM_CALL_SESSION_I18N.joinVideoRoomCall,
  [ROOM_CALL_MEDIA_BUTTONS_ACTION.START]: ROOM_CALL_SESSION_I18N.startVideoRoomCall
} as const

export const ROOM_CALL_RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}
