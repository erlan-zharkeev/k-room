import { type LocalizedTextMapType } from 'common'

export const CONFIRM_EMAIL_I18N = {
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
} as const satisfies LocalizedTextMapType
