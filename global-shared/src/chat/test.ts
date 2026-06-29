import { describe, expect, it } from 'vitest'

import { getRoomInterlocutorId, getRoomOtherUserIds, isRoomFavorites, isRoomPrivate, isRoomSupport } from '../index'

describe('chat contracts', () => {
  it('resolves chat room user ids without including current user', () => {
    const room = {
      users: ['user-1', 'user-2', 'user-3']
    }

    expect(getRoomOtherUserIds(room, 'user-1')).toEqual(['user-2', 'user-3'])
    expect(getRoomInterlocutorId(room, 'user-1')).toBe('user-2')
  })

  it('keeps favorites rooms separate from direct private rooms', () => {
    expect(isRoomFavorites({ chatKind: 'favorites' })).toBe(true)
    expect(isRoomPrivate({ chatKind: 'favorites' })).toBe(false)
  })

  it('keeps support rooms separate from direct private rooms', () => {
    expect(isRoomSupport({ chatKind: 'support' })).toBe(true)
    expect(isRoomPrivate({ chatKind: 'support' })).toBe(false)
  })
})
