import { useCallback, useEffect } from 'react'
import ChatRoom from 'src/components/ChatRoom/ChatRoom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import useTypedSelector from 'src/hooks/useTypedSelector'
import {
  loadChatRooms,
  updateChatMessage,
  updateChatUsersStatus,
  updateMessageStatus,
  useSelectedRoom
} from 'src/store/chatRoomsSlice'
import AsidePanel from 'src/components/AsidePanel/AsidePanel'

import TopPanel from 'src/components/TopPanel/TopPanel'
import Popup from 'src/components/Common/Popup/Popup'
// import StubLoading from '../../components/Common/StubLoading/StubLoading'
import _debounce from 'lodash/debounce'

import { updateContactsStatus, loadContacts } from 'src/store/contactsSlice'
import { showNotification, socketConnect, socketDisconnect } from 'src/store/systemSlice'
import { socket } from 'src/socket/socket'

import { SocketActions, Message, User, ChatRoom as ChatRoomInterface } from 'common-types'

export const MainPage = () => {
  const selectedChatRoom = useSelectedRoom()

  const userId = useTypedSelector((state) => state.auth.userData.id)
  const { viewPort, socketConnected } = useTypedSelector((state) => state.persist.system)
  const { isAuth } = useTypedSelector((state) => state.auth)

  const dispatch = useDispatch<AppDispatch>()

  const statusNotification = (isSuccess: Boolean) => {
    if (isSuccess) {
      console.log('%cSocket Connected ', 'background: #222; color: green')
      dispatch(showNotification({ messageType: 'success', message: 'Server socket connected!' }))
      return
    }
    console.log('%cSocket Disconnected ', 'background: #222; color: red')
    if (isAuth) dispatch(showNotification({ messageType: 'error', message: 'Server socket disconnected!' }))
  }

  const debouncedStatusNotification = useCallback(_debounce(statusNotification, 3000), [])

  useEffect(() => {
    socket.emit(SocketActions.INITIALIZE, userId)

    socket.on(SocketActions.CONNECTION, () => {
      dispatch(socketConnect())
      debouncedStatusNotification(true)
    })
    socket.on(SocketActions.DISCONNECT, () => {
      dispatch(socketDisconnect())
      debouncedStatusNotification(false)
      // if (socket.disconnected) {
      //   console.log('%c reconnection... ', 'background: #222; color: orange')
      //   // socket.connect()
      //   socket.connect()
      // }
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
      const convertedMessageToHtml = (
        <>
          <p>{roomData.message.authorName}</p>
          <p>{roomData.message.body}</p>
        </>
      )
      if (!roomData.message.isSelf)
        dispatch(showNotification({ message: convertedMessageToHtml, messageType: 'info', placement: 'bottomRight' }))
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
  }, [])

  return (
    <div className={'main-page page ' + (selectedChatRoom && viewPort.width <= 576 ? 'move-aside' : '')}>
      {/* <StubLoading isLoading={!socketConnected} reconnect={reconnect} /> */}
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
