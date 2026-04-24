import { InfoNotificationMapType } from 'common'

import type { MongoIdType } from 'src/shared/config'
import { normalizeObjectId } from 'src/shared/lib/normalize-object-id'

import { InfoNotificationStateModel } from '../../info-notification-state.model'

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
