import { ContentTabType, IUserSetting } from 'src/shared/config'

import { getBrowserLanguage } from '../helpers/language'

export const FULL_CONTENT_ELEMENTS: ContentTabType[] = []

export const DEFAULT_SETTINGS: IUserSetting = {
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
