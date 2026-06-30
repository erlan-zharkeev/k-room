import * as Sentry from '@sentry/vue'
import type { Scope } from '@sentry/vue'

type ClientSentryScopeCallback<T> = (scope: Scope) => T

export const withClientSentryScope = <T>(callback: ClientSentryScopeCallback<T>) => Sentry.withScope(callback)

export const captureClientSentryMessage = (...args: Parameters<typeof Sentry.captureMessage>) =>
  Sentry.captureMessage(...args)
