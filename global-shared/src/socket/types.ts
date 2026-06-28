import type {
  CreateRoomAckPayload,
  EventChatRoomDeleted,
  EventChatRoomLeft,
  EventCreateRoom,
  EventDeleteChatRoom,
  EventGetRoom,
  EventGetRooms,
  EventLeaveChatRoom,
  EventMarkRoomAsRead,
  EventMutedChatRoomsUpdated,
  EventPinnedChatRoomsUpdated,
  EventRoomTypingStatus,
  EventUpdateChatRoom,
  EventUpdateMutedChatRoom,
  EventUpdatePinnedChatRoom,
  EventUpdatePinnedChatRoomOrder,
  EventUserTyping
} from '../chat/types'
import type {
  Contact,
  EventContactAddSuccess,
  EventDeleteContact,
  EventDeleteContactSuccess,
  EventGetContacts,
  EventGetContactTypingStatus,
  EventGetSearchedContact,
  EventKnownUsersUpdated,
  EventSaveContact,
  EventSearchContact,
  EventStatusContact,
  EventUpdateContactInteractionSuccess,
  EventUpdateInteraction
} from '../contact/types'
import type { EventUpdateLanguage } from '../language/types'
import type { EventMediaFilesDeleted } from '../media/types'
import type {
  EventAddReaction,
  EventChangeMessageStatus,
  EventDeleteMessage,
  EventEditMessage,
  EventLoadRoomMessages,
  EventMessageDeleted,
  EventMessageDelivered,
  EventMessageEdited,
  EventMessageLinkPreviewUpdated,
  EventMessagesStatusUpdated,
  EventPinnedMessageUpdated,
  EventRoomMessagesLoaded,
  EventSendMessage,
  EventUpdatedMessageReactions,
  EventUpdateMessageStatus,
  EventUpdatePinnedMessage
} from '../message/types'
import type {
  EventDeclineRoomCall,
  EventJoinRoomCall,
  EventLeaveRoomCall,
  EventLoadRoomCalls,
  EventRoomCallDeclined,
  EventRoomCallEnded,
  EventRoomCallHandRaisedUpdated,
  EventRoomCallJoined,
  EventRoomCallLeft,
  EventRoomCallMediaStateUpdated,
  EventRoomCallQuickCommandReceived,
  EventRoomCallSignalReceived,
  EventRoomCallStarted,
  EventRoomCallsLoaded,
  EventRoomCallsUpdated,
  EventSendRoomCallQuickCommand,
  EventSendRoomCallSignal,
  EventSetRoomCallHandRaised,
  EventStartRoomCall,
  EventUpdateRoomCallMediaState,
  JoinRoomCallAckPayload,
  StartRoomCallAckPayload
} from '../room-calls/types'
import type { BackendMessage, TransportMeta } from '../shared/types'
import type { ReqStatus } from '../status/types'
import type { UserPreview } from '../user/types'

export type SocketAckSuccess<TPayload = void> = [TPayload] extends [void]
  ? { ok: true; meta?: TransportMeta }
  : { ok: true; payload: TPayload; meta?: TransportMeta }

export interface SocketAckFailure<TReason extends string = string> {
  ok: false
  reason?: TReason
  message?: BackendMessage
  handledByGlobalError?: boolean
  meta?: TransportMeta
}

export type SocketAckResponse<TPayload = void, TReason extends string = string> =
  | SocketAckSuccess<TPayload>
  | SocketAckFailure<TReason>

export interface EventErrorMessage {
  messageType?: string
  message: string
  silent?: boolean
  status?: ReqStatus
}
export interface EventAuthError {
  event: ClientToServerSocketAction | 'connection'
  payload: unknown
}

export type SocketAckCallback<TPayload = void, TReason extends string = string> = (
  response: SocketAckResponse<TPayload, TReason>
) => void

export type SocketEventPayloadHandler<TPayload> = [TPayload] extends [void]
  ? (meta?: TransportMeta) => void
  : (payload: TPayload, meta?: TransportMeta) => void

export type SocketAckEventPayloadHandler<TPayload, TAckPayload> = [TPayload] extends [void]
  ? (ack?: SocketAckCallback<TAckPayload>) => void
  : (payload: TPayload, ack?: SocketAckCallback<TAckPayload>) => void

export type SocketEventMap<
  TPayloadMap extends object,
  TAckPayloadMap extends Partial<Record<keyof TPayloadMap, unknown>>
> = {
  [TEvent in keyof TPayloadMap]: TEvent extends keyof TAckPayloadMap
    ? SocketAckEventPayloadHandler<TPayloadMap[TEvent], TAckPayloadMap[TEvent]>
    : SocketEventPayloadHandler<TPayloadMap[TEvent]>
}

export interface ClientToServerSocketPayloadMap {
  initialize: void
  'actualize-user-data': void
  'update-language': EventUpdateLanguage
  'search-contact': EventSearchContact
  'save-contact': EventSaveContact
  'delete-contact': EventDeleteContact
  'update-contact-interaction-type': EventUpdateInteraction
  'create-chat-room': EventCreateRoom
  'update-chat-room': EventUpdateChatRoom
  'delete-chat-room': EventDeleteChatRoom
  'leave-chat-room': EventLeaveChatRoom
  'update-pinned-chat-room': EventUpdatePinnedChatRoom
  'update-pinned-chat-room-order': EventUpdatePinnedChatRoomOrder
  'update-muted-chat-room': EventUpdateMutedChatRoom
  'client-typing': EventUserTyping
  'send-message': EventSendMessage
  'edit-message': EventEditMessage
  'load-room-messages': EventLoadRoomMessages
  'update-pinned-message': EventUpdatePinnedMessage
  'change-message-status': EventChangeMessageStatus
  'mark-room-as-read': EventMarkRoomAsRead
  'delete-message': EventDeleteMessage
  'add-reaction': EventAddReaction
  'load-room-calls': EventLoadRoomCalls
  'start-room-call': EventStartRoomCall
  'join-room-call': EventJoinRoomCall
  'decline-room-call': EventDeclineRoomCall
  'leave-room-call': EventLeaveRoomCall
  'update-room-call-media-state': EventUpdateRoomCallMediaState
  'send-room-call-signal': EventSendRoomCallSignal
  'send-room-call-quick-command': EventSendRoomCallQuickCommand
  'set-room-call-hand-raised': EventSetRoomCallHandRaised
}

export interface ClientToServerSocketAckPayloadMap {
  'save-contact': void
  'delete-contact': void
  'update-contact-interaction-type': void
  'create-chat-room': CreateRoomAckPayload
  'update-chat-room': void
  'delete-chat-room': void
  'leave-chat-room': void
  'update-pinned-chat-room': void
  'update-pinned-chat-room-order': void
  'update-muted-chat-room': void
  'edit-message': void
  'load-room-messages': EventRoomMessagesLoaded
  'update-pinned-message': void
  'mark-room-as-read': void
  'delete-message': void
  'add-reaction': void
  'load-room-calls': EventRoomCallsLoaded
  'start-room-call': StartRoomCallAckPayload
  'join-room-call': JoinRoomCallAckPayload
  'decline-room-call': void
  'leave-room-call': void
  'update-room-call-media-state': void
  'send-room-call-quick-command': void
  'set-room-call-hand-raised': void
}

export interface ServerToClientSocketPayloadMap {
  'auth-error': EventAuthError
  'error-message': EventErrorMessage
  'actual-contacts': EventGetContacts
  'known-users-updated': EventKnownUsersUpdated
  'contact-delete-success': EventDeleteContactSuccess
  'contact-add-success': EventContactAddSuccess
  'contact-status-updated': EventStatusContact
  'contact-data-changed': UserPreview
  'contact-interaction-updated': EventUpdateContactInteractionSuccess
  'invite-received': Contact
  'get-contact-typing-status': EventGetContactTypingStatus
  'get-searched-contact': EventGetSearchedContact
  'actual-chat-rooms': EventGetRooms
  'new-room-added': EventGetRoom
  'room-data-updated': EventGetRoom
  'muted-chat-rooms-updated': EventMutedChatRoomsUpdated
  'pinned-chat-rooms-updated': EventPinnedChatRoomsUpdated
  'chat-room-deleted': EventChatRoomDeleted
  'chat-room-left': EventChatRoomLeft
  'room-typing-status': EventRoomTypingStatus
  'media-files-deleted': EventMediaFilesDeleted
  'message-deleted': EventMessageDeleted
  'message-delivered': EventMessageDelivered
  'message-edited': EventMessageEdited
  'message-link-preview-updated': EventMessageLinkPreviewUpdated
  'message-reaction-updated': EventUpdatedMessageReactions
  'pinned-message-updated': EventPinnedMessageUpdated
  'message-status-updated': EventUpdateMessageStatus
  'messages-status-updated': EventMessagesStatusUpdated
  'room-calls-updated': EventRoomCallsUpdated
  'room-call-started': EventRoomCallStarted
  'room-call-joined': EventRoomCallJoined
  'room-call-declined': EventRoomCallDeclined
  'room-call-left': EventRoomCallLeft
  'room-call-ended': EventRoomCallEnded
  'room-call-media-state-updated': EventRoomCallMediaStateUpdated
  'room-call-signal-received': EventRoomCallSignalReceived
  'room-call-quick-command-received': EventRoomCallQuickCommandReceived
  'room-call-hand-raised-updated': EventRoomCallHandRaisedUpdated
}

export type ClientToServerSocketEvents = SocketEventMap<
  ClientToServerSocketPayloadMap,
  ClientToServerSocketAckPayloadMap
>
export type ServerToClientSocketEvents = {
  [TEvent in keyof ServerToClientSocketPayloadMap]: SocketEventPayloadHandler<ServerToClientSocketPayloadMap[TEvent]>
}
export type ClientToServerSocketAction = keyof ClientToServerSocketPayloadMap
export type ClientToServerSocketAckAction = keyof ClientToServerSocketAckPayloadMap
export type ServerToClientSocketAction = keyof ServerToClientSocketPayloadMap
export type SocketAppActions = ClientToServerSocketAction | ServerToClientSocketAction
export type SocketSystemActions =
  | 'connection'
  | 'error'
  | 'reconnect'
  | 'disconnect'
  | 'reconnect_attempt'
  | 'reconnect_failed'

export type SocketActions = SocketAppActions | SocketSystemActions
