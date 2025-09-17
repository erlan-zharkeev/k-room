import { FrontendContactTypeMap, InfoNotificationMapType } from ".";
export declare const USER_ROLES: readonly ["user", "admin"];
export type UserRoleType = (typeof USER_ROLES)[number];
export interface IBaseFrontendUserData {
    id: string;
    username: string;
}
export interface IFrontendUserData extends IBaseFrontendUserData {
    role: UserRoleType;
    email: string;
    infoNotifications: InfoNotificationMapType;
    contacts: FrontendContactTypeMap;
    textRooms: [];
}
