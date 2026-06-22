import {
  NON_EMPTY_PATTERN,
  PASSWORD_MIN_LENGTH_PATTERN,
  PASSWORD_NO_SPACES_PATTERN,
  PASSWORD_ONLY_LATIN_PATTERN,
  PASSWORD_STRONG_PATTERN,
  type ValidationMessages
} from 'global-shared'

export const createPasswordValidationRules = (validationMessages: ValidationMessages) => [
  { pattern: NON_EMPTY_PATTERN, error: validationMessages.passwordIsRequired },
  { pattern: PASSWORD_MIN_LENGTH_PATTERN, error: validationMessages.passwordMustBeAtLeast },
  { pattern: PASSWORD_STRONG_PATTERN, error: validationMessages.passwordMustBeStrong },
  { pattern: PASSWORD_NO_SPACES_PATTERN, error: validationMessages.passwordNotContainSpaces },
  { pattern: PASSWORD_ONLY_LATIN_PATTERN, error: validationMessages.passwordMustContainOnlyLatin }
]

const escapeRegExpValue = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const createExactOrEmptyValidationPattern = (value: string) => {
  if (!value) return /^.*$/

  return new RegExp(`^(?:${escapeRegExpValue(value)})?$`)
}

export const createDifferentOrEmptyValidationPattern = (value: string, flags = '') => {
  if (!value) return /^.*$/

  return new RegExp(`^(?!${escapeRegExpValue(value)}$).*`, flags)
}
