import { IFrontendContact } from 'common'

export type DbContactType = IFrontendContact & IDbContactRequiredSystemData

export interface IDbContactRequiredSystemData {
  onlineStatusSyncedAt: number
  isTyping: boolean
}
