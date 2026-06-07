import { TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS } from './constants'
import { SOCKET_I18N } from './i18n'

let lastSocketTransportErrorToastAt = 0

export const useSocketTransportErrorToast = () => {
  const { t } = useI18n()
  const toast = useAppToast()

  const showSocketTransportErrorToast = () => {
    const now = Date.now()

    if (now - lastSocketTransportErrorToastAt < SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS) return

    lastSocketTransportErrorToastAt = now
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(SOCKET_I18N.transportError)
    })
  }

  return {
    showSocketTransportErrorToast
  }
}
