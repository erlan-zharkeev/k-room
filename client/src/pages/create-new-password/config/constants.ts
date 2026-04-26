import { ROUTE_NAMES } from 'global-shared'

import { CREATE_NEW_PASSWORD_I18N } from './i18n'

export const DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA = {
  firstPassword: '',
  secondPassword: ''
}

export const CREATE_NEW_PASSWORD_PAGE_LAYOUT_PROPS = {
  fallbackRoute: ROUTE_NAMES.authLogin,
  title: CREATE_NEW_PASSWORD_I18N.title
} as const
