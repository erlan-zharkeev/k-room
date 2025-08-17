import { ICodes, DBContactMapType, IInfoNotification } from ".";

export const USER_ROLES = ["user", "admin"] as const;
export type UserRoleType = (typeof USER_ROLES)[number];

export interface IFrontendUserData {
  id: string;
  role: UserRoleType;
  email: string;
  username: string;
  contacts: [];
  textRooms: [];
  unreadInfoNotifications: string[];
}

export type UserShortType = Pick<IFrontendUserData, "id" | "username">;

export interface IUserSchema extends Omit<IFrontendUserData, "contacts"> {
  socketId: string;
  confirmed: Boolean;
  confirmAttempts: number;
  refreshToken: string;
  codes: ICodes;
  infoNotifications: IInfoNotification[];
  contacts: DBContactMapType;
}
