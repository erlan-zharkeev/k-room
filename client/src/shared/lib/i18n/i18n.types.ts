import type { AppLanguage, LocalizedText } from 'global-shared'

import type { I18nKey, I18nNamedValues } from './define-i18n'

export interface I18nRuntime {
  getLocale: () => AppLanguage
  translate: (key: I18nKey, named?: I18nNamedValues) => string
}

export interface I18nTranslate {
  (key: I18nKey, named?: I18nNamedValues): string
  <T>(value: LocalizedText<T>): T
}

export interface UseI18nResult {
  t: I18nTranslate
}
