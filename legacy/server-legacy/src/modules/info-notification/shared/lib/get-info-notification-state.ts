import { AppLanguageType, REQ_STATUS } from 'common'

import type { MongoIdType } from 'src/shared/config'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { normalizeObjectId } from 'src/shared/lib/normalize-object-id'

import { InfoNotificationStateModel } from '../../info-notification-state.model'
import { INFO_NOTIFICATION_STATE_I18N } from '../i18n'

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
