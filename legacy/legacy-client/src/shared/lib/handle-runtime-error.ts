import { log } from 'src/shared/lib/log'
import { frontCaptureSentryException } from 'src/shared/lib/sentry'

export const handleRuntimeError = (message: string, error?: unknown) => {
  log('error', message, error)
  frontCaptureSentryException(error ?? new Error(message))
}
