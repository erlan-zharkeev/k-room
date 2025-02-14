import { createSlice } from '@reduxjs/toolkit'
import {
  ChatRoom,
  EventChangeContactsData,
  EventDeleteMessage,
  EventGetRooms,
  EventMessageDelivered,
  EventStatusContact,
  EventUpdatedMessageReactions,
  EventUpdateMessageStatus,
  ImageObject,
  Message,
  RepliedMessage,
  UserShort
} from 'common-types'
import { UseNotification } from 'src/hooks/use-notification'
import { scrollToBottom } from 'src/utils'

interface AttachedFilesMessage {
  body: string
  images: Array<ImageObject>
  imageCompression: boolean
}

interface RoomsState {
  chatRooms: Array<ChatRoom>
  repliedMessageData: RepliedMessage
  attachedFilesMessage: AttachedFilesMessage
}

const initialRepliedMessageData = {
  id: '',
  authorName: '',
  authorId: '',
  body: '',
  forward: false
}

const initialAttachedFilesMessage = {
  body: '',
  images: [],
  imageCompression: true
}

const initialState: RoomsState = {
  chatRooms: [],
  repliedMessageData: initialRepliedMessageData,
  attachedFilesMessage: initialAttachedFilesMessage
}

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    resetRoomsStore(state) {
      state.chatRooms = []
      state.repliedMessageData = initialRepliedMessageData
      state.attachedFilesMessage = initialAttachedFilesMessage
    },
    updatedAttachedFilesMessage(state, { payload }: { payload: AttachedFilesMessage }) {
      state.attachedFilesMessage = { ...state.attachedFilesMessage, ...payload }
    },
    loadChatRooms(state, { payload }: { payload: EventGetRooms }) {
      state.chatRooms = payload
    },
    repliedMessageSetAsForward(state) {
      state.repliedMessageData.forward = true
    },
    updateChatMessage(state, { payload }: { payload: EventMessageDelivered & { notifications: UseNotification } }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage, idx) => {
        if (roomMessage.tempId === message.tempId) room.messages.splice(idx, 1)
      })
      room.messages.push(message)
      scrollToBottom()
    },
    updateMessageStatus(state, { payload }: { payload: EventUpdateMessageStatus }) {
      const { roomId, messageId, status } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.status = status
      })
    },
    updateMessageReactions(state, { payload }: { payload: EventUpdatedMessageReactions }) {
      const { roomId, messageId, reaction } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.reactions = [...(roomMessage.reactions ?? []), reaction]
      })
    },
    pushTemporaryMessage(state, { payload }: { payload: { roomId: string; message: Message } }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.push(message)
    },
    updateChatUsersStatus(state, { payload }: { payload: EventStatusContact }) {
      const { interlocutorId, online } = payload
      const hasUser = (users: Array<UserShort>): boolean => {
        return users.some((user) => user.id === interlocutorId)
      }
      state.chatRooms.forEach((room) => {
        if (hasUser(room.users ?? [])) room.hasOnline = online
      })
    },
    changeChatName(state, { payload }: { payload: EventChangeContactsData }) {
      const { id, username, avatarPath } = payload
      state.chatRooms.forEach((room) => {
        const roomHasContact = Boolean(room.users?.find((user) => user.id === id))
        if (!roomHasContact) return
        if (room.multiple) return
        room.chatName = username
        room.avatarPath = avatarPath
      })
    },
    setRepliedMessage(state, { payload }: { payload: RepliedMessage }) {
      state.repliedMessageData = {
        ...state.repliedMessageData,
        ...payload
      }
    },
    resetRepliedMessage(state) {
      state.repliedMessageData = initialRepliedMessageData
    },
    deleteMessage(state, { payload }: { payload: EventDeleteMessage }) {
      const { roomId, messageId } = payload
      state.chatRooms.forEach((room) => {
        if (room.id !== roomId) return
        const messageIndex = room.messages.findIndex((message) => message.id === messageId)
        room.messages.splice(messageIndex, 1)
      })
    }
  }
})
