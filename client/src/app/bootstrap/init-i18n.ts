import type { AppLanguage } from 'global-shared'

import { setI18nRuntime } from 'src/shared/lib'

import { appI18n, setI18nLanguage } from '../model/i18n-control.model'

import type { VueApp } from './types'

export const initI18n = (app: VueApp, language: AppLanguage) => {
  setI18nLanguage(language)
  setI18nRuntime({
    getLocale: () => appI18n.global.locale.value as AppLanguage,
    translate: (key, named) => appI18n.global.t(key, named ?? {})
  })
  app.use(appI18n)
}
