import { RouteNamesEnum } from 'common-types'
import { io } from 'socket.io-client'

import { CLIENT_ENV } from 'src/shared/config'

const initConnectionPath = import.meta.env.DEV ? `:${CLIENT_ENV.serverPort}` : ''

export const socket = io(`${initConnectionPath}/`, {
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
