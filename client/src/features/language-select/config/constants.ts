import { APP_LANGUAGE } from 'global-shared'
import type { Component } from 'vue'

import LanguageFlagCnIcon from '../ui/icons/LanguageFlagCnIcon.vue'
import LanguageFlagGbIcon from '../ui/icons/LanguageFlagGbIcon.vue'
import LanguageFlagRuIcon from '../ui/icons/LanguageFlagRuIcon.vue'

import type { LanguageSelectOption, LanguageSelectFlag } from './types'

export const LANGUAGE_SELECT_DEFAULT_PROPS = {
  compact: false
} as const

export const LANGUAGE_SELECT_FLAG_SIZE = {
  DEFAULT: {
    HEIGHT: '18px',
    WIDTH: '24px'
  },
  COMPACT: {
    HEIGHT: '12px',
    WIDTH: '16px'
  }
} as const

export const LANGUAGE_SELECT_OPTIONS: LanguageSelectOption[] = [
  {
    flag: 'gb',
    label: 'English',
    value: APP_LANGUAGE.En
  },
  {
    flag: 'ru',
    label: 'Русский',
    value: APP_LANGUAGE.Ru
  },
  {
    flag: 'cn',
    label: '中文',
    value: APP_LANGUAGE.Zh
  }
]

export const LANGUAGE_SELECT_FLAG_ICON_MAP = {
  gb: LanguageFlagGbIcon,
  ru: LanguageFlagRuIcon,
  cn: LanguageFlagCnIcon
} satisfies Record<LanguageSelectFlag, Component>
