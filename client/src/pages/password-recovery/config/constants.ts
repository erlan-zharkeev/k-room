import { SECOND_IN_MS, VALIDATION_PATTERNS } from 'global-shared'

export const DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA = {
  email: ''
}

export const DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA = {
  code: ''
}

export const EMAIL_PATTERN = new RegExp(VALIDATION_PATTERNS.email)

export const PASSWORD_RECOVERY_COUNTER_TICK_MS = 1 * SECOND_IN_MS
