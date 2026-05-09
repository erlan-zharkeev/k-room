import type { IDbContactRequiredSystemData } from 'src/shared/lib'

export const getRequiredContactSystemData = (): IDbContactRequiredSystemData => ({
  savedAt: Date.now(),
  onlineStatusSyncedAt: Date.now(),
  isTyping: false
})
