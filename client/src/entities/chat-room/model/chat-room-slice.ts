import { createSlice } from '@reduxjs/toolkit'
import {
  IEventChangeContactsData,
  IEventDeleteMessage,
  EventGetRoomsType,
  IEventMessageDelivered,
  IEventUpdatedMessageReactions,
  IEventUpdateMessageStatus,
  IMessage,
  IRepliedMessage
} from 'common-types'

import type { IRoomState, IMessageInputData } from '../types'

const initialRepliedMessageData = {
  id: '',
  authorName: '',
  authorId: '',
  body: '',
  forward: false
}

const initialMessageInputData = {
  body: '',
  images: [],
  imageCompression: true
}

const initialState: IRoomState = {
  chatRooms: [],
  repliedMessageData: initialRepliedMessageData,
  messageInputData: initialMessageInputData
}

export const chatRoomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    updateMessageInputData(state, { payload }: { payload: Partial<IMessageInputData> }) {
      state.messageInputData = {
        ...state.messageInputData,
        ...payload
      }
    },
    removeImageInMessageInputDataByImageName(state, { payload }: { payload: { name: string } }) {
      const filteredImages = [...state.messageInputData.images].filter((img) => img.name !== payload.name)
      state.messageInputData.images = filteredImages
    },
    resetRoomsStore(state) {
      state.chatRooms = []
      state.repliedMessageData = initialRepliedMessageData
      state.messageInputData = initialMessageInputData
    },
    loadChatRooms(state, { payload }: { payload: EventGetRoomsType }) {
      state.chatRooms = payload
    },
    repliedMessageSetAsForward(state) {
      state.repliedMessageData.forward = true
    },
    pushMessage(state, { payload }: { payload: IEventMessageDelivered }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage, idx) => {
        if (roomMessage.tempId === message.tempId) room.messages.splice(idx, 1)
      })
      room.messages.push(message)
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
  pushMessage,
  pushTemporaryMessage,
  updateMessageReactions,
  updateMessageStatus,
  changeChatName,
  setRepliedMessage,
  repliedMessageSetAsForward,
  resetRepliedMessage,
  deleteMessage,
  resetRoomsStore,
  updateMessageInputData,
  removeImageInMessageInputDataByImageName
} = chatRoomsSlice.actions
