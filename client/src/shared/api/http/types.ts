import type { AxiosRequestConfig, AxiosResponse, Method, ResponseType } from 'axios'
import type { Endpoints, BackendResponse, ReqStatus } from 'global-shared'

export type HttpRequestPayload = object | FormData | URLSearchParams | string | null | undefined

export interface HttpRequestOptions<R extends ResponseType = ResponseType> {
  contentType?: string
  headers?: AxiosRequestConfig['headers']
  responseType?: R
  skipAuthRefresh?: boolean
  signal?: AxiosRequestConfig['signal']
}

export interface CreateHttpErrorPayload {
  message: string
  status?: ReqStatus
  silent?: boolean
  payload?: BackendResponse<unknown> | null
}

export type HttpError = Error & {
  type: 'http-error'
  message: string
  status?: ReqStatus
  silent: boolean
  payload: BackendResponse<unknown> | null
}

export type DoHttpRequest = <T = unknown, R extends ResponseType = 'json'>(
  type: Method,
  endpoint: Endpoints,
  data?: HttpRequestPayload,
  opts?: HttpRequestOptions<R>
) => Promise<R extends 'json' ? AxiosResponse<BackendResponse<T>> : AxiosResponse<Blob>>
