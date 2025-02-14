export type InfoItemStatus = "read" | "unread";

export interface InfoItem {
  id: string;
  label: string;
  content: string;
  read: InfoItemStatus;
  contentComponent?: () => string;
}
