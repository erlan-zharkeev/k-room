import { normalizeTimestamp } from './normalize-timestamp'
export const formatHumanDateTime = (value, locale = 'en-GB', fallback = 'Never') => {
  const timestamp = normalizeTimestamp(value)
  if (timestamp === null) return fallback
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(timestamp)
}
