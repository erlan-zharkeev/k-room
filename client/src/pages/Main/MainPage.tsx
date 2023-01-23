import { useCallback, useEffect } from 'react'
import ChatRoom from 'src/components/ChatRoom/ChatRoom'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AsidePanel from 'src/components/AsidePanel/AsidePanel'
import TopPanel from 'src/components/TopPanel/TopPanel'
import Popup from 'src/components/Common/Popup/Popup'
import _debounce from 'lodash/debounce'
import { socket } from 'src/socket/socket'
import { Message, SocketActions, User, ChatRoom as ChatRoomInterface } from 'common-types'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import StubLoading from 'src/components/Common/StubLoading/StubLoading'
import $clg from 'src/services/clg'
import { setReconnectionAttempts, showNotification, socketConnect, socketDisconnect } from 'src/store/systemSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateContactsStatus, loadContacts, updateContactData } from 'src/store/contactsSlice'
import {
  updateChatUsersStatus,
  loadChatRooms,
  updateChatMessage,
  updateMessageStatus,
  changeChatName
} from 'src/store/roomsSlice'

export const MainPage = () => {
  const selectedChatRoom = useSelectedRoom()

  const userId = useTypedSelector((state) => state.auth.userData.id)
  const { viewPort, socketConnected } = useTypedSelector((state) => state.persist.system)
  const { isAuth } = useTypedSelector((state) => state.auth)

  const dispatch = useDispatch<AppDispatch>()

  const statusNotification = (isSuccess: Boolean) => {
    if (isSuccess) {
      $clg('success', 'Socket connected')
      dispatch(showNotification({ messageType: 'success', message: 'Socket connected' }))
      return
    }
    $clg('error', 'Socket disconnected')
    if (isAuth) dispatch(showNotification({ messageType: 'error', message: 'Socket disconnected' }))
  }

  const debouncedStatusNotification = useCallback(_debounce(statusNotification, 1000), [])

  useEffect(() => {
    socket.connect()
    socket.emit(SocketActions.INITIALIZE, userId)

    socket.io.on(SocketActions.RECONNECTION, (attempt) => {
      $clg('success', `Socket reconnected on attempt: ${attempt}`)
      socket.emit(SocketActions.INITIALIZE, userId)
    })
    socket.io.on(SocketActions.RECONNECT_ATTEMPT, (attempt) => {
      $clg('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectionAttempts())
    })
    socket.on(SocketActions.DISCONNECT, () => {
      dispatch(socketDisconnect())
      debouncedStatusNotification(false)
    })
    socket.on(SocketActions.CONNECTION, () => {
      dispatch(socketConnect())
      debouncedStatusNotification(true)
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
    socket.on(
      SocketActions.UPDATE_MESSAGE_STATUS,
      (roomData: { roomId: string; messageId: string; status: string }) => {
        dispatch(updateMessageStatus(roomData))
      }
    )
    socket.on(SocketActions.GET_CONTACTS, (contacts: Array<User>, message?: string) => {
      if (message) dispatch(showNotification({ messageType: 'info', message }))
      dispatch(loadContacts(contacts))
    })
    socket.on(SocketActions.CHANGE_CONTACTS_DATA, (updatedUserData: User) => {
      dispatch(updateContactData(updatedUserData))
      dispatch(changeChatName(updatedUserData))
    })
    return () => {
      socket.removeAllListeners()
    }
  }, [])

  return (
    <div className={'main-page page ' + (selectedChatRoom && viewPort.width <= 576 ? 'move-aside' : '')}>
      <StubLoading isLoading={!socketConnected} />
      <Popup />
      <TopPanel />
      <div className="main-page__content">
        <AsidePanel />
        <ChatRoom />
      </div>
    </div>
  )
}

export default MainPage
