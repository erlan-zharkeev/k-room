import { RouteNamesEnum } from 'common-types'
import { io } from 'socket.io-client'

import { CLIENT_ENV } from 'src/shared/config'

const socketBaseUrl = import.meta.env.DEV ? `${CLIENT_ENV.apiHost}:${CLIENT_ENV.serverPort}` : CLIENT_ENV.apiHost

export const socket = io(`${socketBaseUrl}/`, {
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
