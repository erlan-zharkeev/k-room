import type { INmorphScrollExpose, NmorphCoordsType } from '@nmorph/nmorph-ui-kit'
import type { Virtualizer } from '@tanstack/vue-virtual'
import type { ChatRoom } from 'global-shared'
import {
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
  useTemplateRef,
  watch,
  type ComputedRef,
  type Ref
} from 'vue'

import { useMessage } from 'src/entities/message'
import { useSettings, type MessageScrollAnchorState, type MessageScrollBottomState } from 'src/entities/setting'

import { MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET } from '../config/constants'
import type { MessageListItem } from '../config/types'
import {
  buildMessageBottomScrollState,
  findMessageScrollAnchorIndex,
  isSameMessageScrollState,
  resolveMessageScrollState,
  resolveVisibleMessageScrollAnchorState
} from '../lib/message-scroll-state'
import { waitMessageScrollRestoreStabilization } from '../lib/wait-message-scroll-restore-stabilization'

export const useChatRoomMessageScrollManager = (
  room: Ref<ChatRoom>,
  displayedLastMessageId: ComputedRef<string | null>,
  messageList: ComputedRef<MessageListItem[]>,
  messageItemsQuantity: ComputedRef<number>
) => {
  const { messageById } = useMessage()
  const { settings, setByPath } = useSettings()
  const messagesScrollRef = useTemplateRef<INmorphScrollExpose>('messagesScroll')
  const messagesBottomRef = useTemplateRef<HTMLElement>('messagesBottom')
  const hasInitialScrollSettled = ref(false)
  const isInitialScrollStateSaveLocked = ref(false)
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

  const isMessageSelf = (messageId: string | null) => Boolean(messageId && messageById.value.get(messageId)?.isSelf)

  const updateBackToBottomButtonVisibility = () => {
    const distanceFromBottom = getMessagesBottomDistance()
    const hasBottomDistance = distanceFromBottom > MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET

    showBackToBottomButton.value = messageItemsQuantity.value > 0 && hasBottomDistance
  }

  const scrollMessagesToMaxOffset = async () => {
    const scrollElement = getMessagesScrollElement()

    if (!scrollElement) return

    const maxScrollTop = Math.max(scrollElement.scrollHeight - scrollElement.clientHeight, 0)

    messageVirtualizer?.value.scrollToOffset(maxScrollTop, { behavior: 'auto' })
    scrollElement.scrollTop = maxScrollTop

    await nextTick()
    await waitMessageScrollRestoreStabilization()
  }

  const scrollMessagesToBottom = async () => {
    await nextTick()

    if (!messageItemsQuantity.value) return

    const virtualizer = messageVirtualizer?.value
    const lastItemIndex = messageList.value.length - 1

    if (virtualizer && lastItemIndex >= 0) {
      virtualizer.scrollToIndex(lastItemIndex, { align: 'end', behavior: 'auto' })
      await nextTick()
      await waitMessageScrollRestoreStabilization()
      await scrollMessagesToMaxOffset()
      await scrollMessagesToMaxOffset()
    } else {
      messagesBottomRef.value?.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'auto' })
    }

    showBackToBottomButton.value = false
  }

  const hasSavedMessagesScrollState = (roomId: string) =>
    Boolean(resolveMessageScrollState(settings.value.messageScrollByRoom[roomId]))

  const getSavedMessagesScrollAnchorMessageId = (roomId = room.value.id) => {
    const scrollState = resolveMessageScrollState(settings.value.messageScrollByRoom[roomId])

    if (scrollState?.mode !== 'anchor') return null

    return scrollState.messageId
  }

  const isMessagesScrollStateSaveLocked = () => {
    const isInitialScrollRunning = !hasInitialScrollSettled.value

    return isInitialScrollRunning || isInitialScrollStateSaveLocked.value
  }

  const buildNextMessagesScrollState = (
    scrollTop: number
  ): MessageScrollAnchorState | MessageScrollBottomState | null => {
    if (isMessagesScrolledNearBottom()) {
      return buildMessageBottomScrollState()
    }

    const scrollElement = getMessagesScrollElement()
    const virtualizer = messageVirtualizer?.value

    if (!scrollElement || !virtualizer) {
      return null
    }

    const anchorState = resolveVisibleMessageScrollAnchorState({
      clientHeight: scrollElement.clientHeight,
      messageList: messageList.value,
      scrollTop,
      virtualItems: virtualizer.getVirtualItems()
    })

    return anchorState
  }

  const saveMessagesScrollPositionState = async (roomId: string, scrollTop: number) => {
    if (!roomId) return

    const currentScrollState = settings.value.messageScrollByRoom[roomId]
    const nextScrollState = buildNextMessagesScrollState(scrollTop)

    if (!nextScrollState) return
    if (isSameMessageScrollState(currentScrollState, nextScrollState)) return

    await setByPath(`messageScrollByRoom.${roomId}`, nextScrollState)
  }

  const saveMessagesScrollState = ({ y }: NmorphCoordsType) => {
    if (isMessagesScrollStateSaveLocked()) return

    void saveMessagesScrollPositionState(room.value.id, y)
  }

  const saveCurrentMessagesScrollState = (roomId = room.value.id) => {
    if (isMessagesScrollStateSaveLocked()) return

    const scrollElement = getMessagesScrollElement()

    if (!scrollElement) return

    void saveMessagesScrollPositionState(roomId, scrollElement.scrollTop)
  }

  const restoreMessagesAnchorScrollState = async (
    scrollState: MessageScrollAnchorState,
    virtualizer: Virtualizer<HTMLElement, HTMLElement>
  ) => {
    const anchorIndex = findMessageScrollAnchorIndex(messageList.value, scrollState.messageId)

    if (anchorIndex === -1) return false

    virtualizer.scrollToIndex(anchorIndex, { align: 'start', behavior: 'auto' })
    await nextTick()
    await waitMessageScrollRestoreStabilization()

    const anchorVirtualItem = virtualizer.getVirtualItems().find(({ index }) => index === anchorIndex)

    if (!anchorVirtualItem) return false

    const scrollTop = anchorVirtualItem.start + scrollState.offset

    virtualizer.scrollToOffset(scrollTop, { behavior: 'auto' })

    return true
  }

  const restoreMessagesScrollState = async (roomId = room.value.id) => {
    if (!hasSavedMessagesScrollState(roomId)) return false

    await nextTick()

    const scrollState = resolveMessageScrollState(settings.value.messageScrollByRoom[roomId])

    if (!scrollState) return false

    if (scrollState.mode === 'bottom') {
      await scrollMessagesToBottom()
      return true
    }

    const virtualizer = messageVirtualizer?.value

    if (!virtualizer) return false

    return restoreMessagesAnchorScrollState(scrollState, virtualizer)
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
    isInitialScrollStateSaveLocked.value = true

    try {
      await loadMessages()
    } finally {
      const isSameRoomBeforeInitialScroll = room.value.id === roomId

      if (isSameRoomBeforeInitialScroll) {
        await scrollMessagesToInitialPosition(roomId)
        await waitMessageScrollRestoreStabilization()

        const isSameRoomAfterInitialScroll = room.value.id === roomId

        if (isSameRoomAfterInitialScroll) {
          hasInitialScrollSettled.value = true
          isInitialScrollStateSaveLocked.value = false
        }
      }
    }
  }

  watch(messageItemsQuantity, (length, previousLength) => {
    const shouldScrollInitialFilledList = length && !previousLength && !isMessagesScrollStateSaveLocked()

    if (shouldScrollInitialFilledList) {
      void scrollMessagesToInitialPosition(room.value.id)
    }
  })

  watch(displayedLastMessageId, (nextDisplayedLastMessageId, previousDisplayedLastMessageId) => {
    const hasDisplayedLastMessageChanged = previousDisplayedLastMessageId !== nextDisplayedLastMessageId
    const isInitialScrollSettled = hasInitialScrollSettled.value
    const isOwnDisplayedLastMessage = isMessageSelf(nextDisplayedLastMessageId)
    const isScrolledNearBottom = isMessagesScrolledNearBottom()
    const canAutoScrollToBottom = isInitialScrollSettled && hasDisplayedLastMessageChanged
    const shouldAutoScrollToBottom = isOwnDisplayedLastMessage || isScrolledNearBottom
    const shouldScrollToBottom = canAutoScrollToBottom && shouldAutoScrollToBottom

    if (shouldScrollToBottom) {
      void scrollMessagesToBottom()
    }
  })

  onActivated(updateBackToBottomButtonVisibility)
  onDeactivated(() => saveCurrentMessagesScrollState())
  onBeforeUnmount(() => saveCurrentMessagesScrollState())

  return {
    getMessagesScrollElement,
    getSavedMessagesScrollAnchorMessageId,
    runInitialMessagesScroll,
    saveMessagesScrollState,
    scrollMessagesToBottom,
    setMessageVirtualizer,
    showBackToBottomButton,
    updateBackToBottomButtonVisibility
  }
}
