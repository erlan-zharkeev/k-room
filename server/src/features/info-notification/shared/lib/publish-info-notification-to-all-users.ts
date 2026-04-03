import { AppLanguageType, StatusEnum } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'
import { InfoNotificationStateModel, updateInfoNotificationStateStatus } from 'src/entities/info-notification-state'
import { UserModel } from 'src/entities/user'

import { AppError, getLocalizedText } from 'src/shared/lib'

import { INFO_NOTIFICATION_SHARED_I18N } from './../config'

export const publishInfoNotificationToAllUsers = async (
  notificationId: string,
  language: AppLanguageType,
  publishAgain: boolean = false
) => {
  const notification = await InfoNotificationModel.exists({ _id: notificationId })

  if (!notification) {
    throw new AppError(StatusEnum.NotFound, getLocalizedText(INFO_NOTIFICATION_SHARED_I18N.notFound, language))
  }

  await InfoNotificationModel.updateOne({ _id: notificationId }, { $set: { isActive: true, updatedAt: Date.now() } })

  const users = await UserModel.find().select('_id').lean()
  const states = await InfoNotificationStateModel.find().select('userId infoNotifications').lean()
  const stateByUserId = new Map(states.map((state) => [String(state.userId), state]))
  const updateRequests: Promise<unknown>[] = []

  users.forEach((user) => {
    const userId = String(user._id)
    const state = stateByUserId.get(userId)
    const userAlreadyHasInfoNotification = Boolean(
      state?.infoNotifications && notificationId in Object(state.infoNotifications)
    )

    if (userAlreadyHasInfoNotification && !publishAgain) return

    updateRequests.push(
      updateInfoNotificationStateStatus({
        userId: user._id,
        notificationId,
        status: 'unread'
      })
    )
  })

  await Promise.all(updateRequests)
}
