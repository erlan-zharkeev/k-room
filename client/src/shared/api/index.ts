export { API_TOAST_LIFE_MS } from 'src/shared/config'
export { createApiError, getHandledErrorMessage, isApiError, isHandledError } from './http/create-api-error'
export { getHeaderValue } from './http/get-header-value'
export { useApi } from './http/use-api'
export { useApiInterceptor } from './http/use-api-interceptor'
export { socket } from './socket/socket'
export { socketStatus } from './socket/socket-status'
export { useSocketConnect } from './socket/use-socket-connect'
export { useSocketConnectionMonitor } from './socket/use-socket-connection-monitor'
export { useSocketReconnect } from './socket/use-socket-reconnect'
export type {
  ApiErrorType,
  DoRequestType,
  ICreateApiErrorPayload,
  IDoRequestOptions,
  RequestPayloadType,
  RequestType
} from './http/types'
