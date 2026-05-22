import { EventAuthError, SocketActions } from 'common'
import { parse } from 'cookie'

import { UserModel } from 'src/modules/user'

import { SERVER_ENV, SocketInstance } from 'src/shared/config'
import { getSocketLanguage } from 'src/shared/lib/get-language'

import { verifyToken } from '../lib/verify-token'

const authErrorBreakConnection = (socket: SocketInstance, payload: EventAuthError) => {
  socket.emit<SocketActions>('auth-error', payload)
  socket.disconnect()
}

export const socketAuthMiddleware = async (socket: SocketInstance) => {
  const replayData = { event: 'connection', payload: null }
  const cookie = socket.handshake.headers.cookie
  const parsedCookie = parse(cookie ?? '')

  try {
    const accessToken = parsedCookie.jwt ?? null
    if (!accessToken) {
      return authErrorBreakConnection(socket, replayData)
    }

    const decoded = await verifyToken(accessToken, SERVER_ENV.accessTokenSecret)
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
