import { ICall, IChatRoom, InteractionType, IMessage, MessageStatusType, IReaction, IBasicStreamSettings, MediaFileValueType, IBaseFrontendUserData, FrontendContactMapType, IFrontendContact, AppLanguageType } from './index';
export interface IEventInterlocutorUpdateSignal {
    signal: unknown;
}
export interface IEventUpdateSignal {
    signal: unknown;
}
export interface IEventMarkCallAsVideo {
    callId: string;
}
export interface IEventMessageDelivered {
    roomId: string;
    message: IMessage;
}
export type EventGetRoomsType = IChatRoom[];
export interface IEventStatusContact {
    interlocutorId: string;
    online: boolean;
    onlineStatusUpdatedTimestamp: number;
    lastSeen?: number;
}
export type EventChangeContactsDataType = IBaseFrontendUserData;
export type EventGetContactsType = FrontendContactMapType;
export type EventCallUpdatedType = ICall;
export type EventCallsUpdatedType = ICall[];
export interface IEventSaveContact {
    interlocutorId: string;
}
export interface IEventDeleteContact {
    deletingUserId: string;
}
export interface IEventSearchContact {
    value: string;
    offset?: number;
}
export interface IEventGetSearchedContact {
    value: string;
    offset: number;
    contacts: IFrontendContact[];
    total: number;
    hasMore: boolean;
    nextOffset?: number;
}
export interface IEventCreateRoom {
    contactIds: string[];
    chatName?: string;
    avatarFile?: MediaFileValueType;
}
export interface IEventUpdateChatRoom {
    users: string[];
    roomId: string;
    chatName: string;
    avatar: string;
    avatarFile?: MediaFileValueType;
}
export interface IEventUserTyping {
    authorName: string;
    usersTo: string[];
    isTyping: boolean;
}
export interface IEventGetContactTypingStatus {
    contactId: string;
    isTyping: boolean;
}
export interface IEventSendMessage {
    roomId: string;
    message: IMessage;
}
export interface IEventUpdateMessageStatus {
    roomId: string;
    messageId: string;
    status: MessageStatusType;
}
export interface IEventChangeMessageStatus {
    roomId: string;
    messageId: string;
    status: MessageStatusType;
}
export interface IEventLoadRoomMessages {
    roomId: string;
    limit: number;
    beforeCreatedAt?: number;
}
export interface IEventRoomMessagesLoaded {
    roomId: string;
    messages: IMessage[];
    hasMore: boolean;
    nextBeforeCreatedAt?: number;
}
export interface IEventDeleteMessage {
    messageId: string;
    roomId: string;
}
export interface IEventAddReaction {
    glyphKey: string;
    messageId: string;
    roomId: string;
    username: string;
}
export interface IEventCallUser {
    callId?: string;
    userToCall?: string;
    signal: unknown;
    from: string;
    avatar: string;
    callerName: string;
}
export type EventChangeCallSettingsType = IBasicStreamSettings;
export interface IEventCallAccepted {
    signal: unknown;
}
export interface IEventAnswerCall {
    callId: string;
    to: string;
    signal: unknown;
    selfSocketId: string;
}
export type EventCallStartedAtType = number;
export interface IEventCallEnded {
    callId: string;
    callerId: string;
}
export interface IEventErrorMessage {
    messageType?: string;
    message: string;
}
export interface IEventMessageDeleted {
    messageId: string;
    roomId: string;
}
export interface IEventUpdatedMessageReactions {
    roomId: string;
    messageId: string;
    reaction: IReaction;
}
export interface IEventRoomCreated {
    roomId: string;
}
export interface IEventUpdateInteraction {
    contactId: string;
    interaction: InteractionType;
}
export type EventInviteReceivedType = IFrontendContact;
export interface IEventUpdateContactInteractionSuccess {
    contactId: string;
    interaction: InteractionType;
}
export interface IEventContactAddSuccess {
    contactData: IFrontendContact;
}
export interface IEventDeleteContactSuccess {
    deletedContactId: string;
    silent: boolean;
}
export interface IEventAuthError {
    event: string;
    payload: unknown;
}
export interface IEventUpdateLanguage {
    language: AppLanguageType;
}
export type SocketActionsType ='connection' | 'error' | 'reconnect' | 'auth-error' | 'initialize' | 'disconnect' | 'rooms-loaded' | 'create-chat-room' | 'new-room-added' | 'send-message' | 'message-delivered' | 'room-created' | 'search-contact' | 'get-searched-contact' | 'contact-status-updated' | 'contacts-loaded' | 'save-contact' | 'delete-contact' | 'client-typing' | 'get-contact-typing-status' | 'load-room-messages' | 'room-messages-loaded' | 'change-message-status' | 'message-status-updated' | 'contact-data-changed' | 'call-user' | 'answer-call' | 'call-accepted' | 'call-ended' | 'change-call-settings' | 'call-started-at' | 'update-user-settings' | 'update-chat-room' | 'room-data-updated' | 'add-reaction' | 'message-reaction-updated' | 'message-deleted' | 'error-message' | 'calls-data-loaded' | 'call-data-changed' | 'contact-removed' | 'mark-call-as-video' | 'update-call-signal' | 'interlocutor-update-signal' | 'actual-chat-rooms' | 'interlocutor-ping' | 'update-interaction-type' | 'update-contact-success' | 'invite-received' | 'contact-delete-success' | 'contact-add-success' | 'update-contact-interaction-type' | 'contact-interaction-updated' | 'actual-contacts' | 'actual-messages' | 'actualize-user-data' | 'update-language' | 'reconnect_attempt' | 'reconnect_failed';
