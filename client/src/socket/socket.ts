import { SocketActions, Message, User, ChatRoom as ChatRoomInterface } from 'common-types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import ENV from 'src/ENV'
import useTypedSelector from 'src/hooks/useTypedSelector'
import $clg from 'src/services/clg'
import { AppDispatch } from 'src/store'
import { updateContactsStatus, loadContacts, updateContactData } from 'src/store/contactsSlice'
import {
  updateChatUsersStatus,
  loadChatRooms,
  updateChatMessage,
  updateMessageStatus,
  changeChatName
} from 'src/store/roomsSlice'
import { socketConnect, socketDisconnect, showNotification } from 'src/store/systemSlice'
import _debounce from 'lodash/debounce'

export const socket = io(`:${ENV.SERVER_PORT}/`, {
  forceNew: true,
  path: '/app/',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: Infinity
})

export const useSocketListener = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuth } = useTypedSelector((state) => state.auth)

  const statusNotification = (isSuccess: Boolean) => {
    if (isSuccess) {
      $clg('success', 'Socket connected')
      dispatch(showNotification({ messageType: 'success', message: 'Server socket connected!' }))
      return
    }
    $clg('error', 'Socket disconnected')
    if (isAuth) dispatch(showNotification({ messageType: 'error', message: 'Server socket disconnected!' }))
  }

  const debouncedStatusNotification = useCallback(_debounce(statusNotification, 3000), [])

  socket.on(SocketActions.CONNECTION, () => {
    dispatch(socketConnect())
    debouncedStatusNotification(true)
  })
  socket.on(SocketActions.DISCONNECT, () => {
    dispatch(socketDisconnect())
    debouncedStatusNotification(false)
  })
  socket.on(SocketActions.STATUS_CONTACT, (userData: { userId: string; status: boolean }) => {
    dispatch(updateContactsStatus(userData))
    dispatch(updateChatUsersStatus(userData))
  })
  socket.on(SocketActions.GET_ROOMS, (chatRooms: Array<ChatRoomInterface>) => {
    dispatch(loadChatRooms(chatRooms))
  })
  socket.on(SocketActions.MESSAGE_DELIVERED, (roomData: { roomId: string; message: Message }) => {
    dispatch(updateChatMessage(roomData))
  })
  socket.on(SocketActions.UPDATE_MESSAGE_STATUS, (roomData: { roomId: string; messageId: string; status: string }) => {
    dispatch(updateMessageStatus(roomData))
  })
  socket.on(SocketActions.GET_CONTACTS, (contacts: Array<User>, message?: string) => {
    if (message) dispatch(showNotification({ messageType: 'info', message }))
    dispatch(loadContacts(contacts))
  })
  socket.on(SocketActions.CHANGE_CONTACTS_DATA, (updatedUserData: User) => {
    dispatch(updateContactData(updatedUserData))
    dispatch(changeChatName(updatedUserData))
  })
}
