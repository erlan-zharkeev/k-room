import { useTimeoutFn } from '@vueuse/core'

import { TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import {
  SOCKET_TRANSPORT_ERROR_TOAST_DELAY_MS,
  SOCKET_TRANSPORT_ERROR_TOAST_ID,
  SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS
} from './constants'
import { SOCKET_I18N } from './i18n'
import { socketStatus } from './socket-status'

let lastSocketTransportErrorToastAt = 0
let socketTransportErrorToastRequestId = 0
let isSocketTransportErrorToastPending = false
let isSocketTransportErrorToastVisible = false

export const useSocketTransportErrorToast = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  let currentSocketTransportErrorToastRequestId = 0

  const showDelayedSocketTransportErrorToast = () => {
    if (currentSocketTransportErrorToastRequestId !== socketTransportErrorToastRequestId) return

    isSocketTransportErrorToastPending = false

    if (socketStatus.isConnected.value || isSocketTransportErrorToastVisible) return

    const now = Date.now()

    if (now - lastSocketTransportErrorToastAt < SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS) return

    lastSocketTransportErrorToastAt = now
    isSocketTransportErrorToastVisible = true
    toast.add({
      id: SOCKET_TRANSPORT_ERROR_TOAST_ID,
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(SOCKET_I18N.transportError)
    })
  }

  const { start: startSocketTransportErrorToastTimer, stop: stopSocketTransportErrorToastTimer } = useTimeoutFn(
    showDelayedSocketTransportErrorToast,
    SOCKET_TRANSPORT_ERROR_TOAST_DELAY_MS,
    { immediate: false }
  )

  const hideSocketTransportErrorToast = () => {
    socketTransportErrorToastRequestId += 1
    isSocketTransportErrorToastPending = false
    stopSocketTransportErrorToastTimer()

    if (!isSocketTransportErrorToastVisible) return

    isSocketTransportErrorToastVisible = false
    toast.remove(SOCKET_TRANSPORT_ERROR_TOAST_ID)
  }

  const showSocketTransportErrorToast = () => {
    const now = Date.now()

    if (socketStatus.isConnected.value || isSocketTransportErrorToastPending || isSocketTransportErrorToastVisible)
      return
    if (now - lastSocketTransportErrorToastAt < SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS) return

    socketTransportErrorToastRequestId += 1
    currentSocketTransportErrorToastRequestId = socketTransportErrorToastRequestId
    isSocketTransportErrorToastPending = true
    startSocketTransportErrorToastTimer()
  }

  return {
    hideSocketTransportErrorToast,
    showSocketTransportErrorToast
  }
}
