import { APP_LANGUAGE, AppLanguage } from 'global-shared'

import type { DateTimeFormatPatternMap, DateTimeFormat } from './types'

export const DATE_TIME_FORMAT = {
  auto: 'auto',
  dmyDot24h: 'dmy-dot-24h',
  mdySlash12h: 'mdy-slash-12h',
  dmySlash24h: 'dmy-slash-24h',
  ymdDash24h: 'ymd-dash-24h'
} as const

export const DEFAULT_DATE_TIME_FORMAT: DateTimeFormat = DATE_TIME_FORMAT.auto

export const DATE_PATTERN_BY_DATE_TIME_FORMAT: DateTimeFormatPatternMap = {
  [DATE_TIME_FORMAT.dmyDot24h]: 'dd.MM.yyyy',
  [DATE_TIME_FORMAT.mdySlash12h]: 'MM/dd/yyyy',
  [DATE_TIME_FORMAT.dmySlash24h]: 'dd/MM/yyyy',
  [DATE_TIME_FORMAT.ymdDash24h]: 'yyyy-MM-dd'
}

export const TIME_PATTERN_BY_DATE_TIME_FORMAT: DateTimeFormatPatternMap = {
  [DATE_TIME_FORMAT.dmyDot24h]: 'HH:mm',
  [DATE_TIME_FORMAT.mdySlash12h]: 'h:mm a',
  [DATE_TIME_FORMAT.dmySlash24h]: 'HH:mm',
  [DATE_TIME_FORMAT.ymdDash24h]: 'HH:mm'
}

export const INTL_LOCALE_BY_LANGUAGE = {
  [APP_LANGUAGE.En]: 'en-US',
  [APP_LANGUAGE.Ru]: 'ru-RU',
  [APP_LANGUAGE.Zh]: 'zh-CN'
} satisfies Record<AppLanguage, string>
