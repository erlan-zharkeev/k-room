import type { AxiosResponse } from 'axios'
import { CLIENT_VERSION_HEADER, type TransportMeta } from 'global-shared'
import { watch } from 'vue'

import { getClientPlatform } from 'src/shared/lib/browser/browser'
import { useI18n } from 'src/shared/lib/i18n/i18n'
import { useAppToast } from 'src/shared/lib/toast/toast'

import {
  CLIENT_UPDATE_RELOAD_DELAY_MS,
  CLIENT_UPDATE_RELOAD_STORAGE_PREFIX,
  CLIENT_UPDATE_SERVICE_WORKER_TIMEOUT_MS,
  CLIENT_UPDATE_TOAST_ID
} from './constants'
import { getHeaderValue } from './http/get-header-value'
import { API_I18N } from './i18n'

let isClientUpdateToastActive = false
let activeClientUpdateVersion = ''
let pendingClientUpdateVersion = ''
let isClientUpdateToastRemovingSilently = false
let stopClientUpdateToastWatcher: (() => void) | null = null
const clientUpdateReloadBlockers = new Set<string>()

const buildClientUpdateReloadStorageKey = (clientVersion: string) =>
  `${CLIENT_UPDATE_RELOAD_STORAGE_PREFIX}${clientVersion}`

const getSessionStorageValue = (key: string) => {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

const setSessionStorageValue = (key: string, value: string) => {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    return
  }
}

const hasClientUpdateReloadStarted = (clientVersion: string) =>
  getSessionStorageValue(buildClientUpdateReloadStorageKey(clientVersion)) === 'true'

const markClientUpdateReloadStarted = (clientVersion: string) => {
  setSessionStorageValue(buildClientUpdateReloadStorageKey(clientVersion), 'true')
}

const waitForServiceWorkerControllerChange = () =>
  new Promise<boolean>((resolve) => {
    if (!('serviceWorker' in navigator)) {
      resolve(false)
      return
    }

    let isResolved = false
    let timeoutId = 0
    const resolveOnce = (value: boolean) => {
      if (isResolved) return

      isResolved = true
      window.clearTimeout(timeoutId)
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      resolve(value)
    }
    const handleControllerChange = () => {
      resolveOnce(true)
    }

    timeoutId = window.setTimeout(() => {
      resolveOnce(false)
    }, CLIENT_UPDATE_SERVICE_WORKER_TIMEOUT_MS)
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
  })

const waitForWaitingServiceWorker = (registration: ServiceWorkerRegistration) =>
  new Promise<ServiceWorker | null>((resolve) => {
    if (registration.waiting) {
      resolve(registration.waiting)
      return
    }

    let isResolved = false
    let timeoutId = 0
    const resolveOnce = (worker: ServiceWorker | null) => {
      if (isResolved) return

      isResolved = true
      window.clearTimeout(timeoutId)
      registration.removeEventListener('updatefound', handleUpdateFound)
      resolve(worker)
    }
    const handleUpdateFound = () => {
      const worker = registration.installing

      if (!worker) return
      if (worker.state === 'installed') {
        resolveOnce(registration.waiting ?? worker)
        return
      }

      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
          resolveOnce(registration.waiting ?? worker)
        }
      })
    }

    timeoutId = window.setTimeout(() => {
      resolveOnce(registration.waiting)
    }, CLIENT_UPDATE_SERVICE_WORKER_TIMEOUT_MS)
    registration.addEventListener('updatefound', handleUpdateFound)
    handleUpdateFound()
  })

const resolveWaitingServiceWorker = async (registration: ServiceWorkerRegistration) => {
  if (registration.waiting) return registration.waiting

  try {
    await registration.update()
  } catch {
    return null
  }

  return waitForWaitingServiceWorker(registration)
}

const resolveClientUpdateServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null

  const registrations = await navigator.serviceWorker.getRegistrations()

  for (const registration of registrations) {
    const worker = await resolveWaitingServiceWorker(registration)

    if (worker) return worker
  }

  return null
}

const requestClientUpdateServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return

  const registrations = await navigator.serviceWorker.getRegistrations()

  await Promise.allSettled(registrations.map((registration) => registration.update()))
}

const applyClientUpdateServiceWorker = async () => {
  const worker = await resolveClientUpdateServiceWorker()

  if (!worker) return false

  const controllerChangePromise = waitForServiceWorkerControllerChange()

  worker.postMessage({ type: 'SKIP_WAITING' })

  return controllerChangePromise
}

const reloadClientWithUpdate = async (clientVersion: string) => {
  if (hasClientUpdateReloadStarted(clientVersion)) {
    await requestClientUpdateServiceWorker()
    return
  }

  markClientUpdateReloadStarted(clientVersion)

  try {
    await applyClientUpdateServiceWorker()
  } finally {
    window.location.reload()
  }
}

const showClientUpdateToast = () => {
  const { t } = useI18n()
  const toast = useAppToast()

  toast.remove(CLIENT_UPDATE_TOAST_ID)
  toast.add({
    id: CLIENT_UPDATE_TOAST_ID,
    isCritical: true,
    type: 'warning',
    title: t(API_I18N.clientUpdateTitle),
    content: t(API_I18N.clientUpdateContent),
    closable: false,
    duration: CLIENT_UPDATE_RELOAD_DELAY_MS
  })
}

const stopWatchingClientUpdateToast = () => {
  stopClientUpdateToastWatcher?.()
  stopClientUpdateToastWatcher = null
}

const initializeClientUpdateToastWatcher = () => {
  stopWatchingClientUpdateToast()

  const toast = useAppToast()

  stopClientUpdateToastWatcher = watch(
    toast.toasts,
    (toasts) => {
      const hasClientUpdateToast = toasts.some(({ id }) => id === CLIENT_UPDATE_TOAST_ID)

      if (hasClientUpdateToast) return

      stopWatchingClientUpdateToast()
      isClientUpdateToastActive = false

      if (isClientUpdateToastRemovingSilently) {
        isClientUpdateToastRemovingSilently = false
        return
      }

      const clientVersion = activeClientUpdateVersion

      activeClientUpdateVersion = ''
      void reloadClientWithUpdate(clientVersion)
    },
    { flush: 'post' }
  )
}

const startClientUpdateToast = (nextClientVersion: string) => {
  isClientUpdateToastActive = true
  activeClientUpdateVersion = nextClientVersion
  pendingClientUpdateVersion = ''
  showClientUpdateToast()
  initializeClientUpdateToastWatcher()
}

const postponeActiveClientUpdateToast = () => {
  if (!isClientUpdateToastActive) return

  isClientUpdateToastRemovingSilently = true
  useAppToast().remove(CLIENT_UPDATE_TOAST_ID)
  pendingClientUpdateVersion = activeClientUpdateVersion
  activeClientUpdateVersion = ''
}

const tryStartClientUpdateToast = (nextClientVersion: string) => {
  const isNativeDesktopClient = getClientPlatform() === 'native'
  const isCurrentClientVersion = nextClientVersion === __CLIENT_ENV_DATA__.appVersion

  if (isCurrentClientVersion || isNativeDesktopClient || isClientUpdateToastActive) return

  if (hasClientUpdateReloadStarted(nextClientVersion)) {
    void requestClientUpdateServiceWorker()
    return
  }

  if (clientUpdateReloadBlockers.size) {
    pendingClientUpdateVersion = nextClientVersion
    return
  }

  startClientUpdateToast(nextClientVersion)
}

export const handleTransportMeta = (meta?: TransportMeta | null) => {
  const nextClientVersion = meta?.clientVersion

  if (!nextClientVersion) return

  tryStartClientUpdateToast(nextClientVersion)
}

export const setClientUpdateReloadBlock = (blockerId: string, isBlocked: boolean) => {
  if (isBlocked) {
    clientUpdateReloadBlockers.add(blockerId)
  } else {
    clientUpdateReloadBlockers.delete(blockerId)
  }

  if (clientUpdateReloadBlockers.size) {
    postponeActiveClientUpdateToast()
    return
  }

  if (!pendingClientUpdateVersion) return

  tryStartClientUpdateToast(pendingClientUpdateVersion)
}

export const handleHttpTransportMeta = (response: Pick<AxiosResponse, 'headers'>) => {
  const clientVersion = getHeaderValue(response.headers[CLIENT_VERSION_HEADER])

  handleTransportMeta(clientVersion ? { clientVersion } : undefined)
}
