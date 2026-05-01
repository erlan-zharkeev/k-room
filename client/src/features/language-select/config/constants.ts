import { APP_LANGUAGE } from 'global-shared'

import type { ILanguageSelectOption } from '../types'

export const LANGUAGE_SELECT_DEFAULT_PROPS = {
  compact: false
} as const

export const LANGUAGE_SELECT_OPTIONS: ILanguageSelectOption[] = [
  {
    flag: '🇬🇧',
    label: 'English',
    value: APP_LANGUAGE.En
  },
  {
    flag: '🇷🇺',
    label: 'Русский',
    value: APP_LANGUAGE.Ru
  },
  {
    flag: '🇨🇳',
    label: '中文',
    value: APP_LANGUAGE.Zh
  }
]
