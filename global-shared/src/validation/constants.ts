import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../auth/constants'

export const NON_EMPTY_PATTERN = /^(?!\s*$).+/
export const EMAIL_PATTERN = new RegExp(VALIDATION_PATTERNS.email)
export const NICKNAME_PATTERN = new RegExp(VALIDATION_PATTERNS.nickname)
export const NICKNAME_MIN_LENGTH_PATTERN = new RegExp(`^.{${VALIDATION_LIMITS.nicknameMinLength},}$`)
export const NICKNAME_MAX_LENGTH_PATTERN = new RegExp(`^.{0,${VALIDATION_LIMITS.nicknameMaxLength}}$`)
export const PASSWORD_MIN_LENGTH_PATTERN = new RegExp(`^.{${VALIDATION_LIMITS.passwordMinLength},}$`)
export const PASSWORD_STRONG_PATTERN = new RegExp(VALIDATION_PATTERNS.passwordStrong)
export const PASSWORD_NO_SPACES_PATTERN = new RegExp(`^${VALIDATION_PATTERNS.noSpaces}$`)
export const PASSWORD_ONLY_LATIN_PATTERN = new RegExp(VALIDATION_PATTERNS.onlyLatin)
