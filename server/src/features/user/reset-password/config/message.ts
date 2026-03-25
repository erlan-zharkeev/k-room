import { type LocalizedTextType } from 'common-types'

export const MESSAGE = {
  failed: {
    en: 'Failed to reset password, try again later',
    ru: 'Не удалось сбросить пароль, попробуйте позже'
  },
  codeExpired: {
    en: 'Code expired',
    ru: 'Срок действия кода истёк'
  },
  codeNotValid: {
    en: 'Code is not valid',
    ru: 'Код недействителен'
  },
  success: {
    en: 'Password changed successfully',
    ru: 'Пароль успешно изменён'
  }
} as const satisfies Record<string, LocalizedTextType>
