import { captureException, isInitialized } from '@sentry/react'

export const frontCaptureSentryException = (error: unknown) => {
  if (!isInitialized()) return

  captureException(error)
}
