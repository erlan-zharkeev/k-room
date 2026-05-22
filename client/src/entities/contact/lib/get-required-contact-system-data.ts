import type { ContactLocalState } from 'src/shared/lib'

export const getRequiredContactSystemData = (): ContactLocalState => ({
  savedAt: Date.now(),
  isTyping: false
})
