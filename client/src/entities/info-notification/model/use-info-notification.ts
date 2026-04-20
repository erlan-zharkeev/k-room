import { DbInfoNotificationType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const infoNotificationStore = dexieCollectionStore<DbInfoNotificationType>(db['info-notifications'])

export const useInfoNotification = () => {
  const { bulkGet, put, bulkPut, update, reset } = infoNotificationStore
  const infoNotificationList = infoNotificationStore.use()

  const unreadQuantity = infoNotificationList.filter((notification) => notification.status === 'unread').length

  const isRead = (id: string) =>
    infoNotificationList.find((notification) => notification.id === id)?.status !== 'unread'

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
