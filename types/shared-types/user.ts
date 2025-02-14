import {
  ChatRooms,
  Codes,
  DBContactMap,
  InfoItem,
  MessageStatus,
  UserSettings,
} from ".";

export type UserRole = "user" | "admin";

export interface UserShort {
  id: string;
  username: string;
  avatarPath?: string;
}

export interface UserCredential extends UserShort {
  email?: string;
  password?: string;
  providerName?: string;
}

export interface UserMessageStatus {
  id: string;
  status: MessageStatus;
}

export type UserMediaType = "audio" | "video";

export type UsersMetaData = UserMessageStatus[];

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

export interface KRoomUser extends UserCredential {
  online: boolean;
  chatRooms: ChatRooms;
  role: UserRole;
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

export interface IUserSchema extends Omit<KRoomUser, "contacts"> {
  socketId: string;
  confirmed: Boolean;
  confirmAttempts: number;
  refreshToken: string;
  settings: UserSettings;
  codes: Codes;
  infoItems: Array<InfoItem>;
  contacts: DBContactMap;
  _id: string;
}
