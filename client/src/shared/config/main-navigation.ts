import {
  NmorphIconPhoneFilled,
  NmorphIconChatLineSquare,
  NmorphIconSetting,
  NmorphIconBellFilled,
  NmorphIconUsers
} from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES, defineI18n } from 'global-shared'

const MAIN_NAVIGATION_I18N = defineI18n({
  chatRooms: {
    en: 'Chats',
    ru: 'Чаты',
    zh: '聊天'
  },
  calls: {
    en: 'Calls',
    ru: 'Звонки',
    zh: '通话'
  },
  contacts: {
    en: 'Contacts',
    ru: 'Контакты',
    zh: '联系人'
  },
  info: {
    en: 'Events',
    ru: 'События',
    zh: '事件'
  },
  settings: {
    en: 'Settings',
    ru: 'Настройки',
    zh: '设置'
  }
})

export const MAIN_PAGE_ROUTES = {
  chatRooms: `${ROUTE_NAMES.app}/chat-rooms`,
  calls: `${ROUTE_NAMES.app}/calls`,
  contacts: `${ROUTE_NAMES.app}/contacts`,
  infoNotifications: `${ROUTE_NAMES.app}/info-notifications`,
  settings: `${ROUTE_NAMES.app}/settings`,
  settingsItem: `${ROUTE_NAMES.app}/settings/:settingsId`
} as const

export const MAIN_PAGE_NAV_ITEMS = [
  {
    id: 'chat-rooms',
    path: MAIN_PAGE_ROUTES.chatRooms,
    label: MAIN_NAVIGATION_I18N.chatRooms,
    icon: NmorphIconChatLineSquare
  },
  {
    id: 'calls',
    path: MAIN_PAGE_ROUTES.calls,
    label: MAIN_NAVIGATION_I18N.calls,
    icon: NmorphIconPhoneFilled
  },
  {
    id: 'contacts',
    path: MAIN_PAGE_ROUTES.contacts,
    label: MAIN_NAVIGATION_I18N.contacts,
    icon: NmorphIconUsers
  },
  {
    id: 'info-notifications',
    path: MAIN_PAGE_ROUTES.infoNotifications,
    label: MAIN_NAVIGATION_I18N.info,
    icon: NmorphIconBellFilled
  },
  {
    id: 'settings',
    path: MAIN_PAGE_ROUTES.settings,
    label: MAIN_NAVIGATION_I18N.settings,
    icon: NmorphIconSetting
  }
] as const
