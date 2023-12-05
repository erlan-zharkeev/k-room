import { createSlice } from '@reduxjs/toolkit'
import { Message, RepliedMessage, SocketActionsPayload, UserShort } from 'common-types'
import { AttachedFilesMessage, RoomsState } from './@types/rooms-state'

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
  isLoading: true,
  chatRooms: [],
  repliedMessageData: initialRepliedMessageData,
  attachedFilesMessage: initialAttachedFilesMessage
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    updatedAttachedFilesMessage(state, { payload }: { payload: AttachedFilesMessage }) {
      state.attachedFilesMessage = { ...state.attachedFilesMessage, ...payload }
    },
    loadChatRooms(state, { payload }: { payload: SocketActionsPayload['getRooms'] }) {
      state.chatRooms = payload
    },
    repliedMessageSetAsForward(state) {
      state.repliedMessageData.forward = true
    },
    updateChatMessage(state, { payload }: { payload: SocketActionsPayload['messageDelivered'] }) {
      const { roomId, message } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage, idx) => {
        if (roomMessage.tempId === message.tempId) room.messages.splice(idx, 1)
      })
      room.messages.push(message)
      if (room?.messages.length > 1) room.blocked = false
    },
    updateMessageStatus(state, { payload }: { payload: SocketActionsPayload['updateMessageStatus'] }) {
      const { roomId, messageId, status } = payload
      const room = state.chatRooms.find((room) => room.id === roomId)
      if (!room) return
      room.messages.forEach((roomMessage) => {
        if (roomMessage.id === messageId) roomMessage.status = status
      })
    },
    updateMessageReactions(state, { payload }: { payload: SocketActionsPayload['updatedMessageReactions'] }) {
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
    updateChatUsersStatus(state, { payload }: { payload: SocketActionsPayload['statusContact'] }) {
      const { interlocutorId, status } = payload
      const hasUser = (users: Array<UserShort>): boolean => {
        return users.some((user) => user.id === interlocutorId)
      }
      state.chatRooms.forEach((room) => {
        if (hasUser(room.users ?? [])) room.hasOnline = status
      })
    },
    changeChatName(state, { payload }: { payload: SocketActionsPayload['changeContactsData'] }) {
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
    deleteMessage(state, { payload }: { payload: SocketActionsPayload['deleteMessage'] }) {
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
  updateChatUsersStatus,
  updateChatMessage,
  pushTemporaryMessage,
  updateMessageReactions,
  updateMessageStatus,
  changeChatName,
  setRepliedMessage,
  repliedMessageSetAsForward,
  resetRepliedMessage,
  updatedAttachedFilesMessage,
  deleteMessage
} = roomsSlice.actions
export default roomsSlice.reducer
