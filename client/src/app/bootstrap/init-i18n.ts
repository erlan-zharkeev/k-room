import type { AppLanguage } from 'global-shared'

import { appI18n, setI18nLanguage } from '../lib/i18n'

import type { VueApp } from './types'

export const initI18n = (app: VueApp, language: AppLanguage) => {
  setI18nLanguage(language)
  app.use(appI18n)
}
