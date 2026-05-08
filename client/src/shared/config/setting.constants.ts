import { CLIENT_LANGUAGE } from './language.constants'
import type {
  DateTimeFormatPatternMapType,
  DateTimeFormatType,
  ContentTabType,
  IIoDevicesSettings,
  IUserLocalizationSettings,
  IUserNotificationSettings
} from './setting.types'

export const DATE_TIME_FORMAT = {
  auto: 'auto',
  dmyDot24h: 'dmy-dot-24h',
  mdySlash12h: 'mdy-slash-12h',
  dmySlash24h: 'dmy-slash-24h',
  ymdDash24h: 'ymd-dash-24h'
} as const

export const DEFAULT_DATE_TIME_FORMAT: DateTimeFormatType = DATE_TIME_FORMAT.auto

export const CONTENT_TAB_IDS: ContentTabType[] = ['chat-rooms', 'calls', 'contacts', 'info-notifications', 'settings']

export const DEFAULT_LOCALIZATION_SETTINGS: IUserLocalizationSettings = {
  language: CLIENT_LANGUAGE,
  dateTimeFormat: DEFAULT_DATE_TIME_FORMAT
}

export const DATE_PATTERN_BY_DATE_TIME_FORMAT: DateTimeFormatPatternMapType = {
  [DATE_TIME_FORMAT.dmyDot24h]: 'dd.MM.yyyy',
  [DATE_TIME_FORMAT.mdySlash12h]: 'MM/dd/yyyy',
  [DATE_TIME_FORMAT.dmySlash24h]: 'dd/MM/yyyy',
  [DATE_TIME_FORMAT.ymdDash24h]: 'yyyy-MM-dd'
}

export const TIME_PATTERN_BY_DATE_TIME_FORMAT: DateTimeFormatPatternMapType = {
  [DATE_TIME_FORMAT.dmyDot24h]: 'HH:mm',
  [DATE_TIME_FORMAT.mdySlash12h]: 'h:mm a',
  [DATE_TIME_FORMAT.dmySlash24h]: 'HH:mm',
  [DATE_TIME_FORMAT.ymdDash24h]: 'HH:mm'
}

export const DEFAULT_NOTIFICATION_GROUP_SETTINGS = {
  toast: true,
  sound: true,
  vibration: true,
  browserPush: true,
  nativePush: true
}

export const DEFAULT_NOTIFICATION_SETTINGS: IUserNotificationSettings = {
  enabled: true,
  general: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  messages: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  calls: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS }
}

export const DEFAULT_IO_DEVICES_SETTINGS: IIoDevicesSettings = {
  audioInputDeviceId: '',
  videoInputDeviceId: '',
  audioOutputDeviceId: ''
}
