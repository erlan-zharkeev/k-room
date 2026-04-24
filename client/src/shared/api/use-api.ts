import type { AxiosResponse, ResponseType } from 'axios'
import {
  APP_LANGUAGE_HEADER,
  DEFAULT_APP_LANGUAGE,
  REQ_STATUS,
  type EndpointsType,
  type IBackendResponse
} from 'global-shared'
import { useToast } from 'primevue/usetoast'

import { CLIENT_ENV, CLIENT_LANGUAGE } from 'src/shared/config'

import { apiClient } from './api-client'
import { API_TOAST_LIFE_MS } from './constants'
import { getHeaderValue } from './get-header-value'
import type { IDoRequestOptions, RequestPayloadType, RequestType } from './types'
import { useApiInterceptor } from './use-api-interceptor'

export const useApi = () => {
  const toast = useToast()
  const { interceptError } = useApiInterceptor()

  const successMessageHandler = (response: AxiosResponse<IBackendResponse<unknown>>) => {
    const contentType = getHeaderValue(response.headers?.['content-type'])
    const isJson = contentType.includes('application/json')

    if (!isJson) return

    const { text, silent } = response.data.message
    const isSuccess = response.status === REQ_STATUS.success

    if (text && !silent) {
      toast.add({
        severity: isSuccess ? 'success' : 'warn',
        summary: text,
        life: API_TOAST_LIFE_MS
      })
    }
  }

  const doRequest = async <T, R extends ResponseType = 'json'>(
    type: RequestType,
    endpoint: EndpointsType,
    data: RequestPayloadType = {},
    opts: IDoRequestOptions<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>> => {
    const { contentType = 'application/json', responseType = 'json' } = opts

    try {
      const response = await apiClient.request({
        method: type,
        url: `${CLIENT_ENV.apiBaseUrl}${endpoint}`,
        headers: {
          'Content-Type': contentType,
          [APP_LANGUAGE_HEADER]: CLIENT_LANGUAGE ?? DEFAULT_APP_LANGUAGE
        },
        responseType,
        ...(type === 'get' ? { params: data } : { data })
      })

      successMessageHandler(response as AxiosResponse<IBackendResponse<unknown>>)

      if (response.status === REQ_STATUS.success) {
        return response as R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>
      }

      throw new Error('No response')
    } catch (error) {
      throw await interceptError(error)
    }
  }

  return {
    doRequest
  }
}
