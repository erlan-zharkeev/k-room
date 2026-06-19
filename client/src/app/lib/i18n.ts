import type { AppLanguage } from 'global-shared'
import { createI18n } from 'vue-i18n'

import { CLIENT_LANGUAGE } from 'src/shared/lib'

import { I18N_MESSAGES } from './i18n-messages'

export const appI18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: CLIENT_LANGUAGE,
  fallbackLocale: 'en',
  messages: I18N_MESSAGES
})

export const setI18nLanguage = (language: AppLanguage) => {
  appI18n.global.locale.value = language
}
