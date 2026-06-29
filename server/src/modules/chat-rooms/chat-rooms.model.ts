import { CHAT_KIND_VALUES, CHAT_ROOM_NAME_MAX_LENGTH, SUPPORT_CHAT_STATUS_VALUES } from 'global-shared'
import { model, Schema } from 'mongoose'

import type { ChatRoomSchema } from './chat-rooms.types'

const chatRoomSchema = new Schema<ChatRoomSchema>(
  {
    chatName: {
      type: String,
      required: false,
      maxlength: CHAT_ROOM_NAME_MAX_LENGTH,
      default: ''
    },
    adminId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Number,
      required: true,
      default: Date.now
    },
    chatKind: {
      type: String,
      enum: CHAT_KIND_VALUES,
      required: true
    },
    supportOwnerId: {
      type: String,
      required: false
    },
    supportStatus: {
      type: String,
      enum: SUPPORT_CHAT_STATUS_VALUES,
      required: false
    },
    avatarId: {
      type: String,
      required: false,
      default: null
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
    },
    pinnedMessageId: {
      type: String,
      required: false,
      default: null
    }
  },
  { versionKey: false }
)

export const ChatRoomModel = model<ChatRoomSchema>('ChatRoom', chatRoomSchema, 'chat-room')
