import type { Component } from 'vue'

import SelectLanguageCnFlagIcon from '../ui/icons/SelectLanguageCnFlagIcon.vue'
import SelectLanguageGbFlagIcon from '../ui/icons/SelectLanguageGbFlagIcon.vue'
import SelectLanguageRuFlagIcon from '../ui/icons/SelectLanguageRuFlagIcon.vue'

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

export const SELECT_LANGUAGE_FLAG_ICON_MAP = {
  gb: SelectLanguageGbFlagIcon,
  ru: SelectLanguageRuFlagIcon,
  cn: SelectLanguageCnFlagIcon
} satisfies Record<SelectLanguageOptionFlag, Component>
