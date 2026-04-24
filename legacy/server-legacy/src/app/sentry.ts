import { init, isInitialized, setupExpressErrorHandler } from '@sentry/node'
import type { NodeOptions } from '@sentry/node'
import { shouldIgnoreSentryError } from 'common'
import type { Express } from 'express'

import { SERVER_ENV } from 'src/shared/config'

const SENTRY_BASE_CONFIG = {
  dsn: 'https://ab1874087030df840c3e1feadaee596b@o4511099405139968.ingest.us.sentry.io/4511099731181568',
  enabled: true,
  environment: SERVER_ENV.sentryEnvironment,
  release: SERVER_ENV.appVersion,
  debug: false,
  tracesSampleRate: SERVER_ENV.isDev ? 1 : 0.1
} as const

export const initSentry = () => {
  if (!SERVER_ENV.sentryEnabled || isInitialized()) return

  const beforeSend: NonNullable<NodeOptions['beforeSend']> = (event, hint) => {
    const originalException = hint.originalException
    if (originalException instanceof Error) {
      if (shouldIgnoreSentryError({ message: originalException.message })) {
        return null
      }
    }

    return event
  }

  init({
    ...SENTRY_BASE_CONFIG,
    beforeSend
  })
}

export const setupSentryErrorHandler = (app: Express) => {
  if (!isInitialized()) return

  setupExpressErrorHandler(app)
}
