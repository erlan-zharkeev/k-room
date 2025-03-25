import './style.scss'
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
import { AppDispatch } from 'src/app/store'
import { AdditionalServiceContext } from 'src/shared/providers'
import { clg } from 'src/shared/utils'
import { socket, socketReconnect } from 'src/shared/api'
import { StubLoading } from 'src/pages/main'
import { updateCalls, updateCall } from 'src/entities/call'
import {
  updateContactsStatusLocal,
  loadContacts,
  updateContactsStatus,
  updateContactData,
  acceptInvite,
  addContact,
  updateContactInteractionType,
  deleteContact
} from 'src/entities/contact'
import {
  changeChatName,
  loadChatRooms,
  updateChatMessage,
  updateMessageStatus,
  deleteMessage,
  updateMessageReactions,
  useChatRooms
} from 'src/entities/chat-room'
import { setContextMenu, setReconnectingStatus, useViewport } from 'src/entities/system'
import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { useTypedSelector } from 'src/shared/lib'
import { AdminPanelContent } from 'src/widgets/admin-panel-content'
import { AsideBar } from 'src/widgets/aside-bar'
import { AsidePanel } from 'src/widgets/aside-panel'
import { CallStatusBar } from 'src/widgets/call-status-bar'
import { ChatRoom } from 'src/widgets/chat-room'
import { InfoList } from 'src/widgets/info'
import { TopBar } from 'src/widgets/top-bar'

export const Main = () => {
  const { selectedChatRoom } = useChatRooms()

  const { call } = useContext(AdditionalServiceContext)
  const { viewPort } = useTypedSelector((state) => state.system)
  const { isAuth } = useTypedSelector((state) => state.user)
  const { selectedContentElement } = useTypedSelector((state) => state.persist.settings)
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
      clg('success', 'Socket connected')
      return
    }
    clg('error', 'Socket disconnected')
    if (!isAuth) return
    if (call.current) {
      call.current.closeConnection(true)
    }
    socketDisconnectedNotification.open()
  }

  const { lessOrEqualTablet, greaterOrEqualTablet } = useViewport()
  const hideAside = () => selectedChatRoom && lessOrEqualTablet

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
      console.log('Browser doesn`t support Notification Api')
    }
    window.Notification.requestPermission()
  }

  const mainBodyClassNames = () => `main__body ${isCallMinified ? 'main__body--call-minified' : ''}`

  const checkForContactOnline = () => {
    socket.emit<SocketActions>('interlocutor-ping')
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

    if (socket.disconnected) {
      socketReconnect(dispatch)
    }

    socket.emit<SocketActions>('initialize')

    socket.on<SocketActions>('auth-error', () => {
      socketReconnect(dispatch)
    })
    socket.on<SocketActions>('reconnect', (attempt: number) => {
      clg('success', `Socket reconnected on attempt: ${attempt}`)
      socket.emit<SocketActions>('initialize')
      dispatch(setReconnectingStatus(false))
    })
    socket.on<SocketActions>('reconnect_attempt', (attempt: number) => {
      clg('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectingStatus(true))
    })
    socket.on<SocketActions>('reconnect_failed', () => {
      dispatch(setReconnectingStatus(false))
    })
    socket.on<SocketActions>('error-message', ({ message }: EventErrorMessage) => {
      const errorMessageNotification = notifications.getNotification({ messageType: 'error', message })
      errorMessageNotification.open()
    })
    socket.on<SocketActions>('disconnect', () => {
      statusNotification(false)
    })
    socket.on<SocketActions>('connection', () => {
      statusNotification(true)
    })
    socket.on<SocketActions>('get-contacts', ({ contacts }: EventGetContacts) => {
      dispatch(loadContacts(contacts))
    })
    socket.on<SocketActions>('status-contact', (payload: EventStatusContact) => {
      dispatch(updateContactsStatus(payload))
    })
    socket.on<SocketActions>('change-contacts-data', (payload: EventChangeContactsData) => {
      dispatch(updateContactData(payload))
      dispatch(changeChatName(payload))
    })
    socket.on<SocketActions>('get-rooms', (payload: EventGetRooms) => {
      dispatch(loadChatRooms(payload))
    })
    socket.on<SocketActions>('message-delivered', (payload: EventMessageDelivered) => {
      dispatch(updateChatMessage({ ...payload, notifications }))
    })
    socket.on<SocketActions>('update-message-status', (payload: EventUpdateMessageStatus) => {
      dispatch(updateMessageStatus(payload))
    })
    socket.on<SocketActions>('message-deleted', (payload: EventMessageDeleted) => {
      dispatch(deleteMessage(payload))
    })
    socket.on<SocketActions>('update-message-reactions', (payload: EventUpdatedMessageReactions) => {
      dispatch(updateMessageReactions(payload))
    })
    socket.on<SocketActions>('call-updated', (payload: EventCallsUpdated) => {
      dispatch(updateCalls(payload))
    })
    socket.on<SocketActions>('call-updated', (payload: EventCallUpdated) => {
      dispatch(updateCall(payload))
    })
    socket.on<SocketActions>('invite-received', (payload: EventInviteReceived) => {
      dispatch(acceptInvite(payload))
    })
    socket.on<SocketActions>('contact-add-success', (payload: EventContactAddSuccess) => {
      dispatch(addContact(payload))
      contactAddedSuccessNotification.open()
    })
    socket.on<SocketActions>(
      'contact-interaction-type-updated',
      ({ contactId, interactionType }: EventUpdateContactInteractionTypeSuccess) => {
        dispatch(updateContactInteractionType({ contactId, interactionType }))
      }
    )
    socket.on<SocketActions>('contact-delete-success', ({ deletedContactId, silent }: EventDeleteContactSuccess) => {
      dispatch(deleteContact({ contactId: deletedContactId }))
      if (!silent) contactDeletedSuccessNotification.open()
    })
    return () => {
      socket.removeAllListeners()
      if (pingTimer.current) clearInterval(pingTimer.current)
    }
  }, [])

  return (
    <div className={'main' + (hideAside() ? ' move-aside' : '')} onClick={clickHandler}>
      {socket.disconnected && <StubLoading />}
      <div className="main__wrapper">
        {greaterOrEqualTablet && <AsideBar />}
        <div className="main__content">
          <CallStatusBar />
          <TopBar />
          {selectedContentElement === 'info' || selectedContentElement === 'admin-panel' ? (
            <div className={mainBodyClassNames()}>
              {selectedContentElement === 'info' && <InfoList />}
              {selectedContentElement === 'admin-panel' && <AdminPanelContent />}
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
