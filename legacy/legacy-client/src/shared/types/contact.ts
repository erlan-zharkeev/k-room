import { IFrontendContact } from 'common'

export type DbContact = IFrontendContact & DbContactRequiredSystemData

export interface DbContactRequiredSystemData {
  savedAt: number
  onlineStatusSyncedAt: number
  isTyping: boolean
}
