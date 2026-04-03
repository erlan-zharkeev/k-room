import { Schema } from 'mongoose'

import { IUserPersonalData } from './../config'
import { contactSchema } from './index'

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
    }
  },
  { _id: false }
)
