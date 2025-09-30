import { IFrontendContactMap, InfoNotificationMapType } from ".";

export const USER_ROLES = ["user", "admin"] as const;
export type UserRoleType = (typeof USER_ROLES)[number];

export interface IBaseFrontendUserData {
  id: string;
  username: string;
}

export interface IFrontendUserData extends IBaseFrontendUserData {
  role: UserRoleType;
  email: string;
  infoNotifications: InfoNotificationMapType;
}