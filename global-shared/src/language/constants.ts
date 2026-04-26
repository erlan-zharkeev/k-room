export const APP_LANGUAGE = {
  En: 'en',
  Ru: 'ru',
  Zh: 'zh'
} as const

export const APP_LANGUAGE_VALUES = [APP_LANGUAGE.En, APP_LANGUAGE.Ru, APP_LANGUAGE.Zh] as const

export const APP_LANGUAGE_HEADER = 'x-language'

export const DEFAULT_APP_LANGUAGE = APP_LANGUAGE.En
