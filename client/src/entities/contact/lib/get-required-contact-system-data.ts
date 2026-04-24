import type { IDbContactRequiredSystemData } from 'src/shared/config'

export const getRequiredContactSystemData = (): IDbContactRequiredSystemData => ({
  savedAt: Date.now(),
  onlineStatusSyncedAt: Date.now(),
  isTyping: false
})
