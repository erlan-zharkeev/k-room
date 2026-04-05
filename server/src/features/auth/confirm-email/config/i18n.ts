import { defineI18n } from 'common'

export const CONFIRM_EMAIL_I18N = defineI18n({
  failedEmailConfirm: {
    en: 'Email confirmation failed',
    ru: 'Не удалось подтвердить email'
  },
  emailConfirmed: {
    en: 'Email has been confirmed',
    ru: 'Email подтверждён'
  },
  emailAlreadyConfirmed: {
    en: 'Email already confirmed',
    ru: 'Email уже подтверждён'
  }
})
