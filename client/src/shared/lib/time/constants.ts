import { type AppLanguage } from 'global-shared'

import type { DateTimeFormatPatternMap, DateTimeFormat } from './types'

export const DEFAULT_DATE_TIME_FORMAT: DateTimeFormat = 'auto'

export const DATE_PATTERN_BY_DATE_TIME_FORMAT: DateTimeFormatPatternMap = {
  'dmy-dot-24h': 'dd.MM.yyyy',
  'mdy-slash-12h': 'MM/dd/yyyy',
  'dmy-slash-24h': 'dd/MM/yyyy',
  'ymd-dash-24h': 'yyyy-MM-dd'
}

export const TIME_PATTERN_BY_DATE_TIME_FORMAT: DateTimeFormatPatternMap = {
  'dmy-dot-24h': 'HH:mm',
  'mdy-slash-12h': 'h:mm a',
  'dmy-slash-24h': 'HH:mm',
  'ymd-dash-24h': 'HH:mm'
}

export const INTL_LOCALE_BY_LANGUAGE = {
  ['en']: 'en-US',
  ['ru']: 'ru-RU',
  ['zh']: 'zh-CN'
} satisfies Record<AppLanguage, string>
