import axios, { AxiosResponse } from 'axios'
import { NotificationType, RouteNames, Status } from 'common-types'
import { AppDispatch } from 'src/store'
import { changeIsAppLoading } from 'src/store/userSlice'
import { showNotification } from 'src/store/systemSlice'
import $clg from 'src/services/$clg'

axios.defaults.withCredentials = true

const successMessageHandler = (response: AxiosResponse, dispatch: AppDispatch) => {
  if (!response) return
  const { message, silent } = response.data
  const isSuccess = response.status === Status.success
  if (message && !silent) {
    dispatch(showNotification({ message, messageType: isSuccess ? NotificationType.success : NotificationType.warn }))
  }
}

const errorInterceptor = async (e: any, dispatch: AppDispatch) => {
  const { status } = e.response ?? e.response?.data?.status
  let { message, silent } = e.response?.data
  switch (status) {
    case Status.notAuth:
      const isInitRoute = window.location.pathname === RouteNames.SIGN_IN
      if (!isInitRoute) window.location.href = RouteNames.SIGN_IN
      break
  }
  dispatch(changeIsAppLoading(false))
  const notificationMessage = message ?? `An error has occurred, please try again later. ERROR: ${e.message}`
  silent
    ? $clg('error', message)
    : dispatch(showNotification({ message: notificationMessage, messageType: NotificationType.error }))
}

type RequestTypes = 'post' | 'get' | 'patch' | 'put'

const $api = async (
  type: RequestTypes,
  endpoint: string,
  dispatch: AppDispatch,
  payload: any = null,
  contentType: string = 'application/json'
) => {
  const options = { headers: { 'Content-Type': contentType } }
  try {
    const response = await axios[type](`/api${endpoint}`, payload, options)
    successMessageHandler(response, dispatch)
    return response
  } catch (e: any) {
    errorInterceptor(e, dispatch)
  }
}

export default $api
