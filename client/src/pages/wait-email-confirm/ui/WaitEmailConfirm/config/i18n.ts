import { type LocalizedTextType } from 'common-types'

export const WAIT_EMAIL_CONFIRM_TEXT = {
  title: {
    en: 'Email confirmation',
    ru: 'Подтверждение email'
  },
  sentToEmail: {
    en: 'A confirmation was sent to your email',
    ru: 'Письмо с подтверждением было отправлено на email'
  },
  followLink: {
    en: 'In order to complete the registration, follow the link provided in the email.',
    ru: 'Чтобы завершить регистрацию, перейдите по ссылке из письма.'
  },
  attemptsExhausted: {
    en: 'You have exhausted all attempts. Try again later',
    ru: 'Вы исчерпали все попытки. Попробуйте позже'
  },
  attemptsLeft: {
    en: 'Attempts left:',
    ru: 'Осталось попыток:'
  },
  resendHint: {
    en: 'If the email does not arrive, try to resend the request',
    ru: 'Если письмо не пришло, попробуйте отправить запрос повторно'
  },
  resendInSeconds: {
    en: (seconds: number) => `You can send a confirmation email in ${seconds} seconds`,
    ru: (seconds: number) => `Отправить письмо повторно можно через ${seconds} сек.`
  },
  resend: {
    en: 'Send confirmation link',
    ru: 'Отправить ссылку повторно'
  },
  back: {
    en: 'Back',
    ru: 'Назад'
  }
} as const satisfies Record<string, LocalizedTextType<any>>
