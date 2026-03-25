import { type LocalizedTextType } from 'common-types'

export const MESSAGE = {
  confirmationLinkSent: {
    en: 'Confirmation link has been sent',
    ru: 'Ссылка подтверждения отправлена'
  } satisfies LocalizedTextType,
  emailAlreadyConfirmed: {
    en: 'Email already confirmed',
    ru: 'Email уже подтверждён'
  } satisfies LocalizedTextType,
  noConfirmationAttemptsLeft: {
    en: 'No confirmation attempts left',
    ru: 'Попытки подтверждения закончились'
  } satisfies LocalizedTextType,
  failedSendEmailConfirmationLink: {
    en: 'Failed to send email confirmation link',
    ru: 'Не удалось отправить письмо с подтверждением'
  } satisfies LocalizedTextType
}
