import { defineI18n } from 'global-shared'

export const PASSWORD_RECOVERY_I18N = defineI18n({
  title: {
    en: 'Password recovery',
    ru: 'Восстановление пароля',
    zh: '找回密码'
  },
  enterEmailHint: {
    en: 'Enter your email to receive a recovery code.',
    ru: 'Введите email, чтобы получить код для восстановления.',
    zh: '请输入 email 以获取恢复验证码。'
  },
  sentToEmail: {
    en: 'Recovery code was sent to email',
    ru: 'Код для восстановления отправлен на email',
    zh: '恢复验证码已发送到 email'
  },
  enterCodeHint: {
    en: 'Enter the code from the email to continue.',
    ru: 'Введите код из письма, чтобы продолжить.',
    zh: '请输入邮件中的验证码以继续。'
  },
  emailPlaceholder: {
    en: 'Enter your email',
    ru: 'Введите email',
    zh: '输入 email'
  },
  resend: {
    en: 'Resend code',
    ru: 'Отправить код повторно',
    zh: '重新发送验证码'
  },
  sendCode: {
    en: 'Send code',
    ru: 'Отправить код',
    zh: '发送验证码'
  },
  codePlaceholder: {
    en: 'Enter code from email',
    ru: 'Введите код из письма',
    zh: '输入邮件中的验证码'
  },
  validate: {
    en: 'Validate',
    ru: 'Проверить',
    zh: '验证'
  },
  resendTimer: {
    en: (seconds: number) => `A new code can be sent after ${seconds} seconds.`,
    ru: (seconds: number) => `Новый код можно отправить через ${seconds} сек.`,
    zh: (seconds: number) => `${seconds} 秒后可以发送新验证码。`
  },
  debugCode: {
    en: 'Debug code',
    ru: 'Debug code',
    zh: '调试验证码'
  },
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  }
})
