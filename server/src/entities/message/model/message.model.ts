import { model, Schema } from 'mongoose'

import {
  type IMessageSchema
} from 'common'

import { messageMetaDataSchema } from 'entities/message/model/meta-data.model'
import { reactionSchema } from 'entities/message/model/reaction.model'


const messageSchema = new Schema<IMessageSchema>(
  {
    _id: {
      type: String,
      required: true
    },
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
      type: [String],
      unique: false,
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
      default: [],
    },
    repliedMessage: {
      type: {},
      required: false,
      default: null
    }
  },
  {}
)

export const MessageModel = model('IMessage', messageSchema, 'message')
