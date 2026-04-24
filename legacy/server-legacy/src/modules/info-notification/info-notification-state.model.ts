import { INFO_NOTIFICATION_STATUS } from 'common'
import { model, Schema } from 'mongoose'

import { InfoNotificationStateDocumentType } from './types'

const infoNotificationStateSchema = new Schema<InfoNotificationStateDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    infoNotifications: {
      type: Map,
      of: {
        type: String,
        enum: INFO_NOTIFICATION_STATUS
      },
      default: () => new Map()
    }
  },
  {
    id: false
  }
)

export const InfoNotificationStateModel = model(
  'InfoNotificationState',
  infoNotificationStateSchema,
  'info-notification-state'
)
