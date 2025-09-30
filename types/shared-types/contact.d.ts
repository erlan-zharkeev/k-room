export type InteractionType = "default" | "invited" | "invite-accepted" | "invite-hidden" | "invite-received";
export interface IFrontendContact {
    id: string;
    username: string;
    online: boolean;
    lastSeen: number;
    interactionType: InteractionType;
}
export type IFrontendContactMap = Record<string, IFrontendContact>;
