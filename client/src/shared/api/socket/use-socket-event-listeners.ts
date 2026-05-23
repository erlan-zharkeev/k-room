import { onBeforeUnmount } from 'vue'

import { socket } from './socket'
import type { SocketEventListener } from './types'

export const useSocketEventListeners = (listeners: SocketEventListener[]) => {
  const initializeSocketEventListeners = () => {
    listeners.forEach(({ action, handler }) => {
      socket.on(action, handler as Parameters<typeof socket.on>[1])
    })
  }

  const disposeSocketEventListeners = () => {
    listeners.forEach(({ action, handler }) => {
      socket.off(action, handler as Parameters<typeof socket.off>[1])
    })
  }

  onBeforeUnmount(disposeSocketEventListeners)

  return {
    initializeSocketEventListeners,
    disposeSocketEventListeners
  }
}
