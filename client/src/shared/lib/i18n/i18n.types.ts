import type { LocalizedTextType } from 'global-shared'

export type I18nTranslateType = <T>(value: LocalizedTextType<T>) => T
