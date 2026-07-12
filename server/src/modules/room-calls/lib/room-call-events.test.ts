import { beforeEach, describe, expect, it, vi } from 'vitest'

const ioMock = vi.hoisted(() => ({
  emitWithAck: vi.fn(),
  timeout: vi.fn(),
  to: vi.fn()
}))

vi.mock('src/shared/lib/io', () => ({ getIO: () => ioMock }))
vi.mock('src/shared/lib/transport-meta', () => ({ buildTransportMeta: () => ({ clientVersion: '1.0.0' }) }))

const { emitRoomCallSignalReceived } = await import('./room-call-events')

describe('emitRoomCallSignalReceived', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ioMock.timeout.mockReturnValue(ioMock)
    ioMock.to.mockReturnValue(ioMock)
  })

  it('waits for the target client acknowledgement', async () => {
    const payload = {
      fromUserId: 'user-1',
      roomCallId: 'call-1',
      signal: { type: 'answer' },
      signalId: 'signal-1',
      signalKind: 'answer' as const
    }

    ioMock.emitWithAck.mockResolvedValue([true])

    await expect(emitRoomCallSignalReceived('socket-2', payload)).resolves.toBe(true)
    expect(ioMock.to).toHaveBeenCalledWith('socket-2')
    expect(ioMock.emitWithAck).toHaveBeenCalledWith('room-call-signal-received', payload, { clientVersion: '1.0.0' })
  })

  it('reports missing recipient acknowledgements', async () => {
    ioMock.emitWithAck.mockResolvedValue([])

    await expect(
      emitRoomCallSignalReceived('socket-2', {
        fromUserId: 'user-1',
        roomCallId: 'call-1',
        signal: { type: 'offer' },
        signalId: 'signal-1',
        signalKind: 'offer'
      })
    ).resolves.toBe(false)
  })

  it('treats recipient acknowledgement timeout as missing delivery', async () => {
    ioMock.emitWithAck.mockRejectedValue(new Error('operation has timed out'))

    await expect(
      emitRoomCallSignalReceived('socket-2', {
        fromUserId: 'user-1',
        roomCallId: 'call-1',
        signal: { type: 'offer' },
        signalId: 'signal-1',
        signalKind: 'offer'
      })
    ).resolves.toBe(false)
  })

  it('keeps throwing unexpected delivery failures', async () => {
    const error = new Error('adapter failed')

    ioMock.emitWithAck.mockRejectedValue(error)

    await expect(
      emitRoomCallSignalReceived('socket-2', {
        fromUserId: 'user-1',
        roomCallId: 'call-1',
        signal: { type: 'offer' },
        signalId: 'signal-1',
        signalKind: 'offer'
      })
    ).rejects.toBe(error)
  })
})
