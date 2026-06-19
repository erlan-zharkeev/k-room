import { defineI18n } from 'src/shared/lib'

export const APP_CAPTCHA_I18N = defineI18n('appCaptcha', {
  unavailable: {
    en: 'Verification is temporarily unavailable',
    ru: 'Проверка временно недоступна',
    zh: '验证暂时不可用'
  }
})
