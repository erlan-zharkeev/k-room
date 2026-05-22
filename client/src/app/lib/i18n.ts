import type { AppLanguage } from 'global-shared'
import { createI18n } from 'vue-i18n'

import { CLIENT_LANGUAGE } from 'src/shared/lib'
import type { I18nTranslate } from 'src/shared/lib'

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

export const setI18nLanguage = (language: AppLanguage) => {
  appI18n.global.locale.value = language
}

export const t: I18nTranslate = (value) => value[appI18n.global.locale.value as AppLanguage]
