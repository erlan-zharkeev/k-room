import {
  ChatRoomsType,
  ICodes,
  DBContactMapType,
  IInfoNotification,
  MessageStatusType,
} from ".";
export declare const USER_ROLES: readonly ["user", "admin"];
export type UserRoleType = (typeof USER_ROLES)[number];
export interface IUserMessageStatus {
  id: string;
  status: MessageStatusType;
}
export type UsersMetaDataType = IUserMessageStatus[];
export interface IFirebaseUser {
  firebaseUid: string;
  username: string;
  email: string;
  avatar: string;
  providerId: string;
}
export interface IFrontendUserData {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
  online: boolean;
  chatRooms: ChatRoomsType;
  role: UserRoleType;
  password?: string;
  provider?: string;
  lastSeen?: number;
  contacts?: IFrontendUserData[];
  infoNotifications?: IInfoNotification[];
}
export type UserShortType = Pick<
  IFrontendUserData,
  "id" | "username" | "avatar"
>;
export type UserCredentialType = Pick<
  IFrontendUserData,
  "id" | "username" | "email" | "avatar" | "password" | "provider"
>;
export interface IUserSchema extends Omit<IFrontendUserData, "contacts"> {
  socketId: string;
  confirmed: Boolean;
  confirmAttempts: number;
  refreshToken: string;
  codes: ICodes;
  infoNotifications: IInfoNotification[];
  contacts: DBContactMapType;
}
export interface ICreateNewPasswordPayload
  extends Pick<IFrontendUserData, "password"> {
  query: string;
}
