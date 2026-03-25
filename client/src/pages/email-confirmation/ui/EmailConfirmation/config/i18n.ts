import { type LocalizedTextType } from 'common-types'

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
} as const satisfies Record<string, LocalizedTextType>
