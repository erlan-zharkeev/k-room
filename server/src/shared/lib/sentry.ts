import * as Sentry from '@sentry/node'

import { type ISentryErrorContext, shouldIgnoreSentryError } from 'common'

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
