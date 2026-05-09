import { APP_LANGUAGE } from 'global-shared'
import { InjectionKey } from 'vue'

import type { I18nTranslateType } from './i18n.types'

export const I18N_KEY: InjectionKey<I18nTranslateType> = Symbol('i18n')

const BROWSER_LANGUAGE = navigator.language.toLowerCase()

export const CLIENT_LANGUAGE = BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Ru)
  ? APP_LANGUAGE.Ru
  : BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Zh)
  ? APP_LANGUAGE.Zh
  : APP_LANGUAGE.En
