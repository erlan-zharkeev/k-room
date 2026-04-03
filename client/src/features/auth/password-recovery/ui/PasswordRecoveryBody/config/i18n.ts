import { LocalizedTextMapType } from 'common'

export const PASSWORD_RECOVERY_BODY_I18N = {
  emailPlaceholder: {
    en: 'Enter your email',
    ru: 'Введите email'
  },
  resendTimer: {
    en: (seconds: number) => `A new code can be sent after ${seconds} seconds.`,
    ru: (seconds: number) => `Новый код можно отправить через ${seconds} сек.`
  },
  sendCode: {
    en: 'Send code',
    ru: 'Отправить код'
  },
  codePlaceholder: {
    en: 'Enter code from email',
    ru: 'Введите код из письма'
  },
  validate: {
    en: 'Validate',
    ru: 'Проверить'
  }
} as const satisfies LocalizedTextMapType<any>
