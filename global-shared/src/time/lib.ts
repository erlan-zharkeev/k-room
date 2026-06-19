import { getTime, intlFormat, isValid, toDate } from 'date-fns'

import { isString } from '../shared/lib'

export const normalizeTimestamp = (value?: number | string | null): number | null => {
  if (value === null || value === undefined || value === '') return null

  const dateValue = isString(value) && !Number.isNaN(Number(value)) ? Number(value) : value
  const date = toDate(dateValue)
  const timestampMs = getTime(date)

  return isValid(date) && timestampMs > 0 ? timestampMs : null
}

export const formatHumanDateTime = (value?: number | string | null, locale = 'en-US', fallback = 'Never') => {
  const timestampMs = normalizeTimestamp(value)

  if (timestampMs === null) return fallback

  return intlFormat(
    timestampMs,
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    {
      locale
    }
  )
}
