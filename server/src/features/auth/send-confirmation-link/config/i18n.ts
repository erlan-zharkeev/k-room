import { LocalizedTextMapType } from 'common'

export const SEND_CONFIRMATION_LINK_I18N = {
  confirmationLinkSent: {
    en: 'Confirmation link has been sent',
    ru: 'Ссылка подтверждения отправлена'
  },
  emailAlreadyConfirmed: {
    en: 'Email already confirmed',
    ru: 'Email уже подтверждён'
  },
  noConfirmationAttemptsLeft: {
    en: 'No confirmation attempts left',
    ru: 'Попытки подтверждения закончились'
  },
  failedSendEmailConfirmationLink: {
    en: 'Failed to send email confirmation link',
    ru: 'Не удалось отправить письмо с подтверждением'
  }
} as const satisfies LocalizedTextMapType
