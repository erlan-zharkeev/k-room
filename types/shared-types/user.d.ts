import { ICodes, DBContactMapType, InfoNotificationMapType } from ".";
export declare const USER_ROLES: readonly ["user", "admin"];
export type UserRoleType = (typeof USER_ROLES)[number];
export interface IFrontendUserData {
    id: string;
    role: UserRoleType;
    email: string;
    username: string;
    infoNotifications: InfoNotificationMapType;
    contacts: [];
    textRooms: [];
}
export type UserShortType = Pick<IFrontendUserData, "id" | "username">;
export interface IUserSchema extends Omit<IFrontendUserData, "contacts"> {
    socketId: string;
    confirmed: Boolean;
    confirmAttempts: number;
    refreshToken: string;
    codes: ICodes;
    contacts: DBContactMapType;
}
