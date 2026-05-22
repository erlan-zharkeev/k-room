import { SocketActions } from 'common'
import { Server } from 'socket.io'

import { socketAuthMiddleware } from 'src/modules/auth'

import { ORIGINS, SERVER_ENV, SocketInstance } from 'src/shared/config'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException } from 'src/shared/lib/sentry'

import { socketRouter } from './socket-router'
import { SocketServer } from './types'

const SOCKET_OPTIONS = {
  path: SERVER_ENV.socketPath,
  maxHttpBufferSize: 10 * 1_000_000,
  cors: {
    origin: SERVER_ENV.isDev ? '*' : ORIGINS,
    credentials: true
  }
}

const getSocketIO = (server: SocketServer) => new Server(server, SOCKET_OPTIONS)

export const initIO = (server: SocketServer): Server => {
  const io = getSocketIO(server)
  try {
    io.on<SocketActions>('connection', async (socket: SocketInstance) => {
      await socketAuthMiddleware(socket)
      socketRouter(socket)
    })
  } catch (error: unknown) {
    log.error(`- ${error}`)
    serverCaptureSentryException(error)
  }

  return io
}
