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
  },
  emailGreeting: {
    en: 'Hello',
    ru: 'Здравствуйте',
    zh: '您好'
  },
  emailConfirmationGreeting: {
    en: 'Hi',
    ru: 'Здравствуйте',
    zh: '您好'
  },
  emailConfirmationSubject: {
    en: 'Confirm your email',
    ru: 'Подтвердите email',
    zh: '确认您的邮箱'
  },
  emailConfirmationText: {
    en: 'Please confirm your email address to finish registration.',
    ru: 'Подтвердите адрес email, чтобы завершить регистрацию.',
    zh: '请确认您的邮箱地址以完成注册。'
  },
  emailConfirmationButton: {
    en: 'Confirm email',
    ru: 'Подтвердить email',
    zh: '确认邮箱'
  },
  emailConfirmationFallbackLink: {
    en: 'If the button does not work, open this link manually:',
    ru: 'Если кнопка не работает, откройте эту ссылку вручную:',
    zh: '如果按钮无法使用，请手动打开此链接：'
  },
  passwordRecoveryTitle: {
    en: 'Password recovery',
    ru: 'Восстановление пароля',
    zh: '找回密码'
  },
  passwordRecoveryCodeText: {
    en: 'Use this code to continue resetting your password:',
    ru: 'Используйте этот код для восстановления пароля:',
    zh: '使用此代码找回您的密码：'
  },
  passwordRecoveryIgnoreText: {
    en: 'If you did not request password recovery, you can ignore this message.',
    ru: 'Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.',
    zh: '如果您没有请求找回密码，请忽略此邮件。'
  },
  passwordRecoveryCodeSubject: {
    en: 'Password recovery code',
    ru: 'Код восстановления пароля',
    zh: '找回密码验证码'
  },
  emailChangeTitle: {
    en: 'Email change',
    ru: 'Смена email',
    zh: '更改邮箱'
  },
  emailChangeCodeText: {
    en: 'Use this code to confirm your new email address:',
    ru: 'Используйте этот код для подтверждения нового email:',
    zh: '使用此代码确认您的新邮箱：'
  },
  emailChangeIgnoreText: {
    en: 'If you did not request an email change, you can ignore this message.',
    ru: 'Если вы не запрашивали смену email, проигнорируйте это письмо.',
    zh: '如果您没有请求更改邮箱，请忽略此邮件。'
  },
  emailChangeCodeSubject: {
    en: 'Email change code',
    ru: 'Код смены email',
    zh: '更改邮箱验证码'
  }
})
