import { differenceInMilliseconds, format, intlFormat, intlFormatDistance } from 'date-fns'
import { normalizeTimestamp, SECOND_IN_MS, type AppLanguage } from 'global-shared'

import {
  DATE_PATTERN_BY_DATE_TIME_FORMAT,
  TIME_PATTERN_BY_DATE_TIME_FORMAT,
  INTL_LOCALE_BY_LANGUAGE
} from './constants'
import type { DateTimeFormat } from './types'

const getIntlLocale = (language: AppLanguage) => INTL_LOCALE_BY_LANGUAGE[language]
const getTimeValue = (value: number | string) => normalizeTimestamp(value) ?? 0
const getPatternValue = (value: number | string, pattern: string) => format(getTimeValue(value), pattern)

export const formatLocalizedDate = (value: number | string, language: AppLanguage, dateTimeFormat: DateTimeFormat) => {
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

export const formatLocalizedTime = (value: number | string, language: AppLanguage, dateTimeFormat: DateTimeFormat) => {
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
  language: AppLanguage,
  dateTimeFormat: DateTimeFormat
) => {
  const date = formatLocalizedDate(value, language, dateTimeFormat)
  const time = formatLocalizedTime(value, language, dateTimeFormat)

  return `${date}, ${time}`
}

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguage) =>
  intlFormatDistance(getTimeValue(value), Date.now(), {
    locale: getIntlLocale(language),
    numeric: 'auto'
  })

export const getNextRequestIntervalSec = (timestampMs: number) =>
  differenceInMilliseconds(timestampMs, Date.now()) / SECOND_IN_MS
