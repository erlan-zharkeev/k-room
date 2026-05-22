import { parse } from 'cookie'
import type { SocketActions } from 'global-shared'
import jwt from 'jsonwebtoken'

import { SERVER_ENV } from 'src/app/env'
import { getSocketLanguage } from 'src/shared/lib/get-request-language'
import type { SocketInstance } from 'src/shared/types/socket'

import type { SocketTokenPayload } from './auth.types'

const emitAuthError = (socket: SocketInstance) => {
  socket.emit<SocketActions>('auth-error', {
    event: 'connection',
    payload: null
  })
  socket.disconnect()
}

const verifySocketToken = async (token: string) => {
  return new Promise<SocketTokenPayload>((resolve, reject) => {
    jwt.verify(token, SERVER_ENV.secret.accessTokenSecret, (error, decoded) => {
      if (error) {
        return reject(error)
      }

      return resolve(decoded as SocketTokenPayload)
    })
  })
}

export const socketAuthMiddleware = async (socket: SocketInstance) => {
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

    return true
  } catch {
    emitAuthError(socket)
    return false
  }
}
