import { APP_LANGUAGE, ROUTE_NAMES } from 'global-shared'

import { DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from 'src/shared/assets'
import type { AppIconNameType } from 'src/shared/ui'

import { MAIN_PAGE_I18N } from './main-page-i18n'

export const MAIN_PAGE_ROUTES = {
  chatRooms: `${ROUTE_NAMES.app}/chat-rooms`,
  calls: `${ROUTE_NAMES.app}/calls`,
  contacts: `${ROUTE_NAMES.app}/contacts`,
  infoNotifications: `${ROUTE_NAMES.app}/info-notifications`,
  settings: `${ROUTE_NAMES.app}/settings`,
  settingsItem: `${ROUTE_NAMES.app}/settings/:settingsId`
} as const

export const getMainPageSettingsPath = (settingsId: string) => `${MAIN_PAGE_ROUTES.settings}/${settingsId}`

export const MAIN_PAGE_NAV_ITEMS = [
  {
    id: 'chatRooms',
    path: MAIN_PAGE_ROUTES.chatRooms,
    label: MAIN_PAGE_I18N.chatRooms,
    icon: 'chat'
  },
  {
    id: 'calls',
    path: MAIN_PAGE_ROUTES.calls,
    label: MAIN_PAGE_I18N.calls,
    icon: 'phone'
  },
  {
    id: 'contacts',
    path: MAIN_PAGE_ROUTES.contacts,
    label: MAIN_PAGE_I18N.contacts,
    icon: 'contacts'
  },
  {
    id: 'infoNotifications',
    path: MAIN_PAGE_ROUTES.infoNotifications,
    label: MAIN_PAGE_I18N.info,
    icon: 'notification',
    badge: 3
  },
  {
    id: 'settings',
    path: MAIN_PAGE_ROUTES.settings,
    label: MAIN_PAGE_I18N.settings,
    icon: 'settings'
  }
] satisfies Array<{
  id: string
  path: string
  label: (typeof MAIN_PAGE_I18N)[keyof typeof MAIN_PAGE_I18N]
  icon: AppIconNameType
  badge?: number
}>

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
    icon: 'reply'
  },
  {
    id: 'forward',
    label: MAIN_PAGE_I18N.forwardMessage,
    icon: 'forward'
  },
  {
    id: 'delete',
    label: MAIN_PAGE_I18N.deleteMessage,
    icon: 'trash'
  }
] as const satisfies ReadonlyArray<{
  id: string
  label: (typeof MAIN_PAGE_I18N)[keyof typeof MAIN_PAGE_I18N]
  icon: AppIconNameType
}>

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
    label: MAIN_PAGE_I18N.showWallpaper,
    description: MAIN_PAGE_I18N.showWallpaper
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
    label: MAIN_PAGE_I18N.askQuestion,
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
