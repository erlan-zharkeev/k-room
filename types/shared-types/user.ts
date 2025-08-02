import {
  ChatRoomsType,
  ICodes,
  DBContactMapType,
  IInfoMessage,
  MessageStatusType,
} from ".";

export type UserRoleType = "user" | "admin";
export interface IUserMessageStatus {
  id: string;
  status: MessageStatusType;
}
export type UserMediaType = "audio" | "video";
export type UsersMetaDataType = IUserMessageStatus[];
export interface IFirebaseUser {
  firebaseUid: string;
  username: string;
  email: string;
  avatar: string;
  providerId: string;
}

export interface IUserData {
  id: string;
  username: string;
  online: boolean;
  chatRooms: ChatRoomsType;
  role: UserRoleType;
  avatarPath?: string;
  email?: string;
  password?: string;
  providerName?: string;
  lastSeen?: number;
  contacts?: IUserData[];
  infoNotifications?: IInfoMessage[];
}

export type UserShortType = Pick<IUserData, "id" | "username" | "avatarPath">;

export type UserCredentialType = Pick<
  IUserData,
  "id" | "username" | "email" | "avatarPath" | "password" | "providerName"
>;

export interface IUserSchema extends Omit<IUserData, "contacts"> {
  socketId: string;
  confirmed: Boolean;
  confirmAttempts: number;
  refreshToken: string;
  codes: ICodes;
  infoNotifications: IInfoMessage[];
  contacts: DBContactMapType;
}

export interface ICreateNewPasswordPayload extends Pick<IUserData, "password"> {
  query: string;
}
