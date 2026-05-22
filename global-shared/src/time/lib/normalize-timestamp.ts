import { getTime, isValid, toDate } from 'date-fns'

export const normalizeTimestamp = (value?: number | string | null): number | null => {
  if (value === null || value === undefined || value === '') return null

  const dateValue = typeof value === 'string' && !Number.isNaN(Number(value)) ? Number(value) : value
  const date = toDate(dateValue)
  const timestampMs = getTime(date)

  return isValid(date) && timestampMs > 0 ? timestampMs : null
}
