import { AxiosError, type AxiosRequestConfig, type AxiosResponse, type ResponseType } from 'axios'
import { AUTH_ENDPOINTS, REQ_STATUS, type Endpoints, type BackendResponse } from 'global-shared'

import { TOAST_I18N } from 'src/shared/lib'
import { useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { refreshAuthTokens, shouldSkipAuthRefresh } from './auth-refresh'
import { HTTP_SUCCESS_STATUS_END, HTTP_SUCCESS_STATUS_START } from './constants'
import { getHeaderValue } from './get-header-value'
import { httpClient } from './http-client'
import type { HttpRequestOptions, HttpRequestPayload, HttpRequest } from './types'
import { useHttpInterceptor } from './use-http-interceptor'

const isSuccessStatus = (status: number) => status >= HTTP_SUCCESS_STATUS_START && status < HTTP_SUCCESS_STATUS_END

export const useHttp = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { interceptError } = useHttpInterceptor()

  const successMessageHandler = (response: AxiosResponse<BackendResponse<unknown>>) => {
    const contentType = getHeaderValue(response.headers?.['content-type'])
    const isJson = contentType.includes('application/json')

    if (!isJson) return

    const { text, silent } = response.data.message
    const isSuccess = isSuccessStatus(response.status)

    if (text && !silent) {
      toast.add({
        type: isSuccess ? 'success' : 'warning',
        title: isSuccess ? t(TOAST_I18N.success) : t(TOAST_I18N.warn),
        content: text
      })
    }
  }

  const doHttpRequest = async <T, R extends ResponseType = 'json'>(
    type: HttpRequest,
    endpoint: Endpoints,
    data: HttpRequestPayload = {},
    opts: HttpRequestOptions<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<BackendResponse<T>> : AxiosResponse<Blob>> => {
    const { contentType = 'application/json', headers = {}, signal, skipAuthRefresh = false } = opts
    const responseType = (opts.responseType ?? 'json') as ResponseType

    const requestConfig: AxiosRequestConfig<HttpRequestPayload> = {
      method: type,
      url: `${__CLIENT_ENV_DATA__.apiBaseUrl}${endpoint}`,
      headers: {
        'Content-Type': contentType,
        ...headers
      },
      responseType,
      signal,
      ...(type === 'get' ? { params: data } : { data })
    }

    const request = () => httpClient.request(requestConfig)

    try {
      const response = await request()

      if (!isSuccessStatus(response.status)) {
        throw new Error('No response')
      }

      successMessageHandler(response as AxiosResponse<BackendResponse<unknown>>)

      return response as R extends 'json' ? AxiosResponse<BackendResponse<T>> : AxiosResponse<Blob>
    } catch (error) {
      const isAxiosError = error instanceof AxiosError
      const isUnauthorized = isAxiosError && error.response?.status === REQ_STATUS.notAuth
      const isAuthRefreshRequest = endpoint === AUTH_ENDPOINTS.updateTokensPair
      const canRefreshAuth = !skipAuthRefresh && !shouldSkipAuthRefresh()

      if (isUnauthorized && !isAuthRefreshRequest && canRefreshAuth) {
        try {
          await refreshAuthTokens()

          const response = await request()

          successMessageHandler(response as AxiosResponse<BackendResponse<unknown>>)

          return response as R extends 'json' ? AxiosResponse<BackendResponse<T>> : AxiosResponse<Blob>
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
