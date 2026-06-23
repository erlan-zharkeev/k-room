import { defineI18n, i18nFormatter } from 'src/shared/lib'

export const WAIT_EMAIL_CONFIRM_I18N = defineI18n('waitEmailConfirm', {
  title: {
    en: 'Email confirmation',
    ru: 'Подтверждение email',
    zh: 'Email 确认'
  },
  sentToEmail: {
    en: 'A confirmation was sent to your email',
    ru: 'Письмо с подтверждением было отправлено на email',
    zh: '确认邮件已发送到你的 email'
  },
  followLink: {
    en: 'In order to complete the registration, follow the link provided in the email.',
    ru: 'Чтобы завершить регистрацию, перейдите по ссылке из письма.',
    zh: '请点击邮件中的链接完成注册。'
  },
  attemptsExhausted: {
    en: 'You have exhausted all attempts. Try again later',
    ru: 'Вы исчерпали все попытки. Попробуйте позже',
    zh: '尝试次数已用完，请稍后再试'
  },
  attemptsLeft: {
    en: 'Attempts left:',
    ru: 'Осталось попыток:',
    zh: '剩余尝试次数：'
  },
  resendHint: {
    en: 'If the email does not arrive, try to resend the request',
    ru: 'Если письмо не пришло, попробуйте отправить запрос повторно',
    zh: '如果没有收到邮件，可以尝试重新发送请求'
  },
  resendInSeconds: {
    en: i18nFormatter(['seconds'], (seconds: number) => `You can send a confirmation email in ${seconds} seconds`),
    ru: i18nFormatter(['seconds'], (seconds: number) => `Отправить письмо повторно можно через ${seconds} сек.`),
    zh: i18nFormatter(['seconds'], (seconds: number) => `${seconds} 秒后可以重新发送确认邮件`)
  },
  resend: {
    en: 'Send confirmation link',
    ru: 'Отправить ссылку повторно',
    zh: '发送确认链接'
  },
  login: {
    en: 'Login',
    ru: 'Вход',
    zh: '登录'
  }
})
