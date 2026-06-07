import { isNumber, isUnknownObject } from 'global-shared'

import {
  MESSAGE_SCROLL_STATE_MODE,
  type MessageScrollState,
  type MessageScrollStoredState
} from 'src/entities/setting'

export const buildMessageBottomScrollState = (): MessageScrollState => ({
  mode: MESSAGE_SCROLL_STATE_MODE.BOTTOM
})

export const buildMessageOffsetScrollState = (scrollTop: number): MessageScrollState => ({
  mode: MESSAGE_SCROLL_STATE_MODE.OFFSET,
  scrollTop: Math.trunc(scrollTop)
})

export const resolveMessageScrollState = (state?: MessageScrollStoredState): MessageScrollState | null => {
  if (isNumber(state)) {
    return buildMessageOffsetScrollState(state)
  }

  if (!isUnknownObject(state)) return null

  if (state.mode === MESSAGE_SCROLL_STATE_MODE.BOTTOM) {
    return buildMessageBottomScrollState()
  }

  const { mode, scrollTop } = state
  const isOffsetMode = mode === MESSAGE_SCROLL_STATE_MODE.OFFSET
  const hasScrollTop = isNumber(scrollTop)

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

  return resolvedCurrentState.scrollTop === nextState.scrollTop
}
