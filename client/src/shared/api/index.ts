export { ERROR_TOAST_LIFE_MS, SUCCESS_TOAST_LIFE_MS } from 'src/shared/config'
export { createHttpError, getHandledErrorMessage, isHttpError, isHandledError } from './http/create-http-error'
export { getHeaderValue } from './http/get-header-value'
export { setHttpClientLanguage } from './http/http-client'
export { useHttp } from './http/use-http'
export { useHttpInterceptor } from './http/use-http-interceptor'
export { useProtectedActionCaptcha } from './http/use-protected-action-captcha'
export { socket } from './socket/socket'
export { socketStatus } from './socket/socket-status'
export { setSocketLanguage, updateSocketLanguage } from './socket/use-socket-language'
export { useSocketConnect } from './socket/use-socket-connect'
export { useSocketConnectionMonitor } from './socket/use-socket-connection-monitor'
export { useSocketReconnect } from './socket/use-socket-reconnect'
export type {
  HttpErrorType,
  DoHttpRequestType,
  ICreateHttpErrorPayload,
  IHttpRequestOptions,
  HttpRequestPayloadType,
  HttpRequestType
} from './http/types'
