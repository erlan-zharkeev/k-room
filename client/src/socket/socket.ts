import { io } from 'socket.io-client'
import ENV from 'src/ENV'

const initConnectionPath = ENV.IS_DEV ? `:${ENV.SERVER_PORT}` : ''

export const socket = io(`${initConnectionPath}/`, {
  forceNew: false,
  path: '/socket/',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: ENV.MAX_RECONNECT_ATTEMPTS
})
