import { computed } from 'vue'

import type { DbInfoNotificationType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const infoNotificationStore = dexieCollectionStore<DbInfoNotificationType>(db['info-notifications'])

export const useInfoNotification = () => {
  const { bulkGet, bulkPut, put, reset, update } = infoNotificationStore
  const infoNotificationList = infoNotificationStore.use()
  const isRead = (id: string) => {
    return infoNotificationList.value.find((notification) => notification.id === id)?.status !== 'unread'
  }
  const unreadInfoNotificationQuantity = computed(() => {
    return infoNotificationList.value.filter(({ status }) => status === 'unread').length
  })

  return {
    infoNotificationList,
    unreadInfoNotificationQuantity,
    isRead,
    bulkGet,
    put,
    bulkPut,
    update,
    reset
  }
}
