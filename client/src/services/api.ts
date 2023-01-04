import axios, { AxiosResponse } from 'axios'
import { Status, AuthEndPoints } from 'common-types'
import ENV from 'src/ENV'
import { AppDispatch } from 'src/store'
import { changeIsAppLoading, getUserData } from 'src/store/authSlice'
import { showNotification } from 'src/store/systemSlice'
import $clg from './clg'

axios.defaults.proxy = {
  host: ENV.HOST,
  port: Number(ENV.SERVER_PORT)
}

const endpointHost = ENV.IS_DEV ? '' : `${ENV.HOST}:${ENV.SERVER_PORT}`

const successMessageHandler = (response: AxiosResponse, dispatch: AppDispatch) => {
  if (!response) return
  const message = response.data.message
  const isSuccess = response.status === Status.SUCCESS
  if (message) dispatch(showNotification({ message, messageType: isSuccess ? 'success' : 'warning' }))
}

const errorInterceptor = async (e: any, dispatch: AppDispatch) => {
  const isTokenExpired = e.response.status === Status.TOKEN_EXPIRED
  if (isTokenExpired) {
    dispatch(changeIsAppLoading(true))
    $clg('error', 'Access token is expired')
    const updateTokenResponse = await $api('get', AuthEndPoints.UPDATE_TOKENS_PAIR, dispatch)
    const isTokensPairUpdated = updateTokenResponse?.status === Status.SUCCESS
    if (!isTokensPairUpdated) return
    dispatch(changeIsAppLoading(false))
    $clg('success', 'Tokens pair has been updated')
    dispatch(getUserData(null))
    return
  }
  if (e.response?.data?.status && e.response.data.status === Status.NOT_AUTH) return
  const message = e.response?.data?.message ?? `An error has occurred, please try again later. ERROR: ${e.message}`
  dispatch(showNotification({ message, messageType: 'error' }))
}

type RequestTypes = 'post' | 'get' | 'patch'

export const $api = async (
  type: RequestTypes,
  endpoint: string,
  dispatch: AppDispatch,
  payload: any = null,
  contentType: string = 'application/json'
): Promise<AxiosResponse<any, any>> => {
  const options = { headers: { 'Content-Type': contentType } }
  try {
    const response = await axios[type](`${endpointHost}${endpoint}`, payload, options)
    successMessageHandler(response, dispatch)
    return response
  } catch (e: any) {
    errorInterceptor(e, dispatch)
  }
}

export default $api
