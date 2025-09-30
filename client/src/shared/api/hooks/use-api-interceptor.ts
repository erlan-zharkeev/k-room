import { AxiosError } from 'axios'
import { StatusEnum, RouteNamesEnum } from 'common-types'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { useResetAllStores } from 'src/features/reset-all-stores'

import { useNotification } from 'src/entities/notification/hooks/use-notification'
import { useSettings } from 'src/entities/settings'

import { clg } from 'src/shared/utils'

const extractErrorPayload = async (e: AxiosError) => {
  const res = e.response
  if (!res) return null

  const data = res.data as any

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
  return data
}

export const useApiInterсeptor = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const settings = useSettings()
  const notifications = useNotification()
  const dispatch = useDispatch()
  const { reset: resetStores } = useResetAllStores(dispatch)

  const interceptError = async (e: unknown) => {
    if (e instanceof AxiosError) {
      const status = e.response?.status

      const payload = await extractErrorPayload(e)
      let text: string | undefined
      let silent: boolean | undefined

      if (payload?.message) {
        ({ text, silent } = payload.message)
      }

      switch (status) {
        case StatusEnum.NotAuth: {
          silent = true
          resetStores()
          const isOnMain = location.pathname === RouteNamesEnum.Main
          console.log(isOnMain, 'is on main')
          if (isOnMain) {
            console.log('trying to navigate')
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
    }
  }

  return {
    interceptError
  }
}
