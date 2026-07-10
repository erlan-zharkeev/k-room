import type { RoomCallSignalDeliveryAck, TransportMeta } from 'global-shared'

import { captureClientSentryException, withClientSentryScope } from 'src/shared/lib'

import { handleTransportMeta } from '../transport-meta'

import { socket } from './socket'
import type { SocketAckEventListener, SocketEventListener } from './types'

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> => {
  if ((typeof value !== 'object' && typeof value !== 'function') || value === null) return false

  return typeof Reflect.get(value, 'then') === 'function'
}

const captureSocketEventListenerError = (event: string, error: unknown) => {
  withClientSentryScope((scope) => {
    scope.setTag('socket.event', event)
    scope.setContext('socket_event_listener', { event })
    captureClientSentryException(error)
  })
}

const runSocketEventListener = (
  event: string,
  listener: (payload?: never) => void | Promise<void>,
  payload?: never
) => {
  try {
    const result = listener(payload)

    if (isPromiseLike(result)) {
      void Promise.resolve(result).catch((error) => {
        captureSocketEventListenerError(event, error)
      })
    }
  } catch (error) {
    captureSocketEventListenerError(event, error)
  }
}

const runSocketAckEventListener = async (
  event: string,
  listener: (payload: never) => void | Promise<void>,
  payload: never
) => {
  try {
    await listener(payload)
    return true
  } catch (error) {
    captureSocketEventListenerError(event, error)
    return false
  }
}

export const registerSocketEventListeners = (listeners: readonly SocketEventListener[]) => {
  const registeredListeners = listeners.map(([event, listener]) => {
    const registeredListener =
      event === 'connect' || event === 'disconnect'
        ? () => {
            runSocketEventListener(event, listener as (payload?: never) => void | Promise<void>)
          }
        : (payload: never, meta?: TransportMeta) => {
            handleTransportMeta(meta)
            runSocketEventListener(event, listener as (payload?: never) => void | Promise<void>, payload)
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

export const registerSocketAckEventListeners = (listeners: readonly SocketAckEventListener[]) => {
  const registeredListeners = listeners.map(([event, listener]) => {
    const registeredListener = async (payload: never, meta: TransportMeta, ack?: RoomCallSignalDeliveryAck) => {
      handleTransportMeta(meta)
      const handled = await runSocketAckEventListener(
        event,
        listener as (payload: never) => void | Promise<void>,
        payload
      )

      if (handled) {
        ack?.(true)
      }
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
