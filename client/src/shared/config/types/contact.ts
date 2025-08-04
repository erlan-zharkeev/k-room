import { ContactType } from 'common-types'

export type DbContactType = ContactType & IDbContactRequiredSystemData

export interface IDbContactRequiredSystemData {
  onlineStatusSyncedAt: number
  isTyping: boolean
}
