import { describe, expect, it } from 'vitest'

import { getRoomInterlocutorId, getRoomOtherUserIds } from '../index'

describe('chat contracts', () => {
  it('resolves chat room user ids without including current user', () => {
    const room = {
      users: ['user-1', 'user-2', 'user-3']
    }

    expect(getRoomOtherUserIds(room, 'user-1')).toEqual(['user-2', 'user-3'])
    expect(getRoomInterlocutorId(room, 'user-1')).toBe('user-2')
  })
})
