import { io } from 'socket.io-client'
import ENV from 'src/ENV'

export const socket = io(`:${ENV.SERVER_PORT}/`, {
  forceNew: true,
  path: '/app/',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: Infinity
})

// socket.io.on('reconnect', (attempt: any) => {
//   console.log('reconnection')
//   socket.connect()
// })

// socket.io.on('reconnect_attempt', (attempt: any) => {
//   console.log('reconnection' + attempt)
// })
