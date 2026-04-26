import { ROUTE_NAMES } from 'global-shared'

import { ERROR_PAGE_I18N } from './i18n'

export const ERROR_PAGE_LAYOUT_PROPS = {
  fallbackRoute: ROUTE_NAMES.app,
  title: ERROR_PAGE_I18N.title
} as const
