import type { Server as HttpServer } from 'http'
import type { Server as HttpsServer } from 'https'
import { Server } from 'socket.io'

import { RouteNamesEnum, type SocketActionsType } from 'common'

import { MAX_HTTP_BUFFER_SIZE } from 'src/app/config'
import { socketRouter } from 'src/app/services'

import { socketAuthMiddleware } from 'src/features/auth'

import { ENV, ORIGINS, type SocketInstanceType } from 'src/shared/config'
import { log, serverCaptureSentryException } from 'src/shared/lib'

type SocketServerType = HttpServer | HttpsServer

const getSocketIO = (server: SocketServerType) =>
  new Server(server, {
    path: RouteNamesEnum.SocketPath,
    maxHttpBufferSize: MAX_HTTP_BUFFER_SIZE,
    cors: {
      origin: ENV.IS_DEV ? '*' : ORIGINS,
      credentials: true
    }
  })

export const initIO = (server: SocketServerType): Server => {
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
