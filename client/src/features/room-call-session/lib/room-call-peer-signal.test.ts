import { describe, expect, it } from 'vitest'

import { isRoomCallIceCandidateSignal, isRoomCallSessionDescriptionSignal } from './room-call-peer-signal'

describe('room call peer signal helpers', () => {
  it('detects session description signals with SDP payload', () => {
    expect(isRoomCallSessionDescriptionSignal({ type: 'offer', sdp: 'v=0' }, 'offer')).toBe(true)
    expect(isRoomCallSessionDescriptionSignal({ type: 'answer', sdp: 'v=0' }, 'answer')).toBe(true)
  })

  it('rejects session description signals without SDP payload', () => {
    expect(isRoomCallSessionDescriptionSignal({ type: 'offer' }, 'offer')).toBe(false)
    expect(isRoomCallSessionDescriptionSignal({ type: 'offer', sdp: null }, 'offer')).toBe(false)
    expect(isRoomCallSessionDescriptionSignal({ type: 'answer', sdp: 'v=0' }, 'offer')).toBe(false)
  })

  it('detects ICE candidate signals', () => {
    expect(isRoomCallIceCandidateSignal({ candidate: 'candidate' })).toBe(true)
    expect(isRoomCallIceCandidateSignal({ candidate: null })).toBe(true)
    expect(isRoomCallIceCandidateSignal({ candidate: 1 })).toBe(false)
  })
})
