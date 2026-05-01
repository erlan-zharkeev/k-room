import type { AppLanguageType } from 'global-shared'

import type { ICustomThemeSetting, ThemeType } from 'src/shared/types/theme'

export type WallpaperType = 'default' | 'custom'

export type SoundType = 'connection' | 'calling' | 'income-message' | 'ring' | 'busy'

export type CustomSoundSettingType = Record<SoundType, string>

export type AsideBarButtonNameType = 'contacts' | 'chat-rooms' | 'calls' | 'settings'

export type ContentTabType = 'info-notifications' | AsideBarButtonNameType

export type HiddenNotificationType = 'audio-context'

export interface IMessageListScrollState {
  firstVisibleItemId: string
  offsetFromItemStart?: number
}

export interface IUserSetting {
  selectedContentTab: ContentTabType
  selectedChatRoomId: string
  messageScrollByRoom: Record<string, IMessageListScrollState>
  language: AppLanguageType
  showNotification: boolean
  theme: ThemeType
  systemTheme: Extract<ThemeType, 'dark' | 'light'>
  customTheme: ICustomThemeSetting
  showTooltips: boolean
  soundOn: boolean
  sound: SoundType
  customSounds: CustomSoundSettingType
  showWallpaper: boolean
  wallpaper: WallpaperType
  customWallpaperDataUrl: string
  customWallpaperDarkness: number
  selectedAudioInputDeviceId: string
  selectedVideoInputDeviceId: string
  selectedAudioOutputDeviceId: string
  hiddenNotification: HiddenNotificationType[]
}

export type DbUserSettingType = IUserSetting
