import type { ServerToClientSocketAction, ServerToClientSocketEvents } from 'global-shared'

import { socket } from './socket'

type SocketEventListener =
  | {
      [Event in ServerToClientSocketAction]: readonly [Event, ServerToClientSocketEvents[Event]]
    }[ServerToClientSocketAction]
  | readonly ['connect' | 'disconnect', () => void]

export const registerSocketEventListeners = (listeners: readonly SocketEventListener[]) => {
  listeners.forEach(([event, listener]) => {
    socket.on(event, listener as never)
  })

  return () => {
    listeners.forEach(([event, listener]) => {
      socket.off(event, listener as never)
    })
  }
}
