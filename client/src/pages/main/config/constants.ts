import { APP_LANGUAGE } from 'global-shared'

import { DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from 'src/shared/assets'
import { MAIN_PAGE_ROUTES } from 'src/shared/config'

import { MAIN_PAGE_I18N } from './i18n'

export const ROOM_MESSAGES_PAGE_LIMIT = 30
export const CONTACT_ONLINE_CHECK_INTERVAL_MS = 10_000
export const CONTACT_ONLINE_STATUS_TTL_MS = 30_000

export const getMainPageSettingsPath = (settingsId: string) => `${MAIN_PAGE_ROUTES.settings}/${settingsId}`

export const MAIN_PAGE_CONTACT_SEARCH_DEBOUNCE_MS = 300

export const MESSAGE_VIRTUAL_ITEM_ESTIMATED_SIZE_PX = 74

export const MESSAGE_VIRTUAL_LIST_OVERSCAN = 12

export const MESSAGE_READ_VISIBILITY_THRESHOLD = 0.65

export const MESSAGE_SCROLL_SAVE_DEBOUNCE_MS = 250

export const MESSAGE_LOAD_MORE_SCROLL_TOP_PX = 48

export const MESSAGE_SCROLL_BOTTOM_THRESHOLD_PX = 72

export const MESSAGE_CONTEXT_MENU_WIDTH_PX = 340

export const MESSAGE_CONTEXT_MENU_HEIGHT_PX = 520

export const MESSAGE_CONTEXT_MENU_VIEWPORT_MARGIN_PX = 12

export const MAIN_PAGE_MESSAGE_ACTIONS = [
  {
    id: 'reply',
    label: MAIN_PAGE_I18N.replyMessage,
    icon: 'pi pi-reply'
  },
  {
    id: 'forward',
    label: MAIN_PAGE_I18N.forwardMessage,
    icon: 'pi pi-arrow-up'
  },
  {
    id: 'delete',
    label: MAIN_PAGE_I18N.deleteMessage,
    icon: 'pi pi-times',
    severity: 'danger'
  }
]

export const MAIN_PAGE_LANGUAGE_OPTIONS = [
  {
    label: 'English',
    value: APP_LANGUAGE.En
  },
  {
    label: 'Русский',
    value: APP_LANGUAGE.Ru
  },
  {
    label: '中文',
    value: APP_LANGUAGE.Zh
  }
]

export const MAIN_PAGE_SETTINGS_ITEMS = [
  {
    id: 'account',
    label: MAIN_PAGE_I18N.account,
    description: MAIN_PAGE_I18N.accountDescription
  },
  {
    id: 'theme',
    label: MAIN_PAGE_I18N.theme,
    description: MAIN_PAGE_I18N.brandTheme
  },
  {
    id: 'language',
    label: MAIN_PAGE_I18N.language,
    description: MAIN_PAGE_I18N.language
  },
  {
    id: 'wallpaper',
    label: MAIN_PAGE_I18N.wallpaper,
    description: MAIN_PAGE_I18N.wallpaperEnabled
  },
  {
    id: 'notifications',
    label: MAIN_PAGE_I18N.notifications,
    description: MAIN_PAGE_I18N.notificationsDescription
  },
  {
    id: 'sound',
    label: MAIN_PAGE_I18N.sound,
    description: MAIN_PAGE_I18N.sound
  },
  {
    id: 'devices',
    label: MAIN_PAGE_I18N.devices,
    description: MAIN_PAGE_I18N.devices
  },
  {
    id: 'storage',
    label: MAIN_PAGE_I18N.storage,
    description: MAIN_PAGE_I18N.storageDescription
  },
  {
    id: 'faq',
    label: MAIN_PAGE_I18N.faq,
    description: MAIN_PAGE_I18N.faqDescription
  },
  {
    id: 'question',
    label: MAIN_PAGE_I18N.question,
    description: MAIN_PAGE_I18N.askQuestionDescription
  }
] as const

export const MAIN_PAGE_WALLPAPER_ITEMS = [
  {
    id: 'default',
    label: MAIN_PAGE_I18N.defaultWallpaper,
    darkSrc: DEFAULT_DARK_WALLPAPER,
    lightSrc: DEFAULT_LIGHT_WALLPAPER
  }
] as const

export const MAIN_PAGE_SOUND_ITEMS = [
  {
    id: 'connection',
    label: MAIN_PAGE_I18N.connectionSound,
    src: '/sounds/connection.mp3'
  },
  {
    id: 'calling',
    label: MAIN_PAGE_I18N.callingSound,
    src: '/sounds/calling.mp3'
  },
  {
    id: 'income-message',
    label: MAIN_PAGE_I18N.incomeMessageSound,
    src: '/sounds/income-message.mp3'
  },
  {
    id: 'ring',
    label: MAIN_PAGE_I18N.ringSound,
    src: '/sounds/ring.mp3'
  },
  {
    id: 'busy',
    label: MAIN_PAGE_I18N.busySound,
    src: '/sounds/busy.mp3'
  }
] as const
