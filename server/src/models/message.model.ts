import { Schema, model } from 'mongoose'

export const messageSchema = new Schema({
  authorId: {
    type: String,
    unique: false,
    required: true
  },
  authorName: {
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
    type: [],
    required: false,
    default: []
  },
  repliedMessage: {
    type: {},
    required: false,
    default: null
  }
})

export const MessageModel = model('Message', messageSchema)
