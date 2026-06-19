import { type AppLanguage, type LocalizedText } from 'global-shared'

import { CLIENT_LANGUAGE } from './constants'
import type { I18nNamedValues } from './define-i18n'
import type { I18nRuntime, I18nTranslate, UseI18nResult } from './i18n.types'

let i18nRuntime: I18nRuntime = {
  getLocale: () => CLIENT_LANGUAGE,
  translate: (key) => key
}

const isLocalizedText = (value: unknown): value is LocalizedText<unknown> =>
  typeof value === 'object' && value !== null && 'en' in value && 'ru' in value && 'zh' in value

export const setI18nRuntime = (runtime: I18nRuntime) => {
  i18nRuntime = runtime
}

export const useI18n = (): UseI18nResult => {
  const t = ((value: string | LocalizedText<unknown>, named?: I18nNamedValues) => {
    if (isLocalizedText(value)) return value[i18nRuntime.getLocale() as AppLanguage]

    return i18nRuntime.translate(value, named)
  }) as I18nTranslate

  return {
    t
  }
}
