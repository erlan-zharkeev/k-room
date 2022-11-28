import { createSlice } from '@reduxjs/toolkit'
import useTypedSelector from '../hooks/useTypedSelector'
import { ChatRoomsState } from './@types/ChatRoomsState'
import { ChatRoom, UserShort } from 'k-room.types'

const initialState: ChatRoomsState = {
  chatRooms: [],
  selectedChatRoomId: ''
}

export const useSelectedRoom = () => {
  return useTypedSelector((state) => {
    const { selectedChatRoomId, chatRooms } = state.persist.chatRooms
    return chatRooms.find((room: ChatRoom) => room.roomId === selectedChatRoomId)
  })
}

const chatRoomsSlice = createSlice({
  name: 'chatRooms',
  initialState,
  reducers: {
    loadChatRooms(state, action) {
      state.chatRooms = action.payload
    },
    setChatRoom(state, action) {
      state.selectedChatRoomId = action.payload
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
    removeSelectedChat(state) {
      state.selectedChatRoomId = ''
    },
    updateChatUsersStatus(state, action) {
      const { userId, status } = action.payload
      const hasUser = (users: Array<UserShort>): boolean => {
        return users.some((user) => user.id === userId)
      }
      state.chatRooms.forEach((room) => {
        if (hasUser(room.users)) room.hasOnline = status
      })
    }
  }
})

export const {
  setChatRoom,
  loadChatRooms,
  updateChatUsersStatus,
  removeSelectedChat,
  updateChatMessage,
  pushTemporaryMessage,
  updateMessageStatus
} = chatRoomsSlice.actions

export default chatRoomsSlice.reducer
