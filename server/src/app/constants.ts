import { SERVER_ENV } from './env'

export const SOCKET_MAX_HTTP_BUFFER_SIZE = 10 * 1_000_000

export const SOCKET_OPTIONS = {
  path: SERVER_ENV.socketPath,
  maxHttpBufferSize: SOCKET_MAX_HTTP_BUFFER_SIZE,
  cors: {
    origin: SERVER_ENV.origins,
    credentials: true
  }
} as const
