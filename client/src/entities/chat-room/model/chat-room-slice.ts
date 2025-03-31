import { createSlice } from '@reduxjs/toolkit'
import {
  IChatRoom,
  IEventChangeContactsData,
  IEventDeleteMessage,
  EventGetRoomsType,
  IEventMessageDelivered,
  IEventUpdatedMessageReactions,
  IEventUpdateMessageStatus,
  IImageObject,
  IMessage,
  IRepliedMessage
} from 'common-types'
import { UseNotification } from 'src/entities/notification'
import { scrollToBottom } from 'src/shared/utils'

interface AttachedFilesMessage {
  body: string
  images: IImageObject[]
  imageCompression: boolean
}

interface RoomsState {
  chatRooms: IChatRoom[]
  repliedMessageData: IRepliedMessage
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

export const chatRoomsSlice = createSlice({
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
    loadChatRooms(state, { payload }: { payload: EventGetRoomsType }) {
      state.chatRooms = payload
    },
    repliedMessageSetAsForward(state) {
      state.repliedMessageData.forward = true
    },
    updateChatMessage(state, { payload }: { payload: IEventMessageDelivered & { notifications: UseNotification } }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage, idx) => {
        if (roomMessage.tempId === message.tempId) room.messages.splice(idx, 1)
      })
      room.messages.push(message)
      scrollToBottom()
    },
    updateMessageStatus(state, { payload }: { payload: IEventUpdateMessageStatus }) {
      const { roomId, messageId, status } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.status = status
      })
    },
    updateMessageReactions(state, { payload }: { payload: IEventUpdatedMessageReactions }) {
      const { roomId, messageId, reaction } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.reactions = [...(roomMessage.reactions ?? []), reaction]
      })
    },
    pushTemporaryMessage(state, { payload }: { payload: { roomId: string; message: IMessage } }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.push(message)
    },
    changeChatName(state, { payload }: { payload: IEventChangeContactsData }) {
      const { id, username, avatarPath } = payload
      state.chatRooms.forEach((room) => {
        const roomHasContact = Boolean(room.users?.find((user) => user.id === id))
        if (!roomHasContact) return
        if (room.multiple) return
        room.chatName = username
        room.avatarPath = avatarPath
      })
    },
    setRepliedMessage(state, { payload }: { payload: IRepliedMessage }) {
      state.repliedMessageData = {
        ...state.repliedMessageData,
        ...payload
      }
    },
    resetRepliedMessage(state) {
      state.repliedMessageData = initialRepliedMessageData
    },
    deleteMessage(state, { payload }: { payload: IEventDeleteMessage }) {
      const { roomId, messageId } = payload
      state.chatRooms.forEach((room) => {
        if (room.id !== roomId) return
        const messageIndex = room.messages.findIndex((message) => message.id === messageId)
        room.messages.splice(messageIndex, 1)
      })
    }
  }
})

export const {
  loadChatRooms,
  updateChatMessage,
  pushTemporaryMessage,
  updateMessageReactions,
  updateMessageStatus,
  changeChatName,
  setRepliedMessage,
  repliedMessageSetAsForward,
  resetRepliedMessage,
  updatedAttachedFilesMessage,
  deleteMessage,
  resetRoomsStore
} = chatRoomsSlice.actions
