import { KRoomUser } from ".";

export type InteractionType =
  | "default"
  | "invited"
  | "invite-accepted"
  | "invite-hidden"
  | "invite-received";

export interface ContactBase {
  id: string;
  interactionType: InteractionType;
}
export type Contact = ContactBase &
  Omit<KRoomUser, "chatRooms" | "contacts" | "infoItems" | "role">;
export type DBContact = ContactBase;
export type DBContactMap = Record<string, DBContact>;
