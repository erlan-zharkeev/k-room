import { AxiosError } from 'axios'
import { StatusEnum, RouteNamesEnum } from 'common-types'
import { useLocation, useNavigate } from 'react-router-dom'

import { useNotification } from 'src/entities/notification/hooks/use-notification'
import { useSettings } from 'src/entities/settings'

import { clg } from 'src/shared/utils'

export const useApiInterсeptor = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const settings = useSettings()
  const notifications = useNotification()

  const interceptError = (e: unknown) => {
    if (e instanceof AxiosError) {
      const status = e.response?.status
      let { text, silent } = e.response?.data.message ?? {}

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
          settings.update({ selectedContentTab: 'contacts' })
          break
        }
      }

      const notificationMessage = text ?? `An error has occurred, please try again later. Error: ${e.message}`

      const errorInterceptorNotification = notifications.getNotification({
        message: notificationMessage,
        messageType: 'error'
      })

      silent ? clg('error', text) : errorInterceptorNotification.open()
    }
  }

  return {
    interceptError
  }
}
