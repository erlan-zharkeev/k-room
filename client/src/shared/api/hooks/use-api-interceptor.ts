import { AxiosError } from 'axios'
import { IBackendResponse, RouteNamesEnum, StatusEnum } from 'common'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useResetAllStores } from 'src/features/reset-all-stores'

import { useNotification } from 'src/entities/notification'
import { useI18n, useSettings } from 'src/entities/settings'

import { API_I18N, createApiError } from 'src/shared/api'
import { frontCaptureSentryException } from 'src/shared/lib'
import { log } from 'src/shared/utils'

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
  const dispatch = useDispatch()
  const { reset: resetStores } = useResetAllStores(dispatch)
  const navigate = useNavigate()

  useResetAllStores(dispatch)

  const interceptError = async (error: unknown) => {
    frontCaptureSentryException(error)
    if (error instanceof AxiosError) {
      const status = error.response?.status

      const payload = await extractErrorPayload(error)
      let text: string | undefined
      let silent: boolean | undefined

      if (payload?.message) {
        ;({ text, silent } = payload.message)
      }

      switch (status) {
        case StatusEnum.NotAuth: {
          silent = true
          resetStores()
          const isOnMain = location.pathname === RouteNamesEnum.Main
          if (isOnMain) {
            navigate(RouteNamesEnum.Login)
          }
          break
        }
        case StatusEnum.Forbidden: {
          settings.update({ selectedContentTab: 'contacts' })
          break
        }
      }

      const notificationMessage = text ?? t(API_I18N.genericError)(error.message)

      const errorInterceptorNotification = notifications.getNotification({
        message: notificationMessage,
        messageType: 'error'
      })
      silent ? log('error', text ?? t(API_I18N.unknownError)) : errorInterceptorNotification.open()

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
