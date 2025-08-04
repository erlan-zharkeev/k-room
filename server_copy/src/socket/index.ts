import { io } from '../app/server'
import { slices } from './slices'
import { jwt } from '../services/jwt'
import type { SocketActionsType } from 'common-types'
import type { JWTDecoded, SocketInstanceType } from 'shared/types'
import { ENV } from '../app/config/constants'
import { clc } from '../utils'

export * from './helpers'
export * from './slices'

const breakConnection = (socket: SocketInstanceType) => {
  socket.emit<SocketActionsType>('auth-error')
  socket.disconnect()
}

const authMiddleware = async (socket: SocketInstanceType) => {
  const { token } = socket.handshake.auth
  if (!token) return breakConnection(socket)

  jwt.verify(token, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, (error: { message: string }, decoded: JWTDecoded) => {
    if (error) return breakConnection(socket)
    socket.data = { userId: decoded.id }
  })
}

try {
  io.on<SocketActionsType>('connection', async (socket: SocketInstanceType) => {
    await authMiddleware(socket)
    Object.values(slices).forEach((slice) => slice(socket))
  })
} catch (errors: unknown) {
  console.log(clc.bgWhite(clc.red(`-${errors}`)))
}
