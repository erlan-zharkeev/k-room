import type {
  EventAnswerCall,
  EventCallAccepted,
  EventCallEnded,
  EventCallsUpdated,
  EventCallStartedAt,
  EventCallUpdated,
  EventCallUser,
  EventChangeCallSettings,
  EventMarkCallAsVideo
} from '../calls/types'
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
  EventChangeContactsData,
  EventContactAddSuccess,
  EventDeleteContact,
  EventDeleteContactSuccess,
  EventGetContacts,
  EventGetContactTypingStatus,
  EventGetSearchedContact,
  EventInviteReceived,
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
import type { ReqStatus } from '../status/types'

export interface SocketAckSuccess<TPayload = void> {
  ok: true
  payload?: TPayload
}

export interface SocketAckFailure<TReason extends string = string> {
  ok: false
  reason?: TReason
  handledByGlobalError?: boolean
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

export type SocketEventPayloadHandler<TPayload> = [TPayload] extends [void] ? () => void : (payload: TPayload) => void

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
  'call-user': EventCallUser
  'answer-call': EventAnswerCall
  'call-ended': EventCallEnded
  'change-call-settings': EventChangeCallSettings
  'mark-call-as-video': EventMarkCallAsVideo
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
}

export interface ServerToClientSocketPayloadMap {
  'auth-error': EventAuthError
  'error-message': EventErrorMessage
  'actual-contacts': EventGetContacts
  'known-users-updated': EventKnownUsersUpdated
  'contact-delete-success': EventDeleteContactSuccess
  'contact-add-success': EventContactAddSuccess
  'contact-status-updated': EventStatusContact
  'contact-data-changed': EventChangeContactsData
  'contact-interaction-updated': EventUpdateContactInteractionSuccess
  'invite-received': EventInviteReceived
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
  'calls-data-loaded': EventCallsUpdated
  'call-data-changed': EventCallUpdated
  'call-user': EventCallUser
  'call-accepted': EventCallAccepted
  'call-started-at': EventCallStartedAt
  'call-ended': void
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
