import { type AppLanguage, type LocalizedText } from 'global-shared'
import { useI18n as useVueI18n } from 'vue-i18n'

import type { I18nNamedValues } from './define-i18n'
import type { I18nTranslate, UseI18nResult } from './i18n.types'

const isLocalizedText = (value: unknown): value is LocalizedText<unknown> =>
  typeof value === 'object' && value !== null && 'en' in value && 'ru' in value && 'zh' in value

export const useI18n = (): UseI18nResult => {
  const i18n = useVueI18n({ useScope: 'global' })
  const vueTranslate = i18n.t as (key: string, named?: I18nNamedValues) => string

  const t = ((value: string | LocalizedText<unknown>, named?: I18nNamedValues) => {
    if (isLocalizedText(value)) return value[i18n.locale.value as AppLanguage]

    return vueTranslate(value, named)
  }) as I18nTranslate

  return {
    t
  }
}
