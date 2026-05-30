import { ref } from 'vue'

import type { ChatRoomMessageNavigationParams } from '../config/types'

export const useChatRoomMessageNavigation = ({
  room,
  targetMessageId,
  findLoadedRangeByMessageIndex,
  loadMessagesAround,
  scrollToMessage,
  onTargetMessageScrolled
}: ChatRoomMessageNavigationParams) => {
  const isTargetNavigationSuspended = ref(false)

  const suspendTargetNavigation = () => {
    isTargetNavigationSuspended.value = true
  }

  const resumeTargetNavigation = () => {
    isTargetNavigationSuspended.value = false
  }

  const navigateToMessage = async (messageId: string) => {
    const messageIndex = room.value.messages.indexOf(messageId)

    if (messageIndex === -1) return

    const range = findLoadedRangeByMessageIndex(room.value.id, messageIndex)

    if (!range) {
      await loadMessagesAround(messageId)
    }

    await scrollToMessage(messageId)
  }

  const navigateToTargetMessage = async (messageId: string) => {
    if (isTargetNavigationSuspended.value) return

    const roomId = room.value.id

    await navigateToMessage(messageId)

    const isCurrentTarget = room.value.id === roomId && targetMessageId.value === messageId

    if (!isCurrentTarget) return

    onTargetMessageScrolled()
  }

  const navigateToCurrentTargetMessage = async () => {
    const messageId = targetMessageId.value

    if (!messageId) return

    await navigateToTargetMessage(messageId)
  }

  return {
    navigateToCurrentTargetMessage,
    navigateToTargetMessage,
    resumeTargetNavigation,
    suspendTargetNavigation
  }
}
