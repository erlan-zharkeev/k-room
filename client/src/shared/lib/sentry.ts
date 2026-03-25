import * as Sentry from '@sentry/react'

export const frontCaptureSentryException = (error: unknown) => {
  if (!Sentry.isInitialized()) return

  Sentry.captureException(error)
}
