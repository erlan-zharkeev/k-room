import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'

import { TOAST_LIFE_MS, TOAST_PLACEMENT } from './constants'
import type { AppToastNotification, AppToastStack, AppToastInput } from './types'

const { notifications, notify, removeNotification } = useNmorphNotification()

export const useAppToast = () => {
  return {
    toasts: notifications,

    add(message: AppToastInput, stackType: AppToastStack = 'system') {
      const type = message.type ?? 'info'
      const notification: AppToastNotification = {
        ...message,
        bordered: false,
        duration: message.duration ?? TOAST_LIFE_MS[type],
        placement: message.placement ?? TOAST_PLACEMENT[stackType],
        showIcon: message.showIcon ?? stackType !== 'message',
        showDurationValue: false,
        type
      }

      notify(notification)
    },

    remove: removeNotification
  }
}
