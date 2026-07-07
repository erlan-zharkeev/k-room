import { captureException, captureMessage, isInitialized, withScope, type Scope } from '@sentry/node'
import { isNumber, shouldIgnoreSentryError, type SentryErrorContext } from 'global-shared'

type ServerSentryScopeCallback = (scope: Scope) => void

export const serverCaptureSentryException = (error: unknown) => {
  if (!isInitialized()) {
    return
  }

  captureException(error)
}

export const serverCaptureSentryScopedException = (error: unknown, callback: ServerSentryScopeCallback) => {
  if (!isInitialized()) {
    return
  }

  withScope((scope) => {
    callback(scope)
    captureException(error)
  })
}

const generateSentryError =
  (kind: 'http-error' | 'socket-error') =>
  ({ message, silent, status }: SentryErrorContext) => {
    if (!isInitialized()) {
      return
    }

    if (shouldIgnoreSentryError({ message, silent, status })) {
      return
    }

    captureMessage(message ?? 'Unknown server error', {
      level: 'error',
      tags: {
        kind,
        ...(isNumber(status) ? { status: String(status) } : {})
      }
    })
  }

export const serverCaptureSentryHttpError = generateSentryError('http-error')
export const serverCaptureSentrySocketError = generateSentryError('socket-error')
