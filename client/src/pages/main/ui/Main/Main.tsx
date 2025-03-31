import './style.scss'
import {
  EventCallsUpdatedType,
  EventCallUpdatedType,
  IEventChangeContactsData,
  IEventGetContacts,
  EventGetRoomsType,
  IEventInviteReceived,
  IEventMessageDeleted,
  IEventMessageDelivered,
  IEventStatusContact,
  IEventUpdateContactInteractionSuccess,
  IEventUpdatedMessageReactions,
  IEventUpdateMessageStatus,
  SocketActionsType
} from 'common-types'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { socket, useSocket } from 'src/shared/api'
import { updateCalls, updateCall, CallModal } from 'src/entities/call'
import {
  loadContacts,
  updateContactsStatus,
  updateContactData,
  acceptInvite,
  updateContactInteractionType
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
import { setContextMenu, useViewport } from 'src/entities/system'
import { useNotification } from 'src/entities/notification'
import { useTypedSelector } from 'src/shared/lib'
import { AsideBar } from 'src/widgets/aside-bar'
import { AsidePanel } from 'src/widgets/aside-panel'
import { CallStatusBar } from 'src/widgets/call-status-bar'
import { ChatRoom } from 'src/widgets/chat-room'
import { InfoList } from 'src/widgets/info'
import { TopBar } from 'src/widgets/top-bar'
import { Modal } from 'antd'
import { ContextMenuWrapper } from 'src/entities/context-menu'
import { useContactOnlineMonitor } from 'src/features/monitor-contacts-online'
import { AppLoader } from 'src/widgets/app-loader'
import { useSettings } from 'src/entities/settings'
import { useContactUpdatesMonitor } from 'src/features/contact/monitor-contact-updates'
import { useGetNotificationPermission } from 'src/features/get-bom-permission'

export const Main = () => {
  const { selectedChatRoom } = useChatRooms()
  const { monitorContactsOnline } = useContactOnlineMonitor()
  const { initSocketConnection } = useSocket()
  const { selectedContentElement } = useSettings()
  const { monitorContactUpdates } = useContactUpdatesMonitor()
  const { getNotificationPermission } = useGetNotificationPermission()
  const isCallMinified = useTypedSelector((state) => state.calls.isMinified)

  const notifications = useNotification()
  const dispatch = useDispatch<AppDispatch>()

  const { lessOrEqualTablet, greaterOrEqualTablet, viewPort } = useViewport()

  const clickHandler = () => {
    dispatch(
      setContextMenu({
        event: null,
        type: ''
      })
    )
  }

  getNotificationPermission()
  monitorContactsOnline()
  initSocketConnection()
  monitorContactUpdates()

  useEffect(() => {
    socket.on<SocketActionsType>('get-contacts', ({ contacts }: IEventGetContacts) => {
      dispatch(loadContacts(contacts))
    })
    socket.on<SocketActionsType>('status-contact', (payload: IEventStatusContact) => {
      dispatch(updateContactsStatus(payload))
    })
    socket.on<SocketActionsType>('change-contacts-data', (payload: IEventChangeContactsData) => {
      dispatch(updateContactData(payload))
      dispatch(changeChatName(payload))
    })
    socket.on<SocketActionsType>('get-rooms', (payload: EventGetRoomsType) => {
      dispatch(loadChatRooms(payload))
    })
    socket.on<SocketActionsType>('message-delivered', (payload: IEventMessageDelivered) => {
      dispatch(updateChatMessage({ ...payload, notifications }))
    })
    socket.on<SocketActionsType>('update-message-status', (payload: IEventUpdateMessageStatus) => {
      dispatch(updateMessageStatus(payload))
    })
    socket.on<SocketActionsType>('message-deleted', (payload: IEventMessageDeleted) => {
      dispatch(deleteMessage(payload))
    })
    socket.on<SocketActionsType>('update-message-reactions', (payload: IEventUpdatedMessageReactions) => {
      dispatch(updateMessageReactions(payload))
    })
    socket.on<SocketActionsType>('call-updated', (payload: EventCallsUpdatedType) => {
      dispatch(updateCalls(payload))
    })
    socket.on<SocketActionsType>('call-updated', (payload: EventCallUpdatedType) => {
      dispatch(updateCall(payload))
    })
    socket.on<SocketActionsType>('invite-received', (payload: IEventInviteReceived) => {
      dispatch(acceptInvite(payload))
    })

    socket.on<SocketActionsType>(
      'contact-interaction-type-updated',
      ({ contactId, interaction }: IEventUpdateContactInteractionSuccess) => {
        dispatch(updateContactInteractionType({ contactId, interaction }))
      }
    )
  }, [])

  const rootClassName = useMemo(
    () => (selectedChatRoom && lessOrEqualTablet ? 'main move-aside' : 'main'),
    [selectedChatRoom, lessOrEqualTablet]
  )

  const contentPartClassName = useMemo(() => {
    return isCallMinified ? 'main__body main__body--call-minified' : 'main__body'
  }, [isCallMinified])

  return (
    <>
      <div className={rootClassName} onClick={clickHandler}>
        <div className="main__wrapper">
          {greaterOrEqualTablet && <AsideBar />}
          <div className="main__content">
            <CallStatusBar />
            <TopBar />
            {selectedContentElement === 'info' ? (
              <div className={contentPartClassName}>{selectedContentElement === 'info' && <InfoList />}</div>
            ) : (
              <div className={contentPartClassName}>
                <AsidePanel />
                <ChatRoom />
              </div>
            )}
            {viewPort.width <= 768 && <AsideBar />}
          </div>
        </div>
      </div>
      <AppLoader />
      <Modal />
      <CallModal />
      <ContextMenuWrapper />
    </>
  )
}
