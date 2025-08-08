import { USER_ROLES } from 'common-types'
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
    unreadInfoNotifications: {
      type: [String],
      required: true,
      default: []
    }
  },
  { _id: false }
)
