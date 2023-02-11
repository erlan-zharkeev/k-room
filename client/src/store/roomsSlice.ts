import { createSlice } from '@reduxjs/toolkit'
import { UserShort } from 'common-types'
import { RoomsState } from './@types/RoomsState'

const initialState: RoomsState = {
  chatRooms: []
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    loadChatRooms(state, { payload }) {
      state.chatRooms = payload
    },
    updateChatMessage(state, { payload }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.roomId === roomId)
      room.messages.forEach((roomMessage, idx) => {
        if (roomMessage.id === message.id) room.messages.splice(idx, 1)
      })
      room.messages.push(message)
    },
    updateMessageStatus(state, { payload }) {
      const { roomId, messageId, status } = payload
      const room = state.chatRooms.find((room) => room.roomId === roomId)
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.status = status
      })
    },
    pushTemporaryMessage(state, { payload }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.roomId === roomId)
      room.messages.push(message)
    },
    updateChatUsersStatus(state, { payload }) {
      const { userId, status } = payload
      const hasUser = (users: Array<UserShort>): boolean => {
        return users.some((user) => user.id === userId)
      }
      state.chatRooms.forEach((room) => {
        if (hasUser(room.users)) room.hasOnline = status
      })
    },
    changeChatName(state, { payload }) {
      const { id, username, avatar } = payload
      state.chatRooms.forEach((room) => {
        const roomHasContact = Boolean(room.users.find((user) => user.id === id))
        if (!roomHasContact) return
        if (room.multiple) return
        room.chatName = username
        room.avatar = avatar
      })
    }
  }
})

export const {
  loadChatRooms,
  updateChatUsersStatus,
  updateChatMessage,
  pushTemporaryMessage,
  updateMessageStatus,
  changeChatName
} = roomsSlice.actions

export default roomsSlice.reducer
