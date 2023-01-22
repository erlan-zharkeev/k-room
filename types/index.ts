export interface EnvVariables {
  SERVER_PORT: string;
  CLIENT_PORT: string;
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
}

export enum AuthEndPoints {
  REGISTRATION = "/api/auth/registration",
  SEND_EMAIL_CONFIRMATION_LINK = "/api/auth/send-email-confirmation-link",
  SEND_EMAIL_CONFIRMATION = "/api/auth/send-email-confirmation",
  LOGIN = "/api/auth/login",
  UPDATE_USER_DATA = "/api/auth/user-data/update",
  GET_FILES = "/api/image/:filename",
  LOGOUT = "/api/auth/logout",
  GET_USER_DATA = "/api/auth/get-user-data",
  UPDATE_TOKENS_PAIR = "/api/auth/update-tokens-pair",
}

export enum CommonEndPoints {
  COMMON_IMAGES = "/api/common-images",
}

export enum SystemEndPoints {
  UPDATE_USER_SETTINGS = "/api/user/update-user-settings",
}

export enum SocketActions {
  CONNECTION = "connection",
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
}

export enum RouteNames {
  SIGN_IN = "/sign-in",
  SIGN_UP = "/sign-up",
  WAIT_EMAIL_CONFIRM = "/wait-email-confirm",
  EMAIL_CONFIRM = "/confirm-email",
  MAIN = "/app",
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
}

export interface User extends UserCredential {
  online: boolean;
  chatRooms: ChatRooms;
  lastSeen?: string;
  contacts?: Array<User>;
  avatar?: string;
}

export type theme = "dark" | "light";
export interface UserSettings {
  ableToShowNotification: boolean;
  theme: theme;
  showTooltips: boolean;
  soundOn: boolean;
}

export enum Status {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_AUTH = 401,
  TOKEN_EXPIRED = 403,
  NOT_FOUND = 404,
  UNREACHABLE = 503,
}
