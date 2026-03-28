import { Schema } from 'mongoose'

import { INFO_NOTIFICATION_STATUS, type InfoNotificationMapType } from 'common'

import type { IUserPersonalData } from './../config'
import { contactSchema } from '.'

export const personalSchema = new Schema<IUserPersonalData>(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    contacts: {
      type: Map,
      of: contactSchema,
      default: () => new Map()
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
