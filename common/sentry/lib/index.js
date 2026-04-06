import { REQ_STATUS } from 'common/status'
import { SENTRY_IGNORED_SUBSTRINGS } from '../config'
export const isIgnoredSentryStatus = (status) => {
  switch (status) {
    case REQ_STATUS.badRequest:
    case REQ_STATUS.notAuth:
    case REQ_STATUS.forbidden:
    case REQ_STATUS.notFound:
      return true
    default:
      return false
  }
}
export const shouldIgnoreSentryError = ({ message, silent, status }) => {
  if (silent) return true
  if (isIgnoredSentryStatus(status)) return true
  if (!message) return false
  const normalizedMessage = message.toLowerCase()
  return SENTRY_IGNORED_SUBSTRINGS.some((substring) => normalizedMessage.includes(substring))
}
