import { AxiosResponse, ResponseType } from 'axios'

import { Endpoints } from 'common'

export type Request = 'post' | 'get' | 'patch' | 'put' | 'delete' | 'head'

export type RequestPayload = object | FormData | URLSearchParams | string | null | undefined

export type DoRequest = <T = unknown, R extends ResponseType = 'json'>(
  type: Request,
  endpoint: Endpoints,
  data?: RequestPayload,
  opts?: {
    contentType?: string
    responseType?: R
  }
) => Promise<R extends 'json' ? AxiosResponse<T> : AxiosResponse<Blob>>
