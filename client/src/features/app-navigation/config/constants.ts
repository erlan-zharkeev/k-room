import {
  NmorphIconPhoneFilled,
  NmorphIconChatLineSquare,
  NmorphIconSetting,
  NmorphIconUsers
} from '@nmorph/nmorph-ui-kit'
import { APP_ROUTE_PATHS } from 'global-shared'

import { APP_NAVIGATION_I18N } from './i18n'

export const APP_PAGE_ROUTES = {
  chatRooms: APP_ROUTE_PATHS.chatRooms,
  calls: APP_ROUTE_PATHS.calls,
  contacts: APP_ROUTE_PATHS.contacts,
  settings: APP_ROUTE_PATHS.settings,
  settingsItem: `${APP_ROUTE_PATHS.settings}/:settingsId`
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
    id: 'settings',
    path: APP_PAGE_ROUTES.settings,
    label: APP_NAVIGATION_I18N.settings,
    icon: NmorphIconSetting
  }
] as const
