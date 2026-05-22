import type { CallSchemaType } from 'global-shared'
import { model, Schema } from 'mongoose'

const callSchema = new Schema<CallSchemaType>({
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

export const CallModel = model<CallSchemaType>('Call', callSchema, 'call')
