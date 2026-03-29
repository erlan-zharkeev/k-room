export declare const INFO_NOTIFICATION_STATUS: readonly ['read', 'unread', 'hidden']
export type InfoNotificationType = (typeof INFO_NOTIFICATION_STATUS)[number]
export interface IInfoNotification {
  id: string
  label: string
  content: string
}
export type InfoNotificationMapType = Record<number, InfoNotificationType>
export interface IMarkAsReadPayload {
  id: string
}
