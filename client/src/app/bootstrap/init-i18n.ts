import type { AppLanguage } from 'global-shared'

import { I18N_KEY } from 'src/shared/lib'

import { appI18n, setI18nLanguage, t } from '../lib/i18n'

import type { VueApp } from './types'

export const initI18n = (app: VueApp, language: AppLanguage) => {
  setI18nLanguage(language)
  app.use(appI18n)
  app.provide(I18N_KEY, t)
  app.config.globalProperties.$t = t
}
