import { AxiosError } from 'axios'
import { REQ_STATUS, ROUTE_NAMES, type IBackendResponse, type ReqStatusType } from 'global-shared'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

import { API_I18N, API_TOAST_LIFE_MS } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'

import { createApiError } from './create-api-error'
import { isBackendResponse } from './is-backend-response'

const extractErrorPayload = async (error: AxiosError) => {
  const { response } = error
  if (!response) return null

  const { data } = response

  if (data instanceof Blob) {
    if (data.type?.includes('application/json')) {
      try {
        const parsed = JSON.parse(await data.text())

        return isBackendResponse(parsed) ? parsed : null
      } catch {
        return null
      }
    }

    return null
  }

  return isBackendResponse(data) ? data : null
}

export const useApiInterceptor = () => {
  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()

  const interceptError = async (error: unknown) => {
    log('error', 'API request failed', error)

    if (error instanceof AxiosError) {
      const status = error.response?.status as ReqStatusType | undefined
      const payload = (await extractErrorPayload(error)) as IBackendResponse<unknown> | null
      let text: string | undefined
      let silent: boolean | undefined

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

      if (silent) {
        log('error', text ?? t(API_I18N.unknownError))
      } else {
        toast.add({
          severity: 'error',
          summary: message,
          life: API_TOAST_LIFE_MS
        })
      }

      return createApiError({
        message,
        status,
        silent,
        payload
      })
    }

    if (error instanceof Error) {
      return createApiError({ message: error.message })
    }

    return createApiError({ message: t(API_I18N.unknownError) })
  }

  return {
    interceptError
  }
}
