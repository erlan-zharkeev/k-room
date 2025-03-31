export type InfoItemStatusType = "read" | "unread";
export interface IInfoItem {
    id: string;
    label: string;
    content: string;
    read: InfoItemStatusType;
    contentComponent?: () => string;
}
