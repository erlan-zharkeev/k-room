import type { DbCallSchemaType } from 'global-shared'
import { model, Schema } from 'mongoose'

const callSchema = new Schema<DbCallSchemaType>({
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
})

export const CallModel = model<DbCallSchemaType>('Call', callSchema, 'call')
