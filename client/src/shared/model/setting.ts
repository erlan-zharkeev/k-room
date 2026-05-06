import type { AppLanguageType } from 'global-shared'

import type { IAppearanceSettings } from './appearance.types'

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
  appearance: IAppearanceSettings
  showTooltips: boolean
  soundOn: boolean
  sound: SoundType
  customSounds: CustomSoundSettingType
  selectedAudioInputDeviceId: string
  selectedVideoInputDeviceId: string
  selectedAudioOutputDeviceId: string
  hiddenNotification: HiddenNotificationType[]
}

export type DbUserSettingType = IUserSetting
