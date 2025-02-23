import { Call, ChatRoom, Contact, InteractionType, Message, MessageStatus, Reaction, UserSettings, BasicStreamSettings, UserShort } from ".";
export interface EventInterlocutorUpdateSignal {
    signal: unknown;
}
export interface EventUpdateSignal {
    signal: unknown;
}
export interface EventMarkCallAsVideo {
    callId: string;
}
export interface EventMessageDelivered {
    roomId: string;
    message: Message;
}
export type EventGetRooms = ChatRoom[];
export interface EventStatusContact {
    interlocutorId: string;
    online: boolean;
    onlineStatusUpdatedTimestamp: number;
}
export type EventChangeContactsData = UserShort;
export interface EventGetContacts {
    contacts: Contact[];
}
export type EventCallUpdated = Call;
export type EventCallsUpdated = Call[];
export interface EventSaveContact {
    interlocutorId: string;
}
export interface EventDeleteContact {
    deletingUserId: string;
}
export interface EventSearchContact {
    value: string;
}
export interface EventUpdateUserSettings {
    type: keyof UserSettings;
    value: string | boolean;
}
export interface EventCreateRoom {
    contactId: string;
}
export interface EventUpdateChatRoom {
    users: string[];
    roomId: string;
    chatName: string;
    avatarPath: string;
    avatarFile: {
        buffer: ArrayBuffer;
    } | undefined;
}
export interface EventUserTyping {
    authorName: string;
    usersTo: UserShort[];
    status: boolean;
}
export interface EventGetUserTypingStatus {
    authorData: {
        authorName: string;
        authorId: string;
    };
    status: boolean;
}
export interface EventSendMessage {
    roomId: string;
    message: Message;
}
export interface EventUpdateMessageStatus {
    roomId: string;
    messageId: string;
    status: MessageStatus;
}
export interface EventChangeMessageStatus {
    roomId: string;
    messageId: string;
    status: MessageStatus;
}
export interface EventDeleteMessage {
    messageId: string;
    roomId: string;
}
export interface EventAddReaction {
    glyphKey: string;
    messageId: string;
    roomId: string;
    username: string;
}
export interface EventCallUser {
    callId?: string;
    userToCall?: string;
    signal: unknown;
    from: string;
    avatarPath: string;
    callerName: string;
}
export type EventChangeCallSettings = BasicStreamSettings;
export interface EventCallAccepted {
    signal: unknown;
}
export interface EventAnswerCall {
    callId: string;
    to: string;
    signal: unknown;
    selfSocketId: string;
}
export type EventCallStartedAt = number;
export interface EventCallEnded {
    callId: string;
    callerId: string;
}
export interface EventErrorMessage {
    messageType?: string;
    message: string;
}
export interface EventMessageDeleted {
    messageId: string;
    roomId: string;
}
export interface EventUpdatedMessageReactions {
    roomId: string;
    messageId: string;
    reaction: Reaction;
}
export interface EventRoomCreated {
    roomId: string;
}
export interface EventUpdateInteractionType {
    contactId: string;
    interactionType: InteractionType;
}
export interface EventInviteReceived {
    contactData: Contact;
}
export interface EventUpdateContactInteractionTypeSuccess {
    contactId: string;
    interactionType: InteractionType;
}
export interface EventContactAddSuccess {
    contactData: Contact;
}
export interface EventDeleteContactSuccess {
    deletedContactId: string;
    silent: boolean;
}
export type SocketActions = "connection" | "error" | "reconnect" | "auth-error" | "initialize" | "disconnect" | "get-rooms" | "create-personal-room" | "new-room-added" | "send-message" | "message-delivered" | "room-created" | "search-contact" | "get-searched-contact" | "status-contact" | "get-contacts" | "save-contact" | "delete-contact" | "user-typing" | "get-user-typing-status" | "change-message-status" | "update-message-status" | "change-contacts-data" | "call-user" | "answer-call" | "call-accepted" | "call-ended" | "change-call-settings" | "call-started-at" | "update-user-settings" | "update-chat-room" | "room-data-updated" | "add-reaction" | "update-message-reactions" | "delete-message" | "message-deleted" | "error-message" | "calls-updated" | "call-updated" | "mark-call-as-video" | "update-call-signal" | "interlocutor-update-signal" | "interlocutor-ping" | "update-interaction-type" | "update-contact-success" | "invite-received" | "contact-delete-success" | "contact-add-success" | "update-contact-interaction-type" | "contact-interaction-type-updated" | "reconnect_attempt" | "reconnect_failed";
