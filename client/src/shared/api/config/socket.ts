import { RouteNamesEnum } from 'common'
import { io } from 'socket.io-client'

import { CLIENT_ENV } from 'src/shared/config'

export const socket = io(`${CLIENT_ENV.socketBaseUrl}/`, {
  transports: ['websocket'],
  secure: true,
  forceNew: false,
  autoConnect: false,
  path: RouteNamesEnum.SocketPath,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: CLIENT_ENV.maxReconnectAttempts
})
