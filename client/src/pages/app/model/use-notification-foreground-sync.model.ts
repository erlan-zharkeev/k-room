import { onBeforeUnmount, onMounted } from 'vue'

import { socket } from 'src/shared/api'
import { getClientPlatform, NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE } from 'src/shared/lib'

const isBrowserNotificationForeground = () => {
  return getClientPlatform() === 'browser' && document.visibilityState === 'visible' && document.hasFocus()
}

const syncNotificationForegroundServiceWorker = async (foreground: boolean) => {
  if (!('serviceWorker' in navigator)) return

  const serviceWorker =
    navigator.serviceWorker.controller ?? (await navigator.serviceWorker.getRegistration('/'))?.active

  serviceWorker?.postMessage({
    foreground,
    type: NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE
  })
}

export const useNotificationForegroundSync = () => {
  let lastForeground: boolean | null = null

  const syncNotificationForeground = (force = false) => {
    if (getClientPlatform() !== 'browser') return

    const foreground = socket.connected && isBrowserNotificationForeground()

    if (!force && lastForeground === foreground) return

    lastForeground = foreground

    void syncNotificationForegroundServiceWorker(foreground)

    if (!socket.connected) return

    socket.emit('update-notification-foreground', { foreground })
  }

  const syncNotificationBackground = () => {
    if (getClientPlatform() !== 'browser') return

    lastForeground = false
    void syncNotificationForegroundServiceWorker(false)

    if (!socket.connected) return

    socket.emit('update-notification-foreground', { foreground: false })
  }

  const syncCurrentNotificationForeground = () => {
    syncNotificationForeground()
  }

  const forceSyncCurrentNotificationForeground = () => {
    syncNotificationForeground(true)
  }

  onMounted(() => {
    window.addEventListener('focus', syncCurrentNotificationForeground)
    window.addEventListener('blur', syncCurrentNotificationForeground)
    window.addEventListener('pageshow', forceSyncCurrentNotificationForeground)
    window.addEventListener('pagehide', syncNotificationBackground)
    document.addEventListener('visibilitychange', syncCurrentNotificationForeground)
    socket.on('connect', forceSyncCurrentNotificationForeground)
    socket.on('disconnect', forceSyncCurrentNotificationForeground)
    forceSyncCurrentNotificationForeground()
  })

  onBeforeUnmount(() => {
    syncNotificationBackground()
    window.removeEventListener('focus', syncCurrentNotificationForeground)
    window.removeEventListener('blur', syncCurrentNotificationForeground)
    window.removeEventListener('pageshow', forceSyncCurrentNotificationForeground)
    window.removeEventListener('pagehide', syncNotificationBackground)
    document.removeEventListener('visibilitychange', syncCurrentNotificationForeground)
    socket.off('connect', forceSyncCurrentNotificationForeground)
    socket.off('disconnect', forceSyncCurrentNotificationForeground)
  })
}
