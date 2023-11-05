import axios, { AxiosResponse } from 'axios'
import { NotificationType, RouteNames, Status } from 'common-types'
import { AppDispatch } from 'src/store'
import { changeIsAppLoading, commonSetUserDataHandler } from 'src/store/userSlice'
import { showNotification } from 'src/store/systemSlice'
import $clg from 'src/services/$clg'
import apiMethods from './api-methods'
import { AsyncThunkResponseWrapper } from 'src/@types'
import $router from './$router'
axios.defaults.withCredentials = true

const successMessageHandler = (response: AxiosResponse, dispatch: AppDispatch) => {
  if (!response) return
  const { message, silent } = response.data
  const isSuccess = response.status === Status.success
  if (message && !silent) { dispatch(showNotification({ message, messageType: isSuccess ? NotificationType.success : NotificationType.warn })) }
}

const errorInterceptor = async (e: any, dispatch: AppDispatch) => {
  const { status } = e.response ?? e.response?.data?.status
  switch (status) {
    case Status.badGateaway:
      dispatch(changeIsAppLoading(false))
      break
    case Status.tokenExpired:
      $clg('error', 'Access token is expired')
      dispatch(changeIsAppLoading(true))
      const updateTokenResponse = (await dispatch(apiMethods.auth.updateTokensPair())) as AsyncThunkResponseWrapper
      const isTokensPairUpdated = updateTokenResponse?.payload?.status === Status.success
      if (!isTokensPairUpdated) {
        $router.push(RouteNames.SIGN_IN)
        dispatch(changeIsAppLoading(false))
        return
      }
      $clg('success', 'Tokens pair has been updated')
      const response = (await dispatch(apiMethods.user.getUserData(null))) as AsyncThunkResponseWrapper
      dispatch(changeIsAppLoading(false))
      const { userData, settings } = response.payload.data
      commonSetUserDataHandler(dispatch, { userData, settings })
      return
    case Status.notAuth:
      return
    case Status.badRequest:
      break
  }
  const message = e.response?.data?.message ?? `An error has occurred, please try again later. ERROR: ${e.message}`
  dispatch(showNotification({ message, messageType: NotificationType.error }))
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
