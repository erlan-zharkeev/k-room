export const APP_LANGUAGE = {
  En: 'en',
  Ru: 'ru'
} as const

export const APP_LANGUAGE_VALUES = [APP_LANGUAGE.En, APP_LANGUAGE.Ru] as const

export const APP_LANGUAGE_HEADER = 'x-language'

export const DEFAULT_APP_LANGUAGE = APP_LANGUAGE.En

export type AppLanguageType = (typeof APP_LANGUAGE_VALUES)[number]

export type LocalizedTextType<T = string> = Record<AppLanguageType, T>

export type LocalizedTextMapType<T = string> = Record<string, LocalizedTextType<T>>
