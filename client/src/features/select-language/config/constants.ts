import selectLanguageCnFlagSrc from '../assets/cn.svg'
import selectLanguageGbFlagSrc from '../assets/gb.svg'
import selectLanguageRuFlagSrc from '../assets/ru.svg'

import type { SelectLanguageOption, SelectLanguageOptionFlag } from './types'

export const SELECT_LANGUAGE_DEFAULT_PROPS = {
  compact: false
} as const

export const SELECT_LANGUAGE_FLAG_SIZE = {
  DEFAULT: {
    HEIGHT: '18px',
    WIDTH: '24px'
  },
  COMPACT: {
    HEIGHT: '12px',
    WIDTH: '16px'
  }
} as const

export const SELECT_LANGUAGE_OPTIONS: SelectLanguageOption[] = [
  {
    flag: 'gb',
    value: 'en'
  },
  {
    flag: 'ru',
    value: 'ru'
  },
  {
    flag: 'cn',
    value: 'zh'
  }
]

export const SELECT_LANGUAGE_FLAG_SRC_MAP = {
  gb: selectLanguageGbFlagSrc,
  ru: selectLanguageRuFlagSrc,
  cn: selectLanguageCnFlagSrc
} satisfies Record<SelectLanguageOptionFlag, string>
