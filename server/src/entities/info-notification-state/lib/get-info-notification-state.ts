import { AppLanguageType, REQ_STATUS } from 'common'

import type { MongoIdType } from 'src/shared/config'
import { AppError, localizedText, normalizeObjectId } from 'src/shared/lib'

import { INFO_NOTIFICATION_STATE_I18N } from './../config'
import { InfoNotificationStateModel } from './../model'

export const getInfoNotificationState = async (userId: MongoIdType, language: AppLanguageType) => {
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
    throw new AppError(REQ_STATUS.server, localizedText(INFO_NOTIFICATION_STATE_I18N.stateNotFound, language))
  }

  return state
}
