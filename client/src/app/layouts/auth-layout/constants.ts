import { ROUTE_NAMES } from 'global-shared'

import { AUTH_LAYOUT_I18N } from './i18n'

export const AUTH_LAYOUT_TABS = [
  {
    label: AUTH_LAYOUT_I18N.login,
    path: ROUTE_NAMES.authLogin
  },
  {
    label: AUTH_LAYOUT_I18N.registration,
    path: ROUTE_NAMES.authRegistration
  }
] as const
