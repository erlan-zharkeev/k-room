import { MEDIA_KIND_ACCEPT_MAP, MEDIA_MB_IN_BYTES, MEDIA_VALIDATION_OPTIONS_MAP, isString } from 'global-shared'

import { MAIN_PAGE_ROUTES } from 'src/shared/config'

import SettingsAccountContent from '../ui/content/SettingsAccountContent.vue'
import SettingsDevicesContent from '../ui/content/SettingsDevicesContent.vue'
import SettingsFaqContent from '../ui/content/SettingsFaqContent.vue'
import SettingsLanguageContent from '../ui/content/SettingsLanguageContent.vue'
import SettingsNotificationsContent from '../ui/content/SettingsNotificationsContent.vue'
import SettingsSoundContent from '../ui/content/SettingsSoundContent.vue'
import SettingsStorageContent from '../ui/content/SettingsStorageContent.vue'
import SettingsThemeContent from '../ui/content/SettingsThemeContent.vue'
import SettingsWallpaperContent from '../ui/content/SettingsWallpaperContent.vue'

import { SETTINGS_PAGE_I18N } from './i18n'

export const DEFAULT_SETTINGS_CONTENT_ID = 'account'

const settingsAccountAvatarValidation = MEDIA_VALIDATION_OPTIONS_MAP.avatar

export const SETTINGS_ACCOUNT_AVATAR_ACCEPT = MEDIA_KIND_ACCEPT_MAP[settingsAccountAvatarValidation.supportedKindMediaType]
export const SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE = settingsAccountAvatarValidation.maxMb * MEDIA_MB_IN_BYTES

export const getSettingsPath = (settingsId: string) => `${MAIN_PAGE_ROUTES.settings}/${settingsId}`

export const SETTINGS_NAVIGATION_ITEMS = [
  {
    id: 'account',
    label: SETTINGS_PAGE_I18N.account,
    description: SETTINGS_PAGE_I18N.accountDescription
  },
  {
    id: 'theme',
    label: SETTINGS_PAGE_I18N.theme,
    description: SETTINGS_PAGE_I18N.brandTheme
  },
  {
    id: 'language',
    label: SETTINGS_PAGE_I18N.language,
    description: SETTINGS_PAGE_I18N.language
  },
  {
    id: 'wallpaper',
    label: SETTINGS_PAGE_I18N.wallpaper,
    description: SETTINGS_PAGE_I18N.wallpaperEnabled
  },
  {
    id: 'notifications',
    label: SETTINGS_PAGE_I18N.notifications,
    description: SETTINGS_PAGE_I18N.notificationsDescription
  },
  {
    id: 'sound',
    label: SETTINGS_PAGE_I18N.sound,
    description: SETTINGS_PAGE_I18N.sound
  },
  {
    id: 'devices',
    label: SETTINGS_PAGE_I18N.devices,
    description: SETTINGS_PAGE_I18N.devices
  },
  {
    id: 'storage',
    label: SETTINGS_PAGE_I18N.storage,
    description: SETTINGS_PAGE_I18N.storageDescription
  },
  {
    id: 'faq',
    label: SETTINGS_PAGE_I18N.faq,
    description: SETTINGS_PAGE_I18N.faqDescription
  }
] as const

export const SETTINGS_CONTENT_TITLE = {
  account: SETTINGS_PAGE_I18N.account,
  theme: SETTINGS_PAGE_I18N.theme,
  language: SETTINGS_PAGE_I18N.language,
  wallpaper: SETTINGS_PAGE_I18N.wallpaper,
  notifications: SETTINGS_PAGE_I18N.notifications,
  sound: SETTINGS_PAGE_I18N.sound,
  devices: SETTINGS_PAGE_I18N.devices,
  storage: SETTINGS_PAGE_I18N.storage,
  faq: SETTINGS_PAGE_I18N.faq
} as const

export const SETTINGS_CONTENT_COMPONENTS = {
  account: SettingsAccountContent,
  theme: SettingsThemeContent,
  language: SettingsLanguageContent,
  wallpaper: SettingsWallpaperContent,
  notifications: SettingsNotificationsContent,
  sound: SettingsSoundContent,
  devices: SettingsDevicesContent,
  storage: SettingsStorageContent,
  faq: SettingsFaqContent
} as const

export const isSettingsContentId = (settingsId: unknown): settingsId is keyof typeof SETTINGS_CONTENT_COMPONENTS =>
  isString(settingsId) && settingsId in SETTINGS_CONTENT_COMPONENTS
