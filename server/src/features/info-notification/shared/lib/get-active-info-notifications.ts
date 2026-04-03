import { IInfoNotification } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'

export const getActiveInfoNotifications = async (): Promise<IInfoNotification[]> => {
  const notifications = await InfoNotificationModel.find({ isActive: true }, { __v: 0 }).sort({ createdAt: -1 }).lean()

  return notifications.map(({ _id, ...notification }) => ({
    ...notification,
    id: String(_id)
  }))
}
