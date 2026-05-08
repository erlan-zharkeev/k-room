import { InjectionKey } from 'vue'

import { I18nTranslateType } from './i18n.types'

export const I18N_KEY: InjectionKey<I18nTranslateType> = Symbol('i18n')
