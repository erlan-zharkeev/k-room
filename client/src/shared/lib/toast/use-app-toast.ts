import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import type { AppToastStackType, IAppToastInput } from './types'

const createToastChannel = () => {
  const notifications = useNmorphNotification()

  const toasts = computed(() => notifications.notifications.value)

  const addToast = (message: IAppToastInput) => {
    notifications.notify({
      ...message,
      type: message.type ?? 'info'
    })
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
  } satisfies Record<AppToastStackType, ReturnType<typeof createToastChannel>>

  const findToastStackType = (id: string): AppToastStackType | undefined => {
    if (systemToastChannel.toasts.value.some((toast) => toast.id === id)) return 'system'
    if (messageToastChannel.toasts.value.some((toast) => toast.id === id)) return 'message'

    return undefined
  }

  return {
    systemToasts: systemToastChannel.toasts,
    messageToasts: messageToastChannel.toasts,

    add(message: IAppToastInput, stackType: AppToastStackType = 'system') {
      toastChannels[stackType].addToast(message)
    },

    remove(id: string) {
      const stackType = findToastStackType(id)
      if (!stackType) return

      toastChannels[stackType].removeToast(id)
    }
  }
}
