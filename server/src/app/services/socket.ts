import type { Server as HttpsServer } from 'https'
import { Server } from 'socket.io'
import { MAX_HTTP_BUFFER_SIZE } from 'src/app/config'
import { socketRouter } from 'src/app/services'
import { socketAuthMiddleware } from 'src/features/auth'
import { ENV, ORIGINS, type SocketInstanceType } from 'src/shared/config'
import { log, serverCaptureSentryException } from 'src/shared/lib'

import { RouteNamesEnum, type SocketActionsType } from 'common'

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
