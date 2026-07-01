self.addEventListener('push', (event) => {
  let payload = {}

  try {
    payload = event.data ? event.data.json() : {}
  } catch (error) {
    payload = {}
  }

  const title = payload.title || 'K-Room'
  const options = payload.options || {}
  const badgeCount = Number.isInteger(payload.badgeCount) ? payload.badgeCount : null

  const updateAppBadge = async () => {
    const badgeNavigator = self.navigator

    if (
      badgeCount === null ||
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

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, {
        icon: '/meta/android-chrome-192x192.png',
        badge: '/meta/android-chrome-192x192.png',
        ...options,
        data: {
          url: '/app',
          ...(options.data || {})
        }
      }),
      updateAppBadge()
    ])
  )
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
