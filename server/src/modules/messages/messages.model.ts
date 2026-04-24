import { MESSAGE_STATUS, type IMessageSchema } from 'global-shared'
import { model, Schema } from 'mongoose'

const reactionSchema = new Schema(
  {
    username: { type: String, required: true },
    authorId: { type: String, required: true },
    glyphKey: { type: String, required: true }
  },
  { _id: false }
)

const messageMetaDataSchema = new Schema(
  {
    id: { type: String, required: true },
    status: { type: String, enum: MESSAGE_STATUS, required: true }
  },
  { _id: false }
)

const messageSchema = new Schema<IMessageSchema>({
  _id: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: false
  },
  createdAt: {
    type: Number,
    required: true
  },
  reactions: {
    type: [reactionSchema],
    required: false
  },
  images: {
    type: [String],
    required: false
  },
  imageCompression: {
    type: Boolean,
    required: false,
    default: true
  },
  usersMetaData: {
    type: [messageMetaDataSchema],
    required: false,
    default: []
  },
  repliedMessage: {
    type: {},
    required: false,
    default: null
  }
})

export const MessageModel = model<IMessageSchema>('IMessage', messageSchema, 'message')
