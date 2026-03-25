import type { IDBCallSchema } from 'common'
import { model, Schema } from 'mongoose'

const callSchema = new Schema<IDBCallSchema>(
  {
    calledAt: {
      type: Number,
      required: true
    },
    startedAt: {
      type: Number,
      required: false
    },
    finishedAt: {
      type: Number,
      required: false
    },
    authorId: {
      type: String,
      required: true
    },
    interlocutors: {
      type: [String],
      required: true
    },
    answered: {
      type: Boolean,
      required: true
    },
    video: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
)

export const CallModel = model('Call', callSchema, 'call')
