import { AxiosError } from 'axios'
import { StatusEnum, RouteNamesEnum } from 'common-types'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { useNotification } from 'src/entities/notification/hooks/use-notification'
import { useSettings } from 'src/entities/settings'
import { updateAppLoaderState } from 'src/entities/system'

import { clg } from 'src/shared/utils'

export const useApiInterсeptor = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { updateSetting } = useSettings()
  const notifications = useNotification()

  const interceptError = (e: unknown) => {
    if (e instanceof AxiosError) {
      const status = e.response?.status
      let { message, silent } = e.response?.data ?? {}

      switch (status) {
        case StatusEnum.NotAuth: {
          const isOnMain = location.pathname === RouteNamesEnum.Main
          if (isOnMain) {
            navigate(RouteNamesEnum.Login)
            silent = true
          }
          break
        }
        case StatusEnum.Forbidden: {
          updateSetting({ selectedContentTab: 'contacts' })
          break
        }
      }

      const notificationMessage = message ?? `An error has occurred, please try again later. Error: ${e.message}`

      const errorInterceptorNotification = notifications.getNotification({
        message: notificationMessage,
        messageType: 'error'
      })

      silent ? clg('error', message) : errorInterceptorNotification.open()
    }

    dispatch(updateAppLoaderState(false))
  }

  return {
    interceptError
  }
}
