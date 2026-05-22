import { Schema } from 'mongoose'

import { UserPersonalData } from './types'
import { contactSchema } from './contact.model'

export const personalSchema = new Schema<UserPersonalData>(
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
    }
  },
  { _id: false }
)
