import {
  NotificationType,
  NotificationMessage,
  SocketActions,
  SocketActionsPayload,
  AsideBarButtonName
} from 'common-types'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ViewPortWidthType } from 'src/@types'
import { StubLoading, AsideBar, CallStatusBar, TopBar, InfoList, AsidePanel, ChatRoom } from 'src/components'
import { useSelectedRoom, useTypedSelector, useDebounce } from 'src/hooks'
import { $clg, $socket } from 'src/services'
import { socketReconnect } from 'src/services/$socket'
import {
  AppDispatch,
  changeChatName,
  deleteMessage,
  loadChatRooms,
  loadContacts,
  setContextMenu,
  setReconnectingStatus,
  showNotification,
  updateCall,
  updateCalls,
  updateChatMessage,
  updateChatUsersStatus,
  updateContactData,
  updateContactsStatus,
  updateMessageReactions,
  updateMessageStatus
} from 'src/store'

export const MainPage = () => {
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
      statusNotification(false)
    })
    $socket.on(SocketActions.CONNECTION, () => {
      statusNotification(true)
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
