import { io } from '../server'
import { SocketInstanceType } from '../@types/socket'
import { slices } from './slices'
import { jwt } from '../services/jwt'
import { JWTDecoded, SocketActions } from '../@types'
import { ENV } from '../ENV'
import { clc } from '../utils'

export * from './helpers'
export * from './slices'

const breakConnection = (socket: SocketInstanceType) => {
  socket.emit<SocketActions>('auth-error')
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
  io.on<SocketActions>('connection', async (socket: SocketInstanceType) => {
    await authMiddleware(socket)
    Object.values(slices).forEach((slice) => slice(socket))
  })
} catch (errors: unknown) {
  console.log(clc.red.bgWhite(`-${errors}`))
}
