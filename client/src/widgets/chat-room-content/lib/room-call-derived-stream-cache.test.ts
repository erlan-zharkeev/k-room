import { afterEach, describe, expect, it, vi } from 'vitest'

import { createRoomCallDerivedStreamCache } from './room-call-derived-stream-cache'

class MediaStreamStub {
  constructor(public tracks: MediaStreamTrack[]) {}
}

const createTrack = (id: string) => ({ id } as MediaStreamTrack)

describe('room call derived stream cache', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('keeps the same stream while track ids stay unchanged', () => {
    vi.stubGlobal('MediaStream', MediaStreamStub)

    const cache = createRoomCallDerivedStreamCache()
    const tracks = [createTrack('audio-1'), createTrack('video-1')]
    const firstStream = cache.resolve('user-1', tracks)
    const nextStream = cache.resolve('user-1', [...tracks])

    expect(nextStream).toBe(firstStream)
  })

  it('creates a new stream when track ids change', () => {
    vi.stubGlobal('MediaStream', MediaStreamStub)

    const cache = createRoomCallDerivedStreamCache()
    const firstStream = cache.resolve('user-1', [createTrack('audio-1')])
    const nextStream = cache.resolve('user-1', [createTrack('audio-2')])

    expect(nextStream).not.toBe(firstStream)
  })
})
