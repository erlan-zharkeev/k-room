import { AxiosResponse, ResponseType } from 'axios'
import { EndpointsType, IBackendResponse, StatusEnum } from 'common-types'

import { useNotification } from 'src/entities/notification'

import { axios, IDoRequestOpts } from '../config'
import type { RequestTypes } from '../types'

import { useApiInterсeptor } from './use-api-interceptor'

export const useApi = () => {
  const notifications = useNotification()
  const { interceptError } = useApiInterсeptor()

  const successMessageHandler = (response: AxiosResponse<IBackendResponse<unknown>>) => {
    if (!response) return
    const ct = response.headers?.['content-type'] || ''
    const isJson = ct.includes('application/json')
    if (!isJson) return

    const { text, silent } = response.data.message
    const isSuccess = response.status === StatusEnum.Success
    const successMessageNotification = notifications.getNotification({
      message: text,
      messageType: isSuccess ? 'success' : 'warning'
    })
    if (text && !silent) {
      successMessageNotification.open()
    }
  }

  const doRequest = async <T, R extends ResponseType = 'json'>(
    type: RequestTypes,
    endpoint: EndpointsType,
    data: any = {},
    opts: IDoRequestOpts<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>> => {
    const { contentType = 'application/json', responseType = 'json' } = opts || {}

    try {
      const response = await axios.request({
        method: type,
        url: `/api${endpoint}`,
        headers: { 'Content-Type': contentType },
        responseType,
        ...(type === 'get' ? { params: data } : { data })
      })

      successMessageHandler(response)

      if (response && response.status === StatusEnum.Success) {
        return response
      }
      throw new Error('No response')
    } catch (e: unknown) {
      interceptError(e)
      throw e
    }
  }

  return {
    doRequest
  }
}
