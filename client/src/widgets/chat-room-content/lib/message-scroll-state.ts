import { isNumber, isString, isUnknownObject } from 'global-shared'

import {
  MESSAGE_SCROLL_STATE_MODE,
  type MessageScrollAnchorState,
  type MessageScrollBottomState,
  type MessageScrollState
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

export const resolveMessageScrollState = (state?: unknown): MessageScrollState | null => {
  if (!isUnknownObject(state)) return null

  if (state.mode === MESSAGE_SCROLL_STATE_MODE.BOTTOM) {
    return buildMessageBottomScrollState()
  }

  const { messageId, mode, offset } = state
  const isAnchorMode = mode === MESSAGE_SCROLL_STATE_MODE.ANCHOR
  const hasAnchorMessageId = isString(messageId)
  const hasAnchorOffset = isNumber(offset)
  const hasAnchorState = isAnchorMode && hasAnchorMessageId && hasAnchorOffset

  if (hasAnchorState) {
    return buildMessageAnchorScrollState(messageId, offset)
  }

  return null
}

export const isSameMessageScrollState = (currentState: unknown, nextState: MessageScrollState) => {
  const resolvedCurrentState = resolveMessageScrollState(currentState)

  if (!resolvedCurrentState) return false
  if (resolvedCurrentState.mode !== nextState.mode) return false
  if (resolvedCurrentState.mode === MESSAGE_SCROLL_STATE_MODE.BOTTOM) return true
  if (nextState.mode !== MESSAGE_SCROLL_STATE_MODE.ANCHOR) return false

  const hasSameMessageId = resolvedCurrentState.messageId === nextState.messageId
  const hasSameOffset = resolvedCurrentState.offset === nextState.offset

  return hasSameMessageId && hasSameOffset
}
