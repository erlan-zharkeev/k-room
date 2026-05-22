import type { LocalizedText } from '../language/types'

export type ValidationI18n = {
  fieldIsRequired: LocalizedText
  emailIsRequired: LocalizedText
  passwordIsRequired: LocalizedText
  invalidEmailFormat: LocalizedText
  passwordMustBeAtLeast: LocalizedText
  passwordMustBeStrong: LocalizedText
  passwordNotContainSpaces: LocalizedText
  passwordMustContainOnlyLatin: LocalizedText
  nicknameInvalidFormat: LocalizedText
  nicknameTooLong: LocalizedText
  nicknameTooShort: LocalizedText
  invalidProvider: LocalizedText
}

export type ValidationMessages = Record<keyof ValidationI18n, string>
