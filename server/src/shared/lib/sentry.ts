import { captureException, captureMessage, isInitialized } from '@sentry/node'
import { shouldIgnoreSentryError, type ISentryErrorContext } from 'global-shared'
import { isNumber } from 'lodash'

export const serverCaptureSentryException = (error: unknown) => {
  if (!isInitialized()) {
    return
  }

  captureException(error)
}

const generateSentryError =
  (kind: 'http-error' | 'socket-error') =>
  ({ message, silent, status }: ISentryErrorContext) => {
    if (!isInitialized()) {
      return
    }

    if (shouldIgnoreSentryError({ message, silent, status })) {
      return
    }

    captureMessage(message ?? 'Unknown server error', {
      level: 'error',
      tags: {
        kind,
        ...(isNumber(status) ? { status: String(status) } : {})
      }
    })
  }

export const serverCaptureSentryHttpError = generateSentryError('http-error')
export const serverCaptureSentrySocketError = generateSentryError('socket-error')
