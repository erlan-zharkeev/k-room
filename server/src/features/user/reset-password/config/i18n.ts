import { type LocalizedTextMapType } from 'common'

export const I18N_RESET_PASSWORD_MESSAGE = {
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
} as const satisfies LocalizedTextMapType
