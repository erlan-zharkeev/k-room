import { ContentTab, UserSetting } from 'src/shared/config'

import { getBrowserLanguage } from '../helpers/language'

export const FULL_CONTENT_ELEMENTS: ContentTab[] = []

export const DEFAULT_SETTINGS: UserSetting = {
  selectedContentTab: 'contacts',
  selectedChatRoomId: '',
  messageScrollByRoom: {},
  language: getBrowserLanguage(),
  theme: 'dark',
  soundOn: true,
  showTooltips: false,
  showNotification: true,
  showWallpaper: true,
  selectedAudioInputDeviceId: '',
  selectedVideoInputDeviceId: '',
  selectedAudioOutputDeviceId: '',
  hiddenNotification: []
}
