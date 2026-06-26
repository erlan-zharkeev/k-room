import { describe, expect, it } from 'vitest'

import { hasRoomCallAudioOutputStream } from './room-call-audio-output'

const createMediaStreamStub = (audioTrackQuantity: number) =>
  ({
    getAudioTracks: () => Array.from({ length: audioTrackQuantity })
  } as MediaStream)

describe('room call audio output helpers', () => {
  it('detects streams with audio tracks', () => {
    expect(hasRoomCallAudioOutputStream(createMediaStreamStub(1))).toBe(true)
  })

  it('rejects missing streams and streams without audio tracks', () => {
    expect(hasRoomCallAudioOutputStream(undefined)).toBe(false)
    expect(hasRoomCallAudioOutputStream(createMediaStreamStub(0))).toBe(false)
  })
})
