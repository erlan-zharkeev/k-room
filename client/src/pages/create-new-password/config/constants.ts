import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from 'global-shared'

export const DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA = {
  firstPassword: '',
  secondPassword: ''
}

export const PASSWORD_MIN_LENGTH_PATTERN = new RegExp(`^.{${VALIDATION_LIMITS.passwordMinLength},}$`)
export const PASSWORD_STRONG_PATTERN = new RegExp(VALIDATION_PATTERNS.passwordStrong)
export const PASSWORD_NO_SPACES_PATTERN = new RegExp(`^${VALIDATION_PATTERNS.noSpaces}$`)
export const PASSWORD_ONLY_LATIN_PATTERN = new RegExp(VALIDATION_PATTERNS.onlyLatin)
