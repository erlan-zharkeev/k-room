import { ICall, IChatRoom, ContactType, InteractionType, IMessage, MessageStatusType, IReaction, IUserSettings, IBasicStreamSettings, UserShortType } from ".";
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
}
export type IEventChangeContactsData = UserShortType;
export interface IEventGetContacts {
    contacts: ContactType[];
}
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
}
export interface IEventUpdateUserSettings {
    type: keyof IUserSettings;
    value: string | boolean;
}
export interface IEventCreateRoom {
    contactId: string;
}
export interface IEventUpdateChatRoom {
    users: string[];
    roomId: string;
    chatName: string;
    avatarPath: string;
    avatarFile: {
        buffer: ArrayBuffer;
    } | undefined;
}
export interface IEventUserTyping {
    authorName: string;
    usersTo: UserShortType[];
    status: boolean;
}
export interface IEventGetUserTypingStatus {
    authorData: {
        authorName: string;
        authorId: string;
    };
    status: boolean;
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
    avatarPath: string;
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
export interface IEventInviteReceived {
    contactData: ContactType;
}
export interface IEventUpdateContactInteractionSuccess {
    contactId: string;
    interaction: InteractionType;
}
export interface IEventContactAddSuccess {
    contactData: ContactType;
}
export interface IEventDeleteContactSuccess {
    deletedContactId: string;
    silent: boolean;
}
export type SocketActionsType = "connection" | "error" | "reconnect" | "auth-error" | "initialize" | "disconnect" | "get-rooms" | "create-personal-room" | "new-room-added" | "send-message" | "message-delivered" | "room-created" | "search-contact" | "get-searched-contact" | "status-contact" | "get-contacts" | "save-contact" | "delete-contact" | "user-typing" | "get-user-typing-status" | "change-message-status" | "update-message-status" | "change-contacts-data" | "call-user" | "answer-call" | "call-accepted" | "call-ended" | "change-call-settings" | "call-started-at" | "update-user-settings" | "update-chat-room" | "room-data-updated" | "add-reaction" | "update-message-reactions" | "delete-message" | "message-deleted" | "error-message" | "calls-updated" | "call-updated" | "mark-call-as-video" | "update-call-signal" | "interlocutor-update-signal" | "interlocutor-ping" | "update-interaction-type" | "update-contact-success" | "invite-received" | "contact-delete-success" | "contact-add-success" | "update-contact-interaction-type" | "contact-interaction-type-updated" | "reconnect_attempt" | "reconnect_failed";
