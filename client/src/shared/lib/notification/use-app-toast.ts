import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'

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
  const { settings } = useSettings()
  const { isAuthorized } = useUser()

  const isNotificationVisible = computed(() => settings.value.showNotification || !isAuthorized.value)

  const systemToasts = computed(() => {
    if (!isNotificationVisible.value) return []

    return systemToastChannel.toasts.value
  })

  const messageToasts = computed(() => {
    if (!isNotificationVisible.value) return []

    return messageToastChannel.toasts.value
  })

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
    systemToasts,
    messageToasts,

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
