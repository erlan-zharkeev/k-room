import type { AxiosResponse } from 'axios'
import { CLIENT_VERSION_HEADER, type TransportMeta } from 'global-shared'
import { watch } from 'vue'

import { getClientPlatform } from 'src/shared/lib/browser/browser'
import { useI18n } from 'src/shared/lib/i18n/i18n'
import { useAppToast } from 'src/shared/lib/toast/toast'

import { CLIENT_UPDATE_RELOAD_DELAY_MS, CLIENT_UPDATE_TOAST_ID } from './constants'
import { getHeaderValue } from './http/get-header-value'
import { API_I18N } from './i18n'

let isClientUpdateToastActive = false
let activeClientUpdateVersion = ''
let pendingClientUpdateVersion = ''
let isClientUpdateToastRemovingSilently = false
let stopClientUpdateToastWatcher: (() => void) | null = null
const clientUpdateReloadBlockers = new Set<string>()

const reloadClient = () => {
  window.location.reload()
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

      activeClientUpdateVersion = ''
      reloadClient()
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
