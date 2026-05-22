import type { LocalizedText, ReqStatus } from 'global-shared'

export interface ThrowSocketErrorOptions {
  status?: ReqStatus
  silent?: boolean
  cause?: unknown
}

export interface SocketErrorMiddlewareOptions {
  basicError: LocalizedText<string>
  status?: ReqStatus
  silent?: boolean
}
