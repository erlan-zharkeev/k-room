import { IFrontendContact } from 'common-types'

export type DbContactType = IFrontendContact & IDbContactRequiredSystemData

export interface IDbContactRequiredSystemData {
  onlineStatusSyncedAt: number
  isTyping: boolean
}
