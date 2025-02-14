import {
  EventCallsUpdated,
  EventCallUpdated,
  EventChangeContactsData,
  EventContactAddSuccess,
  EventDeleteContactSuccess,
  EventErrorMessage,
  EventGetContacts,
  EventGetRooms,
  EventInviteReceived,
  EventMessageDeleted,
  EventMessageDelivered,
  EventStatusContact,
  EventUpdateContactInteractionTypeSuccess,
  EventUpdatedMessageReactions,
  EventUpdateMessageStatus,
  SocketActions
} from 'common-types'
import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  StubLoading,
  AsideBar,
  CallStatusBar,
  TopBar,
  InfoList,
  AsidePanel,
  ChatRoom,
  AdminPanelContent
} from 'src/components'
import { ClientNotificationMessage, ViewPortWidthType } from 'src/@enums'
import { useNotification, useSelectedRoom, useTypedSelector } from 'src/hooks'
import { AdditionalServiceContext } from 'src/providers'
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
  updateCall,
  updateCalls,
  updateChatMessage,
  updateChatUsersStatus,
  updateContactsStatusLocal,
  updateContactData,
  updateContactsStatus,
  updateMessageReactions,
  updateMessageStatus,
  addContact,
  updateContactInteractionType,
  deleteContact,
  acceptInvite
} from 'src/store'

export const MainPage = () => {
  const selectedChatRoom = useSelectedRoom()
  const { call } = useContext(AdditionalServiceContext)
  const { viewPort } = useTypedSelector((state) => state.system)
  const { isAuth } = useTypedSelector((state) => state.user)
  const { asideTab } = useTypedSelector((state) => state.persist.settings)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const isCallMinified = useTypedSelector((state) => state.calls.isMinified)
  const notifications = useNotification()
  const pingTimer = useRef<number | NodeJS.Timeout>()
  const [pingTimerCounter, updateTimerCounter] = useState<number>(0)

  useTypedSelector((state) => state.calls.currentCall)
  const dispatch = useDispatch<AppDispatch>()

  const socketDisconnectedNotification = notifications.getNotification({
    messageType: 'error',
    message: ClientNotificationMessage.SocketDisconnected
  })
  const contactAddedSuccessNotification = notifications.getNotification({
    messageType: 'info',
    message: ClientNotificationMessage.ContactAdded
  })
  const contactDeletedSuccessNotification = notifications.getNotification({
    messageType: 'info',
    message: ClientNotificationMessage.ContactDeleted
  })

  const statusNotification = (isSuccess: Boolean) => {
    if (isSuccess) {
      $clg('success', 'Socket connected')
      return
    }
    $clg('error', 'Socket disconnected')
    if (!isAuth) return
    if (call.current) {
      call.current.closeConnection(true)
    }
    socketDisconnectedNotification.open()
  }

  const hideAside = () => selectedChatRoom && viewPort.width <= ViewPortWidthType.Tablet

  const clickHandler = () => {
    dispatch(
      setContextMenu({
        event: null,
        type: ''
      })
    )
  }

  const getNotificationPermission = () => {
    if (!('Notification' in window)) {
      console.log('Your browser doesn`t support Notification API')
    }
    window.Notification.requestPermission()
  }

  const mainBodyClassNames = () => `main-page__body ${isCallMinified ? 'main-page__body--call-minified' : ''}`

  const checkForContactOnline = () => {
    $socket.emit<SocketActions>('interlocutor-ping')
    const maxDiffSeconds = 30
    const currentTimestamp = Date.now()
    contacts.forEach((contact) => {
      const outOfInterval = Math.abs(currentTimestamp - contact.onlineStatusUpdatedTimestamp) / 1000 > maxDiffSeconds
      if (outOfInterval) {
        updateContactsStatusLocal({ contactId: contact.id, online: false })
      }
    })
  }

  useEffect(() => {
    checkForContactOnline()
  }, [pingTimerCounter])

  useEffect(() => {
    getNotificationPermission()

    pingTimer.current = setInterval(() => {
      updateTimerCounter((prev) => {
        const newValue = prev + 1
        return newValue
      })
    }, 5000)

    if ($socket.disconnected) {
      socketReconnect(dispatch)
    }

    $socket.emit<SocketActions>('initialize')

    $socket.on<SocketActions>('auth-error', () => {
      socketReconnect(dispatch)
    })
    $socket.on<SocketActions>('reconnect', (attempt: number) => {
      $clg('success', `Socket reconnected on attempt: ${attempt}`)
      $socket.emit<SocketActions>('initialize')
      dispatch(setReconnectingStatus(false))
    })
    $socket.on<SocketActions>('reconnect_attempt', (attempt: number) => {
      $clg('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectingStatus(true))
    })
    $socket.on<SocketActions>('reconnect_failed', () => {
      dispatch(setReconnectingStatus(false))
    })
    $socket.on<SocketActions>('error-message', ({ message }: EventErrorMessage) => {
      const errorMessageNotification = notifications.getNotification({ messageType: 'error', message })
      errorMessageNotification.open()
    })
    $socket.on<SocketActions>('disconnect', () => {
      statusNotification(false)
    })
    $socket.on<SocketActions>('connection', () => {
      statusNotification(true)
    })
    $socket.on<SocketActions>('get-contacts', ({ contacts }: EventGetContacts) => {
      dispatch(loadContacts(contacts))
    })
    $socket.on<SocketActions>('status-contact', (payload: EventStatusContact) => {
      dispatch(updateContactsStatus(payload))
      dispatch(updateChatUsersStatus(payload))
    })
    $socket.on<SocketActions>('change-contacts-data', (payload: EventChangeContactsData) => {
      dispatch(updateContactData(payload))
      dispatch(changeChatName(payload))
    })
    $socket.on<SocketActions>('get-rooms', (payload: EventGetRooms) => {
      dispatch(loadChatRooms(payload))
    })
    $socket.on<SocketActions>('message-delivered', (payload: EventMessageDelivered) => {
      dispatch(updateChatMessage({ ...payload, notifications }))
    })
    $socket.on<SocketActions>('update-message-status', (payload: EventUpdateMessageStatus) => {
      dispatch(updateMessageStatus(payload))
    })
    $socket.on<SocketActions>('message-deleted', (payload: EventMessageDeleted) => {
      dispatch(deleteMessage(payload))
    })
    $socket.on<SocketActions>('update-message-reactions', (payload: EventUpdatedMessageReactions) => {
      dispatch(updateMessageReactions(payload))
    })
    $socket.on<SocketActions>('call-updated', (payload: EventCallsUpdated) => {
      dispatch(updateCalls(payload))
    })
    $socket.on<SocketActions>('call-updated', (payload: EventCallUpdated) => {
      dispatch(updateCall(payload))
    })
    $socket.on<SocketActions>('invite-received', (payload: EventInviteReceived) => {
      dispatch(acceptInvite(payload))
    })
    $socket.on<SocketActions>('contact-add-success', (payload: EventContactAddSuccess) => {
      dispatch(addContact(payload))
      contactAddedSuccessNotification.open()
    })
    $socket.on<SocketActions>(
      'contact-interaction-type-updated',
      ({ contactId, interactionType }: EventUpdateContactInteractionTypeSuccess) => {
        dispatch(updateContactInteractionType({ contactId, interactionType }))
      }
    )
    $socket.on<SocketActions>('contact-delete-success', ({ deletedContactId, silent }: EventDeleteContactSuccess) => {
      dispatch(deleteContact({ contactId: deletedContactId }))
      if (!silent) contactDeletedSuccessNotification.open()
    })
    return () => {
      $socket.removeAllListeners()
      if (pingTimer.current) clearInterval(pingTimer.current)
    }
  }, [])

  return (
    <div className={'main-page page' + (hideAside() ? ' move-aside' : '')} onClick={clickHandler}>
      {$socket.disconnected && <StubLoading />}
      <div className="main-page__wrapper">
        {viewPort.width >= ViewPortWidthType.Tablet && <AsideBar />}
        <div className="main-page__content">
          <CallStatusBar />
          <TopBar />
          {asideTab === 'info' || asideTab === 'admin-panel' ? (
            <div className={mainBodyClassNames()}>
              {asideTab === 'info' && <InfoList />}
              {asideTab === 'admin-panel' && <AdminPanelContent />}
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
