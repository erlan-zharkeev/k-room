export const VALIDATION_LIMITS = {
  passwordMinLength: 6,
  nicknameMinLength: 2,
  nicknameMaxLength: 32
}

export const PASSWORD_SPECIAL_CHARACTERS = '@$!%*?&'

export const VALIDATION_PATTERNS = {
  email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  nickname: '^[a-z0-9]+(?:[._-][a-z0-9]+)*$',
  passwordStrong: `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d${PASSWORD_SPECIAL_CHARACTERS}]{${VALIDATION_LIMITS.passwordMinLength},}$`,
  noSpaces: '\\S+',
  onlyLatin: '^[\\x00-\\x7F]+$'
}
