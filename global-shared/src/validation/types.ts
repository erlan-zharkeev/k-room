import type { LocalizedTextType } from '../language/types'

export type ValidationI18nType = {
  fieldIsRequired: LocalizedTextType
  emailIsRequired: LocalizedTextType
  passwordIsRequired: LocalizedTextType
  invalidEmailFormat: LocalizedTextType
  passwordMustBeAtLeast: LocalizedTextType
  passwordMustBeStrong: LocalizedTextType
  passwordNotContainSpaces: LocalizedTextType
  passwordMustContainOnlyLatin: LocalizedTextType
  nicknameInvalidFormat: LocalizedTextType
  nicknameTooLong: LocalizedTextType
  nicknameTooShort: LocalizedTextType
  invalidProvider: LocalizedTextType
}

export type ValidationMessagesType = Record<keyof ValidationI18nType, string>
