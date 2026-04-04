import { Types } from 'mongoose'

import { InfoNotificationStatusType } from 'common'

import { normalizeObjectId } from 'src/shared/lib'

import { InfoNotificationStateModel } from './../model'

export const updateInfoNotificationStateStatus = async ({
  userId,
  notificationId,
  status
}: {
  userId: string | Types.ObjectId
  notificationId: string
  status: InfoNotificationStatusType
}) => {
  const normalizedUserId = normalizeObjectId(userId)

  await InfoNotificationStateModel.updateOne(
    { userId: normalizedUserId },
    { $set: { [`infoNotifications.${notificationId}`]: status } },
    { upsert: true }
  )
}
