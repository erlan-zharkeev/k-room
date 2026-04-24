import type { AppLanguageType } from 'global-shared'

export type ThemeType = 'dark' | 'light'

export type AsideBarButtonNameType = 'contacts' | 'chat-rooms' | 'calls' | 'settings'

export type ContentTabType = 'info' | AsideBarButtonNameType

export type HiddenNotificationType = 'audio-context'

export interface IMessageListScrollState {
  firstVisibleItemId: string
}

export interface IUserSetting {
  selectedContentTab: ContentTabType
  selectedChatRoomId: string
  messageScrollByRoom: Record<string, IMessageListScrollState>
  language: AppLanguageType
  showNotification: boolean
  theme: ThemeType
  showTooltips: boolean
  soundOn: boolean
  showWallpaper: boolean
  selectedAudioInputDeviceId: string
  selectedVideoInputDeviceId: string
  selectedAudioOutputDeviceId: string
  hiddenNotification: HiddenNotificationType[]
}

export type DbUserSettingType = IUserSetting
