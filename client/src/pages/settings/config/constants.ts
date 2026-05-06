import { NmorphIconMoon, NmorphIconSunny } from '@nmorph/nmorph-ui-kit'
import {
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP,
  MEDIA_MB_IN_BYTES,
  MEDIA_UPLOAD_TYPE_LABEL_MAP,
  MEDIA_VALIDATION_OPTIONS_MAP,
  VALIDATION_PATTERNS
} from 'global-shared'

import { MAIN_PAGE_ROUTES } from 'src/shared/config'

import SettingsAccountContent from '../ui/content/SettingsAccountContent.vue'
import SettingsDevicesContent from '../ui/content/SettingsDevicesContent.vue'
import SettingsFaqContent from '../ui/content/SettingsFaqContent.vue'
import SettingsLanguageContent from '../ui/content/SettingsLanguageContent.vue'
import SettingsNotificationsContent from '../ui/content/SettingsNotificationsContent.vue'
import SettingsSoundContent from '../ui/content/SettingsSoundContent.vue'
import SettingsStorageContent from '../ui/content/SettingsStorageContent.vue'
import SettingsThemeContent from '../ui/content/theme/SettingsThemeContent.vue'

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

export const SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES =
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP[settingsAccountAvatarValidation.supportedKindMediaType]
export const SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES_LABEL = SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES.map(
  (type) => MEDIA_UPLOAD_TYPE_LABEL_MAP[type]
).join(', ')
export const SETTINGS_ACCOUNT_AVATAR_MAX_MB = settingsAccountAvatarValidation.maxMb
export const SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE = settingsAccountAvatarValidation.maxMb * MEDIA_MB_IN_BYTES
export const SETTINGS_EMAIL_PATTERN = new RegExp(VALIDATION_PATTERNS.email)
export const SETTINGS_WALLPAPER_ALLOWED_TYPES =
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP[settingsWallpaperValidation.supportedKindMediaType]
export const SETTINGS_WALLPAPER_MAX_FILE_SIZE = settingsWallpaperValidation.maxMb * MEDIA_MB_IN_BYTES
export const SETTINGS_WALLPAPER_VISIBILITY_OPTIONS = [
  { value: 'show', label: SETTINGS_PAGE_APPEARANCE_I18N.show },
  { value: 'hide', label: SETTINGS_PAGE_APPEARANCE_I18N.hide }
]
export const SETTINGS_WALLPAPER_FIT_OPTIONS = [
  { value: 'cover', label: SETTINGS_PAGE_APPEARANCE_I18N.cover },
  { value: 'contain', label: SETTINGS_PAGE_APPEARANCE_I18N.contain }
]
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

export const THEME_SETTINGS_RESET_THEME_OPTIONS = [
  {
    icon: NmorphIconSunny,
    label: SETTINGS_PAGE_APPEARANCE_I18N.lightTheme,
    value: 'light'
  },
  {
    icon: NmorphIconMoon,
    label: SETTINGS_PAGE_APPEARANCE_I18N.darkTheme,
    value: 'dark'
  }
] as const

export const THEME_SETTINGS_COLOR_GROUPS = [
  {
    id: 'base',
    items: [
      {
        id: 'main',
        label: SETTINGS_PAGE_APPEARANCE_I18N.main
      },
      {
        id: 'accent',
        label: SETTINGS_PAGE_APPEARANCE_I18N.accent
      }
    ]
  },
  {
    id: 'text',
    items: [
      {
        id: 'text',
        label: SETTINGS_PAGE_APPEARANCE_I18N.text
      },
      {
        id: 'focusText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.focusText
      },
      {
        id: 'contrastText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.contrastText
      },
      {
        id: 'placeholderText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.placeholderText
      },
      {
        id: 'semiContrastText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.semiContrastText
      }
    ]
  },
  {
    id: 'service',
    items: [
      {
        id: 'info',
        label: SETTINGS_PAGE_APPEARANCE_I18N.info
      },
      {
        id: 'infoText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.infoText
      },
      {
        id: 'success',
        label: SETTINGS_PAGE_APPEARANCE_I18N.success
      },
      {
        id: 'successText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.successText
      },
      {
        id: 'error',
        label: SETTINGS_PAGE_APPEARANCE_I18N.error
      },
      {
        id: 'errorText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.errorText
      },
      {
        id: 'warn',
        label: SETTINGS_PAGE_APPEARANCE_I18N.warn
      },
      {
        id: 'warnText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.warnText
      }
    ]
  },
  {
    id: 'overlay',
    items: [
      {
        id: 'overlay',
        label: SETTINGS_PAGE_APPEARANCE_I18N.overlay
      },
      {
        id: 'scrollThumb',
        label: SETTINGS_PAGE_APPEARANCE_I18N.scrollThumb
      }
    ]
  }
] as const

export const THEME_SETTINGS_SHADOW_ITEMS = [
  {
    id: 'darkShadeGeneratorCoefficient',
    label: SETTINGS_PAGE_APPEARANCE_I18N.darkShadeGeneratorCoefficient,
    min: -80,
    max: -5,
    step: 1,
    unit: ''
  },
  {
    id: 'lightShadeGeneratorCoefficient',
    label: SETTINGS_PAGE_APPEARANCE_I18N.lightShadeGeneratorCoefficient,
    min: 5,
    max: 80,
    step: 1,
    unit: ''
  },
  {
    id: 'baseShadowWidth',
    label: SETTINGS_PAGE_APPEARANCE_I18N.baseShadowWidth,
    min: 1,
    max: 8,
    step: 0.5,
    unit: 'px'
  },
  {
    id: 'baseShadowBlurCoefficient',
    label: SETTINGS_PAGE_APPEARANCE_I18N.baseShadowBlurCoefficient,
    min: 1,
    max: 4,
    step: 0.25,
    unit: ''
  }
] as const
