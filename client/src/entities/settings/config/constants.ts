import type { ContentTabType, IUserSetting } from 'src/shared/lib'

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
  selectedAudioOutputDeviceId: ''
}
