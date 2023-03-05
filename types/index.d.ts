export interface EnvVariables {
    SERVER_PORT: string;
    CLIENT_PORT: string;
    SERVER_URL: string;
    CLIENT_URL: string;
    MONGO_HOST: string;
    HOST: string;
    JWT_ACCESS_EXPIRES_INTERVAL: string;
    APP_NAME: string;
    MAIL_APP: string;
    MAIL_PASS: string;
    REGISTRATION_RESEND_INTERVAL_MINUTES: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    IS_DEV: boolean;
    SERVER_ASSETS_PATH: string;
    MAX_RECONNECT_ATTEMPTS: number;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGING_SENDER_ID: string;
    FIREBASE_APP_ID: string;
    FIREBASE_MEASUREMENT_ID: string;
}
export declare enum AuthEndPoints {
    REGISTRATION = "/auth/registration",
    SEND_EMAIL_CONFIRMATION_LINK = "/auth/send-email-confirmation-link",
    SEND_EMAIL_CONFIRMATION = "/auth/send-email-confirmation",
    LOGIN = "/auth/login",
    GOOGLE_LOGIN = "/auth/google-login",
    PROVIDER_LOGIN = "/auth/provider-login",
    LOGOUT = "/auth/logout",
    UPDATE_TOKENS_PAIR = "/auth/update-tokens-pair"
}
export declare enum UserEndPoints {
    GET_USER_DATA = "/auth/get-user-data",
    UPDATE_USER_DATA = "/auth/user-data/update",
    UPDATE_USER_SETTINGS = "/user/update-user-settings"
}
export declare enum CommonEndPoints {
    COMMON_IMAGES = "/common-images",
    GET_FILES = "/image/:filename"
}
export declare enum CodesEndPoints {
    SEND_EMAIL_CODE_PASSWORD_RECOVERY = "/codes/email/password-recovery"
}
export declare enum SocketActions {
    CONNECTION = "connection",
    RECONNECTION = "reconnect",
    RECONNECT_ATTEMPT = "reconnect_attempt",
    RECONNECT_FAILED = "reconnect_failed",
    INITIALIZE = "initialize",
    DISCONNECT = "disconnect",
    GET_ROOMS = "get-rooms",
    CREATE_ROOM = "create-room",
    SEND_MESSAGE = "send-message",
    MESSAGE_DELIVERED = "message-delivered",
    ROOM_CREATED = "room-created",
    SEARCH_CONTACT = "search-contact",
    GET_SEARCHED_CONTACTS = "get-searched-contact",
    STATUS_CONTACT = "status-contact",
    GET_CONTACTS = "get-contacts",
    SAVE_CONTACT = "save-contact",
    DELETE_CONTACT = "delete-contact",
    USER_TYPING = "user-typing",
    GET_USER_TYPING_STATUS = "get-user-typing-status",
    CHANGE_MESSAGE_STATUS = "change-message-status",
    UPDATE_MESSAGE_STATUS = "update-message-status",
    CHANGE_CONTACTS_DATA = "change-contacts-data",
    CALL_USER = "call-user",
    ANSWER_CALL = "answer-call",
    CALL_ACCEPTED = "call-accepted",
    CALL_ENDED = "call-ended",
    CHANGE_CALL_SETTINGS = "change-call-settings",
    CALL_STARTED_AT = "call-started-at"
}
export declare enum RouteNames {
    SIGN_IN = "/sign-in",
    SIGN_UP = "/sign-up",
    WAIT_EMAIL_CONFIRM = "/wait-email-confirm",
    EMAIL_CONFIRM = "/confirm-email",
    MAIN = "/app",
    NOT_FOUND = "/not-found",
    PASSWORD_RECOVERY = "/password-recovery"
}
export interface Message {
    id: string;
    authorName: string;
    author: string;
    body: string;
    createdAt?: string;
    isSelf?: boolean;
    status?: MessageStatus;
}
export type MessageStatus = "sending" | "undelivered" | "delivered" | "read";
export interface ChatRoom {
    _id?: string;
    roomId: string;
    authorId: string;
    chatName: string;
    avatar?: string;
    users: Array<UserShort>;
    messages: Array<Message>;
    multiple: boolean;
    hasOnline: boolean;
}
export type ChatRooms = Array<ChatRoom>;
export interface UserShort {
    id: string;
    username: string;
}
export interface UserCredential extends UserShort {
    email?: string;
    password?: string;
    avatar?: string;
    providerId?: string;
}
export interface User extends UserCredential {
    providerUserId?: string;
    online: boolean;
    chatRooms: ChatRooms;
    lastSeen?: string;
    contacts?: Array<User>;
}
export interface FirebaseUser {
    firebaseUid: string;
    username: string;
    email: string;
    avatar: string;
    providerId: string;
}
export type theme = "dark" | "light";
export interface UserSettings {
    asideTab: string;
    selectedChatRoomId: string;
    ableToShowNotification: boolean;
    theme: theme;
    showTooltips: boolean;
    soundOn: boolean;
}
export type CallStatus = "calling" | "in-progress" | "finished";
export type CallType = "incoming" | "outgoing" | "missed";
export interface StreamSettings {
    streamLoading: boolean;
    audio: boolean;
    video: boolean;
}
export interface Call {
    authorId: string;
    authorName: string;
    startedAt: number;
    finishedAt?: number;
    length?: number;
    interlocutorId: string;
    interlocutorName: string;
    interlocutorAvatar?: string;
    status: CallStatus;
    type: CallType;
    video: boolean;
    interlocutorSettings?: StreamSettings;
}
export interface Codes {
    passwordRecovery: {
        email: string;
        sms: string;
    };
}
export declare enum Status {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    NOT_AUTH = 401,
    TOKEN_EXPIRED = 403,
    NOT_FOUND = 404,
    UNREACHABLE = 503,
    BAD_GATEAWAY = 504
}
