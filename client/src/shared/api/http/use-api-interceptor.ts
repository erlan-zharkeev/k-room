import { AxiosError } from 'axios'
import { REQ_STATUS, ROUTE_NAMES, type IBackendResponse, type ReqStatusType } from 'global-shared'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

import { API_I18N, ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'

import { createApiError } from './create-api-error'
import { extractErrorPayload } from './extract-error-payload'
import { isMediaRequestError } from './is-media-request-error'

export const useApiInterceptor = () => {
  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()

  const interceptError = async (error: unknown) => {
    if (error instanceof AxiosError) {
      const status = error.response?.status as ReqStatusType | undefined
      const mediaRequestError = isMediaRequestError(error)
      const payload = (await extractErrorPayload(error)) as IBackendResponse<unknown> | null
      let text: string | undefined
      let silent: boolean | undefined

      if (!mediaRequestError) {
        log('error', 'API request failed', error)
      }

      if (payload?.message) {
        text = payload.message.text
        silent = payload.message.silent
      }

      if (status === REQ_STATUS.notAuth) {
        silent = true

        if (router.currentRoute.value.path.startsWith(ROUTE_NAMES.app)) {
          await router.push(ROUTE_NAMES.authLogin)
        }
      }

      const message = text ?? t(API_I18N.genericError)(error.message)

      if (mediaRequestError) {
        return createApiError({
          message,
          status,
          silent: true,
          payload
        })
      }

      if (silent) {
        log('error', text ?? t(API_I18N.unknownError))

        return createApiError({
          message,
          status,
          silent,
          payload
        })
      }

      toast.add({
        severity: 'error',
        summary: t(TOAST_I18N.error),
        detail: message,
        life: ERROR_TOAST_LIFE_MS
      })

      return createApiError({
        message,
        status,
        silent,
        payload
      })
    }

    log('error', 'API request failed', error)

    if (error instanceof Error) {
      return createApiError({ message: error.message })
    }

    return createApiError({ message: t(API_I18N.unknownError) })
  }

  return {
    interceptError
  }
}
