export const VALIDATION_LIMITS = {
  passwordMinLength: 6,
  usernameMinLength: 2,
  usernameMaxLength: 32
}

export const VALIDATION_PATTERNS = {
  passwordStrong: `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{${VALIDATION_LIMITS.passwordMinLength},}$`,
  noSpaces: '\\S+',
  onlyLatin: '^[\\x00-\\x7F]+$'
}
