import { ChatRoomsType, ICodes, DBContactMapType, IInfoNotification, MessageStatusType } from ".";
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
export interface IUserData {
    id: string;
    username: string;
    avatarPath?: string;
    email?: string;
    online: boolean;
    chatRooms: ChatRoomsType;
    role: UserRoleType;
    password?: string;
    providerName?: string;
    lastSeen?: number;
    contacts?: IUserData[];
    infoNotifications?: IInfoNotification[];
}
export type UserShortType = Pick<IUserData, "id" | "username" | "avatarPath">;
export type UserCredentialType = Pick<IUserData, "id" | "username" | "email" | "avatarPath" | "password" | "providerName">;
export interface IUserSchema extends Omit<IUserData, "contacts"> {
    socketId: string;
    confirmed: Boolean;
    confirmAttempts: number;
    refreshToken: string;
    codes: ICodes;
    infoNotifications: IInfoNotification[];
    contacts: DBContactMapType;
}
export interface ICreateNewPasswordPayload extends Pick<IUserData, "password"> {
    query: string;
}
