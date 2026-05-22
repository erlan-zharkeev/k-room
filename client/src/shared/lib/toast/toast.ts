import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'

import { TOAST_LIFE_MS, TOAST_PLACEMENT } from './constants'
import type { AppToastStack, AppToastInput } from './types'

const { notifications, notify, removeNotification } = useNmorphNotification()

export const useAppToast = () => {
  return {
    toasts: notifications,

    add(message: AppToastInput, stackType: AppToastStack = 'system') {
      const type = message.type ?? 'info'

      notify({
        ...message,
        duration: message.duration ?? TOAST_LIFE_MS[type],
        placement: message.placement ?? TOAST_PLACEMENT[stackType],
        type
      })
    },

    remove: removeNotification
  }
}
