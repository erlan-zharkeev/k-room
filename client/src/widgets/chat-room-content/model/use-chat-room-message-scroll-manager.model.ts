import type { INmorphScrollExpose, NmorphCoordsType } from '@nmorph/nmorph-ui-kit'
import type { Virtualizer } from '@tanstack/vue-virtual'
import type { ChatRoom } from 'global-shared'
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch, type ComputedRef, type Ref } from 'vue'

import { useSettings } from 'src/entities/setting'

import { MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET } from '../config/constants'

export const useChatRoomMessageScrollManager = (
  room: Ref<ChatRoom>,
  displayedLastMessageId: ComputedRef<string | null>,
  messageItemsQuantity: ComputedRef<number>
) => {
  const { settings, setByPath } = useSettings()
  const messagesScrollRef = useTemplateRef<INmorphScrollExpose>('messagesScroll')
  const messagesBottomRef = useTemplateRef<HTMLElement>('messagesBottom')
  const hasInitialScrollSettled = ref(false)
  const showBackToBottomButton = ref(false)
  let messageVirtualizer: Ref<Virtualizer<HTMLElement, HTMLElement>> | null = null

  const setMessageVirtualizer = (virtualizer: Ref<Virtualizer<HTMLElement, HTMLElement>>) => {
    messageVirtualizer = virtualizer
  }

  const getMessagesScrollElement = () => messagesScrollRef.value?.scrollDOMContainer ?? null

  const getMessagesBottomDistance = () => {
    const scrollElement = getMessagesScrollElement()

    if (!scrollElement) return 0

    return Math.max(scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop, 0)
  }

  const isMessagesScrolledNearBottom = () => {
    const distanceFromBottom = getMessagesBottomDistance()

    return distanceFromBottom <= MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET
  }

  const updateBackToBottomButtonVisibility = () => {
    const distanceFromBottom = getMessagesBottomDistance()
    const hasBottomDistance = distanceFromBottom > MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET

    showBackToBottomButton.value = messageItemsQuantity.value > 0 && hasBottomDistance
  }

  const scrollMessagesToBottom = async () => {
    await nextTick()

    if (!messageItemsQuantity.value) return

    messagesBottomRef.value?.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'auto' })
    showBackToBottomButton.value = false
  }

  const hasSavedMessagesScrollState = (roomId: string) => roomId in settings.value.messageScrollByRoom

  const saveMessagesScrollTop = async (roomId: string, scrollTop: number) => {
    if (!roomId) return

    const currentScrollTop = settings.value.messageScrollByRoom[roomId]
    const nextScrollTop = Math.trunc(scrollTop)
    const hasSameScrollTop = currentScrollTop === nextScrollTop

    if (hasSameScrollTop) return

    await setByPath(`messageScrollByRoom.${roomId}`, nextScrollTop)
  }

  const saveMessagesScrollState = ({ y }: NmorphCoordsType) => {
    void saveMessagesScrollTop(room.value.id, y)
  }

  const saveCurrentMessagesScrollState = (roomId = room.value.id) => {
    const scrollElement = getMessagesScrollElement()

    if (!scrollElement) return

    void saveMessagesScrollTop(roomId, scrollElement.scrollTop)
  }

  const restoreMessagesScrollState = async (roomId = room.value.id) => {
    if (!hasSavedMessagesScrollState(roomId)) return false

    const virtualizer = messageVirtualizer?.value

    if (!virtualizer) return false

    await nextTick()

    const scrollTop = settings.value.messageScrollByRoom[roomId]

    virtualizer.scrollToOffset(scrollTop, { behavior: 'auto' })

    return true
  }

  const scrollMessagesToInitialPosition = async (roomId: string) => {
    if (hasSavedMessagesScrollState(roomId)) {
      await restoreMessagesScrollState(roomId)
      return
    }

    await scrollMessagesToBottom()
  }

  const runInitialMessagesScroll = async (
    roomId: string,
    previousRoomId: string | undefined,
    loadMessages: () => Promise<void>
  ) => {
    if (previousRoomId) {
      saveCurrentMessagesScrollState(previousRoomId)
    }

    hasInitialScrollSettled.value = false

    try {
      await loadMessages()
    } finally {
      if (room.value.id === roomId) {
        await scrollMessagesToInitialPosition(roomId)
        hasInitialScrollSettled.value = true
      }
    }
  }

  watch(messageItemsQuantity, (length, previousLength) => {
    if (length && !previousLength) {
      void scrollMessagesToInitialPosition(room.value.id)
    }
  })

  watch(displayedLastMessageId, (displayedLastMessageId, previousDisplayedLastMessageId) => {
    const hasDisplayedLastMessageChanged = previousDisplayedLastMessageId !== displayedLastMessageId
    const isInitialScrollSettled = hasInitialScrollSettled.value
    const isScrolledNearBottom = isMessagesScrolledNearBottom()
    const canAutoScrollToBottom = isInitialScrollSettled && hasDisplayedLastMessageChanged
    const shouldScrollToBottom = canAutoScrollToBottom && isScrolledNearBottom

    if (shouldScrollToBottom) {
      void scrollMessagesToBottom()
    }
  })

  onBeforeUnmount(saveCurrentMessagesScrollState)

  return {
    getMessagesScrollElement,
    runInitialMessagesScroll,
    saveMessagesScrollState,
    scrollMessagesToBottom,
    setMessageVirtualizer,
    showBackToBottomButton,
    updateBackToBottomButtonVisibility
  }
}
