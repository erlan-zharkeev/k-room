import { type LocalizedTextMapType } from 'common'

export const I18N_CONFIRM_EMAIL_MESSAGE = {
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
