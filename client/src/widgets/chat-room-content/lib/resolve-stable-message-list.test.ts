import { describe, expect, it } from 'vitest'

import type { MessageListItem } from '../config/types'

import { resolveStableMessageList } from './resolve-stable-message-list'

describe('resolveStableMessageList', () => {
  it('keeps the previous list reference when item structure is the same', () => {
    const previousMessageList: MessageListItem[] = [
      { type: 'date-separator', id: 'date-separator-message-1', label: 'Today' },
      { type: 'message', id: 'message-1', messageId: 'message-1' }
    ]
    const nextMessageList: MessageListItem[] = [
      { type: 'date-separator', id: 'date-separator-message-1', label: 'Today' },
      { type: 'message', id: 'message-1', messageId: 'message-1' }
    ]

    expect(resolveStableMessageList(nextMessageList, previousMessageList)).toBe(previousMessageList)
  })

  it('uses the next list when a date separator label changes', () => {
    const previousMessageList: MessageListItem[] = [
      { type: 'date-separator', id: 'date-separator-message-1', label: 'Today' }
    ]
    const nextMessageList: MessageListItem[] = [
      { type: 'date-separator', id: 'date-separator-message-1', label: 'Tomorrow' }
    ]

    expect(resolveStableMessageList(nextMessageList, previousMessageList)).toBe(nextMessageList)
  })

  it('uses the next list when items are added', () => {
    const previousMessageList: MessageListItem[] = [{ type: 'message', id: 'message-1', messageId: 'message-1' }]
    const nextMessageList: MessageListItem[] = [
      { type: 'message', id: 'message-1', messageId: 'message-1' },
      { type: 'message', id: 'message-2', messageId: 'message-2' }
    ]

    expect(resolveStableMessageList(nextMessageList, previousMessageList)).toBe(nextMessageList)
  })
})
