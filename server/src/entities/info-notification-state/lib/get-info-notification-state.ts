import { StatusEnum } from 'common'

import type { MongoIdType } from 'src/shared/config'
import { AppError, getLocalizedText, normalizeObjectId } from 'src/shared/lib'

import { INFO_NOTIFICATION_STATE_I18N } from './../config'
import { InfoNotificationStateModel } from './../model'

export const getInfoNotificationState = async (userId: MongoIdType) => {
  const normalizedUserId = normalizeObjectId(userId)

  const state = await InfoNotificationStateModel.findOneAndUpdate(
    { userId: normalizedUserId },
    {
      $setOnInsert: {
        userId: normalizedUserId,
        infoNotifications: {}
      }
    },
    {
      upsert: true,
      new: true
    }
  ).lean()

  if (!state) {
    throw new AppError(StatusEnum.Server, getLocalizedText(INFO_NOTIFICATION_STATE_I18N.stateNotFound))
  }

  return state
}
