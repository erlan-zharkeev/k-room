import type { LocalizedTextType, ReqStatusType } from 'global-shared'

export interface IThrowSocketErrorOptions {
  status?: ReqStatusType
  silent?: boolean
  cause?: unknown
}

export interface ISocketErrorMiddlewareOptions {
  basicError: LocalizedTextType<string>
  status?: ReqStatusType
  silent?: boolean
}
