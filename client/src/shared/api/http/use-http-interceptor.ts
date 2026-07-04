import { AxiosError } from 'axios'
import { REQ_STATUS, ROUTE_NAMES, type BackendResponse, type ReqStatus } from 'global-shared'
import { useRouter } from 'vue-router'

import { log, syncAppBadge, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { API_I18N } from '../i18n'
import { handleHttpTransportMeta } from '../transport-meta'

import { createHttpError } from './create-http-error'
import { extractErrorPayload } from './extract-error-payload'
import { captureFailedToPerformOperationHttpError } from './http-diagnostics'
import { isMediaRequestError } from './is-media-request-error'
import type { HttpRequestOptions } from './types'

export const useHttpInterceptor = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const router = useRouter()

  const showSharedErrorToast = (content: string) => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content
    })
  }

  const interceptError = async (error: unknown, options: Pick<HttpRequestOptions, 'showErrorToast'> = {}) => {
    const { showErrorToast = true } = options
    const fallbackMessage = t(API_I18N.operationFailed)

    captureFailedToPerformOperationHttpError(error)

    if (error instanceof AxiosError) {
      const status = error.response?.status as ReqStatus | undefined
      const mediaRequestError = isMediaRequestError(error)

      if (error.response) {
        handleHttpTransportMeta(error.response)
      }

      const payload = (await extractErrorPayload(error)) as BackendResponse<unknown> | null
      let text: string | undefined
      let silent: boolean | undefined

      if (!mediaRequestError) {
        log('error', 'HTTP request failed', error)
      }

      if (payload?.message) {
        text = payload.message.text
        silent = payload.message.silent
      }

      if (status === REQ_STATUS.notAuth) {
        silent = true
        await syncAppBadge(0)

        if (router.currentRoute.value.path.startsWith(ROUTE_NAMES.app)) {
          await router.push(ROUTE_NAMES.authLogin)
        }
      }

      const message = !silent && text ? text : fallbackMessage
      const errorMessage = error.response ? message : error.message

      if (mediaRequestError) {
        return createHttpError({
          message: errorMessage,
          status,
          silent: true,
          payload
        })
      }

      if (silent) {
        log('error', text ?? fallbackMessage)

        return createHttpError({
          message: errorMessage,
          status,
          silent,
          payload
        })
      }

      if (showErrorToast) {
        showSharedErrorToast(message)
      }

      return createHttpError({
        message: errorMessage,
        status,
        silent,
        payload
      })
    }

    log('error', 'HTTP request failed', error)

    if (showErrorToast) {
      showSharedErrorToast(fallbackMessage)
    }

    return createHttpError({ message: fallbackMessage })
  }

  return {
    interceptError
  }
}
