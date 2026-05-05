import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { createNotification } from './create-notification'
import type { IAppNotificationInput } from './types'

const toast = useNmorphNotification()

export const useAppToast = () => {
  const notifications = computed(() => toast.notifications.value)

  const add = (message: IAppNotificationInput) => {
    toast.notify(createNotification(message))
  }

  return {
    notifications,
    add,
    remove: toast.removeNotification
  }
}
