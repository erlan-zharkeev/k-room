import { Schema } from 'mongoose'

import { MESSAGE_STATUS } from 'common'

export const messageMetaDataSchema = new Schema(
  {
    id: { type: String, required: true },
    status: { type: String, enum: MESSAGE_STATUS, required: true },
  },
  {
    _id: false
  }
)