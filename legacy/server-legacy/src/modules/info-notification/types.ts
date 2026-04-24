import { InfoNotificationMapType } from 'common'
import { Types } from 'mongoose'

export interface IInfoNotificationAdminActionRequest {
  method?: string
  payload?: Record<string, unknown>
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

export type InfoNotificationFixtureType = {
  _id: Types.ObjectId
  title: {
    en: string
    ru: string
  }
  content: {
    en: string[]
    ru: string[]
  }
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export interface IInfoNotificationStateSchema {
  _id: string
  userId: string
  infoNotifications: InfoNotificationMapType
}

export type InfoNotificationStateDocumentType = Omit<IInfoNotificationStateSchema, '_id' | 'userId'> & {
  _id: Types.ObjectId
  userId: Types.ObjectId
}
