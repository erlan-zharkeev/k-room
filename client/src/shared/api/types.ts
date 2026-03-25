import type { AxiosResponse, ResponseType } from 'axios'
import { EndpointsType } from 'common'

export type RequestTypes = 'post' | 'get' | 'patch' | 'put' | 'delete' | 'head'

export type RequestPayload = object | FormData | URLSearchParams | string | null | undefined

export type DoRequest = <T = unknown, R extends ResponseType = 'json'>(
  type: RequestTypes,
  endpoint: EndpointsType,
  data?: RequestPayload,
  opts?: {
    contentType?: string
    responseType?: R
  }
) => Promise<R extends 'json' ? AxiosResponse<T> : AxiosResponse<Blob>>
