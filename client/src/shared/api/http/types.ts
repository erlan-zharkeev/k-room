import type { AxiosResponse, Method, ResponseType } from 'axios'
import type { EndpointsType, IBackendResponse, ReqStatusType } from 'global-shared'

export type HttpRequestType = Method

export type HttpRequestPayloadType = object | FormData | URLSearchParams | string | null | undefined

export interface IHttpRequestOptions<R extends ResponseType = ResponseType> {
  contentType?: string
  responseType?: R
}

export interface ICreateHttpErrorPayload {
  message: string
  status?: ReqStatusType
  silent?: boolean
  payload?: IBackendResponse<unknown> | null
}

export type HttpErrorType = Error & {
  type: 'http-error'
  message: string
  status?: ReqStatusType
  silent: boolean
  payload: IBackendResponse<unknown> | null
}

export type DoHttpRequestType = <T = unknown, R extends ResponseType = 'json'>(
  type: HttpRequestType,
  endpoint: EndpointsType,
  data?: HttpRequestPayloadType,
  opts?: IHttpRequestOptions<R>
) => Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>>
