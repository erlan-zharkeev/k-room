import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { createNotification } from './create-notification'
import type { IAppNotification, IAppNotificationInput } from './types'

const toast = useNmorphNotification()

export const useAppToast = () => {
  const notifications = computed<IAppNotification[]>(() => toast.notifications.value as IAppNotification[])

  const add = (message: IAppNotificationInput) => {
    toast.notify(createNotification(message))
  }

  return {
    notifications,
    add,
    remove: toast.removeNotification
  }
}
