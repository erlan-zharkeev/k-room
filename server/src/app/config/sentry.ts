import * as Sentry from '@sentry/node'
import type { Express } from 'express'

import { shouldIgnoreSentryError } from 'common'

import { ENV } from 'src/shared/config'

export const initSentry = () => {
  if (ENV.SENTRY_ENABLED !== 'true' || !ENV.SENTRY_DSN_SERVER || Sentry.isInitialized()) {
    return
  }

  Sentry.init({
    dsn: ENV.SENTRY_DSN_SERVER,
    enabled: ENV.SENTRY_ENABLED === 'true',
    environment: ENV.SENTRY_ENVIRONMENT,
    release: ENV.SENTRY_RELEASE || undefined,
    debug: false,
    tracesSampleRate: ENV.SENTRY_ENVIRONMENT === 'development' ? 1 : 0.1,
    beforeSend(event, hint) {
      const originalException = hint.originalException

      if (originalException instanceof Error) {
        if (shouldIgnoreSentryError({ message: originalException.message })) {
          return null
        }
      }

      return event
    }
  })
}

export const setupSentryErrorHandler = (app: Express) => {
  if (!Sentry.isInitialized()) return

  Sentry.setupExpressErrorHandler(app)
}
