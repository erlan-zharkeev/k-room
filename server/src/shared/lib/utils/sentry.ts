import * as Sentry from '@sentry/node'

import { type ISentryErrorContext, SENTRY_IGNORED_SUBSTRINGS, StatusEnum } from 'common-types'

const isIgnoredStatus = (status?: number | null) => {
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

const shouldIgnoreSentryError = ({ message, silent, status }: ISentryErrorContext) => {
  if (silent) return true
  if (isIgnoredStatus(status)) return true
  if (!message) return false

  const normalizedMessage = message.toLowerCase()

  return SENTRY_IGNORED_SUBSTRINGS.some((substring) => normalizedMessage.includes(substring))
}

export const serverCaptureSentryException = (error: unknown) => {
  if (!Sentry.isInitialized()) return

  Sentry.captureException(error)
}

export const serverCaptureSentryHttpError = ({ message, silent, status }: ISentryErrorContext) => {
  if (!Sentry.isInitialized()) return

  if (shouldIgnoreSentryError({ message, silent, status })) {
    return
  }

  Sentry.captureMessage(message ?? 'Unknown server error', {
    level: 'error',
    tags: {
      kind: 'http-error',
      ...(typeof status === 'number' ? { status: String(status) } : {})
    }
  })
}

export const captureSentryException = serverCaptureSentryException
export const captureSentryHttpError = serverCaptureSentryHttpError
