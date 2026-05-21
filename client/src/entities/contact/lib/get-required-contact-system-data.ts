import type { IDbContactRequiredSystemData } from 'src/shared/lib'

export const getRequiredContactSystemData = (): IDbContactRequiredSystemData => ({
  savedAt: Date.now(),
  isTyping: false
})
