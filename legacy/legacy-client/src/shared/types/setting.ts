import { AppLanguage } from 'common'

export type Theme = 'dark' | 'light'

export type AsideBarButtonName = 'contacts' | 'chat-rooms' | 'calls' | 'settings'

export type ContentTab = AsideBarButtonName

export type HiddenNotification = 'audio-context'

export interface MessageListScrollState {
  firstVisibleItemId: string
}

export interface UserSetting {
  selectedContentTab: ContentTab
  selectedChatRoomId: string
  messageScrollByRoom: Record<string, MessageListScrollState>
  language: AppLanguage
  showNotification: boolean
  theme: Theme
  showTooltips: boolean
  soundOn: boolean
  showWallpaper: boolean
  selectedAudioInputDeviceId: string
  selectedVideoInputDeviceId: string
  selectedAudioOutputDeviceId: string
  hiddenNotification: HiddenNotification[]
}

export type DbUserSetting = UserSetting
