import { type LocalizedTextType } from 'common-types'

export const MESSAGE = {
  failedEmailConfirm: {
    en: 'Email confirmation failed',
    ru: 'Не удалось подтвердить email'
  } satisfies LocalizedTextType,
  emailConfirmed: {
    en: 'Email has been confirmed',
    ru: 'Email подтверждён'
  } satisfies LocalizedTextType,
  emailAlreadyConfirmed: {
    en: 'Email already confirmed',
    ru: 'Email уже подтверждён'
  } satisfies LocalizedTextType
}
