import { describe, expect, it } from 'vitest'

import { toggleRoomCallUserFlag } from './room-call-runtime-state'

describe('room call runtime state helpers', () => {
  it('adds missing user flag without mutating source state', () => {
    const state = { 'user-1': true }

    expect(toggleRoomCallUserFlag(state, 'user-2')).toEqual({
      'user-1': true,
      'user-2': true
    })
    expect(state).toEqual({ 'user-1': true })
  })

  it('removes existing user flag without mutating source state', () => {
    const state = {
      'user-1': true,
      'user-2': true
    }

    expect(toggleRoomCallUserFlag(state, 'user-2')).toEqual({
      'user-1': true
    })
    expect(state).toEqual({
      'user-1': true,
      'user-2': true
    })
  })
})
