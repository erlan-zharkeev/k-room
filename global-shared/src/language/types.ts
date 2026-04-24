import { APP_LANGUAGE_VALUES } from './constants'

export type AppLanguageType = (typeof APP_LANGUAGE_VALUES)[number]

export type LocalizedTextType<T = string> = Record<AppLanguageType, T>

export type LocalizedTextMapType<T = string> = Record<string, LocalizedTextType<T>>
