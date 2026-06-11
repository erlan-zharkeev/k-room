import { createAdapter } from '@socket.io/redis-adapter'
import { Server } from 'socket.io'

import { socketAuthMiddleware } from 'src/modules/auth/auth.socket'
import { type PresenceService } from 'src/modules/presence/presence.service'
import { type RedisService } from 'src/modules/security/redis.service'
import { errorToMessage } from 'src/shared/lib/error-to-message'
import { setIO } from 'src/shared/lib/io'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException } from 'src/shared/lib/sentry'
import type { SocketIO } from 'src/shared/types'

import { SOCKET_OPTIONS } from './constants'
import { type SocketRouter } from './socket-router'
import type { SocketServer } from './types'

export const initIO = async (
  server: SocketServer,
  redisService: RedisService,
  presenceService: PresenceService,
  socketRouter: SocketRouter
) => {
  const io: SocketIO = new Server(server, SOCKET_OPTIONS)
  const { publishClient, subscribeClient } = await redisService.createAdapterClients()

  io.adapter(createAdapter(publishClient, subscribeClient))
  setIO(io)

  io.on('connection', async (socket) => {
    try {
      const isAuthenticated = await socketAuthMiddleware(socket)

      if (!isAuthenticated) {
        return
      }

      socketRouter.register(socket)
      await presenceService.markSocketConnected(socket)
    } catch (error) {
      log.error('-Socket connection failed')
      log.error(`-${errorToMessage(error)}`)
      serverCaptureSentryException(error)
    }
  })

  return io
}
