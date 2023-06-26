import { Schema, model } from 'mongoose'
import { MessageStatus } from '../../../types'

export const messageSchema = new Schema({
  authorId: {
    type: String,
    unique: false,
    required: true
  },
  body: {
    type: String,
    unique: false,
    required: false
  },
  createdAt: {
    type: String,
    unique: false,
    required: true
  },
  reactions: {
    type: [],
    unique: false,
    required: false
  },
  images: {
    type: [],
    unique: false,
    required: false
  },
  imageCompression: {
    type: Boolean,
    required: false,
    default: true
  },
  usersMetaData: {
    type: Array<{ id: String; status: MessageStatus }>,
    required: false,
    default: []
  }
})

export const MessageModel = model('Message', messageSchema)
