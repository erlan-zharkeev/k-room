import { describe, expect, it } from 'vitest'

import {
  getRoomInterlocutorId,
  getRoomOtherUserIds,
  isRoomFavorites,
  isRoomPrivate,
  isRoomSupport,
  isRoomVisibleForUser
} from '../index'

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

  it('keeps non-support rooms visible for any user role', () => {
    expect(isRoomVisibleForUser({ chatKind: 'direct', unreadMessagesQuantity: 0 }, 'user-1', 'user')).toBe(true)
    expect(isRoomVisibleForUser({ chatKind: 'group', unreadMessagesQuantity: 0 }, 'admin-1', 'admin')).toBe(true)
  })

  it('shows support rooms to admins only while they are open', () => {
    expect(
      isRoomVisibleForUser(
        { chatKind: 'support', supportOwnerId: 'user-1', supportStatus: 'open', unreadMessagesQuantity: 0 },
        'admin-1',
        'admin'
      )
    ).toBe(true)
    expect(
      isRoomVisibleForUser(
        { chatKind: 'support', supportOwnerId: 'user-1', supportStatus: 'closed', unreadMessagesQuantity: 5 },
        'admin-1',
        'admin'
      )
    ).toBe(false)
  })

  it('shows closed support rooms to owners only while they have unread messages', () => {
    expect(
      isRoomVisibleForUser(
        { chatKind: 'support', supportOwnerId: 'user-1', supportStatus: 'open', unreadMessagesQuantity: 0 },
        'user-1',
        'user'
      )
    ).toBe(true)
    expect(
      isRoomVisibleForUser(
        { chatKind: 'support', supportOwnerId: 'user-1', supportStatus: 'closed', unreadMessagesQuantity: 1 },
        'user-1',
        'user'
      )
    ).toBe(true)
    expect(
      isRoomVisibleForUser(
        { chatKind: 'support', supportOwnerId: 'user-1', supportStatus: 'closed', unreadMessagesQuantity: 0 },
        'user-1',
        'user'
      )
    ).toBe(false)
  })

  it('hides support rooms from non-owner users', () => {
    expect(
      isRoomVisibleForUser(
        { chatKind: 'support', supportOwnerId: 'user-1', supportStatus: 'open', unreadMessagesQuantity: 1 },
        'user-2',
        'user'
      )
    ).toBe(false)
  })
})
