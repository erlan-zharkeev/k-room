import type { IUserSetting } from 'src/shared/config'
import { CLIENT_LANGUAGE } from 'src/shared/config'
import { DEFAULT_APPEARANCE, DEFAULT_CUSTOM_SOUNDS } from 'src/shared/config'

export const DEFAULT_SETTINGS: IUserSetting = {
  selectedContentTab: 'contacts',
  selectedChatRoomId: '',
  messageScrollByRoom: {},
  language: CLIENT_LANGUAGE,
  appearance: DEFAULT_APPEARANCE,

  soundOn: true,
  showTooltips: false,
  showNotification: true,
  sound: 'income-message',
  customSounds: DEFAULT_CUSTOM_SOUNDS,

  selectedAudioInputDeviceId: '',
  selectedVideoInputDeviceId: '',
  selectedAudioOutputDeviceId: '',
  hiddenNotification: []
}
