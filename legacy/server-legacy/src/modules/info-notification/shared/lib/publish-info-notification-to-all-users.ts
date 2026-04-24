import { AppLanguageType, REQ_STATUS } from 'common'

import { UserModel } from 'src/modules/user'

import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { InfoNotificationStateModel } from '../../info-notification-state.model'
import { InfoNotificationModel } from '../../info-notification.model'
import { INFO_NOTIFICATION_SHARED_I18N } from '../i18n'

import { emitInfoNotificationToUsers } from './emit-info-notification-to-users'
import { updateInfoNotificationStateStatus } from './update-info-notification-state-status'

export const publishInfoNotificationToAllUsers = async (
  notificationId: string,
  language: AppLanguageType,
  publishAgain: boolean = false
) => {
  const notification = await InfoNotificationModel.findById(notificationId).lean()

  if (!notification) {
    throw new AppError(REQ_STATUS.notFound, localizedText(INFO_NOTIFICATION_SHARED_I18N.notFound, language))
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
