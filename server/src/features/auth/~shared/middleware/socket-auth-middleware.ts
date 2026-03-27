import { parse } from 'cookie'

import { IEventAuthError, SocketActionsType } from 'common'

import { verifyToken } from 'features/auth'

import { UserModel } from 'entities/user'

import { ENV, SocketInstanceType } from 'shared-config'
import { getSocketLanguage } from 'shared-lib'

const authErrorBreakConnection = (socket: SocketInstanceType, payload: IEventAuthError) => {
  socket.emit<SocketActionsType>('auth-error', payload)
  socket.disconnect()
}

export const socketAuthMiddleware = async (socket: SocketInstanceType) => {
  const replayData = { event: 'connection', payload: null }
  const cookie = socket.handshake.headers.cookie
  const parsedCookie = parse(cookie ?? '')

  try {
    const accessToken = parsedCookie.jwt ?? null
    if (!accessToken) {
      return authErrorBreakConnection(socket, replayData)
    }

    const decoded = await verifyToken(accessToken, ENV?.K_ROOM_ACCESS_TOKEN_SECRET)
    const deviceId = parsedCookie['device-id'] ?? ''
    const language = getSocketLanguage(socket)

    socket.data = { userId: decoded.id, deviceId, language }
    await UserModel.updateOne({ _id: decoded.id }, [
      {
        $set: {
          [`system.device.${deviceId}.socketId`]: socket.id
        }
      }
    ])
  } catch {
    return authErrorBreakConnection(socket, replayData)
  }
}
