import type { AppLanguageType } from 'global-shared'
import { createI18n } from 'vue-i18n'

import { CLIENT_LANGUAGE } from 'src/shared/config'
import type { I18nTranslateType } from 'src/shared/lib'

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

export const setI18nLanguage = (language: AppLanguageType) => {
  appI18n.global.locale.value = language
}

export const t: I18nTranslateType = (value) => value[appI18n.global.locale.value as AppLanguageType]
