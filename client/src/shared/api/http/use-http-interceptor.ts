import { AxiosError } from 'axios'
import { REQ_STATUS, ROUTE_NAMES, type IBackendResponse, type ReqStatusType } from 'global-shared'
import { useRouter } from 'vue-router'

import { TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { createHttpError } from './create-http-error'
import { extractErrorPayload } from './extract-error-payload'
import { HTTP_I18N } from './i18n'
import { isMediaRequestError } from './is-media-request-error'

export const useHttpInterceptor = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const router = useRouter()

  const interceptError = async (error: unknown) => {
    if (error instanceof AxiosError) {
      const status = error.response?.status as ReqStatusType | undefined
      const mediaRequestError = isMediaRequestError(error)
      const payload = (await extractErrorPayload(error)) as IBackendResponse<unknown> | null
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

        if (router.currentRoute.value.path.startsWith(ROUTE_NAMES.app)) {
          await router.push(ROUTE_NAMES.authLogin)
        }
      }

      const message = text ?? t(HTTP_I18N.genericError)(error.message)

      if (mediaRequestError) {
        return createHttpError({
          message,
          status,
          silent: true,
          payload
        })
      }

      if (silent) {
        log('error', text ?? t(HTTP_I18N.unknownError))

        return createHttpError({
          message,
          status,
          silent,
          payload
        })
      }

      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: message
      })

      return createHttpError({
        message,
        status,
        silent,
        payload
      })
    }

    log('error', 'HTTP request failed', error)

    if (error instanceof Error) {
      return createHttpError({ message: error.message })
    }

    return createHttpError({ message: t(HTTP_I18N.unknownError) })
  }

  return {
    interceptError
  }
}
