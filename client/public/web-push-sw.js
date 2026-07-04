const APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE = '__APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE__'
const NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE =
  '__NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE__'
const CALL_NOTIFICATION_GROUP = 'calls'
const INVITE_NOTIFICATION_GROUP = 'invites'
const MESSAGE_NOTIFICATION_GROUP = 'messages'
let hasSyncedNotificationForegroundClient = false

const isUnknownObject = (value) => {
  return typeof value === 'object' && value !== null
}

const isAppBadgeSyncMessage = (message) => {
  return (
    isUnknownObject(message) &&
    message.type === APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE &&
    Number.isInteger(message.badgeCount) &&
    message.badgeCount >= 0
  )
}

const isNotificationForegroundSyncMessage = (message) => {
  return (
    isUnknownObject(message) &&
    message.type === NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE &&
    typeof message.foreground === 'boolean'
  )
}

const updateAppBadge = async (badgeCount) => {
  const badgeNavigator = self.navigator

  if (
    !Number.isInteger(badgeCount) ||
    typeof badgeNavigator?.setAppBadge !== 'function' ||
    typeof badgeNavigator?.clearAppBadge !== 'function'
  ) {
    return
  }

  try {
    if (badgeCount > 0) {
      await badgeNavigator.setAppBadge(badgeCount)
      return
    }

    await badgeNavigator.clearAppBadge()
  } catch (error) {
    void error
  }
}

const isAppBadgeNotification = (notification) => {
  return (
    !notification.data?.group ||
    notification.data.group === CALL_NOTIFICATION_GROUP ||
    notification.data.group === INVITE_NOTIFICATION_GROUP ||
    notification.data.group === MESSAGE_NOTIFICATION_GROUP
  )
}

const isAndroidClient = () => {
  return self.navigator.userAgent.includes('Android')
}

const closeAppBadgeNotifications = async () => {
  try {
    const notifications = await self.registration.getNotifications()

    notifications.forEach((notification) => {
      if (!isAppBadgeNotification(notification)) return

      notification.close()
    })
  } catch (error) {
    void error
  }
}

const syncClientAppBadge = async (badgeCount) => {
  await updateAppBadge(badgeCount)

  if (badgeCount > 0 || !isAndroidClient()) return

  await closeAppBadgeNotifications()
}

const isSameOriginWindowClient = (client) => {
  try {
    return new URL(client.url).origin === self.location.origin
  } catch (error) {
    void error
    return false
  }
}

const isNotificationForegroundClient = (client) => {
  if (client.visibilityState !== 'visible') return false
  if ('focused' in client) return client.focused

  return true
}

const hasNotificationForegroundClient = async () => {
  if (!hasSyncedNotificationForegroundClient) return false

  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })

    return clients.some((client) => isSameOriginWindowClient(client) && isNotificationForegroundClient(client))
  } catch (error) {
    void error
    return false
  }
}

const showPushNotification = async (title, options) => {
  if (await hasNotificationForegroundClient()) return

  await self.registration.showNotification(title, {
    icon: '/meta/android-chrome-192x192.png',
    badge: '/meta/android-chrome-192x192.png',
    ...options,
    data: {
      url: '/app',
      ...(options.data || {})
    }
  })
}

self.addEventListener('message', (event) => {
  const message = event.data

  if (isNotificationForegroundSyncMessage(message)) {
    hasSyncedNotificationForegroundClient = message.foreground
    return
  }

  if (!isAppBadgeSyncMessage(message)) return

  const syncPromise = syncClientAppBadge(message.badgeCount)

  if (typeof event.waitUntil === 'function') {
    event.waitUntil(syncPromise)
    return
  }

  void syncPromise
})

self.addEventListener('push', (event) => {
  let payload = {}

  try {
    payload = event.data ? event.data.json() : {}
  } catch (error) {
    payload = {}
  }

  const title = payload.title
  const options = payload.options || {}
  const badgeCount = Number.isInteger(payload.badgeCount) ? payload.badgeCount : null

  event.waitUntil(Promise.all([showPushNotification(title, options), updateAppBadge(badgeCount)]))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/app'
  const targetUrl = new URL(url, self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const currentClient = clients.find((client) => new URL(client.url).origin === self.location.origin)

      if (currentClient) {
        if ('navigate' in currentClient) {
          return currentClient.navigate(targetUrl).then((client) => client?.focus())
        }

        return currentClient.focus()
      }

      return self.clients.openWindow(targetUrl)
    })
  )
})
