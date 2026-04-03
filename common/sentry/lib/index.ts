import { StatusEnum } from 'common/status'
import type { ISentryErrorContext } from '../config'

import { SENTRY_IGNORED_SUBSTRINGS } from '../config'

export const isIgnoredSentryStatus = (status?: number | null) => {
  switch (status) {
    case StatusEnum.BadRequest:
    case StatusEnum.NotAuth:
    case StatusEnum.Forbidden:
    case StatusEnum.NotFound:
      return true
    default:
      return false
  }
}

export const shouldIgnoreSentryError = ({ message, silent, status }: ISentryErrorContext) => {
  if (silent) return true
  if (isIgnoredSentryStatus(status)) return true
  if (!message) return false

  const normalizedMessage = message.toLowerCase()

  return SENTRY_IGNORED_SUBSTRINGS.some((substring) => normalizedMessage.includes(substring))
}
