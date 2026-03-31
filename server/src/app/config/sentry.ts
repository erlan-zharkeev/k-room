import * as Sentry from '@sentry/node'
import type { Express } from 'express'

import { shouldIgnoreSentryError } from 'common'

import { ENV } from 'src/shared/config'

export const initSentry = () => {
  if (ENV.SENTRY_ENABLED !== 'true' || Sentry.isInitialized()) {
    return
  }

  Sentry.init({
    dsn: 'https://ab1874087030df840c3e1feadaee596b@o4511099405139968.ingest.us.sentry.io/4511099731181568',
    enabled: ENV.SENTRY_ENABLED === 'true',
    environment: ENV.SENTRY_ENVIRONMENT,
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
