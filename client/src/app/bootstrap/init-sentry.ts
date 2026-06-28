import * as Sentry from '@sentry/vue'
import {
  MONITORING_ENDPOINTS,
  isBoolean,
  isNumber,
  isString,
  isUnknownObject,
  shouldIgnoreSentryError
} from 'global-shared'

import { router } from '../router'

import type { VueApp } from './types'

const shouldIgnoreClientSentryException = (originalException: unknown) => {
  if (isString(originalException)) {
    return shouldIgnoreSentryError({ message: originalException })
  }

  if (!(originalException instanceof Error)) {
    return false
  }

  const status = isUnknownObject(originalException) ? Reflect.get(originalException, 'status') : undefined
  const silent = isUnknownObject(originalException) ? Reflect.get(originalException, 'silent') : undefined

  return shouldIgnoreSentryError({
    message: originalException.message,
    ...(isBoolean(silent) ? { silent } : {}),
    ...(isNumber(status) ? { status } : {})
  })
}

const shouldIgnoreClientSentryEvent = (hint: unknown) => {
  if (!isUnknownObject(hint)) return false

  return shouldIgnoreClientSentryException(Reflect.get(hint, 'originalException'))
}

export const initSentry = (app: VueApp) => {
  const { apiBaseUrl, appVersion, isDev, sentryDsnClient, sentryEnabled, sentryEnvironment } = __CLIENT_ENV_DATA__

  if (!sentryEnabled || !sentryDsnClient) {
    return
  }

  Sentry.init({
    app,
    dsn: sentryDsnClient,
    environment: sentryEnvironment,
    release: appVersion,
    tunnel: `${apiBaseUrl}${MONITORING_ENDPOINTS.sentryEnvelope}`,
    integrations: [Sentry.browserTracingIntegration({ router })],
    beforeSend: (event, hint) => {
      if (shouldIgnoreClientSentryEvent(hint)) {
        return null
      }

      return event
    },
    tracesSampleRate: isDev ? 1 : 0.1
  })
}
