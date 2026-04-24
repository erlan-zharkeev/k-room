import { IFrontendContact } from 'common'

export type DbContactType = IFrontendContact & IDbContactRequiredSystemData

export interface IDbContactRequiredSystemData {
  savedAt: number
  onlineStatusSyncedAt: number
  isTyping: boolean
}
