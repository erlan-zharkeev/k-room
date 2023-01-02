import { io } from 'socket.io-client'

export const socket = io('/', {
  forceNew: true,
  path: '/app/',
  reconnection: true,
  reconnectionDelay: 1000000,
  reconnectionDelayMax: 1000000,
  reconnectionAttempts: Infinity
})

// socket.io.on('reconnect', (attempt: any) => {
//   console.log('reconnection')
//   socket.connect()
// })

// socket.io.on('reconnect_attempt', (attempt: any) => {
//   console.log('reconnection' + attempt)
// })
