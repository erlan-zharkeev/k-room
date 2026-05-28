import { MESSAGE_BODY_MAX_LENGTH, MESSAGE_STATUS } from 'global-shared'
import { model, Schema } from 'mongoose'

import type { MessageSchema } from './messages.types'

const reactionSchema = new Schema(
  {
    nickname: { type: String, required: true },
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

const messageSchema = new Schema<MessageSchema>({
  _id: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorNickname: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: false,
    maxlength: MESSAGE_BODY_MAX_LENGTH
  },
  createdAt: {
    type: Number,
    required: true
  },
  editedAt: {
    type: Number,
    required: false
  },
  reactions: {
    type: [reactionSchema],
    required: false
  },
  images: {
    type: [Schema.Types.Mixed],
    required: false
  },
  imageCompression: {
    type: Boolean,
    required: false,
    default: true
  },
  deletedForUserIds: {
    type: [String],
    required: false,
    default: []
  },
  usersMetaData: {
    type: [messageMetaDataSchema],
    required: false,
    default: []
  },
  repliedMessage: {
    type: Schema.Types.Mixed,
    required: false,
    default: null
  }
})

export const MessageModel = model<MessageSchema>('Message', messageSchema, 'message')
