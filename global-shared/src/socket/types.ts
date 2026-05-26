import type { Call } from '../calls/types'
import type { ChatRoom } from '../chat/types'
import type { Contact, KnownUser, Interaction } from '../contact/types'
import type { AppLanguage } from '../language/types'
import type { MediaFileValue } from '../media/types'
import type { Message, MessageLoadDirection, MessageReaction, MessageStatus } from '../message/types'
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
  reactions: MessageReaction[]
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
  event: string
  payload: unknown
}

export interface EventUpdateLanguage {
  language: AppLanguage
}

export type SocketActions =
  | 'connection'
  | 'error'
  | 'reconnect'
  | 'auth-error'
  | 'initialize'
  | 'disconnect'
  | 'rooms-loaded'
  | 'create-chat-room'
  | 'new-room-added'
  | 'send-message'
  | 'message-delivered'
  | 'search-contact'
  | 'get-searched-contact'
  | 'contact-status-updated'
  | 'contacts-loaded'
  | 'save-contact'
  | 'delete-contact'
  | 'client-typing'
  | 'room-typing-status'
  | 'get-contact-typing-status'
  | 'load-room-messages'
  | 'update-pinned-message'
  | 'pinned-message-updated'
  | 'change-message-status'
  | 'mark-room-as-read'
  | 'message-status-updated'
  | 'messages-status-updated'
  | 'contact-data-changed'
  | 'known-users-updated'
  | 'call-user'
  | 'answer-call'
  | 'call-accepted'
  | 'call-ended'
  | 'change-call-settings'
  | 'call-started-at'
  | 'update-chat-room'
  | 'update-pinned-chat-room'
  | 'update-pinned-chat-room-order'
  | 'update-muted-chat-room'
  | 'room-data-updated'
  | 'media-files-deleted'
  | 'pinned-chat-rooms-updated'
  | 'muted-chat-rooms-updated'
  | 'delete-message'
  | 'add-reaction'
  | 'message-reaction-updated'
  | 'message-deleted'
  | 'error-message'
  | 'calls-data-loaded'
  | 'call-data-changed'
  | 'contact-removed'
  | 'mark-call-as-video'
  | 'actual-chat-rooms'
  | 'update-interaction-type'
  | 'update-contact-success'
  | 'invite-received'
  | 'contact-delete-success'
  | 'contact-add-success'
  | 'delete-chat-room'
  | 'chat-room-deleted'
  | 'leave-chat-room'
  | 'chat-room-left'
  | 'update-contact-interaction-type'
  | 'contact-interaction-updated'
  | 'actual-contacts'
  | 'actual-messages'
  | 'actualize-user-data'
  | 'update-language'
  | 'reconnect_attempt'
  | 'reconnect_failed'
