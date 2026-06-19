import type { AppLanguage } from './types'

export const APP_LANGUAGE_VALUES = ['en', 'ru', 'zh'] as const satisfies readonly AppLanguage[]

export const APP_LANGUAGE_HEADER = 'x-language'

export const DEFAULT_APP_LANGUAGE = 'en' as const satisfies AppLanguage
