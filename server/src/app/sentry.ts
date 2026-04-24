import { init, isInitialized, setupExpressErrorHandler, type NodeOptions } from '@sentry/node'
import type { Express } from 'express'
import { shouldIgnoreSentryError } from 'shared'

import { SERVER_ENV } from './config/env'

const SENTRY_BASE_CONFIG = {
  dsn: 'https://ab1874087030df840c3e1feadaee596b@o4511099405139968.ingest.us.sentry.io/4511099731181568',
  enabled: true,
  environment: SERVER_ENV.sentry.sentryEnvironment,
  release: SERVER_ENV.info.appVersion,
  debug: false,
  tracesSampleRate: SERVER_ENV.isDev ? 1 : 0.1
} as const

export const initSentry = () => {
  if (!SERVER_ENV.sentry.sentryEnabled || isInitialized()) {
    return
  }

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
  if (!isInitialized()) {
    return
  }

  setupExpressErrorHandler(app)
}
