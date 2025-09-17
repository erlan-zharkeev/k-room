import { IBaseFrontendUserData } from "./user";

export type InteractionType =
  | "default"
  | "invited"
  | "invite-accepted"
  | "invite-hidden"
  | "invite-received";

export type FrontendContactType = IBaseFrontendUserData & { interactionType: InteractionType }

export type FrontendContactTypeMap = Record<string, FrontendContactType>