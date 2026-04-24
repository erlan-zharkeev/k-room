import { captureException, captureMessage, isInitialized } from '@sentry/node'
import { shouldIgnoreSentryError, type ISentryErrorContext } from 'shared'

export const serverCaptureSentryException = (error: unknown) => {
  if (!isInitialized()) {
    return
  }

  captureException(error)
}

const generateSentryError =
  (kind: 'http-error') =>
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
        ...(typeof status === 'number' ? { status: String(status) } : {})
      }
    })
  }

export const serverCaptureSentryHttpError = generateSentryError('http-error')
