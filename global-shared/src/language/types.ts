import { APP_LANGUAGE_VALUES } from './constants'

export type AppLanguage = (typeof APP_LANGUAGE_VALUES)[number]

export interface EventUpdateLanguage {
  language: AppLanguage
}

export type LocalizedText<T = string> = Record<AppLanguage, T>

export type LocalizedTextMap<T = string> = Record<string, LocalizedText<T>>
