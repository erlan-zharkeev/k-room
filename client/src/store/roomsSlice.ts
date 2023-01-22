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
    loadChatRooms(state, action) {
      state.chatRooms = action.payload
    },
    updateChatMessage(state, action) {
      const { roomId, message } = action.payload
      const room = state.chatRooms.find((room) => room.roomId === roomId)
      room.messages.forEach((roomMessage, idx) => {
        if (roomMessage.id === message.id) room.messages.splice(idx, 1)
      })
      room.messages.push(message)
    },
    updateMessageStatus(state, action) {
      const { roomId, messageId, status } = action.payload
      const room = state.chatRooms.find((room) => room.roomId === roomId)
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.status = status
      })
    },
    pushTemporaryMessage(state, action) {
      const { roomId, message } = action.payload
      const room = state.chatRooms.find((room) => room.roomId === roomId)
      room.messages.push(message)
    },
    updateChatUsersStatus(state, action) {
      const { userId, status } = action.payload
      const hasUser = (users: Array<UserShort>): boolean => {
        return users.some((user) => user.id === userId)
      }
      state.chatRooms.forEach((room) => {
        if (hasUser(room.users)) room.hasOnline = status
      })
    },
    changeChatName(state, action) {
      const { id, username, avatar } = action.payload
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
