import { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS } from '../auth/constants'
import { defineI18n } from '../language/lib'

import type { ValidationI18n } from './types'

export const VALIDATION_I18N = defineI18n({
  fieldIsRequired: {
    en: 'Field is required',
    ru: 'Поле обязательно',
    zh: '字段为必填项'
  },
  emailIsRequired: {
    en: 'Email is required',
    ru: 'Требуется email',
    zh: '需要填写 email'
  },
  passwordIsRequired: {
    en: 'Password is required',
    ru: 'Требуется пароль',
    zh: '需要填写密码'
  },
  invalidEmailFormat: {
    en: 'Invalid email format',
    ru: 'Неверный формат email',
    zh: 'Email 格式不正确'
  },
  passwordMustBeAtLeast: {
    en: `Password must be at least ${VALIDATION_LIMITS.passwordMinLength} characters long`,
    ru: `Пароль должен содержать минимум ${VALIDATION_LIMITS.passwordMinLength} символов`,
    zh: `密码长度至少为 ${VALIDATION_LIMITS.passwordMinLength} 个字符`
  },
  passwordMustBeStrong: {
    en: `Password must contain at least one letter, one number, and may include ${PASSWORD_SPECIAL_CHARACTERS} characters.`,
    ru: `Пароль должен содержать хотя бы одну букву, одну цифру и может включать символы ${PASSWORD_SPECIAL_CHARACTERS}.`,
    zh: `密码必须至少包含一个字母和一个数字，可包含 ${PASSWORD_SPECIAL_CHARACTERS} 字符。`
  },
  passwordNotContainSpaces: {
    en: 'Password must not contain spaces',
    ru: 'Пароль не должен содержать пробелы',
    zh: '密码不能包含空格'
  },
  passwordMustContainOnlyLatin: {
    en: 'Password must contain only Latin characters',
    ru: 'Пароль должен содержать только латинские символы',
    zh: '密码只能包含拉丁字符'
  },
  nicknameInvalidFormat: {
    en: 'Nickname can contain only lowercase Latin letters, numbers, and single ., -, _ separators',
    ru: 'Никнейм может содержать только строчные латинские буквы, цифры и одиночные разделители ., -, _',
    zh: '昵称只能包含小写拉丁字母、数字以及单个 ., -, _ 分隔符'
  },
  nicknameTooLong: {
    en: 'Nickname is too long',
    ru: 'Никнейм слишком длинный',
    zh: '昵称过长'
  },
  nicknameTooShort: {
    en: 'Nickname is too short',
    ru: 'Никнейм слишком короткий',
    zh: '昵称过短'
  },
  invalidProvider: {
    en: 'Invalid provider',
    ru: 'Неверный провайдер',
    zh: '提供商无效'
  }
} satisfies ValidationI18n)
