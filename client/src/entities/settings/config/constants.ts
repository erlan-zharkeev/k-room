import type { ContentTabType, IUserSettings } from 'src/shared/lib'

export const FULL_CONTENT_ELEMENTS: ContentTabType[] = ['info']

export const DEFAULT_SETTINGS: IUserSettings = {
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
