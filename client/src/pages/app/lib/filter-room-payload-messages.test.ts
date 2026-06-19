import { describe, expect, it } from 'vitest'

import { filterRoomPayloadMessages } from './filter-room-payload-messages'

describe('filterRoomPayloadMessages', () => {
  it('filters preview-only fields from room payloads before cache sync', () => {
    expect(
      filterRoomPayloadMessages({
        id: 'room-1',
        users: ['user-1'],
        messages: ['message-1'],
        pinnedMessage: { id: 'message-1' },
        previewMessage: { id: 'message-1' }
      } as never)
    ).toEqual({
      id: 'room-1',
      users: ['user-1'],
      messages: ['message-1']
    })
  })
})
