import { InfoNotificationMapType } from 'common'

import type { MongoIdType } from 'src/shared/config'
import { normalizeObjectId } from 'src/shared/lib'

import { InfoNotificationStateModel } from './../model'

export const createInfoNotificationState = async ({
  userId,
  infoNotifications
}: {
  userId: MongoIdType
  infoNotifications: InfoNotificationMapType
}) => {
  return new InfoNotificationStateModel({
    userId: normalizeObjectId(userId),
    infoNotifications
  }).save()
}
