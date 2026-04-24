import { computed } from 'vue'

import type { DbInfoNotificationType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const infoNotificationStore = dexieCollectionStore<DbInfoNotificationType>(db['info-notifications'])

export const useInfoNotification = () => {
  const { bulkGet, bulkPut, put, reset, update } = infoNotificationStore
  const infoNotificationList = infoNotificationStore.use()
  const unreadQuantity = computed(() => infoNotificationList.value.filter(({ status }) => status === 'unread').length)
  const isRead = (id: string) =>
    infoNotificationList.value.find((notification) => notification.id === id)?.status !== 'unread'

  return {
    infoNotificationList,
    unreadQuantity,
    isRead,
    bulkGet,
    put,
    bulkPut,
    update,
    reset
  }
}
