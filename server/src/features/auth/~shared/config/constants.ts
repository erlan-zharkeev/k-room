import { VALIDATION_LIMITS } from 'common-types'
import { type LocalizedTextType } from 'common-types'

export const AUTH_MESSAGE = {
  nonAuthorized: {
    en: 'User not authorized',
    ru: 'Пользователь не авторизован'
  },
  usernameRequired: {
    en: 'Username is required',
    ru: 'Требуется имя пользователя'
  },
  passwordMustBeAtLeast: {
    en: `Password must be at least ${VALIDATION_LIMITS.passwordMinLength} characters long`,
    ru: `Пароль должен содержать минимум ${VALIDATION_LIMITS.passwordMinLength} символов`
  },
  passwordMustBeStrong: {
    en: 'Password must contain at least one letter, one number, and may include @$!%*?& characters.',
    ru: 'Пароль должен содержать хотя бы одну букву, одну цифру и может включать символы @$!%*?&.'
  },
  passwordNotContainSpaces: {
    en: 'Password must not contain spaces',
    ru: 'Пароль не должен содержать пробелы'
  },
  passwordMustContainOnlyLatin: {
    en: 'Password must contain only Latin characters',
    ru: 'Пароль должен содержать только латинские символы'
  },
  emailIsRequired: {
    en: 'Email is required',
    ru: 'Требуется email'
  },
  passwordIsRequired: {
    en: 'Password is required',
    ru: 'Требуется пароль'
  },
  invalidEmailFormat: {
    en: 'Invalid email format',
    ru: 'Неверный формат email'
  },
  fieldIsRequired: {
    en: 'Field is required',
    ru: 'Поле обязательно'
  },
  invalidProvider: {
    en: 'Invalid provider',
    ru: 'Неверный провайдер'
  },
  atLeastOneRequired: {
    en: 'Require at least one field',
    ru: 'Нужно заполнить хотя бы одно поле'
  },
  usernameIsRequired: {
    en: 'Username is required',
    ru: 'Требуется имя пользователя'
  },
  usernameTooLong: {
    en: 'Username is too long',
    ru: 'Имя пользователя слишком длинное'
  },
  usernameTooShort: {
    en: 'Username is too short',
    ru: 'Имя пользователя слишком короткое'
  },
  invalidId: {
    en: 'Invalid id',
    ru: 'Неверный id'
  }
} as const satisfies Record<string, LocalizedTextType>
