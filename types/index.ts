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

export enum SocketActions {
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
  CALL_STARTED_AT = "call-started-at",
  UPDATE_USER_SETTINGS = "update-user-settings",
  UPDATE_CHAT_ROOM = "update-chat-room",
  ROOM_DATA_UPDATED = "room-data-updated",
  ADD_REACTION = "add-reaction",
  UPDATE_MESSAGE_REACTIONS = "update-message-reactions",
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
}

export interface Reaction {
  username: string;
  authorId: string;
  glyphKey: string;
}

export interface Message {
  id: string;
  authorName: string;
  author: string;
  body: string;
  createdAt?: string;
  isSelf?: boolean;
  status?: MessageStatus;
  reactions?: Array<Reaction>;
  files?: Array<any>;
  filesCompression?: boolean;
}

export type MessageStatus =
  | "sending"
  | "undelivered"
  | "delivered"
  | "read"
  | "none";

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
  blocked?: boolean;
  avatarFile?: any;
}

export type ChatRooms = Array<ChatRoom>;

export interface UserShort {
  id: string;
  username: string;
  avatar?: string;
}

export interface UserCredential extends UserShort {
  email?: string;
  password?: string;
  avatar?: string;
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

export type theme = "dark" | "light";

export interface UserSettings {
  asideTab: string;
  selectedChatRoomId: string;
  ableToShowNotification: boolean;
  theme: theme;
  showTooltips: boolean;
  soundOn: boolean;
  currentInfoId: string;
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

export enum Status {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_AUTH = 401,
  TOKEN_EXPIRED = 403,
  NOT_FOUND = 404,
  UNREACHABLE = 503,
  BAD_GATEAWAY = 504,
}
