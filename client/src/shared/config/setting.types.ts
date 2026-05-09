import type { AppLanguageType } from 'global-shared'

export type ThemeType = 'system' | 'dark' | 'light' | 'custom'

export type SystemTheme = Extract<ThemeType, 'dark' | 'light'>

export type EffectiveThemeType = Exclude<ThemeType, 'system'>

export interface IWallpaperSettings {
  angle: number
  scale: number
  darkness: number
  url: string
  filename: string
}

export interface IThemeShadowSettings {
  darkShadeGeneratorCoefficient: number
  lightShadeGeneratorCoefficient: number
  baseShadowWidth: number
  baseShadowBlurCoefficient: number
}

export interface IColorSchema {
  main: string
  darkShade: string
  lightShade: string
  text: string
  accent: string
  focusText: string
  placeholderText: string
  semiContrastText: string
  contrastText: string
  info: string
  infoText: string
  success: string
  successText: string
  error: string
  errorText: string
  warn: string
  warnText: string
  gray: string
  scrollThumb: string
  white: string
  black: string
  overlay: string
}

export interface IThemeData extends IThemeShadowSettings {
  mode: SystemTheme
  colorSchema: IColorSchema
  wallpaper: IWallpaperSettings
}

export interface IAppearanceSettings {
  selectedTheme: ThemeType
  systemTheme: SystemTheme
  showWallpaper: boolean
  themes: Record<EffectiveThemeType, IThemeData>
}

export type DateTimeFormatType = 'auto' | 'dmy-dot-24h' | 'mdy-slash-12h' | 'dmy-slash-24h' | 'ymd-dash-24h'

export type DateTimeFormatPatternMapType = Partial<Record<DateTimeFormatType, string>>

export type AsideBarButtonNameType = 'contacts' | 'chat-rooms' | 'calls' | 'settings'

export type ContentTabType = AsideBarButtonNameType

export type HiddenNotificationType = 'audio-context'

export type NotificationEventGroupType = 'messages' | 'calls'

export type NotificationSettingGroupType = 'general' | NotificationEventGroupType

export type NotificationPushSettingKeyType = 'browserPush' | 'nativePush'

export type NotificationSettingKeyType = 'toast' | 'sound' | 'vibration' | NotificationPushSettingKeyType

export interface INotificationGroupSettings {
  toast: boolean
  sound: boolean
  vibration: boolean
  browserPush: boolean
  nativePush: boolean
}

export interface IUserNotificationSettings {
  enabled: boolean
  general: INotificationGroupSettings
  messages: INotificationGroupSettings
  calls: INotificationGroupSettings
}

export interface IMessageListScrollState {
  firstVisibleItemId: string
  offsetFromItemStart?: number
}

export interface IIoDevicesSettings {
  audioInputDeviceId: string
  videoInputDeviceId: string
  audioOutputDeviceId: string
}

export interface IUserLocalizationSettings {
  language: AppLanguageType
  dateTimeFormat: DateTimeFormatType
}

export interface IUserSetting {
  contentTab: ContentTabType
  chatRoomId: string
  messageScrollByRoom: Record<string, IMessageListScrollState>
  localization: IUserLocalizationSettings
  appearance: IAppearanceSettings
  notifications: IUserNotificationSettings
  ioDevices: IIoDevicesSettings
  hiddenNotification: HiddenNotificationType[]
}

export type DbUserSettingType = IUserSetting
