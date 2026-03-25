import { ContentTabType, IUserSetting } from 'src/shared/config'
import { getBrowserLanguage } from 'src/shared/lib'

export const FULL_CONTENT_ELEMENTS: ContentTabType[] = ['info']

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
