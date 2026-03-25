import * as Sentry from '@sentry/react'
import { shouldIgnoreSentryError } from 'common'

import { isApiError } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'

const getClientTracePropagationTargets = () => [
  /^\/api/,
  `${CLIENT_ENV.appHost}:${CLIENT_ENV.clientPort}`,
  `${CLIENT_ENV.apiHost}:${CLIENT_ENV.serverPort}`,
  `${CLIENT_ENV.apiHost}/api`
]

export const initSentry = () => {
  if (!CLIENT_ENV.sentryEnabled || !CLIENT_ENV.sentryDsnClient || Sentry.isInitialized()) {
    return
  }

  Sentry.init({
    dsn: CLIENT_ENV.sentryDsnClient,
    enabled: CLIENT_ENV.sentryEnabled,
    environment: CLIENT_ENV.sentryEnvironment,
    release: CLIENT_ENV.sentryRelease || undefined,
    debug: false,
    tracePropagationTargets: getClientTracePropagationTargets(),
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.breadcrumbsIntegration({
        console: false
      })
    ],
    tracesSampleRate: CLIENT_ENV.sentryEnvironment === 'development' ? 1 : 0.1,
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'console') {
        return null
      }

      return breadcrumb
    },
    beforeSend(event, hint) {
      const originalException = hint.originalException

      if (isApiError(originalException)) {
        const message = originalException.payload?.message.text ?? originalException.message

        if (
          shouldIgnoreSentryError({
            message,
            silent: originalException.silent,
            status: originalException.status
          })
        ) {
          return null
        }
      }

      return event
    }
  })
}
