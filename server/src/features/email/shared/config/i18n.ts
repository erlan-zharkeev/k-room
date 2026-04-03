import { LocalizedTextMapType } from 'common'

export const EMAIL_I18N = {
  resendApiKeyMissing: {
    en: 'RESEND_API_KEY is not configured',
    ru: 'RESEND_API_KEY не настроен'
  },
  resendFromEmailMissing: {
    en: 'RESEND_FROM_EMAIL is not configured',
    ru: 'RESEND_FROM_EMAIL не настроен'
  },
  emailConfirmationTokenMissing: {
    en: 'Email confirmation token is required',
    ru: 'Требуется токен подтверждения email'
  },
  emailRecipientMissing: {
    en: 'Email recipient is required',
    ru: 'Требуется получатель email'
  }
} as const satisfies LocalizedTextMapType
