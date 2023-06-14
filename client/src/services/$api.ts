import axios, { AxiosResponse } from 'axios'
import { Status } from 'common-types'
import { AppDispatch } from 'src/store'
import { changeIsAppLoading, commonSetUserDataHandler } from 'src/store/userSlice'
import { showNotification } from 'src/store/systemSlice'
import $clg from 'src/services/$clg'
import apiMethods from './api-methods'
import { AsyncThunkResponseWrapper } from 'src/@types'
import constants from 'src/constants'
axios.defaults.withCredentials = true

const successMessageHandler = (response: AxiosResponse, dispatch: AppDispatch) => {
  if (!response) return
  const { message, silent } = response.data
  const isSuccess = response.status === Status.SUCCESS
  if (message && !silent) dispatch(showNotification({ message, messageType: isSuccess ? 'success' : 'warning' }))
}

const errorInterceptor = async (e: any, dispatch: AppDispatch) => {
  const { status } = e.response ?? e.response?.data?.status
  switch (status) {
    case Status.BAD_GATEAWAY:
      dispatch(changeIsAppLoading(false))
      break
    case Status.TOKEN_EXPIRED:
      $clg('error', 'Access token is expired')
      dispatch(changeIsAppLoading(true))
      const updateTokenResponse = (await dispatch(apiMethods.auth.updateTokensPair())) as AsyncThunkResponseWrapper
      const isTokensPairUpdated = updateTokenResponse?.payload?.status === Status.SUCCESS
      if (!isTokensPairUpdated) return
      $clg('success', 'Tokens pair has been updated')
      const response = (await dispatch(apiMethods.user.getUserData(null))) as AsyncThunkResponseWrapper
      dispatch(changeIsAppLoading(false))
      const { userData, settings } = response.payload.data
      commonSetUserDataHandler(dispatch, { userData, settings })
      return
    case Status.NOT_AUTH:
      return
    case Status.BAD_REQUEST:
      break
  }
  const message = e.response?.data?.message ?? `An error has occurred, please try again later. ERROR: ${e.message}`
  dispatch(showNotification({ message, messageType: 'error', duration: constants.errorNotificationDuration }))
}

type RequestTypes = 'post' | 'get' | 'patch'

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
