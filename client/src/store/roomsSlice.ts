import { createSlice } from '@reduxjs/toolkit'
import { UserShort } from 'common-types'
import { RoomsState } from './@types/RoomsState'

const initialRepliedMessageData = {
  id: '',
  authorName: '',
  authorId: '',
  body: ''
}

const initialAttachedFilesMessage = {
  body: '',
  images: [],
  imageCompression: true
}

const initialState: RoomsState = {
  isLoading: true,
  chatRooms: [],
  repliedMessageData: initialRepliedMessageData,
  attachedFilesMessage: initialAttachedFilesMessage
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    updatedAttachedFilesMessage(state, { payload }) {
      state.attachedFilesMessage = { ...state.attachedFilesMessage, ...payload }
    },
    loadChatRooms(state, { payload }) {
      state.chatRooms = payload
    },
    updateChatMessage(state, { payload }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage, idx) => {
        if (roomMessage.tempId === message.tempId) room.messages.splice(idx, 1)
      })
      room.messages.push(message)
      if (room?.messages.length > 1) room.blocked = false
    },
    updateMessageStatus(state, { payload }) {
      const { roomId, messageId, status } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.status = status
      })
    },
    updateMessageReactions(state, { payload }) {
      const { roomId, messageId, reaction } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.reactions = [...(roomMessage.reactions ?? []), reaction]
      })
    },
    pushTemporaryMessage(state, { payload }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.push(message)
    },
    updateChatUsersStatus(state, { payload }) {
      const { userId, status } = payload
      const hasUser = (users: Array<UserShort>): boolean => {
        return users.some((user) => user.id === userId)
      }
      state.chatRooms.forEach((room) => {
        if (hasUser(room.users ?? [])) room.hasOnline = status
      })
    },
    changeChatName(state, { payload }) {
      const { id, username, avatarPath } = payload
      state.chatRooms.forEach((room) => {
        const roomHasContact = Boolean(room.users?.find((user) => user.id === id))
        if (!roomHasContact) return
        if (room.multiple) return
        room.chatName = username
        room.avatarPath = avatarPath
      })
    },
    setRepliedMessage(state, { payload }) {
      state.repliedMessageData = payload
    },
    resetRepliedMessage(state) {
      state.repliedMessageData = initialRepliedMessageData
    }
  }
})

export const {
  loadChatRooms,
  updateChatUsersStatus,
  updateChatMessage,
  pushTemporaryMessage,
  updateMessageReactions,
  updateMessageStatus,
  changeChatName,
  setRepliedMessage,
  resetRepliedMessage,
  updatedAttachedFilesMessage
} = roomsSlice.actions

export default roomsSlice.reducer
