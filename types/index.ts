// BASIC
export enum Status {
  success = 200,
  badRequest = 400,
  notAuth = 401,
  tokenExpired = 403,
  notFound = 404,
  unreachable = 503,
  badGateaway = 504,
}
export interface MessageMetaData {
  id: string;
  status: Record<MessageStatus, string>;
}
export enum Author {
  system = "system",
  time = "time",
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
  repliedMessage?: RepliedMessage | null;
}

export interface RepliedMessage {
  id: string;
  authorName: string;
  authorId: string;
  body: string;
  images?: Array<any>;
  forward?: boolean;
}

export enum MessageStatus {
  sending = "sending",
  undelivered = "undelivered",
  delivered = "delivered",
  read = "read",
  none = "none",
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
  usersMetaData: Array<{ id: string; status: MessageStatus }>;
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

export enum Theme {
  dark = "dark",
  light = "light",
}

export interface ImageObject {
  name: string;
  src?: string;
  fileBuffer?: File | ArrayBuffer;
}

export enum UserSettingKey {
  theme = "theme",
  soundOn = "soundOn",
  showTooltips = "showTooltips",
  ableToShowNotification = "ableToShowNotification",
  selectedChatRoomId = "selectedChatRoomId",
  asideTab = "asideTab",
  currentInfoId = "currentInfoId",
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

export enum CallStatus {
  calling = "calling",
  inProgress = "in-progress",
  finished = "finished",
}

export enum CallType {
  incoming = "incoming",
  outgoing = "outgoing",
  missed = "missed",
}

export enum UserMediaType {
  audio = "audio",
  video = "video",
  both = "both",
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

export enum InfoItemStatus {
  read = "read",
  unread = "unread",
}

export interface InfoItem {
  id: string;
  label: string;
  content: string;
  read: InfoItemStatus;
  contentComponent?: () => string;
}

export interface SocketActionsPayload {
  initialize: {
    userId: string;
  };
  saveContact: {
    userId: string;
    interlocutorId: string;
  };
  deleteContact: {
    currentUserId: string;
    deletingUserId: string;
  };
  searchContact: {
    value: string;
  };
  updateUserSettings: {
    userId: string;
    type: keyof UserSettings;
    value: string | boolean;
  };
  createRoom: {
    users: Array<string>;
    authorId: string;
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
    avatarFile:
      | {
          buffer: ArrayBuffer;
        }
      | undefined;
    authorId: string;
  };
  userTyping: {
    authorId: string;
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
  sendMessage: { roomId: string; message: Message };
  updateMessageStatus: {
    roomId: string;
    messageId: string;
    status: MessageStatus;
  };
  changeMessageStatus: {
    roomId: string;
    messageId: string;
    status: MessageStatus;
    userId: string;
  };
  deleteMessage: {
    messageId: string;
    roomId: string;
  };
  addReaction: {
    glyphKey: string;
    messageId: string;
    roomId: string;
    authorId: string;
    username: string;
  };
  callUser: {
    userToCall?: string;
    signal: any;
    from: string;
    avatarPath: string;
    callerName: string;
    settings: StreamSettings;
  };
  changeCallSettings: BasicStreamSettings;
  callAccepted: {
    signal: any;
    settings: StreamSettings;
  };
  answerCall: {
    to: string;
    signal: any;
    settings: StreamSettings;
    selfSocketId: string;
  };
  callStartedAt: number;
  callEnded: {
    callerId: string;
  };
  errorMessage: {
    message: string;
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

// ENV VARs
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

// ENDPOINTS (!for every endpoints use upper snake case)
export enum AuthEndPoints {
  REGISTRATION = "/auth/registration",
  SEND_EMAIL_CONFIRMATION_LINK = "/auth/send-email-confirmation-link",
  SEND_EMAIL_CONFIRMATION = "/auth/send-email-confirmation",
  LOGIN = "/auth/login",
  GOOGLE_LOGIN = "/auth/google-login",
  PROVIDER_LOGIN = "/auth/provider-login",
  LOGOUT = "/auth/logout",
  UPDATE_TOKENS_PAIR = "/auth/update-tokens-pair",
}

export enum UserEndPoints {
  GET_USER_DATA = "/auth/get-user-data",
  UPDATE_USER_DATA = "/auth/user-data/update",
  RESET_PASSWORD = "/user/reset-password",
}

export enum CommonEndPoints {
  COMMON_IMAGES = "/common-images",
  GET_INFO = "/notification",
}

export enum CodesEndPoints {
  SEND_EMAIL_CODE_PASSWORD_RECOVERY = "/codes/email/password-recovery",
  VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY = "/codes/email/validate-email-code-password-recovery",
}

export enum RouteNames {
  SIGN_IN = "/sign-in",
  SIGN_UP = "/sign-up",
  WAIT_EMAIL_CONFIRM = "/wait-email-confirm",
  EMAIL_CONFIRM = "/confirm-email",
  MAIN = "/app",
  NOT_FOUND = "/not-found",
  PASSWORD_RECOVERY = "/password-recovery",
  CREATE_NEW_PASSWORD = "/create-new-password",
  NOTIFICATION = "/notification",
  // Don't forget to change path below in nginx manually
  SOCKET_PATH = "/app-socket/",
  API = "/api/",
}

export enum SocketActions {
  CONNECTION = "connection",
  RECONNECT = "reconnect",
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
}
