import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { createNotification } from './create-notification'
import type { AppNotificationStackType, IAppNotificationInput } from './types'

const createToastChannel = () => {
  const notifications = useNmorphNotification()

  const toasts = computed(() => notifications.notifications.value)

  const addToast = (message: IAppNotificationInput) => {
    notifications.notify(createNotification(message))
  }

  return {
    toasts,
    addToast,
    removeToast: notifications.removeNotification
  }
}

const systemToastChannel = createToastChannel()
const messageToastChannel = createToastChannel()

export const useAppToast = () => {
  const toastChannels = {
    system: systemToastChannel,
    message: messageToastChannel
  } satisfies Record<AppNotificationStackType, ReturnType<typeof createToastChannel>>

  const findToastStackType = (id: string): AppNotificationStackType | undefined => {
    if (systemToastChannel.toasts.value.some((toast) => toast.id === id)) return 'system'
    if (messageToastChannel.toasts.value.some((toast) => toast.id === id)) return 'message'

    return undefined
  }

  return {
    systemToasts: systemToastChannel.toasts,
    messageToasts: messageToastChannel.toasts,

    add(message: IAppNotificationInput, stackType: AppNotificationStackType = 'system') {
      toastChannels[stackType].addToast(message)
    },

    remove(id: string) {
      const stackType = findToastStackType(id)
      if (!stackType) return

      toastChannels[stackType].removeToast(id)
    }
  }
}
