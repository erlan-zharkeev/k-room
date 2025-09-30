import { RouteNamesEnum } from 'common-types'
import { SocketActionsType } from 'common-types'
import { socketAuthMiddleware } from 'features/auth'
import type { Server as HttpsServer } from 'https'
import { ENV, ORIGINS, SYSTEM_DATA } from 'shared-config'
import { type SocketInstanceType } from 'shared-config'
import { log } from 'shared-lib'
import { Server } from 'socket.io'

import { socketRouter } from './socket-router'

const getSocketIO = (server: HttpsServer) =>
  new Server(server, {
    path: RouteNamesEnum.SocketPath,
    maxHttpBufferSize: SYSTEM_DATA.maxMbQuantityTransfer * 1_000_000,
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
  } catch (errors: unknown) {
    log.error(`- ${errors}`)
  }

  return io
}
