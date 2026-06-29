;(function () {
  var READY_KEY = '__K_ROOM_CLIENT_RECOVERY_READY__'
  var CONFIG_KEY = '__K_ROOM_CLIENT_RECOVERY_CONFIG__'
  var RECOVERY_PARAM = 'recovery'
  var WEB_PLATFORM = 'web'
  var HARD_UPDATE_ACTION = 'hard-update'

  function noop() {}

  function removeStorageItemsByPrefix(storage, prefix) {
    if (!storage || !prefix) return

    try {
      var keys = []

      for (var index = 0; index < storage.length; index += 1) {
        var key = storage.key(index)

        if (key && key.indexOf(prefix) === 0) {
          keys.push(key)
        }
      }

      keys.forEach(function (key) {
        storage.removeItem(key)
      })
    } catch (error) {
      noop(error)
    }
  }

  function buildPolicyUrl(config) {
    try {
      var url = new URL(config.runtimePolicyUrl, window.location.origin)

      url.searchParams.set('version', config.appVersion)
      url.searchParams.set('platform', WEB_PLATFORM)
      url.searchParams.set('t', String(Date.now()))

      return url.toString()
    } catch (error) {
      noop(error)
      return ''
    }
  }

  function readPolicy(config) {
    var policyUrl = buildPolicyUrl(config)

    if (!policyUrl || !window.fetch) return Promise.resolve(null)

    return fetch(policyUrl, {
      cache: 'no-store',
      credentials: 'omit',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(function (response) {
        return response.ok ? response.json() : null
      })
      .catch(function () {
        return null
      })
  }

  function readPolicyWithTimeout(config) {
    var timeoutMs = Number(config.requestTimeoutMs) || 5000
    var timeoutPromise = new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve(null)
      }, timeoutMs)
    })

    return Promise.race([readPolicy(config), timeoutPromise])
  }

  function clearCacheStorage() {
    if (!window.caches) return Promise.resolve()

    return window.caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            return window.caches.delete(key)
          })
        )
      })
      .then(noop)
  }

  function unregisterServiceWorkers() {
    if (!navigator.serviceWorker) return Promise.resolve()

    return navigator.serviceWorker
      .getRegistrations()
      .then(function (registrations) {
        return Promise.all(
          registrations.map(function (registration) {
            return registration.unregister()
          })
        )
      })
      .then(noop)
  }

  function reloadWithCacheBust() {
    try {
      var url = new URL(window.location.href)

      url.searchParams.set(RECOVERY_PARAM, String(Date.now()))
      window.location.replace(url.toString())
    } catch (error) {
      noop(error)
      window.location.reload()
    }
  }

  function applyHardUpdate(config) {
    removeStorageItemsByPrefix(window.sessionStorage, config.updateReloadStoragePrefix)
    removeStorageItemsByPrefix(window.localStorage, config.updateReloadStoragePrefix)

    return Promise.all([clearCacheStorage().catch(noop), unregisterServiceWorkers().catch(noop)]).then(function () {
      reloadWithCacheBust()
      return false
    })
  }

  function isHardUpdatePolicy(policy) {
    return Boolean(policy && policy.isBlocked === true && policy.action === HARD_UPDATE_ACTION)
  }

  function runRecovery() {
    var config = window[CONFIG_KEY]

    if (!config || !config.enabled || !config.appVersion || !config.runtimePolicyUrl) {
      return Promise.resolve(true)
    }

    return readPolicyWithTimeout(config).then(function (policy) {
      return isHardUpdatePolicy(policy) ? applyHardUpdate(config) : true
    })
  }

  window[READY_KEY] = runRecovery().catch(function () {
    return true
  })
})()
