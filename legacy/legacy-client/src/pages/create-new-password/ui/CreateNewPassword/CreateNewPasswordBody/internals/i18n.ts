import { defineI18n } from 'common'

export const CREATE_NEW_PASSWORD_BODY_I18N = defineI18n({
  success: {
    en: 'Password changed successfully!',
    ru: 'Пароль успешно изменён!'
  },
  toLogin: {
    en: 'Go to login page',
    ru: 'Перейти ко входу'
  },
  title: {
    en: 'Create new password',
    ru: 'Создание нового пароля'
  },
  firstPasswordPlaceholder: {
    en: 'Password',
    ru: 'Пароль'
  },
  secondPasswordPlaceholder: {
    en: 'Confirm password',
    ru: 'Подтвердите пароль'
  },
  submit: {
    en: 'Change password',
    ru: 'Изменить пароль'
  },
  mismatch: {
    en: "Passwords don't match",
    ru: 'Пароли не совпадают'
  }
})
