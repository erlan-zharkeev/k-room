import { createI18n } from 'vue-i18n'

import { CLIENT_LANGUAGE } from 'src/shared/config'

export const appI18n = createI18n({
  legacy: false,
  globalInjection: false,
  locale: CLIENT_LANGUAGE,
  fallbackLocale: 'en',
  messages: {
    en: {},
    ru: {},
    zh: {}
  }
})
