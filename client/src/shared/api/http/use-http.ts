import { AxiosError, type AxiosRequestConfig, type AxiosResponse, type Method, type ResponseType } from 'axios'
import { AUTH_ENDPOINTS, isHttpSuccessStatus, REQ_STATUS, type Endpoints, type BackendResponse } from 'global-shared'

import { TOAST_I18N } from 'src/shared/lib'
import { useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { handleHttpTransportMeta } from '../transport-meta'

import { refreshAuthTokens, shouldSkipAuthRefresh } from './auth-refresh'
import { httpClient } from './http-client'
import { isBackendResponse } from './is-backend-response'
import type { HttpRequestOptions, HttpRequestPayload } from './types'
import { useHttpInterceptor } from './use-http-interceptor'

export const useHttp = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { interceptError } = useHttpInterceptor()

  const successMessageHandler = (response: AxiosResponse<unknown>, showSuccessToast: boolean) => {
    if (!showSuccessToast) return
    if (!isBackendResponse(response.data)) return

    const { text, silent } = response.data.message
    const isSuccess = isHttpSuccessStatus(response.status)

    if (text && !silent) {
      toast.add({
        type: isSuccess ? 'success' : 'warning',
        title: isSuccess ? t(TOAST_I18N.success) : t(TOAST_I18N.warn),
        content: text
      })
    }
  }

  const doHttpRequest = async <T, R extends ResponseType = 'json'>(
    type: Method,
    endpoint: Endpoints,
    data: HttpRequestPayload = {},
    opts: HttpRequestOptions<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<BackendResponse<T>> : AxiosResponse<Blob>> => {
    const {
      contentType = 'application/json',
      headers = {},
      signal,
      skipAuthRefresh = false,
      showErrorToast = true,
      showSuccessToast = true
    } = opts
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

      handleHttpTransportMeta(response)

      if (!isHttpSuccessStatus(response.status)) {
        throw new Error('No response')
      }

      successMessageHandler(response, showSuccessToast)

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

          handleHttpTransportMeta(response)
          successMessageHandler(response, showSuccessToast)

          return response as R extends 'json' ? AxiosResponse<BackendResponse<T>> : AxiosResponse<Blob>
        } catch (retryError) {
          throw await interceptError(retryError, { showErrorToast })
        }
      }

      throw await interceptError(error, { showErrorToast })
    }
  }

  return {
    doHttpRequest
  }
}
