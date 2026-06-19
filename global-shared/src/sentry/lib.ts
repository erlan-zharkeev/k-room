import { REQ_STATUS } from '../status/constants'

import { SENTRY_IGNORED_SUBSTRINGS } from './constants'
import type { SentryErrorContext } from './types'

export const isIgnoredSentryStatus = (status?: number | null) => {
  switch (status) {
    case REQ_STATUS.badRequest:
    case REQ_STATUS.notAuth:
    case REQ_STATUS.forbidden:
    case REQ_STATUS.notFound:
    case REQ_STATUS.tooManyRequests:
      return true
    default:
      return false
  }
}

export const shouldIgnoreSentryError = ({ message, silent, status }: SentryErrorContext) => {
  if (silent) return true
  if (isIgnoredSentryStatus(status)) return true
  if (!message) return false

  const normalizedMessage = message.toLowerCase()

  return SENTRY_IGNORED_SUBSTRINGS.some((substring) => normalizedMessage.includes(substring))
}
