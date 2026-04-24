import { defineI18n } from 'common'

export const RESET_PASSWORD_I18N = defineI18n({
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
})
