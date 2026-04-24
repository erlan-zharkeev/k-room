import { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS, defineI18n } from 'global-shared'

export const FORM_VALIDATION_I18N = defineI18n({
  fieldIsRequired: {
    en: 'Field is required',
    ru: 'Поле обязательно'
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
  passwordMustBeAtLeast: {
    en: `Password must be at least ${VALIDATION_LIMITS.passwordMinLength} characters long`,
    ru: `Пароль должен содержать минимум ${VALIDATION_LIMITS.passwordMinLength} символов`
  },
  passwordMustBeStrong: {
    en: `Password must contain at least one letter, one number, and may include ${PASSWORD_SPECIAL_CHARACTERS} characters.`,
    ru: `Пароль должен содержать хотя бы одну букву, одну цифру и может включать символы ${PASSWORD_SPECIAL_CHARACTERS}.`
  },
  usernameTooLong: {
    en: 'Username is too long',
    ru: 'Имя пользователя слишком длинное'
  },
  usernameTooShort: {
    en: 'Username is too short',
    ru: 'Имя пользователя слишком короткое'
  }
})
