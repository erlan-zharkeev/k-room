import { ROUTE_NAMES, VALIDATION_PATTERNS } from 'global-shared'

import { PASSWORD_RECOVERY_I18N } from './i18n'

export const DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA = {
  email: ''
}

export const DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA = {
  code: ''
}

export const EMAIL_PATTERN = new RegExp(VALIDATION_PATTERNS.email)

export const PASSWORD_RECOVERY_COUNTER_TICK_MS = 1000

export const PASSWORD_RECOVERY_PAGE_LAYOUT_PROPS = {
  fallbackRoute: ROUTE_NAMES.authLogin,
  title: PASSWORD_RECOVERY_I18N.title
} as const
