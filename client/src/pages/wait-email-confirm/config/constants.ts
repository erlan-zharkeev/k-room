import { ROUTE_NAMES } from 'global-shared'

import { WAIT_EMAIL_CONFIRM_I18N } from './i18n'

export const WAIT_EMAIL_CONFIRM_COUNTER_TICK_MS = 1000

export const WAIT_EMAIL_CONFIRM_PAGE_LAYOUT_PROPS = {
  fallbackRoute: ROUTE_NAMES.authLogin,
  title: WAIT_EMAIL_CONFIRM_I18N.title
} as const
