import type { ContactLocalStateType } from 'src/shared/lib'

export const getRequiredContactSystemData = (): ContactLocalStateType => ({
  savedAt: Date.now(),
  isTyping: false
})
