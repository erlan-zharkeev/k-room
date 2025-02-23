import { InferSchemaType, Schema, model, Types } from 'mongoose'

const chatRoomSchema = new Schema({
  chatName: {
    type: String,
    required: false,
    default: ''
  },
  avatarPath: {
    type: String,
    required: false,
    default: ''
  },
  multiple: {
    type: Boolean,
    required: false,
    default: false
  },
  authorId: {
    type: String,
    required: true
  },
  users: {
    type: [String],
    required: true,
    default: []
  },
  messages: {
    type: [String],
    required: true,
    default: []
  }
})

export const ChatRoomModel = model('ChatRoom', chatRoomSchema)
export type ChatRoomSchemaType = InferSchemaType<typeof chatRoomSchema> & { _id: Types.ObjectId }
