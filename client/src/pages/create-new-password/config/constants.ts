import { ROUTE_NAMES, VALIDATION_LIMITS, VALIDATION_PATTERNS } from 'global-shared'

import { CREATE_NEW_PASSWORD_I18N } from './i18n'

export const DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA = {
  firstPassword: '',
  secondPassword: ''
}

export const PASSWORD_MIN_LENGTH_PATTERN = new RegExp(`^.{${VALIDATION_LIMITS.passwordMinLength},}$`)
export const PASSWORD_STRONG_PATTERN = new RegExp(VALIDATION_PATTERNS.passwordStrong)
export const PASSWORD_NO_SPACES_PATTERN = new RegExp(`^${VALIDATION_PATTERNS.noSpaces}$`)
export const PASSWORD_ONLY_LATIN_PATTERN = new RegExp(VALIDATION_PATTERNS.onlyLatin)

export const CREATE_NEW_PASSWORD_PAGE_LAYOUT_PROPS = {
  fallbackRoute: ROUTE_NAMES.authLogin,
  title: CREATE_NEW_PASSWORD_I18N.title
} as const
