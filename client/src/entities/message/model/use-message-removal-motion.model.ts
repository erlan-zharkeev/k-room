import { reactive, readonly } from 'vue'

const removingMessageIds = reactive(new Set<string>())

export const useMessageRemovalMotion = () => {
  const startMessageRemovalMotion = (messageId: string) => {
    removingMessageIds.add(messageId)
  }

  const stopMessageRemovalMotion = (messageId: string) => {
    removingMessageIds.delete(messageId)
  }

  return {
    removingMessageIds: readonly(removingMessageIds),
    startMessageRemovalMotion,
    stopMessageRemovalMotion
  }
}
