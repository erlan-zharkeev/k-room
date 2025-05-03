import { Schema, model } from 'mongoose'
import { IImageObject, IMessageSchema, IReaction } from '../@types'

const reactionSchema = new Schema<IReaction>({
  username: { type: String, required: true },
  authorId: { type: String, required: true },
  glyphKey: { type: String, required: true }
})

const imageSchema = new Schema<Omit<IImageObject, 'fileBuffer'>>({
  src: { type: String, required: true },
  name: { type: String, required: true }
})

const messageSchema = new Schema<IMessageSchema>({
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
    type: [reactionSchema],
    unique: false,
    required: false
  },
  images: {
    type: [imageSchema],
    unique: false,
    required: false
  },
  imageCompression: {
    type: Boolean,
    required: false,
    default: true
  },
  usersMetaData: {
    type: [
      {
        id: { type: String, required: true },
        status: { type: String, enum: ['sending', 'undelivered', 'delivered', 'read', 'none'], required: true }
      }
    ],
    required: false,
    default: []
  },
  repliedMessage: {
    type: {},
    required: false,
    default: null
  }
})

export const MessageModel = model('IMessage', messageSchema, 'message')
