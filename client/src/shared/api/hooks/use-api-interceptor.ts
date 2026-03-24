import { AxiosError } from 'axios'
import { IBackendResponse, RouteNamesEnum, StatusEnum } from 'common-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useResetAllStores } from 'src/features/reset-all-stores'

import { useNotification } from 'src/entities/notification'
import { useSettings } from 'src/entities/settings'

import { ApiError } from 'src/shared/api'
import { clg } from 'src/shared/utils'

const extractErrorPayload = async (e: AxiosError) => {
  const res = e.response
  if (!res) return null

  const data = res.data

  if (data instanceof Blob) {
    if (data.type?.includes('application/json')) {
      try {
        const text = await data.text()
        return JSON.parse(text)
      } catch {
        return null
      }
    }
    return null
  }
  return data as IBackendResponse<unknown> | null
}

export const useApiInterсeptor = () => {
  const settings = useSettings()
  const notifications = useNotification()
  const dispatch = useDispatch()
  const { reset: resetStores } = useResetAllStores(dispatch)
  const navigate = useNavigate()

  useResetAllStores(dispatch)

  const interceptError = async (e: unknown) => {
    if (e instanceof AxiosError) {
      const status = e.response?.status

      const payload = await extractErrorPayload(e)
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

      const notificationMessage = text ?? `An error has occurred, please try again later. Error: ${e.message}`

      const errorInterceptorNotification = notifications.getNotification({
        message: notificationMessage,
        messageType: 'error'
      })
      silent ? clg('error', text ?? 'Unknown error') : errorInterceptorNotification.open()

      return new ApiError({
        message: notificationMessage,
        status,
        silent,
        payload
      })
    }

    if (e instanceof Error) {
      return new ApiError({ message: e.message })
    }

    return new ApiError({ message: 'Unknown error' })
  }

  return {
    interceptError
  }
}
