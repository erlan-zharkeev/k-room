import { useEffect } from 'react'
import ChatRoom from 'src/components/ChatRoom/ChatRoom'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AsidePanel from 'src/components/AsidePanel/AsidePanel'
import TopBar from 'src/components/TopBar/TopBar'
import {
  NotificationMessage,
  NotificationType,
  SocketActions,
  SocketActionsPayload,
  AsideBarButtonName
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
  updateMessageReactions,
  deleteMessage
} from 'src/store/roomsSlice'
import useDebounce from 'src/hooks/useDebounce'
import CallStatusBar from 'src/components/CallStatusBar/CallStatusBar'
import AsideBar from 'src/components/AsideBar/AsideBar'
import InfoList from 'src/components/InfoList/InfoList'
import { updateCall, updateCalls } from 'src/store/callsSlice'
import { ViewPortWidthType } from 'src/store/@types/SystemState'
import { $socket, socketReconnect } from 'src/services/$socket'

const MainPage = () => {
  const selectedChatRoom = useSelectedRoom()

  const { viewPort } = useTypedSelector((state) => state.system)
  const { isAuth } = useTypedSelector((state) => state.user)
  const { asideTab } = useTypedSelector((state) => state.persist.settings)

  const isCallMinified = useTypedSelector((state) => state.calls.isMinified)

  const dispatch = useDispatch<AppDispatch>()

  const statusNotification = (isSuccess: Boolean) => {
    if (isSuccess) {
      $clg('success', 'Socket connected')
      dispatch(
        showNotification({ messageType: NotificationType.success, message: NotificationMessage.socketConnected })
      )
      return
    }
    $clg('error', 'Socket disconnected')
    if (!isAuth) return
    dispatch(showNotification({ messageType: NotificationType.error, message: NotificationMessage.socketDisconnected }))
  }

  const debouncedStatusNotification = useDebounce(statusNotification, 1000)

  const hideAside = () => selectedChatRoom && viewPort.width <= ViewPortWidthType.tablet

  const clickHandler = () => {
    dispatch(
      setContextMenu({
        event: null,
        type: ''
      })
    )
  }

  const mainBodyClassNames = () => `main-page__body ${isCallMinified ? 'main-page__body--call-minified' : ''}`

  useEffect(() => {
    if ($socket.disconnected) $socket.connect()
    // const initializePayload: SocketActionsPayload['initialize'] = { userId }

    $socket.emit(SocketActions.INITIALIZE)

    $socket.on(SocketActions.AUTH_ERROR, async () => {
      socketReconnect(dispatch)
    })

    $socket.on(SocketActions.RECONNECT, (attempt: number) => {
      $clg('success', `Socket reconnected on attempt: ${attempt}`)
      $socket.emit(SocketActions.INITIALIZE)
      dispatch(setReconnectingStatus(false))
    })
    $socket.on(SocketActions.RECONNECT_ATTEMPT, (attempt: number) => {
      $clg('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectingStatus(true))
    })

    $socket.on(SocketActions.RECONNECT_FAILED, () => {
      dispatch(setReconnectingStatus(false))
    })
    $socket.on(SocketActions.ERROR_MESSAGE, ({ message }: SocketActionsPayload['errorMessage']) => {
      dispatch(showNotification({ messageType: NotificationType.error, message }))
    })
    $socket.on(SocketActions.DISCONNECT, () => {
      debouncedStatusNotification(false)
    })
    $socket.on(SocketActions.CONNECTION, () => {
      debouncedStatusNotification(true)
    })
    $socket.on(SocketActions.GET_CONTACTS, ({ contacts, messageBody }: SocketActionsPayload['getContacts']) => {
      if (messageBody) dispatch(showNotification({ messageType: NotificationType.info, message: messageBody }))
      dispatch(loadContacts(contacts))
    })
    $socket.on(SocketActions.STATUS_CONTACT, (payload: SocketActionsPayload['statusContact']) => {
      dispatch(updateContactsStatus(payload))
      dispatch(updateChatUsersStatus(payload))
    })
    $socket.on(SocketActions.CHANGE_CONTACTS_DATA, (payload: SocketActionsPayload['changeContactsData']) => {
      dispatch(updateContactData(payload))
      dispatch(changeChatName(payload))
    })
    $socket.on(SocketActions.GET_ROOMS, (payload: SocketActionsPayload['getRooms']) => {
      dispatch(loadChatRooms(payload))
    })
    $socket.on(SocketActions.MESSAGE_DELIVERED, (payload: SocketActionsPayload['messageDelivered']) => {
      dispatch(updateChatMessage(payload))
    })
    $socket.on(SocketActions.UPDATE_MESSAGE_STATUS, (payload: SocketActionsPayload['updateMessageStatus']) => {
      dispatch(updateMessageStatus(payload))
    })
    $socket.on(SocketActions.MESSAGE_DELETED, (payload: SocketActionsPayload['messageDeleted']) => {
      dispatch(deleteMessage(payload))
    })
    $socket.on(SocketActions.UPDATE_MESSAGE_REACTIONS, (payload: SocketActionsPayload['updatedMessageReactions']) => {
      dispatch(updateMessageReactions(payload))
    })
    $socket.on(SocketActions.CALLS_UPDATED, (payload: SocketActionsPayload['callsUpdated']) => {
      dispatch(updateCalls(payload))
    })
    $socket.on(SocketActions.CALL_UPDATED, (payload: SocketActionsPayload['callUpdated']) => {
      dispatch(updateCall(payload))
    })
    return () => {
      $socket.removeAllListeners()
    }
  }, [])

  return (
    <div className={'main-page page' + (hideAside() ? ' move-aside' : '')} onClick={clickHandler}>
      {$socket.disconnected && <StubLoading />}
      <div className="main-page__wrapper">
        {viewPort.width >= ViewPortWidthType.tablet && <AsideBar />}
        <div className="main-page__content">
          <CallStatusBar />
          <TopBar />
          {asideTab === AsideBarButtonName.info ? (
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
