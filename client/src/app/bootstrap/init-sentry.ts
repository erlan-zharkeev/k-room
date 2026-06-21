import * as Sentry from '@sentry/vue'
import { MONITORING_ENDPOINTS } from 'global-shared'

import { router } from '../router'

import type { VueApp } from './types'

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
    tracesSampleRate: isDev ? 1 : 0.1
  })
}
