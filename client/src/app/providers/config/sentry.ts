import * as Sentry from '@sentry/react'
import { SENTRY_IGNORED_SUBSTRINGS, StatusEnum, type ISentryErrorContext } from 'common-types'

import { isApiError } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'

const isIgnoredStatus = (status?: number | null) => {
  switch (status) {
    case StatusEnum.BadRequest:
    case StatusEnum.NotAuth:
    case StatusEnum.Forbidden:
    case StatusEnum.NotFound:
      return true
    default:
      return false
  }
}

const getClientTracePropagationTargets = () => [
  /^\/api/,
  `${CLIENT_ENV.host}:${CLIENT_ENV.serverPort}`,
  `${CLIENT_ENV.host}/api`
]

const shouldIgnoreSentryError = ({ message, silent, status }: ISentryErrorContext) => {
  if (silent) return true
  if (isIgnoredStatus(status)) return true
  if (!message) return false

  const normalizedMessage = message.toLowerCase()

  return SENTRY_IGNORED_SUBSTRINGS.some((substring) => normalizedMessage.includes(substring))
}

export const frontCaptureSentryException = (error: unknown) => {
  if (!Sentry.isInitialized()) return

  Sentry.captureException(error)
}

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
