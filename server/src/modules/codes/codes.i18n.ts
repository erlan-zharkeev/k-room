import { defineI18n } from 'global-shared'

export const SEND_PASSWORD_RECOVERY_CODE_I18N = defineI18n({
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
})

export const VALIDATE_PASSWORD_RECOVERY_CODE_I18N = defineI18n({
  validated: {
    en: 'The password recovery code is valid',
    ru: 'Код восстановления пароля подтверждён'
  },
  invalidCode: {
    en: 'The password recovery code is invalid',
    ru: 'Код восстановления пароля недействителен'
  },
  expiredCode: {
    en: 'The password recovery code has expired',
    ru: 'Срок действия кода восстановления пароля истёк'
  },
  validationFailed: {
    en: 'Failed to validate password recovery code',
    ru: 'Не удалось проверить код восстановления пароля'
  }
})
