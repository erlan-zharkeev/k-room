import { AxiosError } from 'axios'
import { isString, isUnknownObject, shouldIgnoreSentryError } from 'global-shared'

import { captureClientSentryMessage, withClientSentryScope } from 'src/shared/lib'

import {
  FAILED_TO_PERFORM_OPERATION_MESSAGE_PART,
  FAILED_TO_PERFORM_OPERATION_SENTRY_CONTEXT,
  FAILED_TO_PERFORM_OPERATION_SENTRY_FINGERPRINT,
  FAILED_TO_PERFORM_OPERATION_SENTRY_MESSAGE,
  FAILED_TO_PERFORM_OPERATION_SENTRY_TAG
} from './http-diagnostics.constants'
import type { FailedToPerformOperationHttpCaptureOptions } from './types'

const getStringField = (value: unknown, field: string) => {
  if (!isUnknownObject(value)) return undefined

  const fieldValue = Reflect.get(value, field)

  return isString(fieldValue) ? fieldValue : undefined
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message

  return getStringField(error, 'message')
}

const getUrlWithoutSearch = (value: string | undefined) => {
  if (!value) return undefined

  try {
    const url = new URL(value, window.location.origin)

    return `${url.origin}${url.pathname}`
  } catch {
    return value.split('?')[0]
  }
}

const isTauriRuntime = () => '__TAURI_INTERNALS__' in window || '__TAURI__' in window

export const isFailedToPerformOperationError = (error: unknown) => {
  const message = getErrorMessage(error)

  return message?.toLowerCase().includes(FAILED_TO_PERFORM_OPERATION_MESSAGE_PART) ?? false
}

export const captureFailedToPerformOperationHttpError = (
  error: unknown,
  options: FailedToPerformOperationHttpCaptureOptions = {}
) => {
  const { displayedMessage, fallbackMessage, silent, status } = options
  const displayedFallback = Boolean(fallbackMessage && displayedMessage === fallbackMessage)
  const hasFallbackErrorMessage =
    isFailedToPerformOperationError(error) ||
    (displayedMessage ? displayedMessage.toLowerCase().includes(FAILED_TO_PERFORM_OPERATION_MESSAGE_PART) : false)

  if (!displayedFallback && !hasFallbackErrorMessage) return

  const { apiBaseUrl, appVersion } = __CLIENT_ENV_DATA__
  const axiosError = error instanceof AxiosError ? error : undefined
  const { config, response } = axiosError ?? {}
  const errorMessage = getErrorMessage(error)
  const sentryMessage = errorMessage ?? displayedMessage
  const responseStatus = response?.status ?? status

  if (shouldIgnoreSentryError({ message: sentryMessage, silent, status: responseStatus })) return

  withClientSentryScope((scope) => {
    scope.setLevel('error')
    scope.setTag(FAILED_TO_PERFORM_OPERATION_SENTRY_TAG, 'true')
    scope.setFingerprint(FAILED_TO_PERFORM_OPERATION_SENTRY_FINGERPRINT)
    scope.setContext(FAILED_TO_PERFORM_OPERATION_SENTRY_CONTEXT, {
      apiBaseUrl,
      appVersion,
      currentOrigin: window.location.origin,
      currentProtocol: window.location.protocol,
      errorCode: axiosError?.code ?? getStringField(error, 'code'),
      errorMessage,
      errorName: error instanceof Error ? error.name : getStringField(error, 'name'),
      displayedMessage,
      online: navigator.onLine,
      platform: navigator.platform,
      requestMethod: config?.method,
      requestUrl: getUrlWithoutSearch(config?.url),
      responseStatus,
      responseStatusText: response?.statusText,
      tauriRuntime: isTauriRuntime(),
      userAgent: navigator.userAgent
    })

    captureClientSentryMessage(FAILED_TO_PERFORM_OPERATION_SENTRY_MESSAGE)
  })
}
