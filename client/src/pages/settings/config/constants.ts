import { MEDIA_KIND_ACCEPT_MAP, MEDIA_MB_IN_BYTES, MEDIA_VALIDATION_OPTIONS_MAP } from 'global-shared'

import { MAIN_PAGE_ROUTES } from 'src/shared/config'

import SettingsAccountContent from '../ui/content/SettingsAccountContent.vue'
import SettingsDevicesContent from '../ui/content/SettingsDevicesContent.vue'
import SettingsFaqContent from '../ui/content/SettingsFaqContent.vue'
import SettingsLanguageContent from '../ui/content/SettingsLanguageContent.vue'
import SettingsNotificationsContent from '../ui/content/SettingsNotificationsContent.vue'
import SettingsSoundContent from '../ui/content/SettingsSoundContent.vue'
import SettingsStorageContent from '../ui/content/SettingsStorageContent.vue'
import SettingsThemeContent from '../ui/content/SettingsThemeContent.vue'

import { SETTINGS_PAGE_ACCOUNT_I18N } from './i18n/account'
import { SETTINGS_PAGE_APPEARANCE_I18N } from './i18n/appearance'
import { SETTINGS_PAGE_FAQ_I18N } from './i18n/faq'
import { SETTINGS_PAGE_GENERAL_I18N } from './i18n/general'
import { SETTINGS_PAGE_STORAGE_I18N } from './i18n/storage'

export const SETTINGS_CONTENT_IDS = [
  'account',
  'theme',
  'language',
  'notifications',
  'sound',
  'devices',
  'storage',
  'faq'
] as const

export const DEFAULT_SETTINGS_CONTENT_ID = SETTINGS_CONTENT_IDS[0]

const settingsAccountAvatarValidation = MEDIA_VALIDATION_OPTIONS_MAP.avatar
const settingsWallpaperValidation = MEDIA_VALIDATION_OPTIONS_MAP.image

export const SETTINGS_ACCOUNT_AVATAR_ACCEPT =
  MEDIA_KIND_ACCEPT_MAP[settingsAccountAvatarValidation.supportedKindMediaType]
export const SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE = settingsAccountAvatarValidation.maxMb * MEDIA_MB_IN_BYTES
export const SETTINGS_WALLPAPER_ACCEPT = MEDIA_KIND_ACCEPT_MAP[settingsWallpaperValidation.supportedKindMediaType]
export const SETTINGS_WALLPAPER_MAX_FILE_SIZE = settingsWallpaperValidation.maxMb * MEDIA_MB_IN_BYTES
export const SETTINGS_WALLPAPER_VISIBILITY_OPTIONS = [{ value: 'show' }, { value: 'hide' }]
export const SETTINGS_WALLPAPER_FIT_OPTIONS = [{ value: 'cover' }, { value: 'contain' }]
export const SETTINGS_WALLPAPER_ANGLE_MIN = -180
export const SETTINGS_WALLPAPER_ANGLE_MAX = 180
export const SETTINGS_WALLPAPER_SCALE_MIN = 50
export const SETTINGS_WALLPAPER_SCALE_MAX = 200
export const SETTINGS_WALLPAPER_DARKNESS_MIN = 0
export const SETTINGS_WALLPAPER_DARKNESS_MAX = 100

export const getSettingsPath = (settingsId: string) => `${MAIN_PAGE_ROUTES.settings}/${settingsId}`

export const SETTINGS_NAVIGATION_ITEMS = [
  {
    id: 'account',
    label: SETTINGS_PAGE_ACCOUNT_I18N.account,
    description: SETTINGS_PAGE_ACCOUNT_I18N.accountDescription
  },
  {
    id: 'theme',
    label: SETTINGS_PAGE_APPEARANCE_I18N.appearance,
    description: SETTINGS_PAGE_APPEARANCE_I18N.themeDescription
  },
  {
    id: 'language',
    label: SETTINGS_PAGE_APPEARANCE_I18N.language,
    description: SETTINGS_PAGE_APPEARANCE_I18N.language
  },
  {
    id: 'notifications',
    label: SETTINGS_PAGE_GENERAL_I18N.notifications,
    description: SETTINGS_PAGE_GENERAL_I18N.notificationsDescription
  },
  {
    id: 'sound',
    label: SETTINGS_PAGE_GENERAL_I18N.sound,
    description: SETTINGS_PAGE_GENERAL_I18N.sound
  },
  {
    id: 'devices',
    label: SETTINGS_PAGE_GENERAL_I18N.devices,
    description: SETTINGS_PAGE_GENERAL_I18N.devices
  },
  {
    id: 'storage',
    label: SETTINGS_PAGE_STORAGE_I18N.storage,
    description: SETTINGS_PAGE_STORAGE_I18N.storageDescription
  },
  {
    id: 'faq',
    label: SETTINGS_PAGE_FAQ_I18N.faq,
    description: SETTINGS_PAGE_FAQ_I18N.faqDescription
  }
] as const

export const SETTINGS_CONTENT_TITLE = {
  account: SETTINGS_PAGE_ACCOUNT_I18N.account,
  theme: SETTINGS_PAGE_APPEARANCE_I18N.appearance,
  language: SETTINGS_PAGE_APPEARANCE_I18N.language,
  notifications: SETTINGS_PAGE_GENERAL_I18N.notifications,
  sound: SETTINGS_PAGE_GENERAL_I18N.sound,
  devices: SETTINGS_PAGE_GENERAL_I18N.devices,
  storage: SETTINGS_PAGE_STORAGE_I18N.storage,
  faq: SETTINGS_PAGE_FAQ_I18N.faq
} as const

export const SETTINGS_CONTENT_COMPONENTS = {
  account: SettingsAccountContent,
  theme: SettingsThemeContent,
  language: SettingsLanguageContent,
  notifications: SettingsNotificationsContent,
  sound: SettingsSoundContent,
  devices: SettingsDevicesContent,
  storage: SettingsStorageContent,
  faq: SettingsFaqContent
} as const
