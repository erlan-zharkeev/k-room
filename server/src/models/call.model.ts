import { Schema, model } from 'mongoose'
import { IDBCallSchema } from '../@types'

const callModel = new Schema<IDBCallSchema>({
  calledAt: {
    type: Number,
    required: false
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
    type: [],
    required: true
  },
  answered: {
    type: Boolean,
    required: true
  },
  video: {
    type: Boolean,
    required: false
  }
})

export const CallModel = model('ICall', callModel)
