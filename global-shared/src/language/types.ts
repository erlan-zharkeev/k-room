import { type APP_LANGUAGE_VALUES } from './constants'

export type AppLanguage = (typeof APP_LANGUAGE_VALUES)[number]

export type PluralRule = ReturnType<Intl.PluralRules['select']>

export interface EventUpdateLanguage {
  language: AppLanguage
}

export type LocalizedText<T = string> = Record<AppLanguage, T>

export type LocalizedTextMap<T = string> = Record<string, LocalizedText<T>>

export type PluralForms = Partial<Record<PluralRule, string>> & {
  other: string
}
