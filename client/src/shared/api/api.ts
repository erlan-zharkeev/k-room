import axios, { AxiosError, AxiosResponse } from 'axios'
import { Status, RouteNames, EndpointsType } from 'common-types'
import { AppDispatch } from 'src/app/store'
import { publicRoutes } from 'src/app/router/routes'
import { useNotification, UseNotification } from 'src/entities/notification/hooks/use-notification'
import { useDispatch } from 'react-redux'
import { clg } from 'src/shared/utils'
import { changeSelectedContentElement } from 'src/entities/settings'
import { changeIsAppLoading } from 'src/entities/system'

axios.defaults.withCredentials = true

const successMessageHandler = (response: AxiosResponse, notifications: UseNotification) => {
  if (!response) return
  const { message, silent } = response.data
  const isSuccess = response.status === Status.Success
  const successMessageNotification = notifications.getNotification({
    message,
    messageType: isSuccess ? 'success' : 'warning'
  })
  if (message && !silent) {
    successMessageNotification.open()
  }
}

export const apiErrorInterceptor = async (e: unknown, dispatch?: AppDispatch, notifications?: UseNotification) => {
  if (e instanceof AxiosError) {
    const status = e.response?.status
    let { message, silent } = e.response?.data ?? {}
    switch (status) {
      case Status.NotAuth: {
        const isCurrentRoutePublic = publicRoutes.some((route) => route.path === window.location.pathname)
        if (!isCurrentRoutePublic) {
          window.location.href = RouteNames.SIGN_IN
          silent = true
        }
        break
      }
      case Status.Forbidden: {
        if (dispatch) dispatch(changeSelectedContentElement('contacts'))
        break
      }
    }
    if (!notifications) return
    const notificationMessage = message ?? `An error has occurred, please try again later. Error: ${e.message}`
    const errorInterceptorNotification = notifications.getNotification({
      message: notificationMessage,
      messageType: 'error'
    })
    silent ? clg('error', message) : errorInterceptorNotification.open()
  }
  if (dispatch) dispatch(changeIsAppLoading(false))
}

type RequestTypes = 'post' | 'get' | 'patch' | 'put' | 'delete'

export const useApi = () => {
  const notifications = useNotification()
  const dispatch = useDispatch<AppDispatch>()

  const doRequest = async (
    type: RequestTypes,
    endpoint: EndpointsType,
    data: any = {},
    contentType: string = 'application/json'
  ) => {
    const options = { headers: { 'Content-Type': contentType } }
    try {
      const response = await axios[type](`/api${endpoint}`, data, options)
      successMessageHandler(response, notifications)
      return response as AxiosResponse
    } catch (e: unknown) {
      apiErrorInterceptor(e, dispatch, notifications)
    }
  }
  return {
    doRequest
  }
}
