import { io } from 'socket.io-client'
import ENV from 'src/ENV'

export const socket = io(`:${ENV.SERVER_PORT}/`, {
  forceNew: false,
  path: '/socket/',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: ENV.MAX_RECONNECT_ATTEMPTS
})
