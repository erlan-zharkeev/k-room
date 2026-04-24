import type { AxiosResponse, Method, ResponseType } from 'axios'
import type { EndpointsType, IBackendResponse, ReqStatusType } from 'global-shared'

export type RequestType = Method

export type RequestPayloadType = object | FormData | URLSearchParams | string | null | undefined

export interface IDoRequestOptions<R extends ResponseType = ResponseType> {
  contentType?: string
  responseType?: R
}

export interface ICreateApiErrorPayload {
  message: string
  status?: ReqStatusType
  silent?: boolean
  payload?: IBackendResponse<unknown> | null
}

export type ApiErrorType = Error & {
  type: 'api-error'
  message: string
  status?: ReqStatusType
  silent: boolean
  payload: IBackendResponse<unknown> | null
}

export type DoRequestType = <T = unknown, R extends ResponseType = 'json'>(
  type: RequestType,
  endpoint: EndpointsType,
  data?: RequestPayloadType,
  opts?: IDoRequestOptions<R>
) => Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>>
