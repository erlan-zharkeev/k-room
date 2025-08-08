import { RouteNamesEnum } from 'common-types'
import type { Server as HttpsServer } from 'https'
import { ENV, ORIGINS,SYSTEM_DATA } from 'shared-config'
import { Server } from 'socket.io'

export const getSocketIO = (server: HttpsServer) =>
  new Server(server, {
    path: RouteNamesEnum.SocketPath,
    maxHttpBufferSize: SYSTEM_DATA.maxMbQuantityTransfer * 1_000_000,
    cors: {
      origin: ENV.IS_DEV ? '*' : ORIGINS
    }
  })
