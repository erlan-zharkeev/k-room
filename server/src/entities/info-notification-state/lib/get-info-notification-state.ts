import { Types } from 'mongoose'

import { normalizeObjectId } from 'src/shared/lib'

import { InfoNotificationStateModel } from './../model'

export const getInfoNotificationState = async (userId: string | Types.ObjectId) => {
  const normalizedUserId = normalizeObjectId(userId)

  const existingState = await InfoNotificationStateModel.findOne({ userId: normalizedUserId })

  if (existingState) return existingState

  return await new InfoNotificationStateModel({
    userId: normalizedUserId,
    infoNotifications: {}
  }).save()
}
