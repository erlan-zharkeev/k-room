import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

import { IBackendResponse, ROUTE_NAMES, REQ_STATUS, ReqStatusType } from 'common'

import { API_I18N, createApiError } from 'src/shared/api'
import { frontCaptureSentryException, log } from 'src/shared/lib'
import { useI18n, useSettings } from 'src/shared/preferences'

import { useNotification } from '../../notification'

const isBackendResponse = (data: unknown): data is IBackendResponse<unknown> => {
  if (!data || typeof data !== 'object') return false

  const candidate = data as Record<string, unknown>
  const message = candidate.message

  if (!message || typeof message !== 'object') return false

  const inferredMessage = message as Record<string, unknown>

  return typeof inferredMessage.text === 'string' && typeof inferredMessage.silent === 'boolean'
}

const extractErrorPayload = async (e: AxiosError) => {
  const res = e.response
  if (!res) return null

  const data = res.data

  if (data instanceof Blob) {
    if (data.type?.includes('application/json')) {
      try {
        const text = await data.text()
        const parsed = JSON.parse(text)
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
  const settings = useSettings()
  const notifications = useNotification()
  const navigate = useNavigate()

  const interceptError = async (error: unknown) => {
    frontCaptureSentryException(error)
    if (error instanceof AxiosError) {
      const status = error.response?.status as ReqStatusType | undefined

      const payload = await extractErrorPayload(error)
      let text: string | undefined
      let silent: boolean | undefined

      if (payload?.message) {
        ;({ text, silent } = payload.message)
      }

      switch (status) {
        case REQ_STATUS.notAuth: {
          silent = true
          const isOnMain = location.pathname === ROUTE_NAMES.main
          if (isOnMain) {
            navigate(ROUTE_NAMES.login)
          }
          break
        }
        case REQ_STATUS.forbidden: {
          settings.shallowUpdate({ selectedContentTab: 'contacts' })
          break
        }
      }

      const notificationMessage = text ?? t(API_I18N.genericError)(error.message)

      const errorInterceptorNotification = notifications.getNotification({
        message: notificationMessage,
        messageType: 'error'
      })
      if (silent) {
        log('error', text ?? t(API_I18N.unknownError))
      } else {
        errorInterceptorNotification.open()
      }

      return createApiError({
        message: notificationMessage,
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
