import { Types } from 'mongoose'

import { InfoNotificationMapType } from 'common'

import { normalizeObjectId } from 'src/shared/lib'

import { InfoNotificationStateModel } from './../model'

export const createInfoNotificationState = async ({
  userId,
  infoNotifications
}: {
  userId: string | Types.ObjectId
  infoNotifications: InfoNotificationMapType
}) => {
  return await new InfoNotificationStateModel({
    userId: normalizeObjectId(userId),
    infoNotifications
  }).save()
}
