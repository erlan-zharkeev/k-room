import type { Call } from '../calls/types'
import type { ChatRoom } from '../chat/types'
import type { Contact, KnownUser, Interaction } from '../contact/types'
import type { AppLanguage } from '../language/types'
import type { AudioObject, DocumentObject, ImageObject, MediaFileValue, VideoObject } from '../media/types'
import type {
  Message,
  MessageLinkPreview,
  MessageLoadDirection,
  MessageReaction,
  MessageReactionUpdateAction,
  MessageStatus
} from '../message/types'
import type { BasicStreamSettings } from '../shared/types'
import type { ReqStatus } from '../status/types'
import type { UserPreview } from '../user/types'

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

export interface EventMarkCallAsVideo {
  callId: string
}

export interface EventMessageDelivered {
  roomId: string
  message: Message
}

export interface EventGetRoom extends ChatRoom {
  previewMessage?: Message | null
  pinnedMessage?: Message | null
}

export type EventGetRooms = EventGetRoom[]

export interface EventStatusContact {
  interlocutorId: string
  online: boolean
  onlineStatusUpdatedTimestamp: number
  lastSeen?: number
}

export type EventChangeContactsData = UserPreview

export interface EventGetContacts {
  contacts: Contact[]
  knownUsers: KnownUser[]
}

export type EventKnownUsersUpdated = KnownUser[]
export type EventCallUpdated = Call
export type EventCallsUpdated = Call[]

export interface EventSaveContact {
  interlocutorId: string
}
export interface EventDeleteContact {
  deletingUserId: string
}
export interface EventSearchContact {
  value: string
  offset?: number
}
export interface EventGetSearchedContact {
  value: string
  offset: number
  contacts: Contact[]
  total: number
  hasMore: boolean
  nextOffset?: number
}

export interface EventCreateRoom {
  memberIds: string[]
  chatName?: string
  avatarFile?: MediaFileValue
}

export interface EventUpdateChatRoom {
  roomId: string
  memberIds: string[]
  chatName: string
  avatarFile?: MediaFileValue | null
}

export interface EventDeleteChatRoom {
  roomId: string
}

export interface EventChatRoomDeleted {
  roomId: string
}

export interface EventLeaveChatRoom {
  roomId: string
  nextAdminId?: string
}

export interface EventChatRoomLeft {
  roomId: string
}

export interface EventUpdatePinnedChatRoom {
  roomId: string
  isPinned: boolean
}
export interface EventUpdatePinnedChatRoomOrder {
  pinnedChatRoomIds: string[]
}

export interface EventPinnedChatRoomsUpdated {
  roomId?: string
  isPinned?: boolean
  pinnedChatRoomIds: string[]
}

export interface EventUpdateMutedChatRoom {
  roomId: string
  isMuted: boolean
}

export interface EventMutedChatRoomsUpdated {
  roomId?: string
  isMuted?: boolean
  mutedChatRoomIds: string[]
}

export interface EventMediaFilesDeleted {
  mediaIds: string[]
}

export interface EventUserTyping {
  roomId: string
  isTyping: boolean
}
export interface EventRoomTypingStatus {
  roomId: string
  contactId: string
  isTyping: boolean
}
export interface EventGetContactTypingStatus {
  contactId: string
  isTyping: boolean
}
export interface EventSendMessage {
  roomId: string
  message: Message
}
export interface EventEditMessage {
  roomId: string
  messageId: string
  body: string
  images: ImageObject[]
  documents?: DocumentObject[]
  audios?: AudioObject[]
  videos?: VideoObject[]
}
export interface EventMessageEdited {
  roomId: string
  messageId: string
  body: string
  images: ImageObject[]
  documents?: DocumentObject[]
  audios?: AudioObject[]
  videos?: VideoObject[]
  linkPreview: MessageLinkPreview | null
  editedAt: number
}
export interface EventMessageLinkPreviewUpdated {
  roomId: string
  messageId: string
  linkPreview: MessageLinkPreview
}
export interface EventUpdateMessageStatus {
  roomId: string
  messageId: string
  status: MessageStatus
  userId: string
}
export interface EventMessagesStatusUpdated {
  roomId: string
  messageIds: string[]
  status: MessageStatus
  userId: string
  updatedMessagesQuantity: number
}
export interface EventChangeMessageStatus {
  roomId: string
  messageId: string
  status: MessageStatus
}
export interface EventMarkRoomAsRead {
  roomId: string
}
export interface EventLoadRoomMessages {
  roomId: string
  limit: number
  direction: MessageLoadDirection
  anchorMessageId?: string
}
export interface EventRoomMessagesLoaded {
  roomId: string
  messages: Message[]
  rangeStartMessageId: string | null
  rangeEndMessageId: string | null
}
export interface EventUpdatePinnedMessage {
  roomId: string
  messageId: string
  isPinned: boolean
}
export interface EventPinnedMessageUpdated {
  roomId: string
  pinnedMessageId: string | null
  pinnedMessage?: Message | null
}
export interface EventDeleteMessage {
  deleteForEveryone: boolean
  messageId: string
  roomId: string
}
export interface EventAddReaction {
  glyphKey: string
  messageId: string
  roomId: string
}
export interface EventCallUser {
  callId?: string
  userToCall?: string
  signal: unknown
  from: string
  avatar: string
  callerNickname: string
}
export type EventChangeCallSettings = BasicStreamSettings
export interface EventCallAccepted {
  signal: unknown
}

export interface EventAnswerCall {
  callId: string
  to: string
  signal: unknown
  selfSocketId: string
}
export type EventCallStartedAt = number
export interface EventCallEnded {
  callId: string
  callerId: string
}
export interface EventErrorMessage {
  messageType?: string
  message: string
  silent?: boolean
  status?: ReqStatus
}
export interface EventMessageDeleted {
  messageId: string
  roomId: string
}
export interface EventUpdatedMessageReactions {
  roomId: string
  messageId: string
  action: MessageReactionUpdateAction
  reaction: MessageReaction
}
export interface CreateRoomAckPayload {
  roomId: string
}
export interface EventUpdateInteraction {
  contactId: string
  interaction: Interaction
}

export type EventInviteReceived = Contact

export interface EventUpdateContactInteractionSuccess {
  contactId: string
  interaction: Interaction
}
export interface EventContactAddSuccess {
  contactData: Contact
}
export interface EventDeleteContactSuccess {
  deletedContactId: string
  silent: boolean
}

export interface EventAuthError {
  event: ClientToServerSocketAction | 'connection'
  payload: unknown
}

export interface EventUpdateLanguage {
  language: AppLanguage
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
