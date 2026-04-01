import { frontCaptureSentryException } from 'src/shared/lib/sentry'
import { log } from 'src/shared/utils'

export const handleRuntimeError = (message: string, error?: unknown) => {
  log('error', message, error)
  frontCaptureSentryException(error ?? new Error(message))
}
