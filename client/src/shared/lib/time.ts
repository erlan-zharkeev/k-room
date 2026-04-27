import { APP_LANGUAGE, normalizeTimestamp, type AppLanguageType } from 'global-shared'

const getIntlLocale = (language: AppLanguageType) => (language === APP_LANGUAGE.Ru ? 'ru-RU' : 'en-US')

export const formatLocalizedDate = (value: number | string, language: AppLanguageType) =>
  new Intl.DateTimeFormat(getIntlLocale(language), {
    dateStyle: 'long'
  }).format(normalizeTimestamp(value) ?? 0)

export const formatLocalizedTime = (value: number | string, language: AppLanguageType) =>
  new Intl.DateTimeFormat(getIntlLocale(language), {
    timeStyle: 'short'
  }).format(normalizeTimestamp(value) ?? 0)

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguageType) => {
  const timestampMs = normalizeTimestamp(value) ?? 0
  const diffInSeconds = Math.round((timestampMs - Date.now()) / 1000)
  const absDiffInSeconds = Math.abs(diffInSeconds)
  const formatter = new Intl.RelativeTimeFormat(getIntlLocale(language), { numeric: 'auto' })

  if (absDiffInSeconds < 60) return formatter.format(diffInSeconds, 'second')

  const diffInMinutes = Math.round(diffInSeconds / 60)
  const absDiffInMinutes = Math.abs(diffInMinutes)

  if (absDiffInMinutes < 60) return formatter.format(diffInMinutes, 'minute')

  const diffInHours = Math.round(diffInMinutes / 60)
  const absDiffInHours = Math.abs(diffInHours)

  if (absDiffInHours < 24) return formatter.format(diffInHours, 'hour')

  const diffInDays = Math.round(diffInHours / 24)

  return formatter.format(diffInDays, 'day')
}

export const getNextRequestIntervalSeconds = (timestampMs: number) => (timestampMs - Date.now()) / 1000
