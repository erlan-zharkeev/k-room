import type { LocalizedText } from 'global-shared'

export type I18nTranslate = <T>(value: LocalizedText<T>) => T
