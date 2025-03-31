import { IUserData } from ".";

export type InteractionType =
  | "default"
  | "invited"
  | "invite-accepted"
  | "invite-hidden"
  | "invite-received";

export interface IContactBase {
  id: string;
  interaction: InteractionType;
}
export type ContactType = IContactBase &
  Omit<IUserData, "chatRooms" | "contacts" | "infoItems" | "role">;
export type DBContactType = IContactBase;
export type DBContactMapType = Record<string, DBContactType>;
