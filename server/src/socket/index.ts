import { SocketActions } from '../../../types'
import { io } from '../server'
import { SocketInstanceType } from '../types/SocketInstanceType'
import { slices } from './slices'
import ENV from '../ENV'
import { jwt } from '../services/jwt'
import { JWTDecoded } from '../types/Common'

const breakConnection = (socket: SocketInstanceType) => {
  socket.emit(SocketActions.AUTH_ERROR)
  socket.disconnect()
}

const verifyToken = (token: string) => {
  console.log('verify', token)
  let tokenExpired = false
  let success = false
  jwt.verify(token, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, (error: { message: string }, decoded: JWTDecoded) => {
    if (error) tokenExpired = error.message === 'jwt expired'
    success = true
  })
  return { tokenExpired, success }
}

const authMiddleware = async (socket: SocketInstanceType) => {
  const { token, refreshToken } = socket.handshake.auth
  if (!token) return breakConnection(socket)
  const jwtTokenExpired = verifyToken(token).tokenExpired
  if (jwtTokenExpired) return breakConnection(socket)
  // if (jwtTokenExpired) {
  //   verifyToken(refreshToken)
  // }
  // if (!success) return breakConnection(socket)
  // jwt.verify(token, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, (error: { message: string }, decoded: JWTDecoded) => {
  //   if (error) {
  //     const jwtExpired = error.message === 'jwt expired'
  //     if (!jwtExpired) return breakConnection(socket)
  //   }
  //   socket.data = { userId: decoded.id }
  // })
}

try {
  io.on(SocketActions.CONNECTION, async (socket: SocketInstanceType) => {
    await authMiddleware(socket)
    Object.values(slices).forEach((slice) => slice(socket))
  })
} catch (e) {
  console.log(e)
}
