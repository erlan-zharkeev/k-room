import { IEventAuthError, SocketActionsType } from 'common-types'
import { parse } from 'cookie'
import { ENV, SocketInstanceType } from 'shared-config'

import { verifyToken } from '../lib'

const authErrorBreakConnection = (socket: SocketInstanceType, payload: IEventAuthError) => {
  socket.emit<SocketActionsType>('auth-error', payload)
  socket.disconnect()
}

export const socketAuthMiddleware = async (socket: SocketInstanceType) => {
  socket.use(async (packet, next) => {
    const [event, payload] = packet
    const replayData = { event, payload }

    const cookie = socket.handshake.headers.cookie
    const parsedCookie = parse(cookie ?? '')
    try {
      const accessToken = parsedCookie.jwt ?? null
      if (!accessToken) {
        return authErrorBreakConnection(socket, replayData)
      }
      const decoded = await verifyToken(accessToken, ENV?.K_ROOM_ACCESS_TOKEN_SECRET)
      socket.data = { userId: decoded.id }
      return next()
    } catch {
      return authErrorBreakConnection(socket, replayData)
    }
  })
}
