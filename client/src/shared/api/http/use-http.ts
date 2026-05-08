import { AxiosError, type AxiosRequestConfig, type AxiosResponse, type ResponseType } from 'axios'
import { AUTH_ENDPOINTS, REQ_STATUS, type EndpointsType, type IBackendResponse } from 'global-shared'

import { CLIENT_ENV, ERROR_TOAST_LIFE_MS, SUCCESS_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { HTTP_SUCCESS_STATUS_END, HTTP_SUCCESS_STATUS_START } from './constants'
import { getHeaderValue } from './get-header-value'
import { httpClient } from './http-client'
import type { IHttpRequestOptions, HttpRequestPayloadType, HttpRequestType } from './types'
import { useHttpInterceptor } from './use-http-interceptor'

const isSuccessStatus = (status: number) => status >= HTTP_SUCCESS_STATUS_START && status < HTTP_SUCCESS_STATUS_END

export const useHttp = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { interceptError } = useHttpInterceptor()

  const successMessageHandler = (response: AxiosResponse<IBackendResponse<unknown>>) => {
    const contentType = getHeaderValue(response.headers?.['content-type'])
    const isJson = contentType.includes('application/json')

    if (!isJson) return

    const { text, silent } = response.data.message
    const isSuccess = isSuccessStatus(response.status)

    if (text && !silent) {
      toast.add({
        type: isSuccess ? 'success' : 'warning',
        title: isSuccess ? t(TOAST_I18N.success) : t(TOAST_I18N.warn),
        content: text,
        duration: isSuccess ? SUCCESS_TOAST_LIFE_MS : ERROR_TOAST_LIFE_MS
      })
    }
  }

  const doHttpRequest = async <T, R extends ResponseType = 'json'>(
    type: HttpRequestType,
    endpoint: EndpointsType,
    data: HttpRequestPayloadType = {},
    opts: IHttpRequestOptions<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>> => {
    const { contentType = 'application/json' } = opts
    const responseType = (opts.responseType ?? 'json') as ResponseType

    const requestConfig: AxiosRequestConfig<HttpRequestPayloadType> = {
      method: type,
      url: `${CLIENT_ENV.apiBaseUrl}${endpoint}`,
      headers: {
        'Content-Type': contentType
      },
      responseType,
      ...(type === 'get' ? { params: data } : { data })
    }

    const request = () => httpClient.request(requestConfig)

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
          await httpClient.request({
            method: 'post',
            url: `${CLIENT_ENV.apiBaseUrl}${AUTH_ENDPOINTS.updateTokensPair}`,
            headers: {
              'Content-Type': 'application/json'
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
    doHttpRequest
  }
}
