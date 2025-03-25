import { ChatRooms, Codes, DBContactMap, InfoItem, MessageStatus, UserSettings } from ".";
export type UserRole = "user" | "admin";
export interface UserMessageStatus {
    id: string;
    status: MessageStatus;
}
export type UserMediaType = "audio" | "video";
export type UsersMetaData = UserMessageStatus[];
export interface FirebaseUser {
    firebaseUid: string;
    username: string;
    email: string;
    avatar: string;
    providerId: string;
}
export interface KRoomUser {
    id: string;
    username: string;
    online: boolean;
    chatRooms: ChatRooms;
    role: UserRole;
    avatarPath?: string;
    email?: string;
    password?: string;
    providerName?: string;
    lastSeen?: string;
    contacts?: KRoomUser[];
    infoItems?: InfoItem[];
}
export type UserShort = Pick<KRoomUser, "id" | "username" | "avatarPath">;
export type UserCredential = Pick<KRoomUser, "id" | "username" | "email" | "avatarPath" | "password" | "providerName">;
export interface IUserSchema extends Omit<KRoomUser, "contacts"> {
    socketId: string;
    confirmed: Boolean;
    confirmAttempts: number;
    refreshToken: string;
    settings: UserSettings;
    codes: Codes;
    infoItems: InfoItem[];
    contacts: DBContactMap;
}
export interface ICreateNewPasswordPayload extends Pick<KRoomUser, "password"> {
    query: string;
}
