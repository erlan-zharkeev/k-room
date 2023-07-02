import { Schema, model } from 'mongoose'
import { Call } from '../../../types'

export const callModel = new Schema<Call>({
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
  authorName: {
    type: String,
    required: true
  },
  interlocutorId: {
    type: String,
    required: true
  },
  interlocutorName: {
    type: String,
    required: true
  },
  interlocutorAvatarPath: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  video: {
    type: Boolean,
    required: false
  }
})

export const CallModel = model('Call', callModel)
