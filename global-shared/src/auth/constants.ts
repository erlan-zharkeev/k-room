import { USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH } from '../user/constants'

export const VALIDATION_LIMITS = {
  passwordMinLength: 6,
  nicknameMinLength: USER_NICKNAME_MIN_LENGTH,
  nicknameMaxLength: USER_NICKNAME_MAX_LENGTH
}

export const PASSWORD_SPECIAL_CHARACTERS = '@$!%*?&'

export const VALIDATION_PATTERNS = {
  email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  nickname: '^[a-z0-9]+(?:[._-][a-z0-9]+)*$',
  passwordStrong: `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d${PASSWORD_SPECIAL_CHARACTERS}]{${VALIDATION_LIMITS.passwordMinLength},}$`,
  noSpaces: '\\S+',
  onlyLatin: '^[\\x00-\\x7F]+$'
}
