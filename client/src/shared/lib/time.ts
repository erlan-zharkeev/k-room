import { differenceInMilliseconds, intlFormat, intlFormatDistance } from 'date-fns'
import { APP_LANGUAGE, normalizeTimestamp, type AppLanguageType } from 'global-shared'

const INTL_LOCALE_BY_LANGUAGE = {
  [APP_LANGUAGE.En]: 'en-US',
  [APP_LANGUAGE.Ru]: 'ru-RU',
  [APP_LANGUAGE.Zh]: 'zh-CN'
} satisfies Record<AppLanguageType, string>

const getIntlLocale = (language: AppLanguageType) => INTL_LOCALE_BY_LANGUAGE[language]
const getTimeValue = (value: number | string) => normalizeTimestamp(value) ?? 0

export const formatLocalizedDate = (value: number | string, language: AppLanguageType) =>
  intlFormat(
    getTimeValue(value),
    {
      dateStyle: 'long'
    },
    {
      locale: getIntlLocale(language)
    }
  )

export const formatLocalizedTime = (value: number | string, language: AppLanguageType) =>
  intlFormat(
    getTimeValue(value),
    {
      timeStyle: 'short'
    },
    {
      locale: getIntlLocale(language)
    }
  )

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguageType) =>
  intlFormatDistance(getTimeValue(value), Date.now(), {
    locale: getIntlLocale(language),
    numeric: 'auto'
  })

export const getNextRequestIntervalSeconds = (timestampMs: number) =>
  differenceInMilliseconds(timestampMs, Date.now()) / 1000
