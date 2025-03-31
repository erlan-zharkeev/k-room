import { AxiosResponse } from 'axios'
import { EndpointsType, StatusEnum } from 'common-types'
import { useNotification } from 'src/entities/notification'
import { RequestTypes } from '../types'
import { axios } from '../config'
import { useApiInterсeptor } from './use-api-interceptor'

export const useApi = () => {
  const notifications = useNotification()
  const { interceptError } = useApiInterсeptor()

  const successMessageHandler = (response: AxiosResponse) => {
    if (!response) return
    const { message, silent } = response.data
    const isSuccess = response.status === StatusEnum.Success
    const successMessageNotification = notifications.getNotification({
      message,
      messageType: isSuccess ? 'success' : 'warning'
    })
    if (message && !silent) {
      successMessageNotification.open()
    }
  }

  const doRequest = async (
    type: RequestTypes,
    endpoint: EndpointsType,
    data: any = {},
    contentType: string = 'application/json'
  ) => {
    const options = { headers: { 'Content-Type': contentType } }
    try {
      const response = await axios[type](`/api${endpoint}`, data, options)
      successMessageHandler(response)
      if (response) {
        return response as AxiosResponse
      }
      throw new Error('No response')
    } catch (e: unknown) {
      interceptError(e)
    }
  }

  return {
    doRequest
  }
}
