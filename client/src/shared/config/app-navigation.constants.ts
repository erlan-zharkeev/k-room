import {
  NmorphIconPhoneFilled,
  NmorphIconChatLineSquare,
  NmorphIconSetting,
  NmorphIconBellFilled,
  NmorphIconUsers
} from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'

import { APP_NAVIGATION_I18N } from './app-navigation.i18n'

export const APP_PAGE_ROUTES = {
  chatRooms: `${ROUTE_NAMES.app}/chat-rooms`,
  calls: `${ROUTE_NAMES.app}/calls`,
  contacts: `${ROUTE_NAMES.app}/contacts`,
  infoNotifications: `${ROUTE_NAMES.app}/info-notifications`,
  settings: `${ROUTE_NAMES.app}/settings`,
  settingsItem: `${ROUTE_NAMES.app}/settings/:settingsId`
} as const

export const APP_PAGE_NAV_ITEMS = [
  {
    id: 'chat-rooms',
    path: APP_PAGE_ROUTES.chatRooms,
    label: APP_NAVIGATION_I18N.chatRooms,
    icon: NmorphIconChatLineSquare
  },
  {
    id: 'calls',
    path: APP_PAGE_ROUTES.calls,
    label: APP_NAVIGATION_I18N.calls,
    icon: NmorphIconPhoneFilled
  },
  {
    id: 'contacts',
    path: APP_PAGE_ROUTES.contacts,
    label: APP_NAVIGATION_I18N.contacts,
    icon: NmorphIconUsers
  },
  {
    id: 'info-notifications',
    path: APP_PAGE_ROUTES.infoNotifications,
    label: APP_NAVIGATION_I18N.info,
    icon: NmorphIconBellFilled
  },
  {
    id: 'settings',
    path: APP_PAGE_ROUTES.settings,
    label: APP_NAVIGATION_I18N.settings,
    icon: NmorphIconSetting
  }
] as const
