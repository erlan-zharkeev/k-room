import { NmorphIconMonitor, NmorphIconPhone, NmorphIconVideoCamera } from '@nmorph/nmorph-ui-kit'
import { ROOM_CALL_MEDIA_KIND } from 'global-shared'

import { ROOM_CALL_SESSION_I18N } from './i18n'
import type { RoomCallStartButton } from './types'

export const ROOM_CALL_START_BUTTONS = [
  {
    ariaLabel: ROOM_CALL_SESSION_I18N.startAudioRoomCall,
    icon: NmorphIconPhone,
    mediaKind: ROOM_CALL_MEDIA_KIND.AUDIO
  },
  {
    ariaLabel: ROOM_CALL_SESSION_I18N.startVideoRoomCall,
    icon: NmorphIconVideoCamera,
    mediaKind: ROOM_CALL_MEDIA_KIND.VIDEO
  },
  {
    ariaLabel: ROOM_CALL_SESSION_I18N.startScreenRoomCall,
    icon: NmorphIconMonitor,
    mediaKind: ROOM_CALL_MEDIA_KIND.SCREEN
  }
] satisfies RoomCallStartButton[]

export const ROOM_CALL_RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}
