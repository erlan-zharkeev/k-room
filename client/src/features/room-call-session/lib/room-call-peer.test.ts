import { describe, expect, it, vi } from 'vitest'

import { syncRoomCallPeerLocalTracks } from './room-call-peer'

interface TestSender {
  track: MediaStreamTrack | null
  replaceTrack: ReturnType<typeof vi.fn>
}

const createTrack = (id: string, kind: MediaStreamTrack['kind']) =>
  ({
    id,
    kind
  } as MediaStreamTrack)

const createStream = (...tracks: MediaStreamTrack[]) =>
  ({
    getTracks: () => tracks
  } as MediaStream)

const createSender = (track: MediaStreamTrack | null) => {
  const sender = {
    track,
    replaceTrack: vi.fn(async (nextTrack: MediaStreamTrack | null) => {
      sender.track = nextTrack
    })
  } satisfies TestSender

  return sender
}

const createPeerConnection = (senders: TestSender[]) => {
  const peerConnection = {
    addTrack: vi.fn((track: MediaStreamTrack) => {
      const sender = createSender(track)

      senders.push(sender)

      return sender
    }),
    getSenders: vi.fn(() => senders as unknown as RTCRtpSender[]),
    removeTrack: vi.fn((sender: RTCRtpSender) => {
      const index = senders.indexOf(sender as unknown as TestSender)

      if (index >= 0) {
        senders.splice(index, 1)
      }
    })
  } as unknown as RTCPeerConnection & {
    addTrack: ReturnType<typeof vi.fn>
    getSenders: ReturnType<typeof vi.fn>
    removeTrack: ReturnType<typeof vi.fn>
  }

  return peerConnection
}

describe('room call peer helpers', () => {
  it('replaces a same-kind local track without renegotiation', async () => {
    const oldVideoTrack = createTrack('old-video', 'video')
    const nextVideoTrack = createTrack('next-video', 'video')
    const sender = createSender(oldVideoTrack)
    const peerConnection = createPeerConnection([sender])

    await expect(syncRoomCallPeerLocalTracks(peerConnection, [createStream(nextVideoTrack)])).resolves.toBe(false)

    expect(sender.replaceTrack).toHaveBeenCalledWith(nextVideoTrack)
    expect(peerConnection.removeTrack).not.toHaveBeenCalled()
    expect(peerConnection.addTrack).not.toHaveBeenCalled()
  })

  it('replaces only the changed audio track without touching video', async () => {
    const oldAudioTrack = createTrack('old-audio', 'audio')
    const oldVideoTrack = createTrack('old-video', 'video')
    const nextAudioTrack = createTrack('next-audio', 'audio')
    const audioSender = createSender(oldAudioTrack)
    const videoSender = createSender(oldVideoTrack)
    const peerConnection = createPeerConnection([audioSender, videoSender])

    await expect(
      syncRoomCallPeerLocalTracks(peerConnection, [createStream(nextAudioTrack), createStream(oldVideoTrack)])
    ).resolves.toBe(false)

    expect(audioSender.replaceTrack).toHaveBeenCalledWith(nextAudioTrack)
    expect(videoSender.replaceTrack).not.toHaveBeenCalled()
    expect(peerConnection.removeTrack).not.toHaveBeenCalled()
    expect(peerConnection.addTrack).not.toHaveBeenCalled()
  })

  it('adds new local tracks with renegotiation', async () => {
    const videoTrack = createTrack('video', 'video')
    const peerConnection = createPeerConnection([])

    await expect(syncRoomCallPeerLocalTracks(peerConnection, [createStream(videoTrack)])).resolves.toBe(true)

    expect(peerConnection.addTrack).toHaveBeenCalledWith(videoTrack, expect.anything())
  })

  it('removes missing local tracks with renegotiation', async () => {
    const sender = createSender(createTrack('old-video', 'video'))
    const peerConnection = createPeerConnection([sender])

    await expect(syncRoomCallPeerLocalTracks(peerConnection, [])).resolves.toBe(true)

    expect(peerConnection.removeTrack).toHaveBeenCalledWith(sender)
  })
})
