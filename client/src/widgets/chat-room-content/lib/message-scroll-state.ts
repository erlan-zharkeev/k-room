import { isNumber, isString, isUnknownObject } from 'global-shared'

import {
  MESSAGE_SCROLL_STATE_MODE,
  type MessageScrollAnchorState,
  type MessageScrollBottomState,
  type MessageScrollOffsetState,
  type MessageScrollState,
  type MessageScrollStoredState
} from 'src/entities/setting'

import type { MessageListItem, ResolveVisibleMessageScrollAnchorStateParams } from '../config/types'

export const buildMessageBottomScrollState = (): MessageScrollBottomState => ({
  mode: MESSAGE_SCROLL_STATE_MODE.BOTTOM
})

export const buildMessageAnchorScrollState = (messageId: string, offset: number): MessageScrollAnchorState => ({
  mode: MESSAGE_SCROLL_STATE_MODE.ANCHOR,
  messageId,
  offset: Math.trunc(offset)
})

export const buildMessageOffsetScrollState = (scrollTop: number): MessageScrollOffsetState => ({
  mode: MESSAGE_SCROLL_STATE_MODE.OFFSET,
  scrollTop: Math.trunc(scrollTop)
})

const isMessageVirtualItemVisible = (start: number, end: number, scrollTop: number, clientHeight: number) => {
  const viewportEnd = scrollTop + clientHeight
  const startsBeforeViewportEnd = start <= viewportEnd
  const endsAfterViewportStart = end >= scrollTop

  return startsBeforeViewportEnd && endsAfterViewportStart
}

export const findMessageScrollAnchorIndex = (messageList: MessageListItem[], messageId: string) =>
  messageList.findIndex((item) => item.type === 'message' && item.messageId === messageId)

export const resolveVisibleMessageScrollAnchorState = ({
  clientHeight,
  messageList,
  scrollTop,
  virtualItems
}: ResolveVisibleMessageScrollAnchorStateParams): MessageScrollAnchorState | null => {
  const virtualItem = virtualItems.find(({ end, index, start }) => {
    const item = messageList[index]

    if (!item) return false
    if (item.type !== 'message') return false

    return isMessageVirtualItemVisible(start, end, scrollTop, clientHeight)
  })

  if (!virtualItem) return null

  const item = messageList[virtualItem.index]

  if (!item || item.type !== 'message') return null

  return buildMessageAnchorScrollState(item.messageId, scrollTop - virtualItem.start)
}

export const resolveMessageScrollState = (state?: MessageScrollStoredState): MessageScrollState | null => {
  if (isNumber(state)) {
    return buildMessageOffsetScrollState(state)
  }

  if (!isUnknownObject(state)) return null

  if (state.mode === MESSAGE_SCROLL_STATE_MODE.BOTTOM) {
    return buildMessageBottomScrollState()
  }

  const { messageId, mode, offset, scrollTop } = state
  const isAnchorMode = mode === MESSAGE_SCROLL_STATE_MODE.ANCHOR
  const hasAnchorMessageId = isString(messageId)
  const hasAnchorOffset = isNumber(offset)
  const hasAnchorState = isAnchorMode && hasAnchorMessageId && hasAnchorOffset
  const isOffsetMode = mode === MESSAGE_SCROLL_STATE_MODE.OFFSET
  const hasScrollTop = isNumber(scrollTop)

  if (hasAnchorState) {
    return buildMessageAnchorScrollState(messageId, offset)
  }

  if (isOffsetMode && hasScrollTop) {
    return buildMessageOffsetScrollState(scrollTop)
  }

  return null
}

export const isSameMessageScrollState = (
  currentState: MessageScrollStoredState | undefined,
  nextState: MessageScrollState
) => {
  const resolvedCurrentState = resolveMessageScrollState(currentState)

  if (!resolvedCurrentState) return false
  if (resolvedCurrentState.mode !== nextState.mode) return false
  if (resolvedCurrentState.mode === MESSAGE_SCROLL_STATE_MODE.BOTTOM) return true
  if (
    resolvedCurrentState.mode === MESSAGE_SCROLL_STATE_MODE.ANCHOR &&
    nextState.mode === MESSAGE_SCROLL_STATE_MODE.ANCHOR
  ) {
    const hasSameMessageId = resolvedCurrentState.messageId === nextState.messageId
    const hasSameOffset = resolvedCurrentState.offset === nextState.offset

    return hasSameMessageId && hasSameOffset
  }

  if (
    resolvedCurrentState.mode !== MESSAGE_SCROLL_STATE_MODE.OFFSET ||
    nextState.mode !== MESSAGE_SCROLL_STATE_MODE.OFFSET
  ) {
    return false
  }

  return resolvedCurrentState.scrollTop === nextState.scrollTop
}
