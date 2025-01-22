export declare enum Status {
    success = 200,
    badRequest = 400,
    notAuth = 401,
    forbidden = 403,
    notFound = 404,
    server = 500,
    unreachable = 503,
    badGateway = 504
}
export interface MessageMetaData {
    id: string;
    status: Record<MessageStatus, string>;
}
export declare enum Author {
    system = "system",
    time = "time"
}
export interface Reaction {
    username: string;
    authorId: string;
    glyphKey: string;
}
export interface ImageObject {
    src: string;
    name: string;
    fileBuffer?: ArrayBuffer;
}
export interface Message {
    id: string;
    tempId?: string;
    isSelf?: boolean;
    status?: MessageStatus;
    authorId: string;
    authorName: string;
    body: string;
    createdAt?: string;
    reactions?: Array<Reaction>;
    images?: ImageObject[];
    imageCompression?: boolean;
    repliedMessage?: RepliedMessage | null;
}
export interface RepliedMessage {
    id: string;
    authorName: string;
    authorId: string;
    body: string;
    images?: Array<ImageObject>;
    forward?: boolean;
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
export type UsersMetaData = Array<{
    id: string;
    status: MessageStatus;
}>;
export interface DBMessage extends Message {
    _id: string;
    usersMetaData: UsersMetaData;
}
export type ChatRooms = Array<ChatRoom>;
export type Contact = Omit<KRoomUser, "chatRooms">;
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
export declare enum UserRole {
    user = "user",
    admin = "admin"
}
export interface KRoomUser extends UserCredential {
    online: boolean;
    chatRooms: ChatRooms;
    role: keyof typeof UserRole;
    lastSeen?: string;
    contacts?: Array<KRoomUser>;
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
export declare enum UserSettingKey {
    theme = "theme",
    selectedAdminPanelModelTab = "selectedAdminPanelModelTab",
    soundOn = "soundOn",
    showTooltips = "showTooltips",
    ableToShowNotification = "ableToShowNotification",
    selectedChatRoomId = "selectedChatRoomId",
    asideTab = "asideTab",
    currentInfoId = "currentInfoId",
    showWallpaper = "showWallpaper"
}
export declare enum AsideBarButtonName {
    adminPanel = "adminPanel",
    contacts = "contacts",
    chatList = "chatList",
    calls = "calls",
    settings = "settings",
    info = "info"
}
export declare enum AdminPanelModelTab {
    users = "users",
    calls = "calls",
    chatRooms = "chat-rooms",
    messages = "messages"
}
export interface UserSettings {
    [UserSettingKey.asideTab]: AsideBarButtonName;
    [UserSettingKey.selectedAdminPanelModelTab]: AdminPanelModelTab;
    [UserSettingKey.selectedChatRoomId]: string;
    [UserSettingKey.ableToShowNotification]: boolean;
    [UserSettingKey.theme]: Theme;
    [UserSettingKey.showTooltips]: boolean;
    [UserSettingKey.soundOn]: boolean;
    [UserSettingKey.currentInfoId]: string;
    [UserSettingKey.showWallpaper]: boolean;
}
export declare enum CallStatus {
    calling = "calling",
    inProgress = "in-progress",
    finished = "finished"
}
export declare enum CallType {
    incoming = "incoming",
    outgoing = "outgoing",
    missed = "missed",
    notAnswered = "not-answered",
    current = "current"
}
export declare enum UserMediaType {
    audio = "audio",
    video = "video"
}
export interface StreamSettings extends BasicStreamSettings {
    streamLoading: boolean;
}
export interface BasicStreamSettings {
    [UserMediaType.audio]: boolean;
    [UserMediaType.video]: boolean;
}
export interface Call {
    id: string;
    calledAt?: number;
    authorId: string;
    authorName: string;
    startedAt: number;
    finishedAt?: number;
    length?: number;
    interlocutorId: string;
    interlocutorName: string;
    interlocutorAvatarPath?: string;
    status?: CallStatus;
    type: CallType;
    video: boolean;
    interlocutorSettings?: StreamSettings;
    setId?: boolean;
}
export interface DBCall {
    _id: string;
    calledAt: number;
    startedAt: number;
    finishedAt: number;
    authorId: string;
    interlocutors: Array<string>;
    answered: boolean;
    video: boolean;
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
export declare enum InfoItemStatus {
    read = "read",
    unread = "unread"
}
export interface InfoItem {
    id: string;
    label: string;
    content: string;
    read: InfoItemStatus;
    contentComponent?: () => string;
}
export declare enum NotificationType {
    success = "success",
    error = "error",
    info = "info",
    warn = "warning"
}
export declare enum NotificationMessage {
    default = "",
    networkOffline = "The internet connection has been terminated. Network problems",
    networkOnline = "The internet connection has been restored",
    cantAccessDevice = "Cant get access to video device",
    unknownError = "An unknown error has occurred",
    callCompleted = "Call completed",
    failedGetStream = "Failed to get self stream",
    cantSetCallerSignal = "Cannot set caller signal",
    failedToConnectToDevice = "Failed to connect to device, check for device is plugged in",
    socketConnected = "Connected",
    socketDisconnected = "Disconnected",
    tokensPairUpdated = "Token pair is updated",
    success = "success",
    passwordReset = "Password changed successfully",
    loginSuccess = "Login successfully",
    loginAndRegister = "Login and register successfully",
    userDataUpdated = "User data updated",
    userAddedToContacts = "User added to contacts",
    userRemovedFromContacts = "User removed from contacts",
    emailConfirmed = "Email confirmed",
    checkEmailForCode = "Check your email, we have sent you a code",
    checkEmailForConfirmationLink = "Check your email for confirmation link",
    userCreated = "User successfully created, checkout your email address for email confirmation",
    emailConfirmationLinkSended = "Confirmation link sent to email",
    failedGetUserData = "Failed to get user data",
    failedResetPassword = "Failed to change password",
    invalidConfirmCode = "Invalid confirmation code",
    failedCodeSend = "Code send failed",
    commonServerError = "Server error, the operation could not be performed. Try later",
    failedRegistration = "Registration failed, try register later",
    failedLogin = "Login failed, try register later",
    nonAuthorized = "User not authorized",
    haveNotAccessRights = "User have not access rights",
    failedUserDataUpdate = "Failed to update user data",
    userWithCurrentNameAlreadyExist = "The user with the current username is already registered",
    userWithCurrentEmailAlreadyExist = "The user with the current email address is already registered",
    failedPassHash = "Password hashing failed",
    failedSendConfirmEmail = "Failed to send confirmation email",
    exhaustedConfirmationAttempts = "Attempts to send confirmation the link ended =(",
    userNotFound = "User not found",
    wrongPass = "Invalid password",
    failedEmailConfirm = "Email confirm failed",
    emailNotConfirm = "Please, confirm email",
    usersFind = "Error while finding user(s)",
    failedUpdateSettings = "Failed to save user settings",
    emailLinkedToAnotherMethod = "This email is already linked to another login method",
    failedFindEmail = "Could not find the current email address",
    nextTimeRequestNotPossible = "The code was sent earlier",
    noFilesExist = "No files exist",
    notImage = "File is not an image",
    failedSendConfirmationLink = "Failed to send confirmation link, please try later",
    couldNotFindEmail = "Could not find the current email address",
    imageConverterError = "Server could not process the image, please choose another image file",
    failedToLogin = "Login failed, server error. Please try again, later",
    imageResNotAllowed = "Image resolution not allowed",
    tokenExpired = "Token expired",
    authenticationError = "Authentication error",
    maxAttachedFilesExceed = "The maximum number of attached images should not exceed 4",
    imageSizeMustLessThan2mb = "Image size must be less than 2mb",
    allowAudioContext = "The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio context.",
    failedToDecodeAdminId = "Failed to decode admin id",
    forbiddenDoNotHavePermission = "Forbidden. You don't have permission to get access",
    failedToGetData = "Failed to get data",
    dbRestored = "Data base restored",
    dbResetFailed = "Data base reset failed",
    fixturesAreApplied = "The fixtures are applied",
    userDeleteSuccess = "The user has been successfully deleted",
    deleteUserFailed = "Couldn't delete user",
    userUpdateSuccess = "User update success"
}
export interface ErrorResponse<T> {
    message: T;
    status: Status;
    data: null;
    silent: boolean;
}
export interface KRoomNotification<T = NotificationMessage> {
    key?: string;
    message: T;
    description?: string;
    messageType?: NotificationType;
    duration?: number;
    placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
}
export interface SocketActionsPayload {
    interlocutorUpdateSignal: {
        signal: unknown;
    };
    updateSignal: {
        signal: unknown;
    };
    markCallAsVideo: {
        callId: string;
    };
    messageDelivered: {
        roomId: string;
        message: Message;
    };
    getRooms: Array<ChatRoom>;
    statusContact: {
        interlocutorId: string;
        status: boolean;
    };
    changeContactsData: UserShort;
    getContacts: {
        contacts: Array<Contact>;
        messageBody: NotificationMessage;
    };
    callUpdated: Call;
    callsUpdated: Array<Call>;
    saveContact: {
        interlocutorId: string;
    };
    deleteContact: {
        deletingUserId: string;
    };
    searchContact: {
        value: string;
    };
    updateUserSettings: {
        type: keyof UserSettings;
        value: string | boolean;
    };
    createRoom: {
        users: Array<string>;
        multiple: boolean;
        avatarFile?: {
            buffer: ArrayBuffer;
        };
        chatName?: string;
    };
    updateChatRoom: {
        users: Array<string>;
        roomId: string;
        chatName: string;
        avatarPath: string;
        avatarFile: {
            buffer: ArrayBuffer;
        } | undefined;
    };
    userTyping: {
        authorName: string;
        usersTo: Array<UserShort>;
        status: boolean;
    };
    getUserTypingStatus: {
        authorData: {
            authorName: string;
            authorId: string;
        };
        status: boolean;
    };
    sendMessage: {
        roomId: string;
        message: Message;
    };
    updateMessageStatus: {
        roomId: string;
        messageId: string;
        status: MessageStatus;
    };
    changeMessageStatus: {
        roomId: string;
        messageId: string;
        status: MessageStatus;
    };
    deleteMessage: {
        messageId: string;
        roomId: string;
    };
    addReaction: {
        glyphKey: string;
        messageId: string;
        roomId: string;
        username: string;
    };
    callUser: {
        callId?: string;
        userToCall?: string;
        signal: unknown;
        from: string;
        avatarPath: string;
        callerName: string;
    };
    changeCallSettings: BasicStreamSettings;
    callAccepted: {
        signal: unknown;
    };
    answerCall: {
        callId: string;
        to: string;
        signal: unknown;
        selfSocketId: string;
    };
    callStartedAt: number;
    callEnded: {
        callId: string;
        callerId: string;
    };
    errorMessage: {
        messageType?: NotificationType;
        message: NotificationMessage;
    };
    messageDeleted: {
        messageId: string;
        roomId: string;
    };
    updatedMessageReactions: {
        roomId: string;
        messageId: string;
        reaction: Reaction;
    };
}
export interface EnvVariables {
    SERVER_PORT: string;
    CLIENT_PORT: string;
    SERVER_URL: string;
    CLIENT_URL: string;
    MONGO_HOST: string;
    HOST: string;
    JWT_ACCESS_EXPIRES_INTERVAL: string;
    JWTR_ACCESS_EXPIRES_INTERVAL: string;
    APP_NAME: string;
    MAIL_APP: string;
    MAIL_APP_PASS: string;
    REGISTRATION_RESEND_INTERVAL_MINUTES: string;
    K_ROOM_ACCESS_TOKEN_SECRET: string;
    K_ROOM_REFRESH_TOKEN_SECRET: string;
    K_ROOM_MAIL_PASS: string;
    K_ROOM_ADMIN_PASS: string;
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
export type EndpointsType = AuthEndpoints | UserEndpoints | CommonEndpoints | CodesEndpoints | AdminEndpoints;
export declare enum AuthEndpoints {
    REGISTRATION = "/auth/registration",
    SEND_EMAIL_CONFIRMATION_LINK = "/auth/send-email-confirmation-link",
    SEND_EMAIL_CONFIRMATION = "/auth/send-email-confirmation",
    LOGIN = "/auth/login",
    GOOGLE_LOGIN = "/auth/google-login",
    PROVIDER_LOGIN = "/auth/provider-login",
    LOGOUT = "/auth/logout",
    UPDATE_TOKENS_PAIR = "/auth/update-tokens-pair"
}
export declare enum UserEndpoints {
    GET_USER_DATA = "/auth/get-user-data",
    UPDATE_USER_DATA = "/auth/user-data/update",
    RESET_PASSWORD = "/user/reset-password"
}
export declare enum CommonEndpoints {
    COMMON_IMAGES = "/common-images",
    GET_INFO = "/notification"
}
export declare enum CodesEndpoints {
    SEND_EMAIL_CODE_PASSWORD_RECOVERY = "/codes/email/password-recovery",
    VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY = "/codes/email/validate-email-code-password-recovery"
}
export declare enum AdminEndpoints {
    GET_APP_DATA = "/admin/get-app-data",
    DB_CLEAR = "/admin/db-reset",
    APPLY_FIXTURES = "/admin/apply-fixtures",
    DELETE_USER = "/admin/delete-user",
    UPDATE_USER_DATA = "/admin/update-user-data"
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
    PRIVACY_POLICY = "/privacy-policy/",
    ADMIN_PANEL = "/admin-panel/",
    SOCKET_PATH = "/app-socket/",
    API = "/api/"
}
export declare enum SocketActions {
    CONNECTION = "connection",
    ERROR = "error",
    RECONNECT = "reconnect",
    AUTH_ERROR = "auth-error",
    INITIALIZE = "initialize",
    DISCONNECT = "disconnect",
    GET_ROOMS = "get-rooms",
    CREATE_ROOM = "create-room",
    SEND_MESSAGE = "send-message",
    MESSAGE_DELIVERED = "message-delivered",
    ROOM_CREATED = "room-created",
    SEARCH_CONTACT = "search-contact",
    GET_SEARCHED_CONTACT = "get-searched-contact",
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
    CALL_STARTED_AT = "call-started-at",
    UPDATE_USER_SETTINGS = "update-user-settings",
    UPDATE_CHAT_ROOM = "update-chat-room",
    ROOM_DATA_UPDATED = "room-data-updated",
    ADD_REACTION = "add-reaction",
    UPDATE_MESSAGE_REACTIONS = "update-message-reactions",
    DELETE_MESSAGE = "delete-message",
    MESSAGE_DELETED = "message-deleted",
    ERROR_MESSAGE = "error-message",
    CALLS_UPDATED = "calls-updated",
    CALL_UPDATED = "call-updated",
    MARK_CALL_AS_VIDEO = "mark-call-as-video",
    UPDATE_CALL_SIGNAL = "update-call-signal",
    INTERLOCUTOR_UPDATE_SIGNAL = "interlocutor-update-signal",
    RECONNECT_ATTEMPT = "reconnect_attempt",
    RECONNECT_FAILED = "reconnect_failed"
}
export declare enum AuthTokens {
    accessToken = "jwt",
    refreshToken = "refresh-jwt"
}
export interface IUserSchema extends KRoomUser {
    socketId: string;
    confirmed: Boolean;
    confirmAttempts: number;
    refreshToken: string;
    settings: UserSettings;
    codes: Codes;
    infoItems: Array<InfoItem>;
    _id: string;
}
export interface IMessageSchema extends Omit<Message, 'id' | 'tempId' | 'isSelf' | 'status'> {
    usersMetaData?: UsersMetaData;
}
export interface IDBChatRoomSchema extends DBChatRoom {
}
export interface IDBCallSchema extends DBCall {
}
