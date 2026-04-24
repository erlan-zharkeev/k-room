import { parse } from 'cookie'
import type { SocketActionsType } from 'global-shared'
import jwt from 'jsonwebtoken'

import { SERVER_ENV } from 'src/app/env'
import { getSocketLanguage } from 'src/shared/lib/get-request-language'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { UserModel } from '../user/user.model'

const emitAuthError = (socket: SocketInstanceType) => {
  socket.emit<SocketActionsType>('auth-error', {
    event: 'connection',
    payload: null
  })
  socket.disconnect()
}

const verifySocketToken = async (token: string) => {
  return new Promise<{ id: string }>((resolve, reject) => {
    jwt.verify(token, SERVER_ENV.secret.accessTokenSecret, (error, decoded) => {
      if (error) {
        return reject(error)
      }

      return resolve(decoded as { id: string })
    })
  })
}

export const socketAuthMiddleware = async (socket: SocketInstanceType) => {
  const cookie = socket.handshake.headers.cookie
  const parsedCookie = parse(cookie ?? '')
  const accessToken = parsedCookie.jwt ?? ''

  if (!accessToken) {
    emitAuthError(socket)
    return false
  }

  try {
    const decoded = await verifySocketToken(accessToken)
    const deviceId = parsedCookie['device-id'] ?? ''
    const language = getSocketLanguage(socket)

    socket.data = {
      userId: decoded.id,
      deviceId,
      language
    }

    if (deviceId) {
      await UserModel.updateOne(
        { _id: decoded.id },
        {
          $set: {
            [`system.device.${deviceId}.socketId`]: socket.id
          }
        }
      )
    }

    return true
  } catch {
    emitAuthError(socket)
    return false
  }
}
