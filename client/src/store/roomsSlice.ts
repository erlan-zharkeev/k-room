import { createSlice } from '@reduxjs/toolkit'
import { ChatRoom, UserShort } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { RoomsState } from './@types/RoomsState'

const initialState: RoomsState = {
  chatRooms: []
}

export const useSelectedRoom = () => {
  return useTypedSelector((state) => {
    const { chatRooms } = state.chatRooms
    const { selectedChatRoomId } = state.persist.system
    return chatRooms.find((room: ChatRoom) => room.roomId === selectedChatRoomId)
  })
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
    }
  }
})

export const { loadChatRooms, updateChatUsersStatus, updateChatMessage, pushTemporaryMessage, updateMessageStatus } =
  roomsSlice.actions

export default roomsSlice.reducer
