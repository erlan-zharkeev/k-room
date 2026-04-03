import { LocalizedTextMapType } from 'common'

export const SEND_PASSWORD_RECOVERY_CODE_I18N = {
  codeSent: {
    en: 'Password recovery code has been sent',
    ru: 'Код для восстановления пароля отправлен'
  },
  sendFailed: {
    en: 'Failed to send password recovery code',
    ru: 'Не удалось отправить код для восстановления пароля'
  },
  tooManyRequests: {
    en: 'Please wait before requesting a new code',
    ru: 'Подождите перед повторной отправкой кода'
  }
} as const satisfies LocalizedTextMapType
