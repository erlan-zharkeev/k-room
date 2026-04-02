import * as Sentry from '@sentry/node'

import { type ISentryErrorContext, shouldIgnoreSentryError } from 'common'

export const serverCaptureSentryException = (error: unknown) => {
  if (!Sentry.isInitialized()) return

  Sentry.captureException(error)
}

export const generateSentryError =
  (kind: 'http-error' | 'socket-error') =>
  ({ message, silent, status }: ISentryErrorContext) => {
    if (!Sentry.isInitialized()) return

    if (shouldIgnoreSentryError({ message, silent, status })) {
      return
    }

    Sentry.captureMessage(message ?? 'Unknown server error', {
      level: 'error',
      tags: {
        kind,
        ...(typeof status === 'number' ? { status: String(status) } : {})
      }
    })
  }

export const serverCaptureSentryHttpError = generateSentryError('http-error')
export const serverCaptureSentrySocketError = generateSentryError('socket-error')
