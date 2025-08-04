import { IUserData } from ".";
export type InteractionType = "default" | "invited" | "invite-accepted" | "invite-hidden" | "invite-received";
export interface IContactBase {
    id: string;
    interaction: InteractionType;
    updatedAt: number;
}
export type ContactType = Omit<IContactBase, "updatedAt"> & Omit<IUserData, "chatRooms" | "contacts" | "infoNotifications" | "role">;
export type DBContactType = IContactBase;
export type DBContactMapType = Record<string, DBContactType>;
