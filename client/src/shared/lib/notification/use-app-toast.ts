import { useTimeoutFn } from '@vueuse/core'
import { ref } from 'vue'

import { generateUUIDv4 } from '../helpers/generate-uuid-v4'

import {
  DEFAULT_NOTIFICATION_DURATION,
  DEFAULT_NOTIFICATION_PLACEMENT,
  DEFAULT_NOTIFICATION_WIDTH,
  NOTIFICATION_PLACEMENT_BY_TYPE
} from './constants'
import type { IAppNotification, IAppNotificationInput } from './types'

const notifications = ref<IAppNotification[]>([])

const remove = (id: string) => {
  notifications.value = notifications.value.filter((notification) => notification.id !== id)
}

const createNotification = (message: IAppNotificationInput): IAppNotification => {
  const type = message.type ?? 'info'
  return {
    id: generateUUIDv4(),
    ...message,
    type,
    duration: message.duration ?? DEFAULT_NOTIFICATION_DURATION,
    width: message.width ?? DEFAULT_NOTIFICATION_WIDTH,
    closable: message.closable ?? true,
    fill: true,
    placement: message.placement ?? NOTIFICATION_PLACEMENT_BY_TYPE[type] ?? DEFAULT_NOTIFICATION_PLACEMENT
  }
}

export const useAppToast = () => {
  const add = (message: IAppNotificationInput) => {
    const notification = createNotification(message)

    notifications.value = [...notifications.value, notification]

    if (notification.duration === 0) return

    useTimeoutFn(() => {
      remove(notification.id)
    }, notification.duration)
  }

  return {
    notifications,
    add,
    remove
  }
}
