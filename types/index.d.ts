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
    NEXT_CODE_REQUEST_INTERVAL_SECONDS: number;
    PASSWORD_RECOVERY_LINK_LIFE: number;
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
    RESET_PASSWORD = "/user/reset-password"
}
export declare enum CommonEndPoints {
    COMMON_IMAGES = "/common-images",
    GET_INFO = "/notification"
}
export declare enum CodesEndPoints {
    SEND_EMAIL_CODE_PASSWORD_RECOVERY = "/codes/email/password-recovery",
    VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY = "/codes/email/validate-email-code-password-recovery"
}
export declare enum RouteNames {
    SIGN_IN = "/sign-in",
    SIGN_UP = "/sign-up",
    WAIT_EMAIL_CONFIRM = "/wait-email-confirm",
    EMAIL_CONFIRM = "/confirm-email",
    MAIN = "/app",
    NOT_FOUND = "/not-found",
    PASSWORD_RECOVERY = "/password-recovery",
    CREATE_NEW_PASSWORD = "/create-new-password",
    NOTIFICATION = "/notification",
    SOCKET_PATH = "/app-socket/",
    API = "/api/"
}
export declare enum SocketActions {
    "connection" = "connection",
    "reconnect" = "reconnect",
    "reconnect-attempt" = "reconnect_attempt",
    "reconnect-failed" = "reconnect_failed",
    "initialize" = "initialize",
    "disconnect" = "disconnect",
    "get-rooms" = "get-rooms",
    "create-room" = "create-room",
    "send-message" = "send-message",
    "message-delivered" = "message-delivered",
    "room-created" = "room-created",
    "search-contact" = "search-contact",
    "get-searched-contact" = "get-searched-contact",
    "status-contact" = "status-contact",
    "get-contacts" = "get-contacts",
    "save-contact" = "save-contact",
    "delete-contact" = "delete-contact",
    "user-typing" = "user-typing",
    "get-user-typing-status" = "get-user-typing-status",
    "change-message-status" = "change-message-status",
    "update-message-status" = "update-message-status",
    "change-contacts-data" = "change-contacts-data",
    "call-user" = "call-user",
    "answer-call" = "answer-call",
    "call-accepted" = "call-accepted",
    "call-ended" = "call-ended",
    "change-call-settings" = "change-call-settings",
    "call-started-at" = "call-started-at",
    "update-user-settings" = "update-user-settings",
    "update-chat-room" = "update-chat-room",
    "room-data-updated" = "room-data-updated",
    "add-reaction" = "add-reaction",
    "update-message-reactions" = "update-message-reactions",
    "delete-message" = "delete-message",
    "error-message" = "error-message"
}
export declare enum Status {
    "success" = 200,
    "bad-request" = 400,
    "not-auth" = 401,
    "token-expired" = 403,
    "not-found" = 404,
    "unreachable" = 503,
    "bad-gateaway" = 504
}
export interface SocketActionsPayload {
    ["initialize"]: {
        userId: string;
    };
    "save-contact": {
        userId: string;
        interlocutorId: string;
    };
    "delete-contact": {
        currentUserId: string;
        deletingUserId: string;
    };
    "search-contact": {
        value: string;
    };
    "update-user-settings": {
        userId: string;
        type: keyof UserSettings;
        value: string | boolean;
    };
    "create-room": {
        users: Array<string>;
        authorId: string;
        multiple: boolean;
        avatarFile?: {
            buffer: ArrayBuffer;
        };
        chatName?: string;
    };
    "update-chat-room": {
        users: Array<string>;
        roomId: string;
        chatName: string;
        avatarPath: string;
        avatarFile: {
            buffer: ArrayBuffer;
        } | undefined;
        authorId: string;
    };
    "user-typing": {
        authorId: string;
        authorName: string;
        usersTo: Array<UserShort>;
        status: boolean;
    };
    "get-user-typing-status": {
        authorData: {
            authorName: string;
            authorId: string;
        };
        status: boolean;
    };
    "send-message": {
        roomId: string;
        message: Message;
    };
    "change-message-status": {
        roomId: string;
        messageId: string;
        status: MessageStatus;
        userId: string;
    };
    "delete-message": {
        messageId: string;
        roomId: string;
    };
    "add-reaction": {
        glyphKey: string;
        messageId: string;
        roomId: string;
        authorId: string;
        username: string;
    };
    "call-user": {
        userToCall?: string;
        signal: any;
        from: string;
        avatarPath: string;
        callerName: string;
        settings: StreamSettings;
    };
    "change-call-settings": BasicStreamSettings;
    "call-accepted": {
        signal: any;
        settings: StreamSettings;
    };
    "answer-call": {
        to: string;
        signal: any;
        settings: StreamSettings;
        selfSocketId: string;
    };
    "call-started-at": number;
    "call-ended": {
        callerId: string;
    };
    "error-message": {
        message: string;
    };
}
export interface Reaction {
    username: string;
    authorId: string;
    glyphKey: string;
}
export interface Message {
    id: string;
    tempId?: string;
    authorName: string;
    authorId: string;
    body: string;
    createdAt?: string;
    isSelf?: boolean;
    status?: MessageStatus;
    reactions?: Array<Reaction>;
    images?: Array<any>;
    imageCompression?: boolean;
}
export declare enum MessageStatus {
    sending = "sending",
    undelivered = "undelivered",
    delivered = "delivered",
    read = "read",
    none = "none"
}
export interface ChatRoom {
    id: string;
    authorId: string;
    chatName: string;
    avatarPath?: string;
    users: Array<UserShort>;
    messages: Array<Message>;
    multiple: boolean;
    hasOnline: boolean;
    blocked?: boolean;
}
export interface DBChatRoom extends Omit<ChatRoom, "users" | "messages"> {
    _id: string;
    users: Array<string>;
    messages: Array<string>;
}
export interface DBMessage extends Message {
    _id: string;
    usersMetaData: Array<{
        id: string;
        status: MessageStatus;
    }>;
}
export type ChatRooms = Array<ChatRoom>;
export interface UserShort {
    id: string;
    username: string;
    avatarPath?: string;
}
export interface UserCredential extends UserShort {
    email?: string;
    password?: string;
    avatarPath?: string;
    providerName?: string;
}
export interface User extends UserCredential {
    online: boolean;
    chatRooms: ChatRooms;
    lastSeen?: string;
    contacts?: Array<User>;
    infoItems?: Array<InfoItem>;
}
export interface FirebaseUser {
    firebaseUid: string;
    username: string;
    email: string;
    avatar: string;
    providerId: string;
}
export declare enum Theme {
    dark = "dark",
    light = "light"
}
export interface ImageObject {
    name: string;
    src?: string | ArrayBuffer | null;
    fileBuffer?: File | ArrayBuffer;
}
export declare enum UserSettingKey {
    theme = "theme",
    soundOn = "soundOn",
    showTooltips = "showTooltips",
    ableToShowNotification = "ableToShowNotification",
    selectedChatRoomId = "selectedChatRoomId",
    asideTab = "asideTab",
    currentInfoId = "currentInfoId"
}
export interface UserSettings {
    [UserSettingKey.asideTab]: string;
    [UserSettingKey.selectedChatRoomId]: string;
    [UserSettingKey.ableToShowNotification]: boolean;
    [UserSettingKey.theme]: Theme;
    [UserSettingKey.showTooltips]: boolean;
    [UserSettingKey.soundOn]: boolean;
    [UserSettingKey.currentInfoId]: string;
}
export declare enum CallStatus {
    calling = "calling",
    "in-progress" = "in-progress",
    finished = "finished"
}
export declare enum CallType {
    incoming = "incoming",
    outgoing = "outgoing",
    missed = "missed"
}
export interface StreamSettings extends BasicStreamSettings {
    streamLoading: boolean;
}
export interface BasicStreamSettings {
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
    interlocutorAvatarPath?: string;
    status: CallStatus;
    type: CallType;
    video: boolean;
    interlocutorSettings?: StreamSettings;
}
export interface Codes {
    passwordRecovery: {
        query: {
            value: string;
            expiresIn: string;
        };
        email: string;
        sms: string;
    };
    nextRequestPossibleAt: string;
}
export interface CodeValidationPayload {
    email: string;
    code: string;
}
export interface InfoItem {
    id: string;
    label: string;
    content: string;
    read: "read" | "unread";
    contentComponent?: () => string;
}
