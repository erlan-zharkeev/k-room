import { ContentTabType, IUserSetting } from 'src/shared/config'

export const FULL_CONTENT_ELEMENTS: ContentTabType[] = ['info']

export const DEFAULT_SETTINGS: IUserSetting = {
  selectedContentTab: 'contacts',
  selectedChatRoomId: '',
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
