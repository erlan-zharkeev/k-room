import { log } from 'src/shared/lib'

import { NATIVE_DESKTOP_CACHE_CLEANUP_STORAGE_PREFIX, NATIVE_DESKTOP_CHUNK_RECOVERY_STORAGE_PREFIX } from './constants'
import { isNativeDesktopClient } from './lib'

const getStorageValue = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

const setStorageValue = (storage: Storage, key: string, value: string) => {
  try {
    storage.setItem(key, value)
  } catch {
    return
  }
}

const clearNativeDesktopWebCache = async () => {
  const serviceWorkerRegistrations =
    'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistrations() : []
  const cacheKeys = 'caches' in window ? await window.caches.keys() : []
  const hasCacheData = serviceWorkerRegistrations.length > 0 || cacheKeys.length > 0

  if (!hasCacheData) return false

  await Promise.all([
    ...serviceWorkerRegistrations.map((registration) => registration.unregister()),
    ...cacheKeys.map((cacheKey) => window.caches.delete(cacheKey))
  ])

  return true
}

export const initNativeDesktopWebCache = async () => {
  if (!isNativeDesktopClient()) return false

  const cleanupKey = `${NATIVE_DESKTOP_CACHE_CLEANUP_STORAGE_PREFIX}${__CLIENT_ENV_DATA__.appVersion}`

  if (getStorageValue(window.localStorage, cleanupKey)) return false

  try {
    const hasClearedCache = await clearNativeDesktopWebCache()

    setStorageValue(window.localStorage, cleanupKey, 'true')

    if (!hasClearedCache) return false

    window.location.reload()

    return true
  } catch (error) {
    log('warn', 'Native desktop cache cleanup failed', error)

    return false
  }
}

export const recoverNativeDesktopChunkLoad = async () => {
  if (!isNativeDesktopClient()) return false

  const recoveryKey = `${NATIVE_DESKTOP_CHUNK_RECOVERY_STORAGE_PREFIX}${__CLIENT_ENV_DATA__.appVersion}`

  if (getStorageValue(window.sessionStorage, recoveryKey)) return false

  setStorageValue(window.sessionStorage, recoveryKey, 'true')

  try {
    await clearNativeDesktopWebCache()
  } catch (error) {
    log('warn', 'Native desktop chunk recovery cleanup failed', error)
  }

  window.location.reload()

  return true
}
