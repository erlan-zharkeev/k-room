import type { CallType } from '../calls/types'
import type { ChatKindType, ChatRoomType } from '../chat/types'
import type { ContactType, KnownUserType, InteractionType } from '../contact/types'
import type { AppLanguageType } from '../language/types'
import type { MediaFileValueType } from '../media/types'
import type { MessageType, MessageReactionType, MessageStatusType } from '../message/types'
import type { BasicStreamSettingsType } from '../shared/types'
import type { UserPreviewType } from '../user/types'

import { CONTACT_INTERACTION_UPDATE_FAILED_REASONS } from './constants'

export type ContactInteractionUpdateFailedReasonType =
  (typeof CONTACT_INTERACTION_UPDATE_FAILED_REASONS)[keyof typeof CONTACT_INTERACTION_UPDATE_FAILED_REASONS]

export interface ISocketAckSuccess<TPayload = void> {
  ok: true
  payload?: TPayload
}

export interface ISocketAckFailure<TReason extends string = string> {
  ok: false
  reason?: TReason
  handledByGlobalError?: boolean
}

export type SocketAckResponseType<TPayload = void, TReason extends string = string> =
  | ISocketAckSuccess<TPayload>
  | ISocketAckFailure<TReason>

export interface IEventMarkCallAsVideo {
  callId: string
}

export interface IEventMessageDelivered {
  roomId: string
  message: MessageType
}

export interface IEventGetRoom extends ChatRoomType {
  previewMessage?: MessageType | null
}

export type EventGetRoomsType = IEventGetRoom[]

export interface IEventStatusContact {
  interlocutorId: string
  online: boolean
  onlineStatusUpdatedTimestamp: number
  lastSeen?: number
}

export type EventChangeContactsDataType = UserPreviewType

export interface IEventGetContacts {
  contacts: ContactType[]
  knownUsers: KnownUserType[]
}

export type EventGetContactsType = IEventGetContacts
export type EventKnownUsersUpdatedType = KnownUserType[]
export type EventCallUpdatedType = CallType
export type EventCallsUpdatedType = CallType[]

export interface IEventSaveContact {
  interlocutorId: string
}
export interface IEventDeleteContact {
  deletingUserId: string
}
export interface IEventSearchContact {
  value: string
  offset?: number
}
export interface IEventGetSearchedContact {
  value: string
  offset: number
  contacts: ContactType[]
  total: number
  hasMore: boolean
  nextOffset?: number
}

export interface IEventCreateRoom {
  contactIds: string[]
  chatName?: string
  avatarFile?: MediaFileValueType
}

export interface IEventUpdateChatRoom {
  users: string[]
  roomId: string
  chatName: string
  chatKind: ChatKindType
  avatar: string
  avatarFile?: MediaFileValueType // TODO change to IEventCreateRoom
}

export interface IEventDeleteChatRoom {
  roomId: string
}

export interface IEventChatRoomDeleted {
  roomId: string
}

export interface IEventLeaveChatRoom {
  roomId: string
  nextAdminId?: string
}

export interface IEventChatRoomLeft {
  roomId: string
}

export interface IEventUpdatePinnedChatRoom {
  roomId: string
  isPinned: boolean
}
export interface IEventUpdatePinnedChatRoomOrder {
  pinnedChatRoomIds: string[]
}

export interface IEventPinnedChatRoomsUpdated {
  roomId?: string
  isPinned?: boolean
  pinnedChatRoomIds: string[]
}

export interface IEventUserTyping {
  authorNickname: string
  usersTo: string[]
  isTyping: boolean
}
export interface IEventGetContactTypingStatus {
  contactId: string
  isTyping: boolean
}
export interface IEventSendMessage {
  roomId: string
  message: MessageType
}
export interface IEventUpdateMessageStatus {
  roomId: string
  messageId: string
  status: MessageStatusType
  userId: string
}
export interface IEventMessagesStatusUpdated {
  roomId: string
  messageIds: string[]
  status: MessageStatusType
  userId: string
  updatedMessagesQuantity: number
}
export interface IEventChangeMessageStatus {
  roomId: string
  messageId: string
  status: MessageStatusType
}
export interface IEventMarkRoomAsRead {
  roomId: string
}
export interface IEventLoadRoomMessages {
  roomId: string
  limit: number
  beforeCreatedAt?: number
}
export interface IEventRoomMessagesLoaded {
  roomId: string
  messages: MessageType[]
  hasMore: boolean
  nextBeforeCreatedAt?: number
}
export interface IEventDeleteMessage {
  messageId: string
  roomId: string
}
export interface IEventAddReaction {
  glyphKey: string
  messageId: string
  roomId: string
  nickname: string
}
export interface IEventCallUser {
  callId?: string
  userToCall?: string
  signal: unknown
  from: string
  avatar: string
  callerNickname: string
}
export type EventChangeCallSettingsType = BasicStreamSettingsType
export interface IEventCallAccepted {
  signal: unknown
}

export interface IEventAnswerCall {
  callId: string
  to: string
  signal: unknown
  selfSocketId: string
}
export type EventCallStartedAtType = number
export interface IEventCallEnded {
  callId: string
  callerId: string
}
export interface IEventErrorMessage {
  messageType?: string
  message: string
}
export interface IEventMessageDeleted {
  messageId: string
  roomId: string
}
export interface IEventUpdatedMessageReactions {
  roomId: string
  messageId: string
  reaction: MessageReactionType
}
export interface ICreateRoomAckPayload {
  roomId: string
}
export interface IEventUpdateInteraction {
  contactId: string
  interaction: InteractionType
}

export type EventInviteReceivedType = ContactType

export interface IEventUpdateContactInteractionSuccess {
  contactId: string
  interaction: InteractionType
}
export interface IEventContactAddSuccess {
  contactData: ContactType
}
export interface IEventDeleteContactSuccess {
  deletedContactId: string
  silent: boolean
}

export interface IEventAuthError {
  event: string
  payload: unknown
}

export interface IEventUpdateLanguage {
  language: AppLanguageType
}

export type SocketActionsType =
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
  | 'get-contact-typing-status'
  | 'load-room-messages'
  | 'room-messages-loaded'
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
  | 'room-data-updated'
  | 'pinned-chat-rooms-updated'
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
