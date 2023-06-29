import { useEffect } from 'react'
import ChatRoom from 'src/components/ChatRoom/ChatRoom'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AsidePanel from 'src/components/AsidePanel/AsidePanel'
import TopBar from 'src/components/TopBar/TopBar'
import Popup from 'src/components/Common/Popup/Popup'
import { socket } from 'src/socket/socket'
import {
  Message,
  SocketActions,
  User,
  ChatRoom as ChatRoomInterface,
  Reaction,
  SocketActionsPayload
} from 'common-types'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import StubLoading from 'src/components/Common/StubLoading/StubLoading'
import $clg from 'src/services/$clg'
import { setContextMenu, setReconnectingStatus, showNotification } from 'src/store/systemSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateContactsStatus, loadContacts, updateContactData } from 'src/store/contactsSlice'
import {
  updateChatUsersStatus,
  loadChatRooms,
  updateChatMessage,
  updateMessageStatus,
  changeChatName,
  updateMessageReactions
} from 'src/store/roomsSlice'
import useDebounce from 'src/hooks/useDebounce'
import CallModal from 'src/components/Common/CallModal/CallModal'
import CallStatusBar from 'src/components/CallStatusBar/CallStatusBar'
import AsideBar from 'src/components/AsideBar/AsideBar'
import InfoList from 'src/components/InfoList/InfoList'

const MainPage = () => {
  const selectedChatRoom = useSelectedRoom()

  const userId = useTypedSelector((state) => state.user.userData.id)
  const { viewPort } = useTypedSelector((state) => state.system)
  const { isAuth } = useTypedSelector((state) => state.user)
  const { asideTab } = useTypedSelector((state) => state.persist.settings)

  const isCallMinified = useTypedSelector((state) => state.calls.isMinified)

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

  const debouncedStatusNotification = useDebounce(statusNotification, 1000)

  const hideAside = () => selectedChatRoom && viewPort.width <= 769

  const clickHandler = () => {
    dispatch(setContextMenu({ event: null, type: '' }))
  }

  const mainBodyClassNames = () => `main-page__body ${isCallMinified ? 'main-page__body--call-minified' : ''}`

  useEffect(() => {
    if (socket.disconnected) socket.connect()

    const initializePayload: SocketActionsPayload['initialize'] = { userId }
    socket.emit(SocketActions['initialize'], initializePayload)

    socket.on(SocketActions['reconnect'], (attempt) => {
      $clg('success', `Socket reconnected on attempt: ${attempt}`)
      socket.emit(SocketActions['initialize'], userId)
      dispatch(setReconnectingStatus(false))
    })
    socket.on(SocketActions['reconnect-attempt'], (attempt) => {
      $clg('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectingStatus(true))
    })
    socket.on(SocketActions['reconnect-failed'], () => {
      dispatch(setReconnectingStatus(false))
    })
    socket.on(SocketActions['error-message'], ({ message }: SocketActionsPayload['error-message']) => {
      dispatch(showNotification({ messageType: 'error', message }))
    })

    socket.on(SocketActions['disconnect'], () => {
      debouncedStatusNotification(false)
    })
    socket.on(SocketActions['connection'], () => {
      debouncedStatusNotification(true)
    })

    socket.on(SocketActions['get-contacts'], (contacts: Array<User>, message?: string) => {
      if (message) dispatch(showNotification({ messageType: 'info', message }))
      dispatch(loadContacts(contacts))
    })
    socket.on(SocketActions['status-contact'], (userData: { userId: string; status: boolean }) => {
      dispatch(updateContactsStatus(userData))
      dispatch(updateChatUsersStatus(userData))
    })
    socket.on(SocketActions['change-contacts-data'], (updatedUserData: User) => {
      dispatch(updateContactData(updatedUserData))
      dispatch(changeChatName(updatedUserData))
    })

    socket.on(SocketActions['get-rooms'], (chatRooms: Array<ChatRoomInterface>) => {
      dispatch(loadChatRooms(chatRooms))
    })

    socket.on(SocketActions['message-delivered'], (roomData: { roomId: string; message: Message }) => {
      dispatch(updateChatMessage(roomData))
    })
    socket.on(
      SocketActions['update-message-status'],
      (roomData: { roomId: string; messageId: string; status: string }) => {
        dispatch(updateMessageStatus(roomData))
      }
    )
    socket.on(
      SocketActions['update-message-reactions'],
      (data: { roomId: string; messageId: string; reaction: Reaction }) => {
        dispatch(updateMessageReactions(data))
      }
    )

    return () => {
      socket.removeAllListeners()
    }
  }, [])

  return (
    <div className={'main-page page' + (hideAside() ? ' move-aside' : '')} onClick={clickHandler}>
      {socket.disconnected && <StubLoading />}
      <Popup />
      <CallModal />
      <div className="main-page__wrapper">
        {viewPort.width >= 769 && <AsideBar />}
        <div className="main-page__content">
          <CallStatusBar />
          <TopBar />
          {asideTab === 'info' ? (
            <div className={mainBodyClassNames()}>
              <InfoList />
            </div>
          ) : (
            <div className={mainBodyClassNames()}>
              <AsidePanel />
              <ChatRoom />
            </div>
          )}
          {viewPort.width <= 768 && <AsideBar />}
        </div>
      </div>
    </div>
  )
}

export default MainPage
