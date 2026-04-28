import { ROUTE_NAMES } from 'global-shared'

import { I18N } from './i18n'

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
    label: I18N.chatRooms,
    icon: 'pi pi-comments'
  },
  {
    id: 'calls',
    path: MAIN_PAGE_ROUTES.calls,
    label: I18N.calls,
    icon: 'pi pi-phone'
  },
  {
    id: 'contacts',
    path: MAIN_PAGE_ROUTES.contacts,
    label: I18N.contacts,
    icon: 'pi pi-users'
  },
  {
    id: 'info-notifications',
    path: MAIN_PAGE_ROUTES.infoNotifications,
    label: I18N.info,
    icon: 'pi pi-bell'
  },
  {
    id: 'settings',
    path: MAIN_PAGE_ROUTES.settings,
    label: I18N.settings,
    icon: 'pi pi-cog'
  }
]
