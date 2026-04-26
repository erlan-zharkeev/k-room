import { defineI18n } from 'global-shared'

export const EMAIL_I18N = defineI18n({
  resendApiKeyMissing: {
    en: 'RESEND_API_KEY is not configured',
    ru: 'RESEND_API_KEY не настроен',
    zh: '未配置 RESEND_API_KEY'
  },
  emailConfirmationTokenMissing: {
    en: 'Email confirmation token is required',
    ru: 'Требуется токен подтверждения email',
    zh: '需要 email 确认令牌'
  },
  emailRecipientMissing: {
    en: 'Email recipient is required',
    ru: 'Требуется получатель email',
    zh: '需要 email 收件人'
  }
})
