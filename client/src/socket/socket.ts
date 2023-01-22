import { io } from 'socket.io-client'
import ENV from 'src/ENV'
import _debounce from 'lodash/debounce'

export const socket = io(`:${ENV.SERVER_PORT}/`, {
  forceNew: true,
  path: '/app/',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: ENV.MAX_RECONNECT_ATTEMPTS
})
