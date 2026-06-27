import type { TransportMeta } from 'global-shared'

import { handleTransportMeta } from '../transport-meta'

import { socket } from './socket'
import type { SocketEventListener } from './types'

export const registerSocketEventListeners = (listeners: readonly SocketEventListener[]) => {
  const registeredListeners = listeners.map(([event, listener]) => {
    const registeredListener =
      event === 'connect' || event === 'disconnect'
        ? listener
        : (payload: never, meta?: TransportMeta) => {
            const eventListener = listener as (payload: never) => void

            handleTransportMeta(meta)
            eventListener(payload)
          }

    socket.on(event, registeredListener as never)

    return [event, registeredListener] as const
  })

  return () => {
    registeredListeners.forEach(([event, listener]) => {
      socket.off(event, listener as never)
    })
  }
}
