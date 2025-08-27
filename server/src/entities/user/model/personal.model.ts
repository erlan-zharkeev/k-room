import { INFO_NOTIFICATION_STATUS, type InfoNotificationMapType, USER_ROLES } from 'common-types'
import type { IUserPersonalData } from 'entities/user'
import { Schema } from 'mongoose'

export const personalSchema = new Schema<IUserPersonalData>(
  {
    role: {
      type: String,
      enum: USER_ROLES,
      unique: false,
      required: false
    },
    contacts: {
      type: [String],
      default: [],
      required: true
    },
    chatRooms: {
      type: [String],
      default: [],
      required: true
    },
    infoNotifications: {
      type: Map,
      of: {
        type: String,
        enum: INFO_NOTIFICATION_STATUS as ReadonlyArray<InfoNotificationMapType>
      },
      required: true,
      default: {}
    }
  },
  { _id: false }
)
