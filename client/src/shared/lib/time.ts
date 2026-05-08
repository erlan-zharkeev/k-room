import { differenceInMilliseconds, format, intlFormat, intlFormatDistance } from 'date-fns'
import { APP_LANGUAGE, normalizeTimestamp, type AppLanguageType } from 'global-shared'

import {
  DATE_PATTERN_BY_DATE_TIME_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
  TIME_PATTERN_BY_DATE_TIME_FORMAT,
  type DateTimeFormatType
} from 'src/shared/config'

const INTL_LOCALE_BY_LANGUAGE = {
  [APP_LANGUAGE.En]: 'en-US',
  [APP_LANGUAGE.Ru]: 'ru-RU',
  [APP_LANGUAGE.Zh]: 'zh-CN'
} satisfies Record<AppLanguageType, string>

const getIntlLocale = (language: AppLanguageType) => INTL_LOCALE_BY_LANGUAGE[language]
const getTimeValue = (value: number | string) => normalizeTimestamp(value) ?? 0
const getPatternValue = (value: number | string, pattern: string) => format(getTimeValue(value), pattern)

export const formatLocalizedDate = (
  value: number | string,
  language: AppLanguageType,
  dateTimeFormat: DateTimeFormatType = DEFAULT_DATE_TIME_FORMAT
) => {
  const pattern = DATE_PATTERN_BY_DATE_TIME_FORMAT[dateTimeFormat]

  if (pattern) {
    return getPatternValue(value, pattern)
  }

  return intlFormat(
    getTimeValue(value),
    {
      dateStyle: 'long'
    },
    {
      locale: getIntlLocale(language)
    }
  )
}

export const formatLocalizedTime = (
  value: number | string,
  language: AppLanguageType,
  dateTimeFormat: DateTimeFormatType = DEFAULT_DATE_TIME_FORMAT
) => {
  const pattern = TIME_PATTERN_BY_DATE_TIME_FORMAT[dateTimeFormat]

  if (pattern) {
    return getPatternValue(value, pattern)
  }

  return intlFormat(
    getTimeValue(value),
    {
      timeStyle: 'short'
    },
    {
      locale: getIntlLocale(language)
    }
  )
}

export const formatLocalizedDateTime = (
  value: number | string,
  language: AppLanguageType,
  dateTimeFormat: DateTimeFormatType = DEFAULT_DATE_TIME_FORMAT
) => {
  const date = formatLocalizedDate(value, language, dateTimeFormat)
  const time = formatLocalizedTime(value, language, dateTimeFormat)

  return `${date}, ${time}`
}

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguageType) =>
  intlFormatDistance(getTimeValue(value), Date.now(), {
    locale: getIntlLocale(language),
    numeric: 'auto'
  })

export const getNextRequestIntervalSeconds = (timestampMs: number) =>
  differenceInMilliseconds(timestampMs, Date.now()) / 1000
