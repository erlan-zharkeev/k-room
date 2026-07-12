import type { INmorphScrollExpose, NmorphCoordsType } from '@nmorph/nmorph-ui-kit'
import type { Virtualizer } from '@tanstack/vue-virtual'
import type { ChatRoom, MediaObject, Message } from 'global-shared'
import {
  computed,
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

type MessageScrollSyncMediaObject = MediaObject & {
  aspectRatio?: number
  contentType?: string
  size?: number
}

const buildMessageScrollSyncMediaKey = (mediaObjects: MessageScrollSyncMediaObject[] = []) =>
  mediaObjects
    .map(({ aspectRatio, contentType, name, size, src }) =>
      [src, name, size ?? '', contentType ?? '', aspectRatio ?? ''].join(':')
    )
    .join('|')

const buildMessageScrollSyncReactionsKey = (message: Message) =>
  (message.reactions ?? []).map(({ authorId, glyphKey }) => `${authorId}:${glyphKey}`).join('|')

const buildMessageScrollSyncLinkPreviewKey = (message: Message) => {
  const { linkPreview } = message

  if (!linkPreview) return ''

  return [
    linkPreview.url,
    linkPreview.status,
    linkPreview.title ?? '',
    linkPreview.description ?? '',
    linkPreview.image?.src ?? '',
    linkPreview.image?.aspectRatio ?? ''
  ].join(':')
}

const buildMessageScrollSyncRepliedMessageKey = (message: Message) => {
  const { repliedMessage } = message

  if (!repliedMessage) return ''

  return [
    repliedMessage.id,
    repliedMessage.body,
    buildMessageScrollSyncMediaKey(repliedMessage.images),
    buildMessageScrollSyncMediaKey(repliedMessage.documents),
    buildMessageScrollSyncMediaKey(repliedMessage.audios),
    buildMessageScrollSyncMediaKey(repliedMessage.videos)
  ].join(':')
}

const buildMessageScrollSyncKey = (message: Message) =>
  [
    message.id,
    message.status ?? '',
    message.body,
    message.editedAt ?? '',
    buildMessageScrollSyncMediaKey(message.images),
    buildMessageScrollSyncMediaKey(message.documents),
    buildMessageScrollSyncMediaKey(message.audios),
    buildMessageScrollSyncMediaKey(message.videos),
    buildMessageScrollSyncReactionsKey(message),
    buildMessageScrollSyncLinkPreviewKey(message),
    buildMessageScrollSyncRepliedMessageKey(message)
  ].join('|')

export const useChatRoomMessageScrollManager = (
  room: Ref<ChatRoom>,
  displayedLastMessageId: ComputedRef<string | null>,
  messageList: ComputedRef<MessageListItem[]>,
  messageItemsQuantity: ComputedRef<number>,
  waitForMessagesScrollSettled: () => Promise<void>
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
  const displayedLastMessageScrollSyncState = computed(() => {
    const messageId = displayedLastMessageId.value
    const message = messageId ? messageById.value.get(messageId) : undefined

    if (!message) return null

    return {
      messageId,
      key: buildMessageScrollSyncKey(message)
    }
  })

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
    await nextTick()

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
        await waitForMessagesScrollSettled()
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

  watch(
    displayedLastMessageScrollSyncState,
    (nextScrollSyncState, previousScrollSyncState) => {
      if (!nextScrollSyncState || !previousScrollSyncState) return
      if (nextScrollSyncState.messageId !== previousScrollSyncState.messageId) return
      if (nextScrollSyncState.key === previousScrollSyncState.key) return
      if (!hasInitialScrollSettled.value) return
      if (!isMessagesScrolledNearBottom()) return

      void scrollMessagesToBottom()
    },
    { flush: 'pre' }
  )

  onActivated(() => {
    updateBackToBottomButtonVisibility()
  })
  onDeactivated(() => {
    saveCurrentMessagesScrollState()
  })
  onBeforeUnmount(() => {
    saveCurrentMessagesScrollState()
  })

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
