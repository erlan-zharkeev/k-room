import type { AxiosResponse, ResponseType } from 'axios'
import { EndpointsType, IBackendResponse, StatusEnum } from 'common-types'

import { useNotification } from 'src/entities/notification'

import { useApiInterсeptor, axios, createApiError, IDoRequestOpts, isApiError } from 'src/shared/api'
import type { RequestPayload, RequestTypes } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'

export const useApi = () => {
  const notifications = useNotification()
  const { interceptError } = useApiInterсeptor()
  const apiBaseUrl = import.meta.env.DEV ? '' : CLIENT_ENV.apiHost

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
    data: RequestPayload = {},
    opts: IDoRequestOpts<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>> => {
    const { contentType = 'application/json', responseType = 'json' } = opts || {}

    try {
      const response = await axios.request({
        method: type,
        url: `${apiBaseUrl}/api${endpoint}`,
        headers: { 'Content-Type': contentType },
        responseType,
        ...(type === 'get' ? { params: data } : { data })
      })

      successMessageHandler(response)

      if (response && response.status === StatusEnum.Success) {
        return response
      }
      throw new Error('No response')
    } catch (error: unknown) {
      const apiError = await interceptError(error)
      throw isApiError(apiError) ? apiError : createApiError({ message: 'Unknown error' })
    }
  }

  return {
    doRequest
  }
}
