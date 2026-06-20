import * as Sentry from '@sentry/vue'

import { router } from '../router'

import type { VueApp } from './types'

export const initSentry = (app: VueApp) => {
  const { appVersion, isDev, sentryDsnClient, sentryEnabled, sentryEnvironment } = __CLIENT_ENV_DATA__

  if (!sentryEnabled || !sentryDsnClient) {
    return
  }

  Sentry.init({
    app,
    dsn: sentryDsnClient,
    environment: sentryEnvironment,
    release: appVersion,
    integrations: [Sentry.browserTracingIntegration({ router })],
    tracesSampleRate: isDev ? 1 : 0.1
  })
}
