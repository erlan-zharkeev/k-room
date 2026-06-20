import { APP_PAGE_ROUTES } from 'src/features/app-navigation'

import SettingsAccountContent from '../../ui/content/account/SettingsAccountContent.vue'
import SettingsAppearanceContent from '../../ui/content/appearance/SettingsAppearanceContent.vue'
import SettingsDevicesContent from '../../ui/content/devices/SettingsDevicesContent.vue'
import SettingsLanguageContent from '../../ui/content/localization/SettingsLocalizationContent.vue'
import SettingsFaqContent from '../../ui/content/SettingsFaqContent.vue'
import SettingsNotificationsContent from '../../ui/content/SettingsNotificationsContent.vue'
import SettingsRoadmapContent from '../../ui/content/SettingsRoadmapContent.vue'
import SettingsStorageContent from '../../ui/content/storage/SettingsStorageContent.vue'
import { SETTINGS_PAGE_ACCOUNT_I18N } from '../i18n/account.i18n'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../i18n/appearance.i18n'
import { SETTINGS_PAGE_FAQ_I18N } from '../i18n/faq.i18n'
import { SETTINGS_PAGE_GENERAL_I18N } from '../i18n/general.i18n'
import { SETTINGS_PAGE_ROADMAP_I18N } from '../i18n/roadmap.i18n'
import { SETTINGS_PAGE_STORAGE_I18N } from '../i18n/storage.i18n'

export const SETTINGS_CONTENT_IDS = [
  'account',
  'appearance',
  'language',
  'notifications',
  'devices',
  'storage',
  'faq',
  'roadmap'
] as const

export const DEFAULT_SETTINGS_CONTENT_ID = SETTINGS_CONTENT_IDS[0]

export const getSettingsPath = (settingsId: string) => `${APP_PAGE_ROUTES.settings}/${settingsId}`

export const SETTINGS_NAVIGATION_ITEMS = [
  {
    id: 'account',
    label: SETTINGS_PAGE_ACCOUNT_I18N.account,
    description: SETTINGS_PAGE_ACCOUNT_I18N.accountDescription
  },
  {
    id: 'appearance',
    label: SETTINGS_PAGE_APPEARANCE_I18N.appearance,
    description: SETTINGS_PAGE_APPEARANCE_I18N.appearanceDescription
  },
  {
    id: 'language',
    label: SETTINGS_PAGE_APPEARANCE_I18N.localization,
    description: SETTINGS_PAGE_APPEARANCE_I18N.localization
  },
  {
    id: 'notifications',
    label: SETTINGS_PAGE_GENERAL_I18N.notifications,
    description: SETTINGS_PAGE_GENERAL_I18N.notificationsDescription
  },
  {
    id: 'devices',
    label: SETTINGS_PAGE_GENERAL_I18N.devices,
    description: SETTINGS_PAGE_GENERAL_I18N.devices
  },
  {
    id: 'storage',
    label: SETTINGS_PAGE_STORAGE_I18N.storage,
    description: SETTINGS_PAGE_STORAGE_I18N.storage
  },
  {
    id: 'faq',
    label: SETTINGS_PAGE_FAQ_I18N.faq,
    description: SETTINGS_PAGE_FAQ_I18N.faqDescription
  },
  {
    id: 'roadmap',
    label: SETTINGS_PAGE_ROADMAP_I18N.roadmap,
    description: SETTINGS_PAGE_ROADMAP_I18N.roadmapDescription
  }
] as const

export const SETTINGS_CONTENT_TITLE = {
  account: SETTINGS_PAGE_ACCOUNT_I18N.account,
  appearance: SETTINGS_PAGE_APPEARANCE_I18N.appearance,
  language: SETTINGS_PAGE_APPEARANCE_I18N.localization,
  notifications: SETTINGS_PAGE_GENERAL_I18N.notifications,
  devices: SETTINGS_PAGE_GENERAL_I18N.devices,
  storage: SETTINGS_PAGE_STORAGE_I18N.storage,
  faq: SETTINGS_PAGE_FAQ_I18N.faq,
  roadmap: SETTINGS_PAGE_ROADMAP_I18N.roadmap
} as const

export const SETTINGS_CONTENT_COMPONENTS = {
  account: SettingsAccountContent,
  appearance: SettingsAppearanceContent,
  language: SettingsLanguageContent,
  notifications: SettingsNotificationsContent,
  devices: SettingsDevicesContent,
  storage: SettingsStorageContent,
  faq: SettingsFaqContent,
  roadmap: SettingsRoadmapContent
} as const
