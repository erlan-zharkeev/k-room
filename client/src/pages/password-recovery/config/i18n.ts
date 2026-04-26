import { defineI18n } from 'global-shared'

export const PASSWORD_RECOVERY_I18N = defineI18n({
  title: {
    en: 'Password recovery',
    ru: 'Восстановление пароля',
    zh: '找回密码'
  },
  emailPlaceholder: {
    en: 'Enter your email',
    ru: 'Введите email',
    zh: '输入 email'
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
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  },
  debugCode: {
    en: 'Debug code',
    ru: 'Debug code',
    zh: '调试验证码'
  }
})
