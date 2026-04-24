import type { UnknownObject } from 'global-shared'

export interface IInfoNotificationAdminActionRequest {
  method?: string
  payload?: UnknownObject
}

export interface IInfoNotificationAdminRecordType {
  id: () => string
  toJSON: (currentAdmin?: unknown) => unknown
}

export interface IInfoNotificationAdminResourceType {
  id: () => string
}

export interface IInfoNotificationAdminHelpersType {
  recordActionUrl: (options: { resourceId: string; recordId: string; actionName: string; search?: string }) => string
}

export interface IInfoNotificationAdminActionContextType {
  record?: IInfoNotificationAdminRecordType
  currentAdmin?: unknown
  resource: IInfoNotificationAdminResourceType
  h: IInfoNotificationAdminHelpersType
}

export interface IInfoNotificationAdminNoticeType {
  message: string
  type: 'success' | 'error' | 'info'
}

export interface IInfoNotificationAdminRecordActionResponseType {
  record: unknown
  redirectUrl: string
  notice: IInfoNotificationAdminNoticeType
}
