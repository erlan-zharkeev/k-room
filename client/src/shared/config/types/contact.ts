import { FrontendContactType } from 'common-types'

export type DbContactType = FrontendContactType & IDbContactRequiredSystemData

export interface IDbContactRequiredSystemData {
  onlineStatusSyncedAt: number
  isTyping: boolean
}
