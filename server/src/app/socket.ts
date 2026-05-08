import { Server } from 'socket.io'

import { socketAuthMiddleware } from 'src/modules/auth/auth.socket'
import { errorToMessage } from 'src/shared/lib/error-to-message'
import { setIO } from 'src/shared/lib/io'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException } from 'src/shared/lib/sentry'

import { SERVER_ENV } from './env'
import { socketRouter } from './socket-router'
import type { SocketServerType } from './types'

const SOCKET_OPTIONS = {
  path: SERVER_ENV.socketPath,
  maxHttpBufferSize: 10 * 1_000_000,
  cors: {
    origin: SERVER_ENV.origins,
    credentials: true
  }
} as const

export const initIO = (server: SocketServerType) => {
  const io = new Server(server, SOCKET_OPTIONS)

  io.on('connection', async (socket) => {
    try {
      const isAuthenticated = await socketAuthMiddleware(socket)

      if (!isAuthenticated) {
        return
      }

      socketRouter(socket)
    } catch (error) {
      log.error('-Socket connection failed')
      log.error(`-${errorToMessage(error)}`)
      serverCaptureSentryException(error)
    }
  })

  setIO(io)

  return io
}
