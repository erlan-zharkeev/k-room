import type { INmorphScrollExpose, NmorphCoordsType } from '@nmorph/nmorph-ui-kit'
import type { Virtualizer } from '@tanstack/vue-virtual'
import type { ChatRoom } from 'global-shared'
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch, type ComputedRef, type Ref } from 'vue'

import { MESSAGE_SCROLL_STATE_MODE, useSettings } from 'src/entities/setting'

import { MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET, MESSAGE_SCROLL_LOG_REASON } from '../config/constants'
import { logMessageScrollDebug } from '../lib/log-message-scroll-debug'
import {
  buildMessageBottomScrollState,
  buildMessageOffsetScrollState,
  isSameMessageScrollState,
  resolveMessageScrollState
} from '../lib/message-scroll-state'
import { waitMessageScrollRestoreStabilization } from '../lib/wait-message-scroll-restore-stabilization'

export const useChatRoomMessageScrollManager = (
  room: Ref<ChatRoom>,
  displayedLastMessageId: ComputedRef<string | null>,
  messageItemsQuantity: ComputedRef<number>
) => {
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

  const getMessagesScrollDebugPayload = () => {
    const scrollElement = getMessagesScrollElement()

    if (!scrollElement) {
      return {
        hasScrollElement: false,
        hasInitialScrollSettled: hasInitialScrollSettled.value,
        isInitialScrollStateSaveLocked: isInitialScrollStateSaveLocked.value,
        messageItemsQuantity: messageItemsQuantity.value,
        roomId: room.value.id,
        showBackToBottomButton: showBackToBottomButton.value
      }
    }

    return {
      bottomDistance: Math.max(scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop, 0),
      clientHeight: scrollElement.clientHeight,
      hasScrollElement: true,
      hasInitialScrollSettled: hasInitialScrollSettled.value,
      isInitialScrollStateSaveLocked: isInitialScrollStateSaveLocked.value,
      messageItemsQuantity: messageItemsQuantity.value,
      roomId: room.value.id,
      scrollHeight: scrollElement.scrollHeight,
      scrollTop: scrollElement.scrollTop,
      showBackToBottomButton: showBackToBottomButton.value
    }
  }

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
    const previousValue = showBackToBottomButton.value

    showBackToBottomButton.value = messageItemsQuantity.value > 0 && hasBottomDistance

    if (previousValue !== showBackToBottomButton.value) {
      logMessageScrollDebug('back-to-bottom-visibility-changed', {
        ...getMessagesScrollDebugPayload(),
        distanceFromBottom,
        hasBottomDistance,
        nextValue: showBackToBottomButton.value,
        previousValue
      })
    }
  }

  const scrollMessagesToBottom = async (reason = MESSAGE_SCROLL_LOG_REASON.USER_BACK_TO_BOTTOM) => {
    logMessageScrollDebug('scroll-to-bottom-requested', {
      ...getMessagesScrollDebugPayload(),
      reason
    })

    await nextTick()

    if (!messageItemsQuantity.value) {
      logMessageScrollDebug('scroll-to-bottom-skipped-empty-list', {
        ...getMessagesScrollDebugPayload(),
        reason
      })
      return
    }

    logMessageScrollDebug('scroll-to-bottom-before-scroll-into-view', {
      ...getMessagesScrollDebugPayload(),
      reason
    })
    messagesBottomRef.value?.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'auto' })
    showBackToBottomButton.value = false
    logMessageScrollDebug('scroll-to-bottom-after-scroll-into-view', {
      ...getMessagesScrollDebugPayload(),
      reason
    })
  }

  const hasSavedMessagesScrollState = (roomId: string) =>
    Boolean(resolveMessageScrollState(settings.value.messageScrollByRoom[roomId]))

  const isMessagesScrollStateSaveLocked = () => {
    const isInitialScrollRunning = !hasInitialScrollSettled.value

    return isInitialScrollRunning || isInitialScrollStateSaveLocked.value
  }

  const saveMessagesScrollTop = async (roomId: string, scrollTop: number) => {
    if (!roomId) {
      logMessageScrollDebug('save-scroll-top-skipped-empty-room', {
        ...getMessagesScrollDebugPayload(),
        scrollTop
      })
      return
    }

    const currentScrollState = settings.value.messageScrollByRoom[roomId]
    const isNearBottom = isMessagesScrolledNearBottom()
    const nextScrollState = isNearBottom ? buildMessageBottomScrollState() : buildMessageOffsetScrollState(scrollTop)
    const hasSameScrollState = isSameMessageScrollState(currentScrollState, nextScrollState)

    if (hasSameScrollState) {
      logMessageScrollDebug('save-scroll-top-skipped-same-value', {
        ...getMessagesScrollDebugPayload(),
        currentScrollState,
        nextScrollState,
        targetRoomId: roomId
      })
      return
    }

    logMessageScrollDebug('save-scroll-top-commit', {
      ...getMessagesScrollDebugPayload(),
      currentScrollState,
      nextScrollState,
      targetRoomId: roomId
    })
    await setByPath(`messageScrollByRoom.${roomId}`, nextScrollState)
  }

  const saveMessagesScrollState = ({ y }: NmorphCoordsType) => {
    if (isMessagesScrollStateSaveLocked()) {
      logMessageScrollDebug('save-scroll-state-skipped-initial-restore', {
        ...getMessagesScrollDebugPayload(),
        eventY: y
      })
      return
    }

    logMessageScrollDebug('save-scroll-state-event', {
      ...getMessagesScrollDebugPayload(),
      eventY: y
    })
    void saveMessagesScrollTop(room.value.id, y)
  }

  const saveCurrentMessagesScrollState = (roomId = room.value.id) => {
    if (isMessagesScrollStateSaveLocked()) {
      logMessageScrollDebug('save-current-scroll-state-skipped-initial-restore', {
        ...getMessagesScrollDebugPayload(),
        targetRoomId: roomId
      })
      return
    }

    const scrollElement = getMessagesScrollElement()

    if (!scrollElement) {
      logMessageScrollDebug('save-current-scroll-state-skipped-no-element', {
        ...getMessagesScrollDebugPayload(),
        targetRoomId: roomId
      })
      return
    }

    logMessageScrollDebug('save-current-scroll-state', {
      ...getMessagesScrollDebugPayload(),
      targetRoomId: roomId
    })
    void saveMessagesScrollTop(roomId, scrollElement.scrollTop)
  }

  const restoreMessagesScrollState = async (roomId = room.value.id) => {
    if (!hasSavedMessagesScrollState(roomId)) {
      logMessageScrollDebug('restore-scroll-state-skipped-no-saved-state', {
        ...getMessagesScrollDebugPayload(),
        targetRoomId: roomId
      })
      return false
    }

    await nextTick()

    const scrollState = resolveMessageScrollState(settings.value.messageScrollByRoom[roomId])

    if (!scrollState) {
      logMessageScrollDebug('restore-scroll-state-skipped-invalid-saved-state', {
        ...getMessagesScrollDebugPayload(),
        targetRoomId: roomId
      })
      return false
    }

    if (scrollState.mode === MESSAGE_SCROLL_STATE_MODE.BOTTOM) {
      logMessageScrollDebug('restore-scroll-state-before-scroll-to-bottom', {
        ...getMessagesScrollDebugPayload(),
        scrollState,
        targetRoomId: roomId
      })
      await scrollMessagesToBottom(MESSAGE_SCROLL_LOG_REASON.RESTORE_TO_BOTTOM)
      logMessageScrollDebug('restore-scroll-state-after-scroll-to-bottom', {
        ...getMessagesScrollDebugPayload(),
        scrollState,
        targetRoomId: roomId
      })
      return true
    }

    const virtualizer = messageVirtualizer?.value

    if (!virtualizer) {
      logMessageScrollDebug('restore-scroll-state-skipped-no-virtualizer', {
        ...getMessagesScrollDebugPayload(),
        targetRoomId: roomId
      })
      return false
    }

    logMessageScrollDebug('restore-scroll-state-before-scroll-to-offset', {
      ...getMessagesScrollDebugPayload(),
      scrollState,
      targetRoomId: roomId
    })
    virtualizer.scrollToOffset(scrollState.scrollTop, { behavior: 'auto' })
    logMessageScrollDebug('restore-scroll-state-after-scroll-to-offset', {
      ...getMessagesScrollDebugPayload(),
      scrollState,
      targetRoomId: roomId
    })

    return true
  }

  const scrollMessagesToInitialPosition = async (roomId: string) => {
    if (hasSavedMessagesScrollState(roomId)) {
      logMessageScrollDebug('initial-scroll-restore-saved-state', {
        ...getMessagesScrollDebugPayload(),
        targetRoomId: roomId
      })
      await restoreMessagesScrollState(roomId)
      return
    }

    logMessageScrollDebug('initial-scroll-to-bottom', {
      ...getMessagesScrollDebugPayload(),
      targetRoomId: roomId
    })
    await scrollMessagesToBottom(MESSAGE_SCROLL_LOG_REASON.INITIAL_TO_BOTTOM)
  }

  const runInitialMessagesScroll = async (
    roomId: string,
    previousRoomId: string | undefined,
    loadMessages: () => Promise<void>
  ) => {
    logMessageScrollDebug('initial-scroll-run-started', {
      ...getMessagesScrollDebugPayload(),
      previousRoomId,
      targetRoomId: roomId
    })

    if (previousRoomId) {
      saveCurrentMessagesScrollState(previousRoomId)
    }

    hasInitialScrollSettled.value = false
    isInitialScrollStateSaveLocked.value = true

    try {
      await loadMessages()
    } finally {
      const isSameRoomBeforeInitialScroll = room.value.id === roomId

      if (!isSameRoomBeforeInitialScroll) {
        logMessageScrollDebug('initial-scroll-run-skipped-stale-room', {
          ...getMessagesScrollDebugPayload(),
          currentRoomId: room.value.id,
          targetRoomId: roomId
        })
      } else {
        await scrollMessagesToInitialPosition(roomId)
        await waitMessageScrollRestoreStabilization()

        const isSameRoomAfterInitialScroll = room.value.id === roomId

        if (isSameRoomAfterInitialScroll) {
          hasInitialScrollSettled.value = true
          isInitialScrollStateSaveLocked.value = false
          logMessageScrollDebug('initial-scroll-run-settled', {
            ...getMessagesScrollDebugPayload(),
            targetRoomId: roomId
          })
        } else {
          logMessageScrollDebug('initial-scroll-run-skipped-stale-room', {
            ...getMessagesScrollDebugPayload(),
            currentRoomId: room.value.id,
            targetRoomId: roomId
          })
        }
      }
    }
  }

  watch(messageItemsQuantity, (length, previousLength) => {
    logMessageScrollDebug('message-items-quantity-changed', {
      ...getMessagesScrollDebugPayload(),
      length,
      previousLength
    })

    if (length && !previousLength) {
      logMessageScrollDebug('message-items-quantity-initial-scroll-requested', {
        ...getMessagesScrollDebugPayload(),
        reason: MESSAGE_SCROLL_LOG_REASON.INITIAL_EMPTY_LIST_FILLED
      })
      void scrollMessagesToInitialPosition(room.value.id)
    }
  })

  watch(displayedLastMessageId, (displayedLastMessageId, previousDisplayedLastMessageId) => {
    const hasDisplayedLastMessageChanged = previousDisplayedLastMessageId !== displayedLastMessageId
    const isInitialScrollSettled = hasInitialScrollSettled.value
    const isScrolledNearBottom = isMessagesScrolledNearBottom()
    const canAutoScrollToBottom = isInitialScrollSettled && hasDisplayedLastMessageChanged
    const shouldScrollToBottom = canAutoScrollToBottom && isScrolledNearBottom

    logMessageScrollDebug('displayed-last-message-watch', {
      ...getMessagesScrollDebugPayload(),
      canAutoScrollToBottom,
      displayedLastMessageId,
      hasDisplayedLastMessageChanged,
      isInitialScrollSettled,
      isScrolledNearBottom,
      previousDisplayedLastMessageId,
      shouldScrollToBottom
    })

    if (shouldScrollToBottom) {
      void scrollMessagesToBottom(MESSAGE_SCROLL_LOG_REASON.DISPLAYED_LAST_MESSAGE_CHANGED)
    }
  })

  onBeforeUnmount(() => {
    logMessageScrollDebug('before-unmount-save-current-scroll-state', getMessagesScrollDebugPayload())
    saveCurrentMessagesScrollState()
  })

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
