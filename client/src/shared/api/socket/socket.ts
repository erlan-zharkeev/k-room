import { io, type Socket } from 'socket.io-client'

import { SOCKET_MAX_RECONNECTION_DELAY_MS, SOCKET_RECONNECTION_DELAY_MS } from './constants'

export const socket: Socket = io(`${__CLIENT_ENV_DATA__.socketBaseUrl}/`, {
  transports: ['websocket'],
  secure: true,
  forceNew: false,
  autoConnect: false,
  path: __CLIENT_ENV_DATA__.socketPath,
  reconnection: true,
  reconnectionDelay: SOCKET_RECONNECTION_DELAY_MS,
  reconnectionDelayMax: SOCKET_MAX_RECONNECTION_DELAY_MS,
  reconnectionAttempts: 10,
  withCredentials: true
})
