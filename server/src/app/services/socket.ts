import type { Server as HttpsServer } from 'https'
import { Server } from 'socket.io'

import { RouteNamesEnum, type SocketActionsType } from 'common-types'

import { MAX_HTTP_BUFFER_SIZE } from 'app/config'
import { socketRouter } from 'app/services/socket-router'

import { socketAuthMiddleware } from 'features/auth'

import { ENV, ORIGINS, type SocketInstanceType } from 'shared-config'
import { log, serverCaptureSentryException } from 'shared-lib'

const getSocketIO = (server: HttpsServer) =>
  new Server(server, {
    path: RouteNamesEnum.SocketPath,
    maxHttpBufferSize: MAX_HTTP_BUFFER_SIZE,
    cors: {
      origin: ENV.IS_DEV ? '*' : ORIGINS,
      credentials: true
    }
  })

export const initIO = (server: HttpsServer): Server => {
  const io = getSocketIO(server)
  try {
    io.on<SocketActionsType>('connection', async (socket: SocketInstanceType) => {
      await socketAuthMiddleware(socket)
      socketRouter(socket)
    })
  } catch (error: unknown) {
    log.error(`- ${error}`)
    serverCaptureSentryException(error)
  }

  return io
}
