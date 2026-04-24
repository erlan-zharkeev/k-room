import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from 'global-shared'

export const REGISTRATION_FORM_RULES = {
  username: {
    required: true,
    minlength: VALIDATION_LIMITS.usernameMinLength,
    maxlength: VALIDATION_LIMITS.usernameMaxLength
  },
  email: {
    required: true
  },
  password: {
    required: true,
    minlength: VALIDATION_LIMITS.passwordMinLength,
    pattern: VALIDATION_PATTERNS.passwordStrong
  },
  policy: {
    required: true
  }
} as const
