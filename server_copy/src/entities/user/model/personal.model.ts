import { Schema } from 'mongoose'
import type { IUserPersonalData } from 'entities/user'
import { USER_ROLES } from 'common-types'

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
      type: [String],
      required: true,
      default: []
    }
  },
  { _id: false }
)
