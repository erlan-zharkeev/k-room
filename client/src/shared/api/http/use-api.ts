import { AxiosError, type AxiosRequestConfig, type AxiosResponse, type ResponseType } from 'axios'
import {
  APP_LANGUAGE_HEADER,
  AUTH_ENDPOINTS,
  DEFAULT_APP_LANGUAGE,
  REQ_STATUS,
  type EndpointsType,
  type IBackendResponse
} from 'global-shared'

import {
  API_SUCCESS_STATUS_END,
  API_SUCCESS_STATUS_START,
  CLIENT_ENV,
  ERROR_TOAST_LIFE_MS,
  SUCCESS_TOAST_LIFE_MS,
  TOAST_I18N
} from 'src/shared/config'
import { currentLanguage, translate } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import { apiClient } from './api-client'
import { getHeaderValue } from './get-header-value'
import type { IDoRequestOptions, RequestPayloadType, RequestType } from './types'
import { useApiInterceptor } from './use-api-interceptor'

const isSuccessStatus = (status: number) => status >= API_SUCCESS_STATUS_START && status < API_SUCCESS_STATUS_END

export const useApi = () => {
  const toast = useAppToast()
  const { interceptError } = useApiInterceptor()

  const successMessageHandler = (response: AxiosResponse<IBackendResponse<unknown>>) => {
    const contentType = getHeaderValue(response.headers?.['content-type'])
    const isJson = contentType.includes('application/json')

    if (!isJson) return

    const { text, silent } = response.data.message
    const isSuccess = isSuccessStatus(response.status)

    if (text && !silent) {
      toast.add({
        type: isSuccess ? 'success' : 'warning',
        title: isSuccess ? translate(TOAST_I18N.success) : translate(TOAST_I18N.warn),
        content: text,
        duration: isSuccess ? SUCCESS_TOAST_LIFE_MS : ERROR_TOAST_LIFE_MS
      })
    }
  }

  const doRequest = async <T, R extends ResponseType = 'json'>(
    type: RequestType,
    endpoint: EndpointsType,
    data: RequestPayloadType = {},
    opts: IDoRequestOptions<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>> => {
    const { contentType = 'application/json' } = opts
    const responseType = (opts.responseType ?? 'json') as ResponseType

    const requestConfig: AxiosRequestConfig<RequestPayloadType> = {
      method: type,
      url: `${CLIENT_ENV.apiBaseUrl}${endpoint}`,
      headers: {
        'Content-Type': contentType,
        [APP_LANGUAGE_HEADER]: currentLanguage.value ?? DEFAULT_APP_LANGUAGE
      },
      responseType,
      ...(type === 'get' ? { params: data } : { data })
    }

    const request = () => apiClient.request(requestConfig)

    try {
      const response = await request()

      if (!isSuccessStatus(response.status)) {
        throw new Error('No response')
      }

      successMessageHandler(response as AxiosResponse<IBackendResponse<unknown>>)

      return response as R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.status === REQ_STATUS.notAuth &&
        endpoint !== AUTH_ENDPOINTS.updateTokensPair
      ) {
        try {
          await apiClient.request({
            method: 'post',
            url: `${CLIENT_ENV.apiBaseUrl}${AUTH_ENDPOINTS.updateTokensPair}`,
            headers: {
              'Content-Type': 'application/json',
              [APP_LANGUAGE_HEADER]: currentLanguage.value ?? DEFAULT_APP_LANGUAGE
            },
            responseType: 'json'
          })

          const response = await request()

          successMessageHandler(response as AxiosResponse<IBackendResponse<unknown>>)

          return response as R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>
        } catch (retryError) {
          throw await interceptError(retryError)
        }
      }

      throw await interceptError(error)
    }
  }

  return {
    doRequest
  }
}
