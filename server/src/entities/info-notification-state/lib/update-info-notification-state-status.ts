import { InfoNotificationStatusType } from 'common'

import type { MongoIdType } from 'src/shared/config'
import { normalizeObjectId } from 'src/shared/lib'

import { InfoNotificationStateModel } from './../model'

export const updateInfoNotificationStateStatus = async ({
  userId,
  notificationId,
  status
}: {
  userId: MongoIdType
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
