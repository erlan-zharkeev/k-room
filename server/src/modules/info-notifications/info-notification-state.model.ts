import { INFO_NOTIFICATION_STATUS } from 'global-shared'
import { model, Schema } from 'mongoose'

import type { InfoNotificationStateDocumentType } from './info-notifications.types'

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

export const InfoNotificationStateModel = model<InfoNotificationStateDocumentType>(
  'InfoNotificationState',
  infoNotificationStateSchema,
  'info-notification-state'
)
