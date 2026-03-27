import type { AxiosResponse, ResponseType } from 'axios'
import { EndpointsType } from 'common'

export type RequestType = 'post' | 'get' | 'patch' | 'put' | 'delete' | 'head'

export type RequestPayloadType = object | FormData | URLSearchParams | string | null | undefined

export type DoRequestType = <T = unknown, R extends ResponseType = 'json'>(
  type: RequestType,
  endpoint: EndpointsType,
  data?: RequestPayloadType,
  opts?: {
    contentType?: string
    responseType?: R
  }
) => Promise<R extends 'json' ? AxiosResponse<T> : AxiosResponse<Blob>>
