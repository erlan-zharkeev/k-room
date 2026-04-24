import { MESSAGE_STATUS } from 'common'
import { Schema } from 'mongoose'

export const messageMetaDataSchema = new Schema(
  {
    id: { type: String, required: true },
    status: { type: String, enum: MESSAGE_STATUS, required: true }
  },
  {
    _id: false
  }
)
