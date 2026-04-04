import { AppLanguageType, StatusEnum } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'
import { InfoNotificationStateModel, updateInfoNotificationStateStatus } from 'src/entities/info-notification-state'
import { UserModel } from 'src/entities/user'

import { AppError, getLocalizedText } from 'src/shared/lib'

import { INFO_NOTIFICATION_SHARED_I18N } from './../config'
import { emitInfoNotificationToUsers } from './emit-info-notification-to-users'

export const publishInfoNotificationToAllUsers = async (
  notificationId: string,
  language: AppLanguageType,
  publishAgain: boolean = false
) => {
  const notification = await InfoNotificationModel.findById(notificationId).lean()

  if (!notification) {
    throw new AppError(StatusEnum.NotFound, getLocalizedText(INFO_NOTIFICATION_SHARED_I18N.notFound, language))
  }

  const publishedAt = Date.now()

  await InfoNotificationModel.updateOne({ _id: notificationId }, { $set: { isActive: true, updatedAt: publishedAt } })

  const users = await UserModel.find().select('_id').lean()
  const states = await InfoNotificationStateModel.find().select('userId infoNotifications').lean()
  const stateByUserId = new Map(states.map((state) => [String(state.userId), state]))
  const updateRequests: Promise<unknown>[] = []
  const recipientUserIds: string[] = []

  users.forEach((user) => {
    const userId = String(user._id)
    const state = stateByUserId.get(userId)
    const userAlreadyHasInfoNotification = Boolean(
      state?.infoNotifications && notificationId in Object(state.infoNotifications)
    )

    if (userAlreadyHasInfoNotification && !publishAgain) return

    recipientUserIds.push(userId)

    updateRequests.push(
      updateInfoNotificationStateStatus({
        userId: user._id,
        notificationId,
        status: 'unread'
      })
    )
  })

  await Promise.all(updateRequests)

  await emitInfoNotificationToUsers({
    userIds: recipientUserIds,
    notification: {
      ...notification,
      id: String(notification._id),
      isActive: true,
      updatedAt: publishedAt,
      status: 'unread' as const
    }
  })
}
