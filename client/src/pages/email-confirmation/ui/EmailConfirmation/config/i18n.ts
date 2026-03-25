import { type LocalizedTextMapType } from 'common'

export const EMAIL_CONFIRMATION_TEXT = {
  title: {
    en: 'Congratulations',
    ru: 'Готово'
  },
  confirmed: {
    en: 'confirmed',
    ru: 'подтверждён'
  },
  email: {
    en: 'Email',
    ru: 'Email'
  },
  back: {
    en: 'Back',
    ru: 'Назад'
  }
} as const satisfies LocalizedTextMapType
