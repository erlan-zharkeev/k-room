import * as Sentry from '@sentry/node'
import type { Express } from 'express'

import { shouldIgnoreSentryError } from 'common'

import { SERVER_ENV } from 'src/shared/config'

export const initSentry = () => {
  if (!SERVER_ENV.sentryEnabled || Sentry.isInitialized()) {
    return
  }

  Sentry.init({
    dsn: 'https://ab1874087030df840c3e1feadaee596b@o4511099405139968.ingest.us.sentry.io/4511099731181568',
    enabled: true,
    environment: SERVER_ENV.sentryEnvironment,
    release: SERVER_ENV.appVersion,
    debug: false,
    tracesSampleRate: SERVER_ENV.isDev  ? 1 : 0.1,
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
