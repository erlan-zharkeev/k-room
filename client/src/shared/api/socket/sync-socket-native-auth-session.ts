import { isUnknownObject } from 'global-shared'

import { readNativeAuthSession } from '../native-auth-session'

import { socket } from './socket'

export const syncSocketNativeAuthSession = () => {
  const { accessToken: _accessToken, deviceId: _deviceId, ...auth } = isUnknownObject(socket.auth) ? socket.auth : {}
  const session = readNativeAuthSession()

  socket.auth = session
    ? {
        ...auth,
        accessToken: session.accessToken,
        deviceId: session.deviceId
      }
    : auth
}
