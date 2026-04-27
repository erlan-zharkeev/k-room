import { io, type Socket } from 'socket.io-client'

import { CLIENT_ENV, SOCKET_MAX_RECONNECTION_DELAY_MS, SOCKET_RECONNECTION_DELAY_MS } from 'src/shared/config'

export const socket: Socket = io(`${CLIENT_ENV.socketBaseUrl}/`, {
  transports: ['websocket'],
  secure: true,
  forceNew: false,
  autoConnect: false,
  path: CLIENT_ENV.socketPath,
  reconnection: true,
  reconnectionDelay: SOCKET_RECONNECTION_DELAY_MS,
  reconnectionDelayMax: SOCKET_MAX_RECONNECTION_DELAY_MS,
  reconnectionAttempts: 10,
  withCredentials: true
})
