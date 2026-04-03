import { model, Schema } from 'mongoose'

import { INFO_NOTIFICATION_STATUS } from 'common'

import { IInfoNotificationStateDocument } from './../config/types'

const infoNotificationStateSchema = new Schema<IInfoNotificationStateDocument>(
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
