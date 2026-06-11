import { APP_LANGUAGE } from 'global-shared'
import { type InjectionKey } from 'vue'

import type { I18nTranslate } from './i18n.types'

export const I18N_KEY: InjectionKey<I18nTranslate> = Symbol('i18n')

const BROWSER_LANGUAGE = navigator.language.toLowerCase()

export const CLIENT_LANGUAGE = BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Ru)
  ? APP_LANGUAGE.Ru
  : BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Zh)
  ? APP_LANGUAGE.Zh
  : APP_LANGUAGE.En
