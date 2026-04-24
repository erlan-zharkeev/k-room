import type { IFrontendContact } from 'global-shared'

export type DbContactType = IFrontendContact & IDbContactRequiredSystemData

export interface IDbContactRequiredSystemData {
  savedAt: number
  onlineStatusSyncedAt: number
  isTyping: boolean
}
