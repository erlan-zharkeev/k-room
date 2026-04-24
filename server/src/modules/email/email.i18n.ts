import { defineI18n } from 'shared'

export const EMAIL_I18N = defineI18n({
  resendApiKeyMissing: {
    en: 'RESEND_API_KEY is not configured',
    ru: 'RESEND_API_KEY не настроен'
  },
  emailConfirmationTokenMissing: {
    en: 'Email confirmation token is required',
    ru: 'Требуется токен подтверждения email'
  },
  emailRecipientMissing: {
    en: 'Email recipient is required',
    ru: 'Требуется получатель email'
  }
})
