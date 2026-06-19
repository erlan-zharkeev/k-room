export type AppLanguage = 'en' | 'ru' | 'zh'

export type PluralRule = ReturnType<Intl.PluralRules['select']>

export interface EventUpdateLanguage {
  language: AppLanguage
}

export type LocalizedText<T = string> = Record<AppLanguage, T>

export type LocalizedTextMap<T = string> = Record<string, LocalizedText<T>>

export type PluralForms = Partial<Record<PluralRule, string>> & {
  other: string
}
