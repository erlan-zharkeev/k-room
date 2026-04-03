import { StatusEnum } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'
import { UserModel } from 'src/entities/user'

import { AppError } from 'src/shared/lib'

export const sendInfoNotificationToAllUsers = async (notificationId: number, resend: boolean = false) => {
  const notification = await InfoNotificationModel.findOne({ id: notificationId }, { _id: 0, id: 1 }).lean()

  if (!notification) {
    throw new AppError(StatusEnum.NotFound, `Info notification with id ${notificationId} not found`)
  }

  await InfoNotificationModel.updateOne({ id: notificationId }, { $set: { isActive: true, updatedAt: Date.now() } })

  const statusPath = `personal.infoNotifications.${notificationId}`
  const filter = resend ? {} : { [statusPath]: { $exists: false } }

  await UserModel.updateMany(filter, { $set: { [statusPath]: 'unread' } })
}
