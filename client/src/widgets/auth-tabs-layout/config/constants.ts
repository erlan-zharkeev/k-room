import { ROUTE_NAMES } from 'global-shared'

import { AUTH_TABS_LAYOUT_I18N } from './i18n'

export const AUTH_TABS = [
  {
    label: AUTH_TABS_LAYOUT_I18N.login,
    path: ROUTE_NAMES.login
  },
  {
    label: AUTH_TABS_LAYOUT_I18N.registration,
    path: ROUTE_NAMES.registration
  }
] as const
