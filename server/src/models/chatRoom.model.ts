import { Schema, model } from 'mongoose'
import { ChatRoom } from './../../../types/'

export const chatRoomModel = new Schema<ChatRoom>({
  chatName: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false
  },
  authorId: {
    type: String,
    required: true
  },
  multiple: {
    type: Boolean,
    required: false
  },
  users: {
    type: [{ id: String, username: String }],
    required: true,
    default: []
  },
  messages: {
    type: [],
    required: false,
    default: []
  }
})

export const ChatRoomModel = model('ChatRoom', chatRoomModel)
