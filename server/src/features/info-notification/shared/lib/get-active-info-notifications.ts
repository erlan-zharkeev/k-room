import { IInfoNotification } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'

export const getActiveInfoNotifications = async (): Promise<IInfoNotification[]> =>
  await InfoNotificationModel.find({ isActive: true }, { _id: 0, __v: 0 }).sort({ createdAt: -1 }).lean()
