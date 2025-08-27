export type ThemeType = 'dark' | 'light'

export type AsideBarButtonNameType = 'contacts' | 'chat-rooms' | 'calls' | 'settings'

export type ContentTabType = 'info' | AsideBarButtonNameType

export interface IUserSetting {
  selectedContentTab: ContentTabType
  selectedChatRoomId: string
  showNotification: boolean
  theme: ThemeType
  showTooltips: boolean
  soundOn: boolean
  showWallpaper: boolean
  selectedAudioInputDeviceId: string
  selectedVideoInputDeviceId: string
  selectedAudioOutputDeviceId: string
}

export type DbUserSettingType = IUserSetting
