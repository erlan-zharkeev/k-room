import { DbContactRequiredSystemData } from 'src/shared/config'

export const getRequiredContactSystemData = (): DbContactRequiredSystemData => ({
  savedAt: Date.now(),
  onlineStatusSyncedAt: Date.now(),
  isTyping: false
})
