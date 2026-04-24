import { breadcrumbsIntegration, browserTracingIntegration, init, isInitialized } from '@sentry/react'
import type { Breadcrumb, BrowserOptions } from '@sentry/react'

import { shouldIgnoreSentryError } from 'common'

import { isApiError } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'

export const useInitSentry = () => {
  if (!CLIENT_ENV.sentryEnabled || !CLIENT_ENV.sentryDsnClient || isInitialized()) {
    return
  }

  const tracePropagationTargets = [
    new RegExp(`^${CLIENT_ENV.apiPath}`),
    `${CLIENT_ENV.appHost}:${CLIENT_ENV.clientPort}`,
    `${CLIENT_ENV.apiHost}:${CLIENT_ENV.serverPort}`,
    `${CLIENT_ENV.apiHost}${CLIENT_ENV.apiPath}`
  ]

  const integrations = [
    browserTracingIntegration(),
    breadcrumbsIntegration({
      console: false
    })
  ]

  const beforeBreadcrumb = (breadcrumb: Breadcrumb) => {
    if (breadcrumb.category === 'console') {
      return null
    }
    return breadcrumb
  }

  const beforeSend: NonNullable<BrowserOptions['beforeSend']> = (event, hint) => {
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

  init({
    dsn: CLIENT_ENV.sentryDsnClient,
    enabled: CLIENT_ENV.sentryEnabled,
    environment: CLIENT_ENV.sentryEnvironment,
    release: CLIENT_ENV.appVersion,
    debug: false,
    tracePropagationTargets,
    integrations,
    tracesSampleRate: CLIENT_ENV.sentryEnvironment === 'development' ? 1 : 0.1,
    beforeBreadcrumb,
    beforeSend
  })
}
