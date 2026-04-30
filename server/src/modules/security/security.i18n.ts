import { defineI18n } from 'global-shared'

export const SECURITY_I18N = defineI18n({
  captchaRequired: {
    en: 'Complete verification to continue',
    ru: 'Подтвердите, что вы не робот, чтобы продолжить',
    zh: '请完成验证后继续'
  },
  temporarilyBlocked: {
    en: 'Too many requests. Please try again later',
    ru: 'Слишком много запросов. Попробуйте позже',
    zh: '请求过多，请稍后再试'
  },
  rateLimited: {
    en: 'Please wait before trying again',
    ru: 'Подождите перед следующей попыткой',
    zh: '请稍后再试'
  },
  captchaFailed: {
    en: 'Verification failed. Please try again',
    ru: 'Проверка не пройдена. Попробуйте ещё раз',
    zh: '验证失败，请重试'
  }
})
